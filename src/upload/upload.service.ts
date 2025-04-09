import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class UploadService {
  async uploadFile(file: Express.Multer.File, req: Request) {
    const baseUrl = `${req.protocol}://${req.get('host')}`; // Dynamically get base URL
    const filePath = `${baseUrl}/uploads/${file.filename}`;
    return {
      message: 'File uploaded successfully',
      url: filePath,
    };
  }
}
