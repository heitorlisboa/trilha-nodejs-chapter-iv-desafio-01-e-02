import { Connection, getRepository, Repository } from 'typeorm';
import { hash } from 'bcryptjs';
import request from 'supertest';

import { createTestConnection } from '../../../../database/test';
import { User } from '../../entities/User';
import { app } from '../../../../app';

let connection: Connection;
let typeormUserRepository: Repository<User>;

describe('Show user profile controller', () => {
  beforeEach(async () => {
    connection = await createTestConnection();
    typeormUserRepository = getRepository(User);
    const user = typeormUserRepository.create({
      name: 'John Doe',
      email: 'john@test.com',
      password: await hash('secret', 8),
    });
    await typeormUserRepository.save(user);
  });

  afterEach(async () => {
    const users = await typeormUserRepository.find();
    await typeormUserRepository.remove(users);
    await connection.close();
  });

  it('should be able to show the user profile', async () => {
    // Authenticating before because the route requires authentication
    const {
      body: { token: sessionToken },
    } = await request(app).post('/api/v1/sessions').send({
      email: 'john@test.com',
      password: 'secret',
    });

    const response = await request(app)
      .get('/api/v1/profile')
      .set({
        Authorization: `Bearer ${sessionToken}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name');
  });
});
