import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers/';
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      // limits: { fieldSize: 10000 }
      storage: diskStorage({
        destination: './static/uploads', //  Ubicación de la carpeta donde se guardarán los archivos
        filename: fileNamer,
      }),
    }),
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    console.log(file);

    if (!file)
      throw new BadRequestException('Make sure that the file is an image');

    return {
      fileName: file.originalname,
    };
  }
}
