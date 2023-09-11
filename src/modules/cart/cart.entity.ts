import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Product} from '../product/product.entity';
import {User} from '../user/user.entity';

@Entity()
export class Cart {

    @PrimaryGeneratedColumn('uuid')
    public id: number;

    @Column()
    public total: number;

    @Column()
    public quantity: number;

    @ManyToOne(type => Product, item => item.id)
    @JoinColumn()
    public item: Product;

    @ManyToOne(type => User, user => user.id)
    @JoinColumn()
    public user: User;

}