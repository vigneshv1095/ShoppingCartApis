import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Product} from "../product/product.entity";
import {User} from "../user/user.entity";

@Entity()
export class Cart {

    @PrimaryGeneratedColumn('uuid')
    id: number

    @Column()
    total: number

    @Column()
    quantity: number

    @ManyToOne(type => Product, item => item.id)
    @JoinColumn()
    item: Product;

    @ManyToOne(type => User, user => user.id)
    @JoinColumn()
    user : User;

}