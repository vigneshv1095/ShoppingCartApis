import {Role} from '../role/role.enum';
import {UserService} from './user.service';
import {Repository} from 'typeorm';
import {User} from './user.entity';
import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';

const user1 = new User();
user1.username = 'test1';
user1.password = 'test1234';
user1.role = Role.User;
user1.suspended = false;

const user2 = new User();
user2.username = 'test2';
user2.password = 'test1234';
user2.role = Role.User;
user2.suspended = false;

describe('UserService', () => {
    let service: UserService;
    let repo: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        findOne: jest.fn().mockResolvedValue(user1),
                        save: jest.fn()
                    }
                }
            ]
        }).compile();
        service = module.get<UserService>(UserService);
        repo = module.get<Repository<User>>(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findOneByName', () => {
        it ('it should get user1', () => {
            const name = 'test1';
            const repoSpy = jest.spyOn(repo, 'findOne');
            expect(service.findOneByName(name)).resolves.toEqual(user1);
            expect(repoSpy).toBeCalledWith({username: name} );
        });
    });

    describe('insertOne', () => {
        it ('should create a new user', () => {
            service.save(user2);
            expect(repo.save).toBeCalledTimes(1);
            expect(repo.save).toBeCalledWith(user2);
        });
    });

    describe('suspendUser', () => {
        it('should suspend user', () => {
            const suspendedUser = user1;
            suspendedUser.suspended = true;
            expect(service.toggleSuspend('test1', true)).resolves.toEqual(suspendedUser);
            expect(repo.findOne).toBeCalledTimes(1);
        });
    });

});