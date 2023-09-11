import {UserController} from './user.controller';
import {UserService} from './user.service';
import {Test, TestingModule} from '@nestjs/testing';
import {User} from './user.entity';
import {Role} from '../role/role.enum';
import {CanActivate} from '@nestjs/common';
import {AuthGuard} from '../auth/auth.guard';

const user2 = new User();
user2.username = 'test2';
user2.password = 'test1234';
user2.role = Role.User;
user2.suspended = true;

describe('UserController', () => {
    let controller: UserController;
    let service: UserService;

    beforeEach(async () => {
        const mockGuard: CanActivate = { canActivate: jest.fn(() => true) };
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [{
                provide: UserService,
                useValue: {
                    toggleSuspend: jest.fn().mockImplementation((username: string, suspend: boolean) =>
                        Promise.resolve(user2))
                }
            }]
        }).overrideGuard(AuthGuard).useValue(mockGuard).compile();
        controller = module.get<UserController>(UserController);
        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('suspendUser', () => {
        it('should suspend user', async () => {
            await expect(controller.suspendUser({username: 'test2', suspend: false})).resolves.toEqual({
                success: true,
                data: user2
            });
            expect(service.toggleSuspend).toBeCalledTimes(1);
            expect(service.toggleSuspend).toBeCalledWith('test2', false);
        });
    });
});