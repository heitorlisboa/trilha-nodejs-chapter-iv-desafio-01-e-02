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

describe('Get statement operation controller', () => {
  beforeEach(async () => {
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

  afterEach(async () => {
    // Removing the statements
    const typeormStatementRepository = getRepository(Statement);
    const statements = await typeormStatementRepository.find();
    await typeormStatementRepository.remove(statements);

    // Removing the users
    const users = await typeormUserRepository.find();
    await typeormUserRepository.remove(users);

    await connection.close();
  });

  it('should be able to get the statement', async () => {
    // Creating a deposit statement first
    const { body: statement } = await request(app)
      .post('/api/v1/statements/deposit')
      .set({
        Authorization: `Bearer ${sessionToken}`,
      })
      .send({
        amount: 1000,
        description: 'Statement description sample',
      });

    // Then getting the created statement
    const response = await request(app)
      .get(`/api/v1/statements/${statement.id}`)
      .set({
        Authorization: `Bearer ${sessionToken}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(statement);
  });
});
