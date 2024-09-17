import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpStatus,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TicketsService } from './tickets.service';
import { Response } from 'express';
import { multerOptions } from 'src/config/multer.config';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded or invalid file type');
      }

      const result = await this.ticketsService.processCsvAndWeather(file.path);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(error.status || HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message || 'Error processing file',
      });
    }
  }
}
