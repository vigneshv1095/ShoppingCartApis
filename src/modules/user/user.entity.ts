import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    OneToOne
} from 'typeorm';
import {Role} from "../role/role.enum";
import {Cart} from "../cart/cart.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, unique: true})
    username: string;

    @Column({nullable: false, select:false})
    password: string;

    @Column({default: false})
    suspended: boolean;

    // Since the scope of the problem is limited to user and admin.
    // We're sticking with enum rather than creating a new table.
    @Column()
    role: Role

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    @OneToOne(type => Cart, cart => cart.id)
    @JoinColumn()
    cart: Cart;
}