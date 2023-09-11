import {Module} from '@nestjs/common';
import {UserModule} from '../user/user.module';
import {AuthModule} from '../auth/auth.module';
import {RoleModule} from '../role/role.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigService} from '@nestjs/config';
import {Cart} from './cart.entity';
import {CartService} from './cart.service';
import {CartController} from './cart.controller';
import {ProductModule} from '../product/product.module';
import {JwtService} from '@nestjs/jwt';

@Module({
    imports: [UserModule, AuthModule, RoleModule, ProductModule, TypeOrmModule.forFeature([Cart])],
    providers: [CartService, ConfigService, JwtService],
    exports: [CartService],
    controllers: [CartController]
})
export class CartModule {}