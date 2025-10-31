import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
    uploadImage(
        file: Express.Multer.File,
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            const uploadStream = v2.uploader.upload_stream((error, result) => {
                if (error) return reject(error);
                if (result) {
                    resolve(result);
                } else {
                    reject(new Error('Result is undefined'));
                }
            });

            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }
}
