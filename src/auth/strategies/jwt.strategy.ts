import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";

import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jst.payload.interface";

export class JwtStrategy extends PassportStrategy(Strategy) {
  async validate(payload: JwtPayload): Promise<User> {
    const { email } = payload;
    return;
  }
}