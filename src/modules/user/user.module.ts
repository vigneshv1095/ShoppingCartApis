import {Module} from '@nestjs/common';
import {RoleModule} from '../role/role.module';
import {UserService} from './user.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './user.entity';
import {UserController} from './user.controller';
import {JwtService} from '@nestjs/jwt';

@Module({
    imports: [RoleModule, TypeOrmModule.forFeature([User])],
    providers: [UserService, JwtService],
    exports: [UserService, TypeOrmModule],
    controllers: [UserController]
})

export class UserModule {}