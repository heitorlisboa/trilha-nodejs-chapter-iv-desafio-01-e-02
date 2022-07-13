import { Connection, getRepository } from 'typeorm';
import request from 'supertest';

import { createTestConnection } from '../../../../database/test';
import { User } from '../../entities/User';
import { app } from '../../../../app';

let connection: Connection;

describe('Create user controller', () => {
  beforeEach(async () => {
    connection = await createTestConnection();
  });

  afterEach(async () => {
    const typeormUserRepository = getRepository(User);
    const users = await typeormUserRepository.find();
    await typeormUserRepository.remove(users);
    await connection.close();
  });

  it('should be able to create a new user', async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: 'John Doe',
      email: 'john@test.com',
      password: 'secret',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({});
  });
});
