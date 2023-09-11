import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async findOneByName(name: string): Promise<User> {
        return this.usersRepository.findOne({username: name});
    }

    async findOneWithPassword(name: string): Promise<User> {
        return this.usersRepository.createQueryBuilder().select('*').where({username: name}).getRawOne();
    }

    async save(user: User): Promise<void> {
        await this.usersRepository.save(user);
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }

    public async toggleSuspend(username: string, suspend: boolean): Promise<User> {
        const user = await this.findOneByName(username);
        user.suspended = suspend;
        await this.save(user);
        return user;
    }
}