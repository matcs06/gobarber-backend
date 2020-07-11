import 'reflect-metadata';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatar from './UpdateUserAvatarService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AppError from '../../../shared/errors/AppError';

let fakeUserRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatar;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatar = new UpdateUserAvatar(
      fakeUserRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update the avatar', async () => {
    const user = await fakeUserRepository.create({
      name: 'Jhon doe',
      email: 'jhondoe@example.com',
      password: '12345678',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update the avatar from a non existent user', async () => {
    expect(
      updateUserAvatar.execute({
        user_id: 'non existing user',
        avatarFileName: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete the old avatar when updating to a new one', async () => {
    const user = await fakeUserRepository.create({
      name: 'Jhon doe',
      email: 'jhondoe@example.com',
      password: '12345678',
    });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});
