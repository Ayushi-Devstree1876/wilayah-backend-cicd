import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2CommandOutput,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { Readable } from "stream";

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>("AWS_REGION"),
      credentials: {
        accessKeyId: this.configService.get<string>("AWS_ACCESS_KEY"),
        secretAccessKey: this.configService.get<string>("AWS_SECRET_KEY"),
      },
    });
  }

  async awsSingleUpload(path, media) {
    const uploadParams = new PutObjectCommand({
      Bucket: this.configService.get<string>("S3_BUCKET_NAME"),
      Key: path,
      Body: media.buffer,
      ContentType: media.mimetype,
      ACL: "public-read",
    });

    await this.s3Client.send(uploadParams);
    const location = `https://${this.configService.get<string>("S3_BUCKET_NAME")}.s3.${this.configService.get<string>("AWS_REGION")}.amazonaws.com/${path}`;

    return { Location: location, Key: path };
  }

  async awsMultipleUpload(path, media) {
    const uploadResults = [];
    const concurrencyLimit = 5; // Number of concurrent uploads

    // Use a for...of loop to iterate over files
    for (let i = 0; i < media.length; i++) {
      const file = media[i];

      // Prepare S3 upload parameters
      const uploadParams = new PutObjectCommand({
        Bucket: this.configService.get<string>("S3_BUCKET_NAME"),
        Key: `${path}/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read",
      });

      // Upload the file and store the result
      const uploadPromise = this.s3Client.send(uploadParams).then(() => {
        const location = `https://${this.configService.get<string>("S3_BUCKET_NAME")}.s3.${this.configService.get<string>("AWS_REGION")}.amazonaws.com/${path}/${file.originalname}`;
        return { Location: location, Key: `${path}/${file.originalname}` };
      });

      // Push the uploadPromise to uploadResults
      uploadResults.push(uploadPromise);

      // If we've hit the concurrency limit, wait for all promises to settle before continuing
      if (uploadResults.length >= concurrencyLimit) {
        await Promise.all(uploadResults);
        uploadResults.length = 0; // Reset the batch
      }
    }

    // Wait for any remaining uploads to complete
    const locations = await Promise.all(uploadResults);
    return locations;
  }

  async awsDelete(key) {
    const params = new DeleteObjectCommand({
      Bucket: this.configService.get<string>("S3_BUCKET_NAME"),
      Key: key,
    });

    // delete from s3
    this.s3Client.send(params);
  }
  // Method to fetch all files in the S3 bucket
  async getFilesFromS3(
    bucketName: string,
    folderName: string
  ): Promise<ListObjectsV2CommandOutput["Contents"]> {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: folderName,
    });

    const result = await this.s3Client.send(command);
    return result.Contents || [];
  }

  // Method to get content of a specific file from S3
  async getFileFromS3(bucketName: string, fileName: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });

    const result = await this.s3Client.send(command);

    // Convert stream to string
    if (result.Body) {
      return await this.streamToString(result.Body as Readable);
    }

    throw new Error("Empty file or unable to read file from S3");
  }

  private async streamToString(stream: Readable): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
      stream.on("error", reject);
    });
  }
}
