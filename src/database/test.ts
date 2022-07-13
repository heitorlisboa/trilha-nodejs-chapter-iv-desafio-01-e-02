import {
  Connection,
  ConnectionOptions,
  createConnection,
  getConnectionOptions,
} from 'typeorm';

export async function createTestConnection(): Promise<Connection> {
  const defaultOptions = await getConnectionOptions();

  const options = {
    ...defaultOptions,
    database: 'fin_api_test',
  };

  return await createConnection(options as ConnectionOptions);
}
