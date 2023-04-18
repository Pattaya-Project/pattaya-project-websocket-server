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
    return token === this.configService.get<string>('app.server-token') ? true : false
  }
}