import { getRepository, Repository, Not } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IExexptUserDTO from '@modules/users/dtos/IExexptUserDTO';

import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { email } });

    return user;
  }

  public async findAllProviders({
    except_user_id,
  }: IExexptUserDTO): Promise<User[]> {
    let user: User[];

    if (except_user_id) {
      user = await this.ormRepository.find({
        where: {
          id: Not(except_user_id),
        },
      });
    } else {
      user = await this.ormRepository.find();
    }

    return user;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const users = this.ormRepository.create(userData);

    await this.ormRepository.save(users);

    return users;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UsersRepository;
