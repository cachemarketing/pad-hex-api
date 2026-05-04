import {
  S3Client as AwsS3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3"
import { s3Config } from "../../../shared/infrastructure/config/s3.config"
import { cloudfrontConfig } from "../../../shared/infrastructure/config/cloudfront.config"

export class S3Client {
  private static instance: S3Client
  private client: AwsS3Client
  private bucket: string
  private s3PublicUrl: string
  private cloudfrontUrl: string

  private constructor() {
    this.client = new AwsS3Client({
      region: s3Config.region,
      credentials: {
        accessKeyId: s3Config.accessKeyId!,
        secretAccessKey: s3Config.secretAccessKey!,
      },
      ...(s3Config.endpoint && { endpoint: s3Config.endpoint }),
    })
    this.bucket = s3Config.bucket
    this.s3PublicUrl = s3Config.publicUrl
    this.cloudfrontUrl = cloudfrontConfig.getPublicUrl()
  }

  static getInstance(): S3Client {
    if (!S3Client.instance) {
      S3Client.instance = new S3Client()
    }
    return S3Client.instance
  }

  getClient(): AwsS3Client {
    return this.client
  }

  getBucket(): string {
    return this.bucket
  }

  // ✅ Obtener URL pública (prioriza CloudFront si está configurado)
  getPublicUrlForKey(key: string): string {
    if (this.cloudfrontUrl) {
      return `${this.cloudfrontUrl}/${key}`
    }
    return `${this.s3PublicUrl}/${key}`
  }

  async uploadFile(
    key: string,
    body: Buffer,
    contentType: string,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      // Cache control para CloudFront
      CacheControl: `public, max-age=${cloudfrontConfig.cacheSettings.maxTTL}, immutable`,
      Metadata: {
        "uploaded-at": new Date().toISOString(),
      },
    })

    await this.client.send(command)

    // Retornar URL a través de CloudFront
    return this.getPublicUrlForKey(key)
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    })
    await this.client.send(command)
  }

  async fileExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })
      await this.client.send(command)
      return true
    } catch (error) {
      return false
    }
  }

  // ✅ Invalidar caché de CloudFront después de eliminar/actualizar
  async invalidateCache(paths: string[]): Promise<void> {
    if (!cloudfrontConfig.distributionId) {
      console.warn(
        "CloudFront Distribution ID no configurado, no se puede invalidar caché",
      )
      return
    }

    try {
      const { CloudFrontClient, CreateInvalidationCommand } =
        await import("@aws-sdk/client-cloudfront")

      const cloudfront = new CloudFrontClient({
        region: s3Config.region,
        credentials: {
          accessKeyId: s3Config.accessKeyId!,
          secretAccessKey: s3Config.secretAccessKey!,
        },
      })

      const command = new CreateInvalidationCommand({
        DistributionId: cloudfrontConfig.distributionId,
        InvalidationBatch: {
          CallerReference: `${Date.now()}`,
          Paths: {
            Quantity: paths.length,
            Items: paths,
          },
        },
      })

      await cloudfront.send(command)
      console.log(`✅ Caché de CloudFront invalidado para: ${paths.join(", ")}`)
    } catch (error) {
      console.error("Error invalidando caché de CloudFront:", error)
    }
  }
}
