import { getRepository, Repository } from 'typeorm';

import { IStatementsRepository } from './IStatementsRepository';
import { Statement } from '../entities/Statement';
import { ICreateStatementDTO } from '../useCases/createStatement/ICreateStatementDTO';
import { IGetStatementOperationDTO } from '../useCases/getStatementOperation/IGetStatementOperationDTO';
import {
  IGetBalanceDTO,
  IGetBalanceDTOWithStatementFalse,
  IGetBalanceDTOWithStatementTrue,
} from '../useCases/getBalance/IGetBalanceDTO';

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;

  constructor() {
    this.repository = getRepository(Statement);
  }

  async create({
    user_id,
    amount,
    description,
    type,
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = this.repository.create({
      user_id,
      amount,
      description,
      type,
    });

    return this.repository.save(statement);
  }

  async findStatementOperation({
    statement_id,
    user_id,
  }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.findOne(statement_id, {
      where: { user_id },
    });
  }

  async getUserBalance(
    data: IGetBalanceDTOWithStatementFalse
  ): Promise<{ balance: number }>;

  async getUserBalance(
    data: IGetBalanceDTOWithStatementTrue
  ): Promise<{ balance: number; statements: Statement[] }>;

  async getUserBalance({ user_id, with_statement = false }: IGetBalanceDTO) {
    const statements = await this.repository.find({
      where: { user_id },
    });

    const balance = statements.reduce((acc, operation) => {
      if (operation.type === 'deposit') {
        return acc + operation.amount;
      } else {
        return acc - operation.amount;
      }
    }, 0);

    if (with_statement) {
      return {
        statements,
        balance,
      };
    }

    return { balance };
  }
}
