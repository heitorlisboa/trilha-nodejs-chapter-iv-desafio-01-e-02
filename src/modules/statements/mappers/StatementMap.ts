import { Statement } from '../entities/Statement';

export class StatementMap {
  static toDTO(statement: Statement): Statement {
    return { ...statement, amount: Number(statement.amount) };
  }
}
