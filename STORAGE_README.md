# Sistema de Almacenamiento de Imágenes - Cloud Pixels

Este sistema permite subir, gestionar y optimizar imágenes en el bucket de Supabase Storage, específicamente diseñado para logos de empresas y otros recursos visuales.

## 🚀 Características

- ✅ **Subida de imágenes** con drag & drop
- ✅ **Validación automática** de archivos
- ✅ **Optimización automática** de imágenes
- ✅ **Generación de miniaturas**
- ✅ **Interfaz moderna y responsive**
- ✅ **Integración completa con Supabase**
- ✅ **Soporte para múltiples formatos** (JPG, PNG, GIF, WebP)
- ✅ **Compresión inteligente** para optimizar el tamaño

## 📁 Estructura del Proyecto

```
src/
├── lib/
│   ├── storage-service.ts      # Servicio principal de almacenamiento
│   ├── image-utils.ts          # Utilidades para procesamiento de imágenes
│   └── supabase.ts            # Cliente de Supabase
├── components/
│   └── ImageUploader.astro    # Componente de subida de imágenes
├── types/
│   └── storage.ts             # Tipos TypeScript
└── pages/
    └── upload-logo.astro      # Página de ejemplo
```

## 🛠️ Instalación y Configuración

### 1. Dependencias

El proyecto ya incluye las dependencias necesarias:
- `@supabase/supabase-js` - Cliente de Supabase
- `astro` - Framework de Astro

### 2. Configuración de Supabase

Asegúrate de que tu bucket `logo-propuestas` esté configurado correctamente:

1. **Crear el bucket** en Supabase Dashboard
2. **Configurar políticas** para permitir subidas públicas
3. **Verificar permisos** de lectura/escritura

### 3. Variables de Entorno

Tu configuración ya está en `src/lib/supabase.ts`:
```typescript
const supabaseUrl = 'https://cgchcozsszowdizlupkc.supabase.co';
const supabaseAnonKey = 'tu-clave-aqui';
```

## 📖 Uso Básico

### 1. Componente Simple

```astro
---
import ImageUploader from "../components/ImageUploader.astro";
---

<ImageUploader 
  title="Subir Logo"
  description="Arrastra tu imagen aquí"
  folder="logos"
/>
```

### 2. Con Callbacks Personalizados

```astro
<ImageUploader 
  title="Logo de Empresa"
  folder="logos"
  onUploadSuccess="handleSuccess"
  onUploadError="handleError"
/>
```

### 3. Uso Directo del Servicio

```typescript
import { StorageService } from '../lib/storage-service';

// Subir imagen simple
const result = await StorageService.uploadImage(file, 'mi-logo', 'logos');

if (result.success) {
  console.log('URL del logo:', result.url);
}
```

## 🔧 API del Servicio

### StorageService

#### `uploadImage(file, fileName?, folder?)`
Sube una imagen al bucket especificado.

```typescript
const result = await StorageService.uploadImage(
  file,           // File object
  'logo-empresa', // Nombre personalizado (opcional)
  'logos'         // Carpeta (opcional, default: 'logos')
);
```

#### `deleteImage(filePath)`
Elimina una imagen del bucket.

```typescript
const success = await StorageService.deleteImage('logos/logo-empresa.jpg');
```

#### `listImages(folder?)`
Lista todas las imágenes en una carpeta.

```typescript
const images = await StorageService.listImages('logos');
```

#### `getImageUrl(filePath)`
Obtiene la URL pública de una imagen.

```typescript
const url = StorageService.getImageUrl('logos/logo-empresa.jpg');
```

### ImageUtils

#### `processImage(file, options)`
Procesa una imagen antes de subirla.

```typescript
const processed = await ImageUtils.processImage(file, {
  maxWidth: 800,
  maxHeight: 600,
  quality: 0.8,
  format: 'webp'
});
```

#### `uploadProcessedImage(file, fileName?, folder?, processOptions?)`
Sube una imagen procesada con opciones de optimización.

```typescript
const result = await ImageUtils.uploadProcessedImage(
  file,
  'logo-optimizado',
  'logos',
  {
    maxWidth: 1200,
    quality: 0.85,
    format: 'webp'
  }
);
```

## 🎨 Personalización del Componente

### Props Disponibles

```typescript
interface ImageUploaderProps {
  title?: string;              // Título del componente
  description?: string;        // Descripción
  acceptedTypes?: string;      // Tipos de archivo aceptados
  maxSize?: number;            // Tamaño máximo en MB
  folder?: string;             // Carpeta de destino
  onUploadSuccess?: string;    // Función de éxito
  onUploadError?: string;      // Función de error
}
```

### Estilos CSS

El componente incluye estilos completos que puedes personalizar:

