import 'reflect-metadata';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUserRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUserRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should should be able to recover the password using the e-mail', async () => {
    const senEmail = jest.spyOn(fakeMailProvider, 'sendMail');
    await fakeUserRepository.create({
      name: 'Jhon Doe',
      email: 'example@gmail.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'example@gmail.com',
    });

    expect(senEmail).toHaveBeenCalled();
  });

  it('should should not be able to recover a non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'jhondoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');
    const user = await fakeUserRepository.create({
      name: 'Jhon Doe',
      email: 'example@gmail.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'example@gmail.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
