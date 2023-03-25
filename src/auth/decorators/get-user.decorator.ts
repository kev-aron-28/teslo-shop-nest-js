import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

export const GetUser = createParamDecorator(
    (data, ctx: ExecutionContext ) => {
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;
        const field = data;

        if(!user) {
            throw new InternalServerErrorException('User not found (request)');
        }

        if(!field) return user;

        if(field) return user[field];

    }
);
