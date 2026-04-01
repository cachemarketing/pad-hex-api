import dotenv from "dotenv"
dotenv.config()

export const s3Config = {
  region: process.env.AWS_REGION || "us-east-1",
  bucket: process.env.AWS_S3_BUCKET || "my-blog-images",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  endpoint: process.env.AWS_S3_ENDPOINT,
  publicUrl:
    process.env.AWS_S3_PUBLIC_URL ||
    `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`,
}

// Validar configuración
if (!s3Config.accessKeyId || !s3Config.secretAccessKey) {
  console.warn(
    "⚠️ AWS credentials no configuradas. Las subidas de imágenes no funcionarán.",
  )
}
