import { IsString, IsNumber } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  origin: string;

  @IsString()
  destination: string;

  @IsString()
  airline: string;

  @IsString()
  flight_num: string;

  @IsString()
  origin_iata_code: string;

  @IsString()
  destination_iata_code: string;

  @IsNumber()
  origin_latitude: number;

  @IsNumber()
  origin_longitude: number;

  @IsNumber()
  destination_latitude: number;

  @IsNumber()
  destination_longitude: number;
}
