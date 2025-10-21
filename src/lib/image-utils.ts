import { StorageService } from './storage-service';
import type { UploadResult } from './storage-service';

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export interface ProcessedImage {
  file: File;
  originalSize: number;
  processedSize: number;
  compressionRatio: number;
}

export class ImageUtils {
  /**
   * Procesa una imagen antes de subirla (redimensiona y optimiza)
   * @param file - Archivo de imagen original
   * @param options - Opciones de procesamiento
   * @returns Promise<ProcessedImage> - Imagen procesada
   */
  static async processImage(
    file: File, 
    options: ImageProcessingOptions = {}
  ): Promise<ProcessedImage> {
    const {
      maxWidth = 800,
      maxHeight = 600,
      quality = 0.8,
      format = 'jpeg'
    } = options;

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        try {
          // Calcular nuevas dimensiones manteniendo la proporción
          const { width, height } = this.calculateDimensions(
            img.width, 
            img.height, 
            maxWidth, 
            maxHeight
          );

          // Configurar canvas
          canvas.width = width;
          canvas.height = height;

          // Dibujar imagen redimensionada
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
          }

          // Convertir a blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const processedFile = new File([blob], file.name, {
                  type: `image/${format}`,
                  lastModified: Date.now()
                });

                const compressionRatio = (1 - (processedFile.size / file.size)) * 100;

                resolve({
                  file: processedFile,
                  originalSize: file.size,
                  processedSize: processedFile.size,
                  compressionRatio
                });
              } else {
                reject(new Error('No se pudo procesar la imagen'));
              }
            },
            `image/${format}`,
            quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Error al cargar la imagen'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Sube una imagen procesada al bucket de Supabase
   * @param file - Archivo de imagen
   * @param fileName - Nombre del archivo
   * @param folder - Carpeta de destino
   * @param processOptions - Opciones de procesamiento
   * @returns Promise<UploadResult> - Resultado de la subida
   */
  static async uploadProcessedImage(
    file: File,
    fileName?: string,
    folder: string = 'logos-propuestas',
    processOptions?: ImageProcessingOptions
  ): Promise<UploadResult> {
    try {
      let finalFile = file;

      // Procesar la imagen si se especifican opciones
      if (processOptions) {
        const processed = await this.processImage(file, processOptions);
        finalFile = processed.file;
        
        console.log(`Imagen procesada: ${processed.compressionRatio.toFixed(1)}% de compresión`);
      }

      // Subir la imagen
      return await StorageService.uploadImage(finalFile, fileName, folder);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al procesar la imagen'
      };
    }
  }

  /**
   * Valida y optimiza una imagen para uso web
   * @param file - Archivo de imagen
   * @returns Promise<File> - Archivo optimizado
   */
  static async optimizeForWeb(file: File): Promise<File> {
    const options: ImageProcessingOptions = {
      maxWidth: 1200,
      maxHeight: 800,
      quality: 0.85,
      format: 'webp'
    };

    const processed = await this.processImage(file, options);
    return processed.file;
  }

  /**
   * Crea una miniatura de una imagen
   * @param file - Archivo de imagen
   * @param size - Tamaño de la miniatura (cuadrada)
   * @returns Promise<File> - Miniatura generada
   */
  static async createThumbnail(file: File, size: number = 150): Promise<File> {
    const options: ImageProcessingOptions = {
      maxWidth: size,
      maxHeight: size,
      quality: 0.7,
      format: 'jpeg'
    };

    const processed = await this.processImage(file, options);
    return processed.file;
  }

  /**
   * Calcula las dimensiones de una imagen redimensionada
   * @param originalWidth - Ancho original
   * @param originalHeight - Alto original
   * @param maxWidth - Ancho máximo permitido
   * @param maxHeight - Alto máximo permitido
   * @returns {width: number, height: number} - Nuevas dimensiones
   */
  private static calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    let { width, height } = { width: originalWidth, height: originalHeight };

    // Redimensionar solo si es necesario
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    return { width, height };
  }

  /**
   * Obtiene información de una imagen sin cargarla completamente
   * @param file - Archivo de imagen
   * @returns Promise<{width: number, height: number}> - Dimensiones de la imagen
   */
  static getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => reject(new Error('No se pudo obtener las dimensiones de la imagen'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Convierte un archivo a base64
   * @param file - Archivo a convertir
   * @returns Promise<string> - String en base64
   */
  static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Error al convertir el archivo'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Convierte base64 a archivo
   * @param base64 - String en base64
   * @param fileName - Nombre del archivo
   * @param mimeType - Tipo MIME
   * @returns File - Archivo generado
   */
  static base64ToFile(base64: string, fileName: string, mimeType: string): File {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    
    return new File([blob], fileName, { type: mimeType });
  }

  /**
   * Valida si una imagen cumple con los requisitos mínimos
   * @param file - Archivo de imagen
   * @param minWidth - Ancho mínimo requerido
   * @param minHeight - Alto mínimo requerido
   * @returns Promise<boolean> - True si cumple los requisitos
   */
  static async validateImageRequirements(
    file: File, 
    minWidth: number = 100, 
    minHeight: number = 100
  ): Promise<boolean> {
    try {
      const dimensions = await this.getImageDimensions(file);
      return dimensions.width >= minWidth && dimensions.height >= minHeight;
    } catch (error) {
      return false;
    }
  }
}
