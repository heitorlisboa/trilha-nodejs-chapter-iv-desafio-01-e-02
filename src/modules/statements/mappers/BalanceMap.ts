import { Statement } from "../entities/Statement";

export class BalanceMap {
  static toDTO({statements, balance}: { statements: Statement[], balance: number}) {
    const parsedStatements = statements.map(({
      id,
      amount,
      description,
      type,
      created_at,
      updated_at
    }) => (
      {
        id,
        amount: Number(amount),
        description,
        type,
        created_at,
        updated_at
      }
    ));

    return {
      statements: parsedStatements,
      balance: Number(balance)
    }
  }
}
