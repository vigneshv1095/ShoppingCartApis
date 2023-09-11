import {AuthService} from "./auth.service";
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import {Test, TestingModule} from "@nestjs/testing";
import {User} from "../user/user.entity";
import {Role} from "../role/role.enum";
import * as bcrypt from 'bcrypt';
import {HttpException} from "@nestjs/common";

const user1 = new User();
user1.username = 'test1';
user1.password = 'test1234';
user1.role = Role.User;
user1.suspended = false;

describe('AuthService', () => {
    let service: AuthService;
    let userService: UserService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: {
                        findOneByName: jest.fn().mockImplementation((username: string) => {
                            if (username === 'test1') return Promise.resolve(user1)
                        }),
                        findOneWithPassword: jest.fn().mockImplementation((username: string) => {
                            if (username === 'test1') return Promise.resolve(user1)
                        }),
                        save: jest.fn()
                    }
                },
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest.fn().mockImplementation(async (payload: any) =>
                            Promise.resolve('signedpayload'))
                    }
                }
            ]
        }).compile();
        service = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Signup', () => {
        it('it should signup', async () => {
            const user: User = await service.signUp('test', '1234', Role.User);
            expect(user.username === 'test');
            expect(await bcrypt.compare('1234', user.password)).toEqual(true);
            expect(user.role).toEqual(Role.User);
            expect(userService.findOneByName).toBeCalledTimes(1);
            expect(userService.save).toBeCalledTimes(1);
        });

        it('it should not sign up', () => {
            expect(service.signUp('test1', 'test1234', Role.User)).rejects.toEqual(
                new HttpException("User already exists. Please use sign in", 400)
            )
        });
    });

    describe('Signin', () => {
        it('it should signin', async () => {
            user1.password = await bcrypt.hash(user1.password, 10);
            await expect(service.signIn('test1', 'test1234')).resolves.toEqual({
                accessToken: 'signedpayload'
            });
            expect(userService.findOneWithPassword).toBeCalledTimes(1);
        });

        it('it should not signin for missing user', () => {
            expect(service.signIn('test2', 'test1234')).rejects.toEqual(
                new HttpException("User doesn't exist. Please sign up before logging in", 400)
            );
            expect(userService.findOneWithPassword).toBeCalledTimes(1);
        });

        it('it should not allow invalid password', () => {
            expect(service.signIn('test1', 'test123')).rejects.toEqual(
                new HttpException("Username and password doesn't match. Please try again", 400)
            );
            expect(userService.findOneWithPassword).toBeCalledTimes(1);
        });
        it('it should not allow suspended user', () => {
            user1.suspended = true;
            expect(service.signIn('test1', 'test1234')).rejects.toEqual(
                new HttpException("User is suspended. Please contact admin.", 400)
            );
            expect(userService.findOneWithPassword).toBeCalledTimes(1);
        })
    });

})