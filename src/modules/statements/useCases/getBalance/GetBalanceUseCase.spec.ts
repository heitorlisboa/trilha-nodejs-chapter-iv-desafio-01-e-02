import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { GetBalanceUseCase } from './GetBalanceUseCase';
import { ICreateUserDTO } from '../../../users/useCases/createUser/ICreateUserDTO';
import { ICreateStatementDTO } from '../createStatement/ICreateStatementDTO';
import { OperationType } from '../../entities/Statement';
import { GetBalanceError } from './GetBalanceError';

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

const user: ICreateUserDTO = {
  name: 'John Doe',
  email: 'john@test.com',
  password: 'secret',
};

let userId: string;

describe('Get balance use case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepository
    );
    userId = (await usersRepository.create(user)).id;
  });

  it('should be able to get the user balance', async () => {
    // Creating a statement
    const statement = await statementsRepository.create({
      type: OperationType.WITHDRAW,
      amount: 1000,
      description: 'Statement description sample',

      user_id: userId,
    });

    // Getting the user balance and statements
    const { balance, statements } = await getBalanceUseCase.execute({
      user_id: userId,
    });

    // Calculating the balance to compare
    const calculatedBalance = statements.reduce((acc, operation) => {
      if (operation.type === 'deposit') {
        return acc + operation.amount;
      } else {
        return acc - operation.amount;
      }
    }, 0);

    expect(typeof balance).toBe('number');
    expect(balance).toEqual(calculatedBalance);
    expect(statements[0]).toMatchObject(statement);
  });

  it('should not be able to get the balance of a non-existent user', async () => {
    await expect(getBalanceUseCase.execute({ user_id: '123' })).rejects.toThrow(
      GetBalanceError
    );
  });
});
