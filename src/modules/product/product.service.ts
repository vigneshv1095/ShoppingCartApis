import {HttpException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Product} from "./product.entity";
import {Repository} from "typeorm";


@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(Product) private productRepository: Repository<Product>
    ) {
    }

    public async getAll(): Promise<Product[]> {
        return this.productRepository.find();
    }

    public async findById(id: number): Promise<Product> {
        return this.productRepository.findOne(id);
    }

    public async create(product: Product): Promise<Product> {
        return this.productRepository.save(product);
    }

    public async update(product: Product): Promise<void> {
        await this.productRepository.update(product.id, product);
    }

    public async updateItemStock(id: number, stock: boolean): Promise<Product> {
        const product = await this.findById(id);
        if (!product) {
            throw new HttpException("Please create the product first.", 400);
        }
        product.inStock = stock;
        await this.update(product);
        return product;
    }

}