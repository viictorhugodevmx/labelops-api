import { createApp } from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';

async function bootstrap(): Promise<void> {
  await connectDatabase();

  const app = createApp();

  app.listen(env.port, () => {
    console.log(
      `LabelOps API running on http://localhost:${env.port}`
    );
  });
}

void bootstrap();
