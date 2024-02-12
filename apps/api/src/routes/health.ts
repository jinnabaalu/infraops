import express, { Request, Response } from 'express';

const healthRouter = express.Router();

healthRouter.get('/health', (req: Request, res: Response) => {
  
  res.json({ status: 'UP' });
});

export default healthRouter;
