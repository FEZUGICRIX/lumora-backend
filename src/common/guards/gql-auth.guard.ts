// import {
//   Injectable,
//   CanActivate,
//   ExecutionContext,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { GqlExecutionContext } from '@nestjs/graphql';

// @Injectable()
// export class GqlAuthGuard implements CanActivate {
//   canActivate(context: ExecutionContext): boolean {
//     const ctx = GqlExecutionContext.create(context).getContext();
//     const req = ctx.req;

//     if (!req.session || !req.session.userId) {
//       throw new UnauthorizedException('Not logged in');
//     }

//     ctx.user = { id: req.session.userId, role: req.session.role };
//     return true;
//   }
// }
