import express, { Request, Response } from 'express';
import { ContactPointRequest, ExecuteQueryRequest, RequestKeyspaceEntity } from '../models/cassandraModels';
import { CassandraService } from '../services/cassandraService';

const cassandraRoute = express.Router();
const contactPoints = [
  {
    "dc": "LOCAL",
    "hosts": ["127.0.0.1"]
  },
  {
    "dc": "NY",
    "hosts": ["10.0.23.1", "10.0.23.2"]
  },
  {
    "dc": "SYD",
    "hosts": ["10.0.27.1", "10.0.27.2"]
  }
]

cassandraRoute.get('/contactPoints', async (_req, res: Response<ContactPointRequest[] | { error: string }>) => {
  try {
    const cassandraService = new CassandraService();
    console.log("ROUTE METHOD")
    res.json(contactPoints);
  } catch (error) {
    console.error('Error fetching contact points:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

cassandraRoute.post('/keyspaces', async (req: Request<{}, {}, RequestKeyspaceEntity>, res: Response) => {
  try {
    const { contactPoints, dataCenter } = req.body;
    const cassandraService = new CassandraService();
    const keyspaces = await cassandraService.getKeySpaces(contactPoints, dataCenter);
    res.json({ keyspaces });
  } catch (error) {
    console.error('Error fetching keyspaces:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

cassandraRoute.post('/getTablesByKeyspace', async (req: Request<{}, {}, ExecuteQueryRequest>, res: Response) => {
  console.log(req.body)
  try {
    const { contactPoints, dataCenter, keyspace } = req.body;
    const query = `SELECT table_name FROM system_schema.tables WHERE keyspace_name = '${keyspace}'`;
    const cassandraService = new CassandraService();
    const tables = await cassandraService.executeSelectQuery(contactPoints, dataCenter, keyspace, query);
    res.json({ tables });
  } catch (error) {
    console.error('Error getting tables by keyspace:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

cassandraRoute.post('/executeSelectQuery', async (req: Request<{}, {}, ExecuteQueryRequest>, res: Response) => {
  try {
    const { contactPoints, dataCenter, keyspace, query } = req.body;
    const cassandraService = new CassandraService();
    console.log(req.body)
    const result = await cassandraService.executeSelectQuery(contactPoints, dataCenter, keyspace, query);
    res.json({ result });
  } catch (error) {
    console.error('Error executing select query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default cassandraRoute;