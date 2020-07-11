import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUserRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProvidersService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    listProviders = new ListProvidersService(fakeUserRepository);
  });

  it('should be able to list the providers', async () => {
    const user1 = await fakeUserRepository.create({
      name: 'Jhon Doe',
      email: 'any@gmail.com',
      password: '12345678',
    });

    const user2 = await fakeUserRepository.create({
      name: 'Jhon tre',
      email: 'any1@gmail.com',
      password: '12345678',
    });

    const loggedUser = await fakeUserRepository.create({
      name: 'Jhon qua',
      email: 'any2@gmail.com',
      password: '12345678',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
