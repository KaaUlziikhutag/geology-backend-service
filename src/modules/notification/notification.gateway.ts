import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthenticationService } from '../authentication/authentication.service.js';

interface SocketWithUser {
  socketId: string;
  userId: number;
}
@WebSocketGateway({ namespace: 'notification', cors: { origin: '*' } })
export class NotificationGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;
  socketMap: Map<string, SocketWithUser> = new Map();
  private readonly logger = new Logger(NotificationGateway.name);

  constructor(private readonly authService: AuthenticationService) {}
  afterInit(server: Server) {
    this.server = server;
    this.logger.log('NotificationGateway initialized', this.server);
  }
  onModuleInit() {
    this.logger.log('NotificationGateway module initialized');
    this.server.on('connection', (client) => {
      const token = client.handshake.headers.authorization;
      if (!token) {
        client.disconnect();
        return;
      }
      const user = this.authService.verifyJwt(token);
      if (!user) {
        client.disconnect();
        return;
      }
      this.socketMap.set(user.id, {
        socketId: client.id,
        userId: user.userId,
      });
      client.on('disconnect', () => {
        this.socketMap.delete(user.id);
      });
      this.logger.log(`Client connected: ${client.id}`);
    });
  }

  handleNotifcation(receiverId: number, value: boolean): void {
    this.socketMap.forEach((socket) => {
      if (receiverId === socket.userId) {
        this.server.to(socket.socketId).emit('notification', value);
      }
    });
  }
}
