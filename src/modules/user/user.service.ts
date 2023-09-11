import {HttpException, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    public async findOneByName(name: string): Promise<User> {
        return this.usersRepository.findOne({username: name});
    }

    public async findOneWithPassword(name: string): Promise<User> {
        return this.usersRepository.createQueryBuilder().select('*').where({username: name}).getRawOne();
    }

    public async save(user: User): Promise<void> {
        await this.usersRepository.save(user);
    }

    public async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }

    public async toggleSuspend(username: string, suspend: boolean): Promise<User> {
        const user = await this.findOneByName(username);
        if (!user) {
            throw new HttpException('User not found', 400);
        }
        user.suspended = suspend;
        await this.save(user);
        return user;
    }
}