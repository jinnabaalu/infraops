import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import healthRouter from './src/routes/health';
import helloRouter from './src/hello';
import cassandraRoute from './src/routes/cassandraRoute';
import cors from 'cors';

const app = express();
const port = 8081;

app.use(bodyParser.json());
app.use(cors());

app.use('/api', healthRouter);
app.use('/api', helloRouter);
app.use('/api/cassandra', cassandraRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
