import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from './CreateStatementUseCase';
import { ICreateUserDTO } from '../../../users/useCases/createUser/ICreateUserDTO';
import { ICreateStatementDTO } from './ICreateStatementDTO';
import { OperationType } from '../../entities/Statement';
import { CreateStatementError } from './CreateStatementError';

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

const user: ICreateUserDTO = {
  name: 'John Doe',
  email: 'john@test.com',
  password: 'secret',
};

let userId: string;

describe('Create statement use case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );
    userId = (await usersRepository.create(user)).id;
  });

  it('should be able to create a new deposit statement', async () => {
    const depositStatement: ICreateStatementDTO = {
      user_id: userId,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: 'Statement description sample',
    };

    const createdDepositStatement = await createStatementUseCase.execute(
      depositStatement
    );

    expect(createdDepositStatement).toMatchObject(depositStatement);
  });

  it('should be able to create a new withdraw statement', async () => {
    const depositStatement: ICreateStatementDTO = {
      user_id: userId,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: 'Statement description sample',
    };

    await createStatementUseCase.execute(depositStatement);

    const withdrawStatement: ICreateStatementDTO = {
      ...depositStatement,
      type: OperationType.WITHDRAW,
    };

    const createdWithdrawStatement = await createStatementUseCase.execute(
      withdrawStatement
    );

    expect(createdWithdrawStatement).toMatchObject(withdrawStatement);
  });

  it('should not be able to create a new withdraw statement with insufficient funds', async () => {
    await expect(
      createStatementUseCase.execute({
        user_id: userId,
        type: OperationType.WITHDRAW,
        amount: 1000,
        description: 'Statement description sample',
      })
    ).rejects.toThrow(CreateStatementError.InsufficientFunds);
  });

  it('should not be able to create a new statement for a non-existent user', async () => {
    await expect(
      createStatementUseCase.execute({
        user_id: '123',
        type: OperationType.DEPOSIT,
        amount: 1000,
        description: 'Statement description sample',
      })
    ).rejects.toThrow(CreateStatementError.UserNotFound);
  });
});
