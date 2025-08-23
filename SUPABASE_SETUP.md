# Configuración de Supabase para Cloud Pixels

## 🚀 Configuración Rápida

### 1. Obtener Credenciales de Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Ve a **Settings** > **API**
4. Copia:
   - **Project URL** (ej: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key

### 2. Configurar Variables de Entorno

**Opción A: Variables de Entorno (Recomendado para producción)**

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

**Opción B: Archivo de Configuración Local**

Edita `src/config/supabase-config.ts`:

```typescript
export const SUPABASE_CONFIG = {
  url: 'https://tu-proyecto.supabase.co',
  anonKey: 'tu-anon-key-aqui'
};
```

### 3. Crear Tabla en Supabase

Ejecuta este SQL en el **SQL Editor** de Supabase:

```sql
-- Crear tabla de propuestas
CREATE TABLE propuestas (
  id SERIAL PRIMARY KEY,
  codigo_propuesta VARCHAR(50) UNIQUE NOT NULL,
  nombre_proyecto VARCHAR(255) NOT NULL,
  fecha_propuesta DATE,
  cliente_nombre VARCHAR(255) NOT NULL,
  cliente_empresa VARCHAR(255) NOT NULL,
  texto_introductorio TEXT,
  resumen_ejecutivo TEXT,
  objetivos_alcance TEXT,
  servicios_seleccionados TEXT[],
  entregables TEXT[],
  valor_proyecto VARCHAR(100),
  terminos_pago TEXT,
  contacto_email VARCHAR(255),
  contacto_whatsapp VARCHAR(50),
  horarios_atencion TEXT,
  descripcion_empresa TEXT,
  terminos_condiciones TEXT,
  terminos_validez TEXT,
  texto_aceptacion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_propuestas_codigo ON propuestas(codigo_propuesta);
CREATE INDEX idx_propuestas_cliente ON propuestas(cliente_nombre);
CREATE INDEX idx_propuestas_fecha ON propuestas(fecha_propuesta);
CREATE INDEX idx_propuestas_created ON propuestas(created_at);

-- Habilitar RLS (Row Level Security) si es necesario
ALTER TABLE propuestas ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir todas las operaciones (ajustar según necesidades)
CREATE POLICY "Allow all operations" ON propuestas FOR ALL USING (true);
```

### 4. Configurar Políticas de Seguridad

Si quieres más seguridad, puedes crear políticas específicas:

```sql
-- Solo permitir lectura pública
CREATE POLICY "Public read access" ON propuestas FOR SELECT USING (true);

-- Solo permitir inserción desde tu aplicación
CREATE POLICY "Insert from app" ON propuestas FOR INSERT WITH CHECK (true);

-- Solo permitir actualización desde tu aplicación
CREATE POLICY "Update from app" ON propuestas FOR UPDATE USING (true);

-- Solo permitir eliminación desde tu aplicación
CREATE POLICY "Delete from app" ON propuestas FOR DELETE USING (true);
```

## 🔧 Verificación

### 1. Probar Conexión

Abre la consola del navegador en tu sitio y verifica que no hay errores de Supabase.

### 2. Probar Crear Propuesta

1. Ve a la página de crear propuesta
2. Llena el formulario
3. Envía la propuesta
4. Verifica que se guarde en Supabase

### 3. Verificar en Supabase

Ve a **Table Editor** > **propuestas** y verifica que aparezcan las nuevas propuestas.

## 🚨 Solución de Problemas

### Error: "Missing Supabase configuration"

- Verifica que las credenciales estén correctas
- Asegúrate de que el archivo `.env.local` esté en la raíz del proyecto
- Reinicia el servidor de desarrollo

### Error: "Invalid API key"

- Verifica que estés usando la **anon key** (no la service_role key)
- Asegúrate de que el proyecto esté activo en Supabase

### Error: "Table doesn't exist"

- Verifica que hayas ejecutado el SQL para crear la tabla
- Asegúrate de estar en el proyecto correcto de Supabase

### Error de CORS

- Ve a **Settings** > **API** en Supabase
- Verifica que tu dominio esté en la lista de **Additional Allowed Origins**

## 📱 Uso en Producción

### 1. Variables de Entorno

En tu hosting (Vercel, Netlify, etc.), configura las variables de entorno:

```bash
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 2. Dominios Permitidos

En Supabase, agrega tu dominio de producción a **Settings** > **API** > **Additional Allowed Origins**.

### 3. Monitoreo

- Usa **Logs** en Supabase para monitorear el uso
- Configura alertas para errores en **Settings** > **Alerts**

## 🔒 Seguridad

### Recomendaciones

1. **Nunca** expongas la `service_role` key en el cliente
2. Usa solo la `anon` key para operaciones del cliente
3. Implementa autenticación si es necesario
4. Usa políticas RLS para controlar acceso a datos
5. Valida todos los datos en el servidor antes de guardar

### Autenticación (Opcional)

Si quieres agregar autenticación:

```typescript
// En tu componente
import { supabase } from '../lib/supabase-client';

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// Verificar sesión
const { data: { session } } = await supabase.auth.getSession();
```

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs en la consola del navegador
2. Verifica la configuración en Supabase
3. Consulta la [documentación oficial de Supabase](https://supabase.com/docs)
4. Revisa los logs en **Logs** > **API** en Supabase

---

¡Tu sitio ahora debería funcionar tanto en desarrollo como en producción! 🎉
