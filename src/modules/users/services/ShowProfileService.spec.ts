import 'reflect-metadata';
import ShowProfileService from './ShowProfileService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AppError from '../../../shared/errors/AppError';

let fakeUserRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUserRepository);
  });

  it('should be able to show the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'Jhon Doe',
      email: 'any@gmail.com',
      password: '12345678',
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('Jhon Doe');

    expect(profile.email).toBe('any@gmail.com');
  });

  it('should be able to show the profile', async () => {
    await expect(
      showProfile.execute({
        user_id: 'non-existen-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
