import dotenv from 'dotenv';

import { createApp } from './app';

dotenv.config();

const port = Number(
  process.env.PORT ?? 3006
);

const app = createApp();

app.listen(port, () => {
  console.log(
    `LabelOps API running on http://localhost:${port}`
  );
});
