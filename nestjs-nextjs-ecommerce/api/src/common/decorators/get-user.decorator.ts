// create a custom decorator to extract the user from the request
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// createParamDecorator: gives you access to the current request through the execution context
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest(); // retrieved the request HTTP object from the execution context
    const user = request.user; // The passport has already attached the authenicated user via request.user

    return data ? user?.[data] : user; // The data argument is optional unless you specify which property of the user you want
  },
);
