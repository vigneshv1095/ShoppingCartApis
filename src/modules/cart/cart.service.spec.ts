import {CartService} from "./cart.service";
import {Repository} from "typeorm";
import {Cart} from "./cart.entity";
import {Product} from "../product/product.entity";
import {Test, TestingModule} from "@nestjs/testing";
import {ProductService} from "../product/product.service";
import {getRepositoryToken} from "@nestjs/typeorm";
import {User} from "../user/user.entity";
import {HttpException} from "@nestjs/common";

const product1 = new Product();
product1.id = 123;
product1.price = 100;
product1.inStock = true;
product1.name = 'Product 1';

const product2 = new Product();
product2.id = 134;
product2.price = 200;
product2.inStock = true;
product2.name = 'Product 2';

const product3 = new Product();
product3.id = 145;
product3.price = 300;
product3.inStock = true;
product3.name = 'Product 3';

const cart = [
    {
        "id": 1,
        "total": 100,
        "quantity": 1,
        "item": {
            "id" : 123,
            "price": 100,
            "inStock": true,
            "name": "Product 1"
        },
        "user": {
            "id": 3,
            "username": "test2",
            "suspended": false,
            "role": "user",
        }
    },
    {
        "id": 2,
        "total": 200,
        "quantity": 1,
        "item": {
            "id" : 134,
            "price": 200,
            "inStock": true,
            "name": "Product 2"
        },
        "user": {
            "id": 3,
            "username": "test2",
            "suspended": false,
            "role": "user",
        }
    }
]

const newCartItem = {
    "id" : 3,
    "total" : 300,
    "quantity": 1,
    "item": {},
    "user": {}
}

describe('CartService', () => {
    let service: CartService;
    let repo: Repository<Cart>;
    let productService: ProductService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CartService,
                {
                    provide: ProductService,
                    useValue: {
                        findById: jest.fn().mockImplementation((id: number) => {
                            if (id === 123) return product1;
                            if (id === 134) return product2;
                            if (id === 145) return product3;
                        })
                    }
                },
                {
                    provide: getRepositoryToken(Cart),
                    useValue: {
                        find: jest.fn().mockReturnValue(cart),
                        create: jest.fn().mockReturnValue(newCartItem),
                        save: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn()
                    }
                }
            ]
        }).compile();
        service = module.get<CartService>(CartService)
        repo = module.get<Repository<Cart>>(getRepositoryToken(Cart))
        productService = module.get<ProductService>(ProductService)
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getItemsInCart', () => {
        it ('should return the cart', () => {
            const user = new User();
            user.id = 1;
            expect(service.getItemsInCart(user)).resolves.toEqual(cart)
        });
    });

    describe('AddToCart', () => {
        it ('add new item to cart', () => {
            const user = new User();
            user.id = 1;
            expect(service.addToCart(145, user)).resolves.toEqual({
                "id": 3,
                "item": {"id": 145, "inStock": true, "name": "Product 3", "price": 300},
                "quantity": 1, "total": 300,
                "user": {"id": 1}})
        })

        it ('trying to add non existing product', () => {
            const user = new User();
            user.id = 1;
            expect(service.addToCart(167, user)).rejects.toEqual(
                new HttpException("Product not in stock or missing!", 400)
            )
        })

        it ('add existing product in cart', () => {
            const user = new User();
            user.id = 1;
            expect(service.addToCart(123, user)).resolves.toEqual({
                "id": 1,
                "item":{"id": 123, "inStock": true, "name": "Product 1", "price": 100},
                "quantity": 2, "total": 200,
                "user": {"id": 3, "username": "test2", "suspended": false, "role": "user",}})
        })
    })

    describe('removeFromCart', () => {
        it ('removes an item from cart', async () => {
            const user = new User();
            user.id = 1;
            const repoSpy = jest.spyOn(repo, 'remove');
            // This should have popped out cart[0] since we're removing the first product.
            await expect(service.removeItemsInCart(123, user)).resolves.toEqual(cart)
            expect(repoSpy).toBeCalledTimes(1)
            expect(repoSpy).toBeCalledWith(cart[0])
        })
    })
})
