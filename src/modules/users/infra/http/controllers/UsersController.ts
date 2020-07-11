import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserSevice from '@modules/users/services/CreateUserService';

export default class UsersController {
  public async create(
    request: Request,
    response: Response,
  ): Promise<Omit<Response, 'password'>> {
    const { name, email, password } = request.body;

    const createUser = container.resolve(CreateUserSevice);

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    delete user.password;

    return response.json(user);
  }
}
