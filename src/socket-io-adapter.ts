import { INestApplicationContext, Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions, Socket } from 'socket.io';

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);
  constructor(
    private app: INestApplicationContext, //   private configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options: ServerOptions) {
    const cors = {
      origin: ['*'],
    };

    this.logger.log(`Configuring SocketIO server with custom CORS options`, {
      cors,
    });

    const optionWithCors: ServerOptions = {
      ...options,
      cors,
      pingInterval: 5000,
    };

    const server: Server = super.createIOServer(port, optionWithCors);

    // ping the server at intervals
    setInterval(function () {
      console.log('pinging...');
      server.emit('heartbeat', 'ping...'); // heartbeat test sending to all clients
    }, 15000);

    /**
     * The websocket communication can be
     * improved by introducing authorization features
     * just like regular REST connection
     *  to enable only authenticated users to communicate with the server
     */
    return server;
  }
}