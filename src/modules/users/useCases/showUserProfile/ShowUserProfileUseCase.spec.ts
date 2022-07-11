import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';
import { ICreateUserDTO } from '../createUser/ICreateUserDTO';
import { ShowUserProfileError } from './ShowUserProfileError';

let usersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe('Show user profile use case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it('should be able to show the user profile', async () => {
    const user: ICreateUserDTO = {
      name: 'John Doe',
      email: 'john@test.com',
      password: 'secret',
    };

    const { id } = await usersRepository.create(user);

    const userProfile = await showUserProfileUseCase.execute(id);

    expect(userProfile).toMatchObject({ name: user.name, email: user.email });
    expect(userProfile).not.toHaveProperty('password');
  });

  it('should not be able to show the profile of a non-existent user', async () => {
    await expect(showUserProfileUseCase.execute('123')).rejects.toThrow(
      ShowUserProfileError
    );
  });
});
