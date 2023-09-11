import {RolesGuard} from './role.guard';
import {Reflector} from '@nestjs/core';
import {Test} from '@nestjs/testing';

describe('RoleGuard', () => {

    let guard: RolesGuard;
    let reflector: Reflector;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [],
            providers: [
                RolesGuard,
                {
                    provide: Reflector,
                    useValue: {
                        getAllAndOverride: jest.fn().mockImplementation((metadataKey: any, targets: any) => ['admin'])
                    }
                }
            ]
        }).compile();
        reflector = module.get<Reflector>(Reflector);
        guard = module.get<RolesGuard>(RolesGuard);
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    describe('Invalid Role', () => {
        it ('validate user role', () => {
            const context = {
                getClass: jest.fn(),
                getHandler: jest.fn(),
                switchToHttp: jest.fn(() => ({
                    getRequest: jest.fn().mockReturnValue({
                        user: {
                            role: 'user'
                        }
                    })
                }))
            } as any;
            expect(guard.canActivate(context)).toEqual(false);
        });
    });

    describe('Valid Role', () => {
        it ('validate admin role', () => {
            const context = {
                getClass: jest.fn(),
                getHandler: jest.fn(),
                switchToHttp: jest.fn(() => ({
                    getRequest: jest.fn().mockReturnValue({
                        user: {
                            role: 'admin'
                        }
                    })
                }))
            } as any;
            expect(guard.canActivate(context)).toEqual(true);
        });
    });

});