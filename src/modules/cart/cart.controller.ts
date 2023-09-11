import {Body, Controller, Delete, Get, Post, Req, UseGuards} from '@nestjs/common';
import {AuthGuard} from '../auth/auth.guard';
import {RolesGuard} from '../role/role.guard';
import {Roles} from '../role/role.decorator';
import {Role} from '../role/role.enum';
import {CartItemRequest, DefaultResponse} from './cart.types';
import {CartService} from './cart.service';

@UseGuards(AuthGuard, RolesGuard)
@Controller('cart')
export class CartController {

    constructor(
        private cartService: CartService
    ) {
    }

    @Get()
    @Roles(Role.User)
    public async getItemsInCart(@Req() req: any): Promise<DefaultResponse> {
        return {
            success: true,
            data: await this.cartService.getItemsInCart(req.user)
        };
    }

    @Post('add')
    @Roles(Role.User)
    public async addItemToCart(@Req() req: any, @Body() body: CartItemRequest): Promise<DefaultResponse> {
        return {
            success: true,
            data: await this.cartService.addToCart(body.productId, req.user)
        };
    }

    @Delete('remove')
    @Roles(Role.User)
    public async removeItemFromCart(@Req() req: any, @Body() body: CartItemRequest): Promise<DefaultResponse> {
        return {
            success: true,
            data: await this.cartService.removeItemsInCart(body.productId, req.user)
        };
    }

}