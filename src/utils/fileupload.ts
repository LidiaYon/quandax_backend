// utils/fileUpload.ts
import multer from 'multer';
import path from 'path';
import { CustomError } from './errors';
import { getEnvVariable } from './getEnvVariable';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Different folders for different file types
        const type = file.mimetype.startsWith('video/') ? 'videos' : 'pdfs';
        cb(null, `uploads/${type}`);
    },
    filename: (req, file, cb) => {
        // Create unique filename with timestamp
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Accept only videos and PDFs
    if (file.mimetype.startsWith('video/') || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new CustomError('Invalid file type. Only videos and PDFs are allowed', 400));
    }
};

export const fileUploader = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(getEnvVariable("MAX_FILE_UPLOAD_SIZE_MB"),10) * 1024 * 1024 , // this is our limit in MB
    }
});