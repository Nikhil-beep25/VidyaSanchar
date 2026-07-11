import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../utils/logger';

// Ensure uploads folder exists locally
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export async function uploadFile(req: Request, res: Response, next: NextFunction) {
  try {
    const { base64Data, fileName, mimeType } = req.body;

    if (!base64Data || !fileName || !mimeType) {
      return res.status(400).json({
        success: false,
        message: 'Base64 data, fileName, and mimeType are required.'
      });
    }

    // 1. Validate MIME type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
    ];

    if (!allowedMimeTypes.includes(mimeType)) {
      return res.status(400).json({
        success: false,
        message: `Unsupported file type. Allowed types: JPEG, PNG, WEBP, PDF, DOCX.`
      });
    }

    // 2. Validate File Size (5MB limit)
    // base64 length to approximate bytes is roughly length * 3/4
    const approxBytes = base64Data.length * 0.75;
    const maxBytes = 5 * 1024 * 1024; // 5MB

    if (approxBytes > maxBytes) {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds the 5MB maximum limit.'
      });
    }

    // 3. Process base64 buffer
    const base64Clean = base64Data.replace(/^data:.*?;base64,/, '');
    const buffer = Buffer.from(base64Clean, 'base64');

    // 4. Secure filename using unique timestamp
    const ext = path.extname(fileName) || (mimeType.includes('pdf') ? '.pdf' : mimeType.includes('png') ? '.png' : '.jpg');
    const safeFileName = `${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}${ext}`;
    const destinationPath = path.join(uploadsDir, safeFileName);

    // Write file to local uploads directory
    await fs.promises.writeFile(destinationPath, buffer);

    logger.info(`[Upload] File saved successfully: ${safeFileName}`);

    // Return the download/preview url path
    const fileUrl = `/uploads/${safeFileName}`;

    return res.status(201).json({
      success: true,
      message: 'File uploaded successfully.',
      fileUrl,
      fileName: safeFileName,
      mimeType,
      sizeBytes: buffer.length
    });
  } catch (error) {
    next(error);
  }
}
