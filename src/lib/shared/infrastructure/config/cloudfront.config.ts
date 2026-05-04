import dotenv from "dotenv"
dotenv.config()

export const cloudfrontConfig = {
  // CloudFront Distribution URL (sin https://)
  distributionDomain: process.env.CLOUDFRONT_DOMAIN || "",
  distributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID || "",

  // URLs completas
  getPublicUrl(): string {
    return this.distributionDomain ? `https://${this.distributionDomain}` : ""
  },

  // URL para un key específico
  getImageUrl(key: string): string {
    return `${this.getPublicUrl()}/${key}`
  },

  // Configuración de caché (en segundos)
  cacheSettings: {
    defaultTTL: 86400, // 24 horas
    minTTL: 0,
    maxTTL: 31536000, // 1 año
  },

  // Comportamientos de caché
  behaviors: {
    images: {
      pathPattern: "posts/*",
      minTTL: 86400, // 24 horas
      maxTTL: 31536000, // 1 año
      defaultTTL: 86400,
      compress: true,
    },
  },
}

// Validar configuración
if (!cloudfrontConfig.distributionDomain) {
  console.warn(
    "⚠️ CLOUDFRONT_DOMAIN no configurado. Las imágenes se servirán directamente desde S3.",
  )
}
