import {ProductService} from './product.service';
import {Repository} from 'typeorm';
import {Product} from './product.entity';
import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {HttpException} from '@nestjs/common';

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

describe('ProductService', () => {
    let service: ProductService;
    let repo: Repository<Product>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                {
                    provide: getRepositoryToken(Product),
                    useValue: {
                        find: jest.fn().mockResolvedValue(products),
                        findOne: jest.fn().mockImplementation((id: number) => {
                            if (id === 123) {
                                return product1;
                            }
                        }),
                        save: jest.fn().mockImplementation( (product: any) => Promise.resolve(product)),
                        update: jest.fn()
                    }
                }
            ]
        }).compile();
        service = module.get<ProductService>(ProductService);
        repo = module.get<Repository<Product>>(getRepositoryToken(Product));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getAll', () => {
        it ('should return all products', () => {
            expect(service.getAll()).resolves.toEqual(products);
        });
    });

    describe('findById', () => {
        it ('should return a particular product', () => {
            expect(service.findById(123)).resolves.toEqual(product1);
        });

        it ('should throw error for non existing product', () => {
            expect(service.findById(145)).resolves.toBeUndefined();
        });
    });

    describe('updateItemStock', () => {
        it ('updates the item stock', () => {
            expect(service.updateItemStock(123, false)).resolves.toEqual({
                id: 123,
                price: 100,
                inStock: false,
                name: 'Product 1'
            });
        });

        it ('update non existing product', () => {
            expect(service.updateItemStock(145, false)).rejects.toEqual(
                new HttpException('Please create the product first.', 400)
            );
        });
    });

});