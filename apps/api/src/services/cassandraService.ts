import { Client } from 'cassandra-driver';
import { ContactPointRequest } from '../models/cassandraModels';
import * as fs from 'fs';

export class CassandraService {
  private client!: Client;

  async getContactPoints(): Promise<ContactPointRequest[] | { error: string }> {
    console.log("SERVICE METHOD")
    const configFilePath = '../config/cassandra.json';
    try {
        const fileContents = fs.readFileSync(configFilePath, 'utf8');
        const configData = JSON.parse(fileContents) as ContactPointRequest[];
        return configData;
    } catch (error: any) {
        return { error: `Error loading or parsing config file: ${error.message}` };
    }
  }

  async getKeySpaces(contactPoints: string[], dataCenter: string): Promise<string[]> {
    console.log("GET KEYSPACE")
    const client = new Client({
      contactPoints,
      localDataCenter: dataCenter
    });

    const result = await client.execute('SELECT keyspace_name FROM system_schema.keyspaces');
    return result.rows.map(row => row['keyspace_name']);
  }

  async executeSelectQuery(contactPoints: string[], dataCenter: string, keyspace: string, query: string): Promise<any> {
    if (!query.trim().match(/^select\s+/i)) {
      throw new Error('Query must start with SELECT');
    }
    if (query.match(/(create|delete|update)/i)) {
      throw new Error('Query contains forbidden keywords');
    }

    const client = new Client({
      contactPoints,
      localDataCenter: dataCenter,
      keyspace: keyspace
    });

    const result = await client.execute(query);
    return result.rows;
  }
}
