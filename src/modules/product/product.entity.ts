import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Cart} from "../cart/cart.entity";


@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column()
    inStock: boolean;

    @CreateDateColumn()
    createdAt: String;

    @UpdateDateColumn()
    updatedAt: String;

    @OneToMany(type => Cart, cart => cart.id)
    @JoinColumn()
    cart: Cart[]

}