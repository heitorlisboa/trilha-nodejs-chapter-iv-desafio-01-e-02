import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

export class ShowUserProfileController {
  async execute(request: Request, response: Response) {
    const { id } = request.user;

    const showUserProfile = container.resolve(ShowUserProfileUseCase);

    const userProfile = await showUserProfile.execute(id);

    return response.json(userProfile);
  }
}
