import { Connection, getRepository, Repository } from 'typeorm';
import { hash } from 'bcryptjs';
import request from 'supertest';

import { createTestConnection } from '../../../../database/test';
import { Statement } from '../../entities/Statement';
import { User } from '../../../users/entities/User';
import { app } from '../../../../app';

let connection: Connection;
let typeormUserRepository: Repository<User>;

let sessionToken: string;
const statement: { amount: number; description: string } = {
  amount: 1000,
  description: 'Statement description sample',
};

describe('Create statement controller', () => {
  beforeAll(async () => {
    connection = await createTestConnection();

    // Creating a user to authenticate...
    typeormUserRepository = getRepository(User);
    const user = typeormUserRepository.create({
      name: 'John Doe',
      email: 'john@test.com',
      password: await hash('secret', 8),
    });
    await typeormUserRepository.save(user);
    // ...and then authenticating
    sessionToken = (
      await request(app).post('/api/v1/sessions').send({
        email: 'john@test.com',
        password: 'secret',
      })
    ).body.token;
  });

  afterAll(async () => {
    // Removing the statements
    const typeormStatementRepository = getRepository(Statement);
    const statements = await typeormStatementRepository.find();
    await typeormStatementRepository.remove(statements);

    // Removing the users
    const users = await typeormUserRepository.find();
    await typeormUserRepository.remove(users);

    await connection.close();
  });

  it('should be able to create a new deposit statement', async () => {
    const response = await request(app)
      .post('/api/v1/statements/deposit')
      .set({
        Authorization: `Bearer ${sessionToken}`,
      })
      .send(statement);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(statement);
  });

  it('should be able to create a new withdraw statement', async () => {
    const response = await request(app)
      .post('/api/v1/statements/withdraw')
      .set({
        Authorization: `Bearer ${sessionToken}`,
      })
      .send(statement);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(statement);
  });
});
