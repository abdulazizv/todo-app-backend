import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
const port = process.env.PORT || 4000;
async function start() {
  try {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(port, () => {
      console.log(`Server has been started at ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
}
start();
