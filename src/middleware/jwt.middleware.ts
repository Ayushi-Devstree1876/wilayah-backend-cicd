// jwt.middleware.ts
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as passport from 'passport';
import {
  ExtractJwt,
  StrategyOptions,
  Strategy as JwtStrategy,
} from 'passport-jwt';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor() {
    const opts: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secret',
      ignoreExpiration: false,
    };

    passport.use(
      new JwtStrategy(opts, (jwt_payload, done) => {
        if (jwt_payload) {
          return done(null, jwt_payload);
        } else {
          return done(new UnauthorizedException('Invalid token'), false);
        }
      }),
    );
  }

  use(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err || !user) {
        return next(new UnauthorizedException('Unauthorized access'));
      }
      next();
    })(req, res, next);
  }
}
