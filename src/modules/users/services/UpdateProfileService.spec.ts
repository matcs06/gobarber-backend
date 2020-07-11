import 'reflect-metadata';
import UpdateProfileService from './UpdateProfileService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AppError from '../../../shared/errors/AppError';
import usersRouter from '../infra/http/routes/users.routes';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'Jhon Doe',
      email: 'any@gmail.com',
      password: '12345678',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Jhon Trê',
      email: 'jhontre@gmail.com',
    });

    expect(updatedUser.name).toBe('Jhon Trê');
    expect(updatedUser.email).toBe('jhontre@gmail.com');
  });

  it('should not be able to update the email with one that is already used', async () => {
    await fakeUserRepository.create({
      name: 'Jhon Doe',
      email: 'any@gmail.com',
      password: '12345678',
    });

    const user = await fakeUserRepository.create({
      name: 'Test',
      email: 'test@gmail.com',
      password: '12345678',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Jhon Trê',
        email: 'any@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password', async () => {
    const user = await fakeUserRepository.create({
      name: 'Jhon Doe',
      email: 'any@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Jhon tre',
      email: 'jhontre@example.com',
      old_password: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'Jhon Doe',
      email: 'any@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Jhon tre',
        email: 'jhontre@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'Jhon Doe',
      email: 'any@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Jhon tre',
        email: 'jhontre@example.com',
        old_password: 'wrong-old-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a non-existent user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existen-user-id',
        name: 'Jhon tre',
        email: 'jhontre@example.com',
        old_password: 'wrong-old-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
