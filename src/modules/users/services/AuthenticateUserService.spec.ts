import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);
    authenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await createUser.execute({
      name: 'Jhon Doe',
      email: 'any1@gmail.com',
      password: '12345678',
    });

    const response = await authenticateUser.execute({
      email: 'any1@gmail.com',
      password: '12345678',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with a non existing user ', async () => {
    expect(
      authenticateUser.execute({
        email: 'any1@gmail.com',
        password: '12345678',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with a wrong password', async () => {
    await createUser.execute({
      name: 'Jhon Doe',
      email: 'any1@gmail.com',
      password: '12345678',
    });

    expect(
      authenticateUser.execute({
        email: 'any1@gmail.com',
        password: '123456789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
