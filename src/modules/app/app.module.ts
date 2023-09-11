import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthModule} from '../auth/auth.module';
import {RoleModule} from '../role/role.module';
import {UserModule} from '../user/user.module';
import {User} from '../user/user.entity';
import {ProductModule} from '../product/product.module';
import {CartModule} from '../cart/cart.module';
import {Cart} from '../cart/cart.entity';
import {Product} from '../product/product.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get('DB_HOST'),
                port: +configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_DATABASE'),
                entities: [User, Cart, Product],
                synchronize: true
            })
        }),
        AuthModule,
        RoleModule,
        UserModule,
        ProductModule,
        CartModule
    ]
})

export class AppModule {}