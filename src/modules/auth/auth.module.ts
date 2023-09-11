import {Module} from '@nestjs/common';
import {UserModule} from '../user/user.module';
import {JwtModule} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import {AuthService} from './auth.service';
import {AuthGuard} from './auth.guard';
import {AuthController} from './auth.controller';

@Module({
    imports: [UserModule, JwtModule.registerAsync({
        useFactory: (configService: ConfigService) => ({
            global: true,
            secret: configService.get('JWT_SECRET'),
            signOptions: { expiresIn: configService.get('JWT_EXPIRY')}
        }),
        inject: [ConfigService]
    })],
    providers: [AuthService, AuthGuard, ConfigService],
    exports: [AuthService, AuthGuard],
    controllers: [AuthController]
})

export class AuthModule {}