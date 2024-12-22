import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {

    // TODO: CSRF

    try {
        const data = await req.formData();

        // Get all the field with 'image' into 1 array
        const files = data.getAll('file');

        const links = [];
        for (const file of files) {

            // if (!(file instanceof File)) { continue; }

            const fileBuffer = await (file as any).arrayBuffer();
            const typedArray = new Uint8Array(fileBuffer);
            const body = Buffer.from(typedArray);

            const s3Client = new S3Client({
                region: 'us-west-1',
                credentials: {
                    accessKeyId: process.env.S3_ACCESS_KEY!,
                    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
                }
            });

            const bucketName = 'cdn-greet';
            const ext = (file as any).name.split('.').pop();
            const newFilename = Date.now() + '.' + ext;

            const response = await s3Client.send(new PutObjectCommand({
                Bucket: bucketName,
                Key: newFilename,
                Body: body,
                ContentType: (file as any)!.type,
                ACL: 'public-read',
            }));

            const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
            links.push(link);
        }

        return NextResponse.json(links);


    } catch (error) {
        console.error(error)
        return NextResponse.json({}, { status: 500 });
    }
}