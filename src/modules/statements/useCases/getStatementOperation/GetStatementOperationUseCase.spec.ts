import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';
import { ICreateUserDTO } from '../../../users/useCases/createUser/ICreateUserDTO';
import { OperationType } from '../../entities/Statement';
import { GetStatementOperationError } from './GetStatementOperationError';

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

const user: ICreateUserDTO = {
  name: 'John Doe',
  email: 'john@test.com',
  password: 'secret',
};

let userId: string;

describe('Get statement operation use case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository
    );
    userId = (await usersRepository.create(user)).id;
  });

  it('should be able to get the statement', async () => {
    const statement = await statementsRepository.create({
      user_id: userId,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: 'Statement description sample',
    });

    const obtainedStatement = await getStatementOperationUseCase.execute({
      user_id: userId,
      statement_id: statement.id,
    });

    expect(obtainedStatement).toMatchObject(statement);
  });

  it('should not be able to get a non-existent statement', async () => {
    await expect(
      getStatementOperationUseCase.execute({
        user_id: userId,
        statement_id: '123',
      })
    ).rejects.toThrow(GetStatementOperationError.StatementNotFound);
  });

  it('should not be able to get a statement from a non-existent user', async () => {
    await expect(
      getStatementOperationUseCase.execute({
        user_id: '123',
        statement_id: '123',
      })
    ).rejects.toThrow(GetStatementOperationError.UserNotFound);
  });
});
