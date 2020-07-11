import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IExexptUserDTO from '../dtos/IExexptUserDTO';

export default interface IUsersRepository {
  findAllProviders(data?: IExexptUserDTO): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(data: ICreateUserDTO): Promise<User>;
}
