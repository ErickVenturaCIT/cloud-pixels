// Tipos para el sistema de almacenamiento de Supabase

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  path?: string;
}

export interface ImageMetadata {
  id: string;
  fileName: string;
  originalName: string;
  filePath: string;
  publicUrl: string;
  fileSize: number;
  mimeType: string;
  dimensions?: {
    width: number;
    height: number;
  };
  uploadedAt: string;
  uploadedBy?: string;
  tags?: string[];
  description?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
}

export interface StorageConfig {
  bucketName: string;
  allowedMimeTypes: string[];
  maxFileSize: number;
  maxImageDimensions?: {
    width: number;
    height: number;
  };
  compressionOptions?: {
    quality: number;
    format: 'jpeg' | 'png' | 'webp';
  };
  folderStructure: {
    logos: string;
    thumbnails: string;
    temp: string;
  };
}

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  createThumbnail?: boolean;
  thumbnailSize?: number;
}

export interface ProcessedImage {
  file: File;
  originalSize: number;
  processedSize: number;
  compressionRatio: number;
  thumbnail?: File;
}

export interface StoragePolicy {
  bucketName: string;
  policy: {
    name: string;
    definition: string;
    roles: string[];
  };
}

export interface BucketInfo {
  name: string;
  public: boolean;
  fileCount: number;
  totalSize: number;
  createdAt: string;
  updatedAt: string;
}

export interface FileInfo {
  name: string;
  id?: string;
  updated_at?: string;
  created_at?: string;
  last_accessed_at?: string;
  metadata?: Record<string, any>;
}

// Tipos para eventos de almacenamiento
export interface StorageEvent {
  type: 'upload' | 'delete' | 'update' | 'error';
  timestamp: string;
  bucketName: string;
  filePath: string;
  metadata?: Record<string, any>;
}

// Tipos para validación de archivos
export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions?: string[];
}

export interface FileValidationRules {
  allowedTypes: string[];
  maxSize: number;
  minSize?: number;
  maxDimensions?: {
    width: number;
    height: number;
  };
  minDimensions?: {
    width: number;
    height: number;
  };
  allowedExtensions: string[];
  forbiddenExtensions: string[];
}

// Tipos para gestión de archivos
export interface FileManager {
  upload(file: File, options?: UploadOptions): Promise<UploadResult>;
  delete(filePath: string): Promise<boolean>;
  list(folder?: string): Promise<FileInfo[]>;
  getPublicUrl(filePath: string): string;
  download(filePath: string): Promise<Blob>;
  move(sourcePath: string, destinationPath: string): Promise<boolean>;
  copy(sourcePath: string, destinationPath: string): Promise<boolean>;
}

export interface UploadOptions {
  fileName?: string;
  folder?: string;
  metadata?: Record<string, any>;
  processImage?: boolean;
  imageOptions?: ImageProcessingOptions;
  onProgress?: (progress: UploadProgress) => void;
}

// Tipos para el componente de UI
export interface ImageUploaderProps {
  title?: string;
  description?: string;
  acceptedTypes?: string;
  maxSize?: number;
  folder?: string;
  onUploadSuccess?: string;
  onUploadError?: string;
  showPreview?: boolean;
  showProgress?: boolean;
  allowMultiple?: boolean;
  autoUpload?: boolean;
  validationRules?: FileValidationRules;
}

// Tipos para callbacks
export type UploadSuccessCallback = (url: string, path: string, metadata?: ImageMetadata) => void;
export type UploadErrorCallback = (error: string, file?: File) => void;
export type UploadProgressCallback = (progress: UploadProgress) => void;
export type FileValidationCallback = (result: FileValidationResult) => void;
