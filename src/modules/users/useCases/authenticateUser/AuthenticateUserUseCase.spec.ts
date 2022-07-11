import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { ICreateUserDTO } from '../createUser/ICreateUserDTO';
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

const user: ICreateUserDTO = {
  name: 'John Doe',
  email: 'john@test.com',
  password: 'secret',
};

describe('Authenticate user use case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    await createUserUseCase.execute(user);
  });

  it('should be able to authenticate a user', async () => {
    const response = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(response).toHaveProperty('token');
    expect(response).toHaveProperty('user.name', user.name);
    expect(response).toHaveProperty('user.email', user.email);
  });

  it('should not be able to authenticate a non-existent user', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: 'false@test.com',
        password: '1234',
      })
    ).rejects.toThrow(IncorrectEmailOrPasswordError);
  });

  it('should not be able to authenticate a user with wrong password', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: 'another password',
      })
    ).rejects.toThrow(IncorrectEmailOrPasswordError);
  });
});
