import { Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';
import * as WebSocket from 'ws';
import { AuthService } from '../components/auth/auth.service';
import { Member } from '../libs/dto/member/member';
import * as url from 'url';;

export interface MessagePayLoad {
  event: string;
  text: string;
  memberData: Member;
}

export interface InfoPayLoad {
  event: string;
  totalClients: number;
  memberData: Member;
  action: string;
}

@WebSocketGateway({transports : ['websocket'],secure: false})
export class  SocketGateway implements OnGatewayInit{
private logger: Logger = new Logger('SocketEventsGateway');
private summaryClient: number = 0;
private clientsAuthMap = new Map<WebSocket, Member>();
private messageList: MessagePayLoad[] = [];

constructor(private authService: AuthService) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
   this.logger.log(`Web Socket Server initialized: ${this.summaryClient}`);
  }

  private async retrieveAuth(req: any): Promise<Member>{
try{
const parseUrl = url.parse(req.url,true);
const {token} = parseUrl.query;
console.log('Token:', token);
return await this.authService.verifyToken(token as string)
   
}catch(err){
  return null
}
  }

  public async handleConnection(client: WebSocket, req: any) {
    const authMember = await this.retrieveAuth(req) 
    this.summaryClient++;
    console.log('Auth Member:', authMember);
    
    const clientNick:string = authMember?.memberNick ?? 'Guest';
    this.clientsAuthMap.set(client, authMember);
    this.logger.log(`== Connection [${clientNick}] total ${this.summaryClient}==`);

    const infoMsg: InfoPayLoad = {
      event: 'info',
      totalClients: this.summaryClient,
      memberData: authMember,
      action: 'joined'
    }
    this.emitMessage(infoMsg);
    //clients Messages
    client.send(JSON.stringify({event: 'getMessages', list: this.messageList}))
  }

    public handleDisconnect(client: WebSocket) {
    const authMember = this.clientsAuthMap.get(client);
    this.summaryClient--;
    this.clientsAuthMap.delete(client);

    const clientNick:string = authMember?.memberNick ?? 'Guest';
    this.logger.verbose(`== Connection $ total ${this.summaryClient}=`);

      const infoMsg: InfoPayLoad = {
      event: 'info',
      totalClients: this.summaryClient,
      memberData: authMember,
      action: 'left'
    }
    this.broadcastMessage(client, infoMsg);
  }

  @SubscribeMessage('message')
  public async handleMessage(client: WebSocket, payload: string): Promise<any> {
    const authMember = this.clientsAuthMap.get(client);
    const newMessage: MessagePayLoad = {event: 'message', text: payload, memberData: authMember};    

    const clientNick:string = authMember?.memberNick ?? 'Guest';
    this.logger.verbose(`New Message[${clientNick}]: ${payload}` );

    this.messageList.push(newMessage);
    if(this.messageList.length > 5) this.messageList.splice(0,  this.messageList.length - 5); 

    this.emitMessage(newMessage);   
    return null
  }

  private broadcastMessage(sender: WebSocket, message: InfoPayLoad | MessagePayLoad) {
    this.server.clients.forEach((client)=>{
      if(client !== sender && client.readyState === WebSocket.OPEN){
        client.send(JSON.stringify(message))
      }
    })
  }

  private emitMessage(message: InfoPayLoad | MessagePayLoad) {
    this.server.clients.forEach((client)=>{
      if(client.readyState === WebSocket.OPEN){
        client.send(JSON.stringify(message))
      }
    })
}
}

/*
message targeting:
1.Client(only client itself)
2.Broadcast (to all clients except sender)
3.Emit (to all clients including sender)

*/
