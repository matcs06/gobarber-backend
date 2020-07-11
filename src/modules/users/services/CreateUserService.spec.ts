import 'reflect-metadata';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AppError from '../../../shared/errors/AppError';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let CreateUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    CreateUser = new CreateUserService(fakeUserRepository, fakeHashProvider);
  });

  it('should be able to create a new user', async () => {
    const user = await CreateUser.execute({
      name: 'Jhon Doe',
      email: 'any@gmail.com',
      password: '12345678',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with the same email from another one', async () => {
    await CreateUser.execute({
      name: 'Jhon Doe',
      email: 'any@gmail.com',
      password: '12345678',
    });

    await expect(
      CreateUser.execute({
        name: 'Jhon Doe',
        email: 'any@gmail.com',
        password: '12345678',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
