import { Module } from '@nestjs/common';
import { AppController } from '@server/app.controller';
import { AppService } from '@server/app.service';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../client/.next/server/app'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
