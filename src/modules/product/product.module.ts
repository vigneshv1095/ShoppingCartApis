import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Product} from "./product.entity";
import {ProductService} from "./product.service";
import {AuthModule} from "../auth/auth.module";
import {RoleModule} from "../role/role.module";
import {ConfigService} from "@nestjs/config";
import {ProductController} from "./product.controller";
import {JwtService} from "@nestjs/jwt";


@Module({
    imports: [AuthModule, RoleModule, TypeOrmModule.forFeature([Product])],
    providers: [ProductService, ConfigService, JwtService],
    exports: [ProductService],
    controllers: [ProductController]
})
export class ProductModule {}