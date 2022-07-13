import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '../../../users/repositories/IUsersRepository';
import { BalanceMap } from '../../mappers/BalanceMap';
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { GetBalanceError } from './GetBalanceError';

interface IRequest {
  user_id: string;
}

@injectable()
export class GetBalanceUseCase {
  constructor(
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute({ user_id }: IRequest) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new GetBalanceError();
    }

    const balanceWithStatements = await this.statementsRepository.getUserBalance({
      user_id,
      with_statement: true,
    });

    const balanceWithStatementsDTO = BalanceMap.toDTO(balanceWithStatements);

    return balanceWithStatementsDTO;
  }
}