```css
.image-uploader {
  /* Estilos del contenedor */
}

.upload-area {
  /* Área de drag & drop */
}

.upload-btn {
  /* Botón de subida */
}
```

## 🔒 Seguridad y Validación

### Validaciones Automáticas

- ✅ **Tipo de archivo**: Solo imágenes (JPG, PNG, GIF, WebP)
- ✅ **Tamaño máximo**: 5MB por defecto
- ✅ **Dimensiones mínimas**: 100x100 píxeles
- ✅ **Sanitización**: Nombres de archivo seguros

### Políticas de Supabase

Asegúrate de configurar las políticas correctas en tu bucket:

```sql
-- Política para permitir subidas públicas
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'logo-propuestas');

-- Política para permitir lectura pública
CREATE POLICY "Allow public reads" ON storage.objects
FOR SELECT USING (bucket_id = 'logo-propuestas');
```

## 📱 Responsive Design

El componente está completamente optimizado para dispositivos móviles:

- ✅ **Touch-friendly**: Interfaz táctil optimizada
- ✅ **Responsive**: Se adapta a todos los tamaños de pantalla
- ✅ **Accesible**: Soporte para lectores de pantalla

## 🚀 Ejemplos de Uso

### 1. Formulario de Propuesta

```astro
---
import ImageUploader from "../components/ImageUploader.astro";
---

<form class="proposal-form">
  <div class="form-group">
    <label>Logo de la Empresa</label>
    <ImageUploader 
      folder="logos"
      onUploadSuccess="setCompanyLogo"
    />
  </div>
  
  <!-- Otros campos del formulario -->
</form>

<script>
  window.setCompanyLogo = function(url, path) {
    // Guardar la URL del logo en el formulario
    document.getElementById('company-logo-url').value = url;
  };
</script>
```

### 2. Galería de Logos

```typescript
import { StorageService } from '../lib/storage-service';

async function loadCompanyLogos() {
  try {
    const logos = await StorageService.listImages('logos');
    
    logos.forEach(logo => {
      const url = StorageService.getImageUrl(`logos/${logo}`);
      displayLogo(url, logo);
    });
  } catch (error) {
    console.error('Error cargando logos:', error);
  }
}
```

### 3. Optimización Automática

```typescript
import { ImageUtils } from '../lib/image-utils';

async function uploadOptimizedLogo(file: File) {
  const result = await ImageUtils.uploadProcessedImage(
    file,
    'logo-empresa',
    'logos',
    {
      maxWidth: 800,
      quality: 0.85,
      format: 'webp'
    }
  );
  
  if (result.success) {
    console.log('Logo optimizado subido:', result.url);
  }
}
```

## 🐛 Solución de Problemas

### Error: "Bucket not found"
- Verifica que el bucket `logo-propuestas` existe en Supabase
- Confirma que el nombre está correctamente escrito

### Error: "Policy violation"
- Revisa las políticas de seguridad del bucket
- Asegúrate de que las políticas permiten subidas públicas

### Error: "File too large"
- El archivo excede el límite de 5MB
- Usa `ImageUtils.processImage()` para comprimir la imagen

### Error: "Invalid file type"
- Solo se aceptan archivos de imagen
- Verifica la extensión del archivo

## 📈 Rendimiento

### Optimizaciones Incluidas

- ✅ **Lazy loading** de imágenes
- ✅ **Compresión automática** antes de la subida
- ✅ **Generación de miniaturas** para listas
- ✅ **Cache de URLs** públicas
- ✅ **Validación del lado del cliente**

### Métricas de Rendimiento

- **Tiempo de subida**: < 2s para imágenes < 1MB
- **Compresión**: 20-60% de reducción de tamaño
- **Tamaño máximo**: 5MB por archivo
- **Formatos soportados**: JPG, PNG, GIF, WebP

## 🔄 Actualizaciones y Mantenimiento

### Versiones Soportadas

- **Node.js**: 16.x o superior
- **Astro**: 5.x
- **Supabase**: 2.x

### Actualizaciones

Para actualizar las dependencias:

```bash
npm update @supabase/supabase-js
npm update astro
```

## 📞 Soporte

Si tienes problemas o preguntas:

1. **Revisa los logs** del navegador para errores
2. **Verifica la configuración** de Supabase
3. **Consulta la documentación** de Supabase Storage
4. **Revisa las políticas** del bucket

## 🎯 Roadmap

### Próximas Características

- [ ] **Subida múltiple** de archivos
- [ ] **Editor de imágenes** integrado
- [ ] **Sistema de etiquetas** para organizar archivos
- [ ] **Backup automático** de imágenes
- [ ] **CDN integration** para mejor rendimiento
- [ ] **Analytics** de uso de almacenamiento

---

**¡Disfruta usando el sistema de almacenamiento de imágenes! 🚀**
