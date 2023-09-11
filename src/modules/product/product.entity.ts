import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Cart} from '../cart/cart.entity';

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    public id: number;

    @Column()
    public name: string;

    @Column()
    public price: number;

    @Column()
    public inStock: boolean;

    @CreateDateColumn()
    public createdAt: string;

    @UpdateDateColumn()
    public updatedAt: string;

    @OneToMany(type => Cart, cart => cart.id)
    @JoinColumn()
    public cart: Cart[];

}