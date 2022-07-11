import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from './CreateUserUseCase';
import { ICreateUserDTO } from './ICreateUserDTO';
import { CreateUserError } from './CreateUserError';

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

const user: ICreateUserDTO = {
  name: 'John Doe',
  email: 'john@test.com',
  password: 'secret',
};

describe('Create user use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it('should be able to create a new user', async () => {
    const createdUser = await createUserUseCase.execute(user);

    expect(createdUser).toMatchObject({ name: user.name, email: user.email });
  });

  it('should not be able to create a new user with a duplicate e-mail', async () => {
    // Creating for the first time
    await createUserUseCase.execute(user);

    // Creating for the second time
    await expect(createUserUseCase.execute(user)).rejects.toThrow(
      CreateUserError
    );
  });
});
