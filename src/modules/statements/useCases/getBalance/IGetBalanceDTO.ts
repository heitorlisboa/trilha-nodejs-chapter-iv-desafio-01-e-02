export interface IGetBalanceDTO {
  user_id: string;
  with_statement?: boolean;
}

export interface IGetBalanceDTOWithStatementFalse extends IGetBalanceDTO {
  with_statement?: false;
}

export interface IGetBalanceDTOWithStatementTrue extends IGetBalanceDTO {
  with_statement?: true;
}
