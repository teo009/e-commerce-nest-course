import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Repository } from "typeorm";

import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jst.payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    ConfigService: ConfigService
  ) {
    super({ 
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: ConfigService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;
    const user = await this.userRepository.findOneBy({ id });

    if(!user) throw new UnauthorizedException('Token not valid');
    if(!user.isActive) throw new UnauthorizedException('User is inactive');

    return user;
  }
}