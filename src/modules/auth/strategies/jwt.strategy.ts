// // src/modules/auth/strategies/jwt.strategy.ts
// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';

// const cookieExtractor = (req: any) => req?.cookies?.['access_token'] ?? null;

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
//   constructor() {
//     super({
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         cookieExtractor,
//         ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ]),
//       secretOrKey: process.env.JWT_PUBLIC_KEY?.replace(/\\n/g, '\n'),
//       algorithms: ['RS256'],
//     });
//   }

//   async validate(payload: any) {
//     // payload.sub = userId
//     return { id: payload.sub, roles: payload.roles ?? ['user'] };
//   }
// }
