import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { CreateTicketDto } from '../tickets/dto/create-ticket.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  async processCsv(filePath: string): Promise<void> {
    const tickets: CreateTicketDto[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', async (row) => {
          const ticketDto = plainToInstance(CreateTicketDto, row);

          const errors = await validate(ticketDto);
          if (errors.length > 0) {
            console.log(`Validation failed: ${errors}`);
            return;
          }

          tickets.push(ticketDto);
        })
        .on('end', async () => {
          await this.ticketRepository.save(tickets);
          resolve();
        })
        .on('error', (error) => reject(error));
    });
  }
}
