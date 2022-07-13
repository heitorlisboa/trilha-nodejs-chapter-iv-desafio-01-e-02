import { Connection, getRepository, Repository } from 'typeorm';
import { hash } from 'bcryptjs';
import request from 'supertest';

import { createTestConnection } from '../../../../database/test';
import { User } from '../../entities/User';
import { app } from '../../../../app';

let connection: Connection;
let typeormUserRepository: Repository<User>;

describe('Authenticate user controller', () => {
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

  it('should be able to authenticate the user', async () => {
    const respose = await request(app).post('/api/v1/sessions').send({
      email: 'john@test.com',
      password: 'secret',
    });

    expect(respose.status).toBe(200);
    expect(respose.body).toHaveProperty('user');
    expect(respose.body).toHaveProperty('token');
  });
});
