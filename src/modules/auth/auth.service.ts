import {HttpException, Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {User} from "../user/user.entity";
import * as bcrypt from 'bcrypt';
import {Role} from "../role/role.enum";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    public async signUp(username: string, password: string, role: Role): Promise<User> {
        const user = await this.userService.findOneByName(username);
        if (user) {
            throw new HttpException("User already exists. Please use sign in", 400);
        }
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltOrRounds);
        const newUser = new User();
        newUser.username = username;
        newUser.password = hashedPassword;
        newUser.role = role;
        await this.userService.save(newUser);
        return newUser;
    }

    public async signIn(username: string, password: string): Promise<any> {
        const user = await this.userService.findOneWithPassword(username);
        if (!user) {
            throw new HttpException("User doesn't exist. Please sign up before logging in", 400);
        }
        const isPassValid = await bcrypt.compare(password, user.password);
        if (!isPassValid) {
            throw new HttpException("Username and password doesn't match. Please try again", 400);
        }
        if (user.suspended) {
            throw new HttpException("User is suspended. Please contact admin.", 400);
        }
        const payload = {id: user.id, username: user.username, role: user.role};
        return {
            accessToken: await this.jwtService.signAsync(payload)
        }
    }
}