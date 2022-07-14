import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs';

export class CustomIntercepter implements NestInterceptor {
    intercept(context: ExecutionContext, handler: CallHandler) {
        console.log("THIS IS INTERCEPTING THE REQUEST");
        console.log({context});
        return handler.handle().pipe(
            map((data) => {
                console.log("THIS IS INTERCEPTING THE RESPONSE");
                console.log({data});
                const response = {
                    ...data,
                    created_at: data.createdAt
                }
                delete response.updatedAt
                delete response.createdAt
                console.log(response);
                return response;
            })
        );
    };
}