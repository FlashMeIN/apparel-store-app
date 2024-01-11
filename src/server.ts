import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import apparelRoutes from './routes/apparelRoutes';

const app = express();
const PORT = 3000;
// Middleware
app.use(helmet());
app.use(morgan('combined')); // Logging
app.use(bodyParser.json());

// Routes
app.use('/api/apparel', apparelRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

if (!module.parent) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
export default app;