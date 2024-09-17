import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { HttpException, HttpStatus } from '@nestjs/common';

export const multerOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const dir = './uploads';
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: (req, file, callback) => {
      const fileExtName = extname(file.originalname);
      const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      callback(null, `${randomName}${fileExtName}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (file.mimetype !== 'text/csv') {
      return callback(
        new HttpException(
          'Only CSV files are allowed!',
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
    callback(null, true);
  },
};
