import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {Test, TestingModule} from "@nestjs/testing";
import {User} from "../user/user.entity";
import {Role} from "../role/role.enum";
import {ConfigService} from "@nestjs/config";

const user1 = new User();
user1.username = 'test1';
user1.password = 'test1234';
user1.role = Role.User;
user1.suspended = false;

const token = {
    accessToken: 'signedToken'
}

describe('AuthController', () => {
    let controller: AuthController;
    let service: AuthService
    let configService: ConfigService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        signUp: jest.fn().mockResolvedValue(user1),
                        signIn: jest.fn().mockResolvedValue(token)
                    }
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockImplementation((key: string) => { return 'ADMIN_KEY'})
                    }
                }
            ]
        }).compile();
        controller = module.get<AuthController>(AuthController);
        service = module.get<AuthService>(AuthService);
        configService = module.get<ConfigService>(ConfigService);
    })

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('signup', () => {
        it ('signup admin', () => {
            const serviceSpy = jest.spyOn(service, 'signUp');
            expect(controller.signUp({headers: {authorization: 'ADMIN_KEY'}},
                {username: 'test1', password: 'test1234'})).resolves.toEqual({
                success: true,
                data: user1
            });
            expect(serviceSpy).toBeCalledWith('test1', 'test1234', Role.Admin);
        });

        it ('signup user', () => {
            const serviceSpy = jest.spyOn(service, 'signUp');
            expect(controller.signUp({headers: {authorization: ''}},
                {username: 'test1', password: 'test1234'})).resolves.toEqual({
                success: true,
                data: user1
            });
            expect(serviceSpy).toBeCalledWith('test1', 'test1234', Role.User);
        });
    });

    describe('signIn', () => {
        it('expect signed in token', () => {
            expect(controller.signIn({username: 'test1', password: 'test1234'})).resolves.toEqual({
                success: true,
                data: token
            });
        });
    });
})