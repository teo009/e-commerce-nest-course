import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto/';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-usder.decorator';
import { User } from './entities/user.entity';

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


  @Get('private')
@UseGuards(AuthGuard())
  testingPrivateRoute(
    //@Req() request: Express.Request
    @GetUser() user: User
  ) {
    return user;
  }

}
