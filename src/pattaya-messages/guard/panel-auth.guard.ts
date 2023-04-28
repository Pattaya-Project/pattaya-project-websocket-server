import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class PanelAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService
  ){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }


  validateRequest(request: any): boolean {
    const token = request.handshake.headers.authorization.replace("###### ", '')
    const incomingToken = this.configService.get<string[]>('app.server-token').find(item => item['token'] === token);
    return incomingToken === undefined ? false : true
  }

  getCreds(token: string): any {
    const incomingToken = this.configService.get<string[]>('app.server-token').find(item => item['token'] === token);
    return incomingToken
  }
}