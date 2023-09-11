import {Body, Controller, Get, Patch, Post, UseGuards} from "@nestjs/common";
import {ProductService} from "./product.service";
import {CreateItemRequest, DefaultResponse, UpdateStockRequest} from "./product.types";
import {AuthGuard} from "../auth/auth.guard";
import {RolesGuard} from "../role/role.guard";
import {Roles} from "../role/role.decorator";
import {Role} from "../role/role.enum";
import {Product} from "./product.entity";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";


@Controller('items')
@UseGuards(AuthGuard, RolesGuard)
export class ProductController {

    constructor(
        private productService: ProductService
    ) {
    }

    @ApiBearerAuth()
    @Get()
    @Roles(Role.User)
    public async getAllItems(): Promise<DefaultResponse> {
        return {
            success: true,
            data: await this.productService.getAll()
        }
    }

    @Patch('update_stock')
    @Roles(Role.Admin)
    @ApiTags('Admin')
    public async updateItemStock(@Body() body: UpdateStockRequest): Promise<DefaultResponse> {
        return {
            success: true,
            data: await this.productService.updateItemStock(body.id, body.stock)
        }
    }

    @Post('create')
    @Roles(Role.Admin)
    @ApiTags('Admin')
    public async createItem(@Body() body: CreateItemRequest): Promise<DefaultResponse> {
        const product = new Product();
        product.name = body.name;
        product.price = body.price;
        product.inStock = true;
        return {
            success: true,
            data: await this.productService.create(product)
        }
    }


}