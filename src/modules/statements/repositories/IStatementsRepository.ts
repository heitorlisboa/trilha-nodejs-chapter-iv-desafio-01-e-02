import { Statement } from '../entities/Statement';
import { ICreateStatementDTO } from '../useCases/createStatement/ICreateStatementDTO';
import { IGetStatementOperationDTO } from '../useCases/getStatementOperation/IGetStatementOperationDTO';
import {
  IGetBalanceDTOWithStatementFalse,
  IGetBalanceDTOWithStatementTrue,
} from '../useCases/getBalance/IGetBalanceDTO';

export interface IStatementsRepository {
  create: (data: ICreateStatementDTO) => Promise<Statement>;
  findStatementOperation: (
    data: IGetStatementOperationDTO
  ) => Promise<Statement | undefined>;
  getUserBalance(
    data: IGetBalanceDTOWithStatementFalse
  ): Promise<{ balance: number }>;
  getUserBalance(
    data: IGetBalanceDTOWithStatementTrue
  ): Promise<{ balance: number; statements: Statement[] }>;
}
