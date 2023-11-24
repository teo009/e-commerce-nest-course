import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto/';
import { Auth, GetUser } from './decorators/';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() CreateUserDto: CreateUserDto) {
    return this.authService.create(CreateUserDto);
  }

  @Post('login')
  logIn(@Body() LoginUserDto: LoginUserDto) {
    return this.authService.login(LoginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @Auth(ValidRoles.admin)
  testingPrivateRoute(
    @GetUser() user: User,
  ) {
    return {
      ok: true,
      user,
    };
  }

}
