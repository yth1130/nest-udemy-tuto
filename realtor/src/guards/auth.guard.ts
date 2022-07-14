import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import * as jwt from 'jsonwebtoken';
import { PrismaService } from "src/prisma/prisma.service";

interface JWTPayload {
    name: string;
    id: number;
    iat: number;
    exp: number;
}

@Injectable()
export class AuthGuards implements CanActivate {

    constructor (
        private readonly reflector: Reflector,
        private readonly prismaService: PrismaService,
    ) {}
    
    async canActivate(context: ExecutionContext) {
        const roles = this.reflector.getAllAndOverride('roles', [
            context.getHandler(),
            context.getClass()
        ]);

        console.log(roles);
        if (roles.length) {
            // 요청 헤더에서 JWT를 가져와 검증.
            const request = context.switchToHttp().getRequest();
            const token = request.headers?.authorization?.split("Bearer ")[1];

            try {
                const payload = await jwt.verify(token, process.env.JSON_TOKEN_KEY) as JWTPayload;
                // console.log({payload});
                const user = await this.prismaService.user.findUnique({
                    where: {
                        id: payload.id
                    }
                })
                if (!user) 
                    return false;
                // console.log(user);
                if (roles.includes(user.userType) === false)
                    return false;
                    
                return true;
            } catch(error) {
                return false;
            }

        }

        return true;
    }
}