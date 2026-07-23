import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

dotenv.config();

const app = express();

const port = Number(
  process.env.PORT ?? 3006
);

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    app: process.env.APP_NAME ?? 'labelops-api',
    domain: 'Music label media manager',
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(
    `LabelOps API running on http://localhost:${port}`
  );
});
