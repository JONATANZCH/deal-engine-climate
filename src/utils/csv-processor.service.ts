import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CsvProcessorService {
  async parseCsv<T extends object>(
    filePath: string,
    dtoClass: new () => T,
    mapRowToDto: (row: any) => T,
  ): Promise<T[]> {
    const results: T[] = [];
    const errorsArray = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', async (row) => {
          const dtoInstance = plainToInstance(dtoClass, mapRowToDto(row));

          const errors = await validate(dtoInstance);
          if (errors.length > 0) {
            console.log(
              `Validation processor failed: ${JSON.stringify(errors)}`,
            );
            errorsArray.push(errors);
            return;
          }

          results.push(dtoInstance);
        })
        .on('end', () => {
          if (errorsArray.length > 0) {
            reject({ success: false, errors: errorsArray });
          } else {
            resolve(results);
          }
        })
        .on('error', (error) => reject(error));
    });
  }
}
