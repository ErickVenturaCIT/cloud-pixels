# Cloud Pixels - Sistema de Gestión de Propuestas

Un sistema completo para gestionar propuestas comerciales construido con **Astro** y **Supabase**.

## 🚀 Características

- **Crear Propuestas**: Formulario completo para crear propuestas comerciales
- **Gestionar Propuestas**: Lista con filtros, búsqueda y ordenamiento
- **Base de Datos**: Integración completa con Supabase
- **Interfaz Moderna**: Diseño responsive con Tailwind CSS
- **API REST**: Endpoints para todas las operaciones CRUD

## 🛠️ Tecnologías

- **Frontend**: Astro 5.x
- **Base de Datos**: Supabase (PostgreSQL)
- **Estilos**: CSS puro con sistema de utilidades personalizado
- **Lenguaje**: TypeScript
- **Autenticación**: Supabase Auth
- **Scripts**: TypeScript modular con tipado estricto

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd cloud-pixels
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crea un archivo `.env.local` en la raíz del proyecto:
   ```env
   SUPABASE_URL=https://cgchcozsszowdizlupkc.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnY2hjb3pzc3pvd2Rpemx1cGtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NTM1OTQsImV4cCI6MjA3MTMyOTU5NH0.HunwagMGHZsPJa1GwYNl4UgxpYCOWWrUV6shUzacow4
   ```

4. **Configurar la base de datos**
   
   Ejecuta el siguiente SQL en tu proyecto de Supabase:
   ```sql
   -- Crear tabla de propuestas
   CREATE TABLE propuestas (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     codigo_propuesta VARCHAR(50) UNIQUE NOT NULL,
     
     -- Información básica del proyecto
     nombre_proyecto VARCHAR(255) NOT NULL,
     cliente_nombre VARCHAR(255) NOT NULL,
     cliente_empresa VARCHAR(255) NOT NULL,
     fecha_propuesta DATE,
     
     -- Contenido principal
     texto_introductorio TEXT,
     resumen_ejecutivo TEXT,
     descripcion_empresa TEXT,
     objetivos_alcance TEXT,
     
     -- Servicios y entregables (JSON)
     servicios_seleccionados JSONB,
     entregables JSONB,
     
     -- Timeline y proceso
     proceso_timeline JSONB,
     
     -- Información económica
     valor_proyecto VARCHAR(100),
     terminos_pago TEXT,
     
     -- Información de contacto
     contacto_email VARCHAR(255),
     contacto_whatsapp VARCHAR(50),
     horarios_atencion TEXT,
     
     -- Términos y condiciones
     terminos_condiciones TEXT,
     terminos_validez TEXT,
     texto_aceptacion TEXT,
     
     -- Metadatos
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Crear índices para optimización
   CREATE INDEX idx_propuestas_codigo ON propuestas(codigo_propuesta);
   CREATE INDEX idx_propuestas_created_at ON propuestas(created_at);

   -- Crear función para actualizar updated_at automáticamente
   CREATE OR REPLACE FUNCTION update_updated_at_column()
   RETURNS TRIGGER AS $$
   BEGIN
     NEW.updated_at = NOW();
     RETURN NEW;
   END;
   $$ language 'plpgsql';

   -- Crear trigger para actualizar updated_at
   CREATE TRIGGER update_propuestas_updated_at 
     BEFORE UPDATE ON propuestas 
     FOR EACH ROW 
     EXECUTE FUNCTION update_updated_at_column();

   -- Habilitar RLS
   ALTER TABLE propuestas ENABLE ROW LEVEL SECURITY;

   -- Políticas de seguridad
   CREATE POLICY "Permitir lectura pública de propuestas" ON propuestas
     FOR SELECT USING (true);

   CREATE POLICY "Permitir inserción de propuestas" ON propuestas
     FOR INSERT WITH CHECK (true);

   CREATE POLICY "Permitir actualización de propuestas" ON propuestas
     FOR UPDATE USING (true);

   CREATE POLICY "Permitir eliminación de propuestas" ON propuestas
     FOR DELETE USING (true);
   ```

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

6. **Abrir en el navegador**
   ```
   http://localhost:4321
   ```

## 📁 Estructura del Proyecto

```
cloud-pixels/
├── src/
│   ├── components/          # Componentes reutilizables
│   ├── layouts/            # Layouts de página
│   ├── lib/                # Utilidades y configuración
│   │   └── supabase.ts     # Cliente de Supabase
│   ├── pages/              # Páginas de la aplicación
│   │   ├── api/            # Endpoints de la API
│   │   │   └── propuestas/ # API de propuestas
│   │   ├── crear-propuesta.astro
│   │   ├── propuestas.astro
│   │   └── index.astro
│   ├── scripts/            # Scripts TypeScript
│   │   ├── propuestas.ts   # Lógica de gestión de propuestas
│   │   ├── crear-propuesta.ts # Lógica del formulario
│   │   ├── dashboard.ts    # Lógica del dashboard
│   │   └── index.ts        # Exportaciones centralizadas
│   └── styles/             # Estilos globales
├── public/                 # Archivos estáticos
├── astro.config.mjs        # Configuración de Astro
└── package.json
```

## 🔧 Comandos Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de la construcción

## 🌐 Endpoints de la API

### Propuestas

- `GET /api/propuestas` - Obtener todas las propuestas
- `GET /api/propuestas/[id]` - Obtener propuesta por ID
- `PUT /api/propuestas/[id]` - Actualizar propuesta
- `DELETE /api/propuestas/[id]` - Eliminar propuesta
- `GET /api/propuestas/codigo/[codigo]` - Obtener por código

## 🎨 Personalización

### Estilos
- Modifica `src/styles/global.css` para estilos personalizados
- El sistema incluye clases de utilidad para layout, formularios, botones y componentes

### Scripts
- Los scripts están organizados en `src/scripts/` con TypeScript
- Cada funcionalidad tiene su propio archivo para mejor mantenimiento
- Modifica los tipos en los archivos `.ts` según tus necesidades

### Base de Datos
- Ajusta las políticas RLS en Supabase según tus necesidades
- Modifica la estructura de la tabla `propuestas` según tu caso de uso

## 🚀 Despliegue

### Vercel
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Netlify
1. Conecta tu repositorio a Netlify
2. Configura las variables de entorno
3. Despliega automáticamente

### Otros
- Cualquier plataforma que soporte Astro
- Asegúrate de configurar las variables de entorno

## 🔒 Seguridad

- Las políticas RLS están habilitadas en Supabase
- Solo se permite acceso público a las operaciones básicas
- Considera implementar autenticación para operaciones sensibles

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación de [Astro](https://docs.astro.build/)
2. Consulta la documentación de [Supabase](https://supabase.com/docs)
3. Abre un issue en este repositorio

## 🎯 Roadmap

- [ ] Sistema de autenticación de usuarios
- [ ] Plantillas de propuestas
- [ ] Exportación a PDF
- [ ] Notificaciones por email
- [ ] Dashboard con estadísticas avanzadas
- [ ] API para integraciones externas

---

**Desarrollado con ❤️ usando Astro y Supabase**
