import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CsvProcessorService } from '../utils/csv-processor.service';
import { WeatherService } from '../weather/weather.service';

export interface ProcessedTicketsResponse {
  success: boolean;
  message: string;
  totalWeatherReports: number;
  weatherReports?: any[];
}

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private readonly csvProcessorService: CsvProcessorService,
    private readonly weatherService: WeatherService,
  ) {}

  async processCsvAndWeather(
    filePath: string,
  ): Promise<ProcessedTicketsResponse> {
    const tickets = await this.csvProcessorService.parseCsv<CreateTicketDto>(
      filePath,
      CreateTicketDto,
      (row) => ({
        origin: row.origin,
        destination: row.destination,
        airline: row.airline,
        flight_num: row.flight_num,
        origin_iata_code: row.origin_iata_code,
        destination_iata_code: row.destination_iata_code,
        origin_latitude: parseFloat(row.origin_latitude),
        origin_longitude: parseFloat(row.origin_longitude),
        destination_latitude: parseFloat(row.destination_latitude),
        destination_longitude: parseFloat(row.destination_longitude),
      }),
    );

    if (tickets.length === 0) {
      console.error('No valid data found in CSV file');
      throw new BadRequestException('No valid data found in CSV file');
    }

    const uniqueTickets = tickets.reduce((acc, ticket) => {
      const originKey = `${ticket.origin_latitude}_${ticket.origin_longitude}`;
      const destinationKey = `${ticket.destination_latitude}_${ticket.destination_longitude}`;
      const key = `${originKey}_${destinationKey}`;

      if (!acc.has(key)) {
        acc.set(key, ticket);
      }

      return acc;
    }, new Map());

    const uniqueTicketList = Array.from(uniqueTickets.values());

    console.log(`Total unique tickets to be saved: ${uniqueTicketList.length}`);

    let savedTicketsCount = 0;
    for (const ticket of uniqueTicketList) {
      try {
        const exists = await this.ticketRepository.findOne({
          where: {
            flight_num: ticket.flight_num,
            airline: ticket.airline,
            origin: ticket.origin,
            destination: ticket.destination,
          },
        });

        if (!exists) {
          await this.ticketRepository.save(ticket);
          savedTicketsCount++;
        }
      } catch (error) {
        console.error(`Error guardando ticket: ${error.message}`);
      }
    }

    console.log(`Total unique tickets saved in the DB: ${savedTicketsCount}`);

    const weatherReports =
      await this.weatherService.getWeatherForTickets(uniqueTicketList);

    console.log(`Total weather reports generated: ${weatherReports.length}`);

    return {
      success: true,
      message: 'Tickets and weather data processed successfully',
      totalWeatherReports: weatherReports.length,
      weatherReports,
    };
  }
}
