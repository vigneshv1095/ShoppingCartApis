import {ProductController} from "./product.controller";
import {ProductService} from "./product.service";
import {Test, TestingModule} from "@nestjs/testing";
import {Product} from "./product.entity";
import {CanActivate} from "@nestjs/common";
import {AuthGuard} from "../auth/auth.guard";
import {RolesGuard} from "../role/role.guard";


const product1 = new Product();
product1.id = 123;
product1.price = 100;
product1.inStock = true;
product1.name = 'Product 1';

const product2 = new Product();
product2.id = 134;
product2.price = 100;
product2.inStock = true;
product2.name = 'Product 2';

const products = [product1, product2];

describe('ProductController', () => {
    let controller: ProductController;
    let service: ProductService

    beforeEach(async () => {
        // Mocking the guards since we've unit tested the guards individually.
        const mockGuard: CanActivate = { canActivate: jest.fn(() => true) };
        const mockRoleGuard: CanActivate = { canActivate: jest.fn(() => true) };
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [
                {
                    provide: ProductService,
                    useValue: {
                        getAll: jest.fn().mockReturnValue(products),
                        updateItemStock: jest.fn().mockImplementation((id: number, stock: boolean) => {
                            product1.inStock = stock;
                            return product1;
                        }),
                        create: jest.fn().mockReturnValue(product1)
                    }
                }
            ]
        }).overrideGuard(AuthGuard).useValue(mockGuard)
            .overrideGuard(RolesGuard).useValue(mockRoleGuard)
            .compile()
        controller = module.get<ProductController>(ProductController)
        service = module.get<ProductService>(ProductService)
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('GetAllItems', () => {
        it('get all items', () => {
            expect(controller.getAllItems()).resolves.toEqual({
                data: products,
                success: true
            })
        })
    })

    describe('create product', () => {
        it('should create product', () => {
            expect(controller.createItem({price: 100, name: 'Product 1'})).resolves.toEqual({
                success: true,
                data: product1
            });
        })
    })

    describe('update stock', () => {
        it('update item stock', () => {
            expect(controller.updateItemStock({id: 123, stock: false})).resolves.toEqual({
                success: true,
                data: {
                    id: 123,
                    price: 100,
                    name: 'Product 1',
                    inStock: false
                }
            })
        });
    });
});