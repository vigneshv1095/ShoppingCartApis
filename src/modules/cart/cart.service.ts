import {HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Cart} from './cart.entity';
import {Repository} from 'typeorm';
import {User} from '../user/user.entity';
import {ProductService} from '../product/product.service';

@Injectable()
export class CartService {

    constructor(
        @InjectRepository(Cart) private cartRepository: Repository<Cart>,
        private productService: ProductService
    ) {
    }

    public async addToCart(productId: number, user: User): Promise<Cart> {
        const cartItems = await this.cartRepository.find({ relations: ['item', 'user'], where: {user: {id: user.id}}});
        const product = await this.productService.findById(productId);

        if (!product || !product.inStock) {
            throw new HttpException('Product not in stock or missing!', 400);
        }
        const cart = cartItems.filter(
            (item) => item.item.id === productId
        );
        if (cart.length < 1) {
            // We're allowing one quantity of product to be added at a single time.
            const newItem = this.cartRepository.create({total: product.price, quantity: 1});
            newItem.user = user;
            newItem.item = product;
            await this.cartRepository.save(newItem);
            return newItem;
        } else {
            const quantity = (cart[0].quantity += 1);
            const total = cart[0].total += cart[0].item.price;
            await this.cartRepository.update(cart[0].id, { quantity, total });
            return cart[0];
        }
    }

    public async getItemsInCart(user: User): Promise<Cart[]> {
        const userCart = await this.cartRepository.find({ relations: ['item', 'user'], where: {user: {id: user.id}}});
        return userCart;
    }

    public async removeItemsInCart(productId: number, user: User): Promise<Cart[]> {
        const cartItems = await this.cartRepository.find({ relations: ['item', 'user'], where: {user: {id: user.id}}});
        const cart = cartItems.filter(
            (item) => item.item.id === productId
        );
        await this.cartRepository.remove(cart[0]);
        return this.getItemsInCart(user);
    }

}