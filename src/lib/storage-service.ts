import { supabase } from './supabase';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  path?: string;
}

export class StorageService {
  private static readonly BUCKET_NAME = 'logo-propuestas';

  /**
   * Sube una imagen al bucket de Supabase Storage
   * @param file - El archivo a subir
   * @param fileName - Nombre del archivo (opcional, se genera automáticamente si no se proporciona)
   * @param folder - Carpeta donde se guardará la imagen
   * @returns Promise<UploadResult> - Resultado de la subida
   */
  static async uploadImage(
    file: File, 
    fileName?: string, 
    folder: string = 'logos-propuestas'
  ): Promise<UploadResult> {
    try {
      // Validar el archivo
      if (!file) {
        throw new Error('No se proporcionó ningún archivo');
      }

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen');
      }

      // Validar tamaño (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('El archivo es demasiado grande. Máximo 5MB permitido');
      }

      // Generar nombre único si no se proporciona
      const finalFileName = fileName || this.generateUniqueFileName(file.name);
      
      // Crear la ruta completa
      const filePath = `${folder}/${finalFileName}`;

      // Subir el archivo
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true,
        });

      if (error) {
        throw new Error(`Error al subir: ${error.message}`);
      }

      // Obtener la URL pública
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      return {
        success: true,
        url: urlData.publicUrl,
        path: filePath
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Elimina una imagen del bucket
   * @param filePath - Ruta del archivo a eliminar
   * @returns Promise<boolean> - True si se eliminó correctamente
   */
  static async deleteImage(filePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        throw new Error(`Error al eliminar: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Error eliminando imagen:', error);
      return false;
    }
  }

  /**
   * Lista todas las imágenes en una carpeta
   * @param folder - Carpeta a listar
   * @returns Promise<string[]> - Lista de archivos
   */
  static async listImages(folder: string = 'logo-propuestas'): Promise<string[]> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(folder);

      if (error) {
        throw new Error(`Error al listar: ${error.message}`);
      }

      return data?.map(file => file.name) || [];
    } catch (error) {
      console.error('Error listando imágenes:', error);
      return [];
    }
  }

  /**
   * Obtiene la URL pública de una imagen
   * @param filePath - Ruta del archivo
   * @returns string - URL pública
   */
  static getImageUrl(filePath: string): string {
    const { data } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  /**
   * Genera un nombre único para el archivo
   * @param originalName - Nombre original del archivo
   * @returns string - Nombre único generado
   */
  private static generateUniqueFileName(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop() || 'jpg';
    return `logo_${timestamp}_${random}.${extension}`;
  }

  /**
   * Valida si un archivo es una imagen válida
   * @param file - Archivo a validar
   * @returns boolean - True si es válido
   */
  static isValidImage(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    return validTypes.includes(file.type) && file.size <= maxSize;
  }
}
