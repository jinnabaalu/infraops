// src/hello.ts
import express, { Request, Response } from 'express';

const helloRouter = express.Router();

helloRouter.get('/', (req: Request, res: Response) => {
  res.send('Hello, this is your API!');
});

export default helloRouter;
