import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsString, IsNumber } from 'class-validator';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  origin: string;

  @Column()
  @IsString()
  destination: string;

  @Column()
  @IsString()
  airline: string;

  @Column()
  @IsString()
  flight_num: string;

  @Column()
  @IsString()
  origin_iata_code: string;

  @Column()
  @IsString()
  destination_iata_code: string;

  @Column('decimal')
  @IsNumber()
  origin_latitude: number;

  @Column('decimal')
  @IsNumber()
  origin_longitude: number;

  @Column('decimal')
  @IsNumber()
  destination_latitude: number;

  @Column('decimal')
  @IsNumber()
  destination_longitude: number;
}
