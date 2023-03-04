import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFileter } from './helper/fileFileter.helper';
import { fileNamer } from './helper/fileNamer.helper';

@Controller('files')
export class FilesController {
    constructor(
        private readonly filesService: FilesService,
        private readonly configService: ConfigService
    ) {}
    @Post('product')
    @UseInterceptors(FileInterceptor('file', {
        fileFilter: fileFileter,
        limits: { fileSize: 100000000 },
        storage: diskStorage({
            destination: './static/products',
            filename: fileNamer
        })
    }))
    uploadFile(@UploadedFile() file: Express.Multer.File) {

        if(!file) {
            throw new BadRequestException('Not an image you send');
        }

        return {
            secureUrl: `${this.configService.get('HOST_API')}/files/product/${file.filename}`
        };
    }


    @Get('product/:imageName')
    async findProductImage(
        @Res() res: Response,
        @Param('imageName') imageName: string
    ) {
        const path = this.filesService.getStaticProductImage(imageName);

        res.sendFile(path);


    }
}
