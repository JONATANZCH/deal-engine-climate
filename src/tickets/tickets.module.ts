import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from './entities/ticket.entity';
import { CsvProcessorService } from '../utils/csv-processor.service';
import { WeatherModule } from '../weather/weather.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), WeatherModule, CacheModule],
  controllers: [TicketsController],
  providers: [TicketsService, CsvProcessorService],
})
export class TicketsModule {}
