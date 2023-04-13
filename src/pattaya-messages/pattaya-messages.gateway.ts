import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { PattayaMessagesService } from './pattaya-messages.service';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { BotCheckinDto } from './dto/bot-checkin.dto';
import { ResponseMessageDto } from './dto/response-message.dto';


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

  constructor(private readonly pattayaMessagesService: PattayaMessagesService)  {}

  afterInit(server: Server) {
    this.logger.log('Socket.io server initialized');
    setInterval(async () => {
      const data = await this.pattayaMessagesService.getOnlineBot()
      const response: ResponseMessageDto = {
        success: true,
        message: 'Response all online bot',
        data
      }
      this.server.emit('panel_received_online_bot_data', response);
      this.logger.log(`Response online bot: ${response.data}`);
    }, 10000);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
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
