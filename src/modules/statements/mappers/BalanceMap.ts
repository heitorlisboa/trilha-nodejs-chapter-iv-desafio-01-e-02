import { Statement } from "../entities/Statement";
import { StatementMap } from "./StatementMap";

export class BalanceMap {
  static toDTO({statements, balance}: { statements: Statement[], balance: number}) {
    const parsedStatements = statements.map(StatementMap.toDTO);

    return {
      statements: parsedStatements,
      balance: Number(balance)
    }
  }
}
