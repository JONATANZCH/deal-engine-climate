import { Module } from '@nestjs/common';
import { TicketsModule } from './tickets/tickets.module';
import { WeatherModule } from './weather/weather.module';
import { CacheModule } from './cache/cache.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TicketsModule,
    WeatherModule,
    CacheModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
