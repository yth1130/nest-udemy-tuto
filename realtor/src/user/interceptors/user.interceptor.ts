import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import * as jwt from 'jsonwebtoken'

export class UserInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler<any>) {
        const request = context.switchToHttp().getRequest();
        // console.log({request});
        const token = request?.headers?.authorization?.split("Bearer ")[1];
        // console.log({ token });
        const user = await jwt.decode(token);
        // console.log({user});
        request.user = user;
        
        return next.handle()
    }
}