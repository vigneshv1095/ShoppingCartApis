import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    OneToOne
} from 'typeorm';
import {Role} from '../role/role.enum';
import {Cart} from '../cart/cart.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({nullable: false, unique: true})
    public username: string;

    @Column({nullable: false, select: false})
    public password: string;

    @Column({default: false})
    public suspended: boolean;

    // Since the scope of the problem is limited to user and admin.
    // We're sticking with enum rather than creating a new table.
    @Column()
    public role: Role;

    @CreateDateColumn()
    public createdAt: string;

    @UpdateDateColumn()
    public updatedAt: string;

    @OneToOne(type => Cart, cart => cart.id)
    @JoinColumn()
    public cart: Cart;
}