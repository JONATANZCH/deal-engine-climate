import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { CacheService } from '../cache/cache.service';
import { ConfigService } from '@nestjs/config';
import { CreateTicketDto } from 'src/tickets/dto/create-ticket.dto';

@Injectable()
export class WeatherService {
  private readonly apiKey: string;
  private readonly batchSize: number;
  private readonly cacheTTL: number;
  private readonly apiUrl: string;
  private apiRequestCount = 0;
  private readonly logger = new Logger(WeatherService.name);

  constructor(
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
    this.batchSize = this.configService.get<number>('WEATHER_BATCH_SIZE', 10);
    this.cacheTTL = this.configService.get<number>('CACHE_TTL', 3600);
    this.apiUrl = this.configService.get<string>('OPENWEATHER_API_URL');
  }

  async getWeatherForTickets(tickets: CreateTicketDto[]): Promise<any[]> {
    return this.processTicketsInBatches(tickets, this.batchSize);
  }

  private async processTicketsInBatches(
    tickets: CreateTicketDto[],
    batchSize: number,
  ): Promise<any[]> {
    const weatherReports: any[] = [];
    const uniqueCoordinates = new Set<string>();

    const processBatch = async (start: number, end: number) => {
      const batch = tickets.slice(start, end);
      const batchPromises = batch.map(async (ticket) => {
        const originKey = `${parseFloat(ticket.origin_latitude.toFixed(2))}_${parseFloat(ticket.origin_longitude.toFixed(2))}`;
        const destinationKey = `${parseFloat(ticket.destination_latitude.toFixed(2))}_${parseFloat(ticket.destination_longitude.toFixed(2))}`;

        let weatherOrigin;
        let weatherDestination;

        if (!uniqueCoordinates.has(originKey)) {
          console.log(`Requesting weather for origin: ${originKey}`);
          uniqueCoordinates.add(originKey);
          weatherOrigin = await this.getWeatherWithCache(
            ticket.origin_latitude,
            ticket.origin_longitude,
          );
        }

        if (!uniqueCoordinates.has(destinationKey)) {
          console.log(`Requesting weather for destination: ${destinationKey}`);
          uniqueCoordinates.add(destinationKey);
          weatherDestination = await this.getWeatherWithCache(
            ticket.destination_latitude,
            ticket.destination_longitude,
          );
        }

        return { ticket, weatherOrigin, weatherDestination };
      });
      return Promise.all(batchPromises);
    };

    for (let i = 0; i < tickets.length; i += batchSize) {
      const end = Math.min(i + batchSize, tickets.length);
      const batchResults = await processBatch(i, end);
      weatherReports.push(...batchResults);
    }

    console.log(`Total API requests made: ${this.apiRequestCount}`);
    return weatherReports;
  }

  private async getWeatherWithCache(lat: number, lon: number): Promise<any> {
    const roundedLat = parseFloat(lat.toFixed(2));
    const roundedLon = parseFloat(lon.toFixed(2));

    const cacheKey = `${roundedLat}_${roundedLon}`;
    let weather = await this.cacheService.get(cacheKey);

    if (weather) {
      console.log(`Cache hit for coordinates: ${roundedLat}, ${roundedLon}`);
    } else {
      console.log(
        `Cache miss for coordinates: ${roundedLat}, ${roundedLon}. Fetching from API...`,
      );
      this.apiRequestCount++;
      weather = await this.fetchWeatherFromApi(roundedLat, roundedLon);

      // Verifica si el clima se guarda correctamente en el caché
      await this.cacheService.set(cacheKey, weather, this.cacheTTL);
      console.log(
        `Weather data stored in cache for coordinates: ${roundedLat}, ${roundedLon}`,
      );
    }

    return weather;
  }

  private async fetchWeatherFromApi(lat: number, lon: number): Promise<any> {
    try {
      const response = await axios.get(this.apiUrl, {
        params: {
          lat: lat,
          lon: lon,
          appid: this.apiKey,
          units: 'metric',
        },
        timeout: 5000,
      });
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error fetching weather for lat: ${lat}, lon: ${lon}`,
        error,
      );
      throw new Error('Error fetching weather data');
    }
  }
}
