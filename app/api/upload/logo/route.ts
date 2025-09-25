import cloudinary from '@/lib/cloudinary';
import { NextRequest } from 'next/server';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('logo') as File;
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Upload to Cloudinary 
    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'company-logos',
          transformation: [
            { width: 300, height: 300, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result);
          } else {
            reject(new Error('Upload failed with no result'));
          }
        }
      ).end(buffer);
    });
    
    return Response.json({
      success: true,
      data: { logoUrl: uploadResult.secure_url }
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return Response.json({
      success: false,
      message: "Failed to upload logo"
    }, { status: 500 });
  }
}