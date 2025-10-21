# 🚀 Instrucciones para Configurar y Probar el Sistema Cloud Pixels con Supabase

## 📋 **Paso 1: Configurar la Base de Datos en Supabase**

### 1.1 Ejecutar el Script SQL
1. Ve a tu proyecto Supabase: `https://cgchcozsszowdizlupkc.supabase.co`
2. Haz clic en **"SQL Editor"** en el menú lateral
3. Copia y pega **todo el contenido** del archivo `supabase-schema.sql`
4. Haz clic en **"Run"** para ejecutar el script

### 1.2 Verificar la Tabla Creada
1. Ve a **"Table Editor"** en el menú lateral
2. Deberías ver la tabla **"propuestas"** creada
3. Haz clic en ella para ver su estructura

## 🧪 **Paso 2: Probar el Sistema**

### 2.1 Iniciar el Servidor Local
```bash
python -m http.server 8000
```

### 2.2 Acceder al Panel de Administración
1. Abre tu navegador
2. Ve a: `http://localhost:8000/admin-dashboard.html`
3. Deberías ver el panel de administración de Cloud Pixels

### 2.3 Crear una Propuesta de Prueba
1. En la pestaña **"Crear Nueva Propuesta"**
2. Llena todos los campos obligatorios:
   - **Nombre del Proyecto**: "Sitio Web Empresarial"
   - **Fecha de Propuesta**: Selecciona la fecha actual
   - **Nombre del Cliente**: "Juan Pérez"
   - **Empresa del Cliente**: "Mi Empresa S.A."
   - **Resumen Ejecutivo**: "Desarrollo de un sitio web moderno y responsive..."
   - **Objetivos & Alcance**: "Crear una presencia digital profesional..."
   - **Servicios**: Selecciona al menos 2 servicios
   - **Entregables**: Agrega al menos 3 entregables
   - **Valor del Proyecto**: "$5,000"
   - **Condiciones de Pago**: "• Pago inicial del 50%..."

3. Haz clic en **"🚀 Generar Propuesta HTML"**

### 2.4 Verificar el Resultado
- Debería aparecer un mensaje de éxito
- Se debería descargar automáticamente un archivo HTML
- En la pestaña **"Lista de Propuestas"** deberías ver tu propuesta creada

## 🔍 **Paso 3: Verificar en Supabase**

### 3.1 Revisar la Base de Datos
1. Ve a **"Table Editor"** en Supabase
2. Selecciona la tabla **"propuestas"**
3. Deberías ver tu propuesta creada con:
   - Un **ID único** (UUID)
   - Un **código de propuesta** (formato: CP-YYYYMMDD-XXXX)
   - Todos los datos que ingresaste

### 3.2 Probar el Enlace Dinámico
1. En la lista de propuestas, haz clic en **"🔗 Copiar Enlace"**
2. Abre el enlace en una nueva pestaña
3. Debería cargar la propuesta con todos los datos

## 🛠️ **Paso 4: Funcionalidades Disponibles**

### 4.1 Panel de Administración
- ✅ **Crear propuestas** con formulario completo
- ✅ **Ver lista** de todas las propuestas creadas
- ✅ **Vista previa** de propuestas
- ✅ **Descargar** propuestas como archivos HTML
- ✅ **Copiar enlaces** para compartir
- ✅ **Eliminar** propuestas

### 4.2 Propuestas Dinámicas
- ✅ **Cargar propuestas** desde URL con código
- ✅ **Mostrar error** si no se encuentra la propuesta
- ✅ **Población automática** de todos los campos

## 🔧 **Solución de Problemas**

### Error: "Base de datos no inicializada"
- Verifica que el archivo `supabase-config.js` esté presente
- Revisa la consola del navegador para errores de conexión

### Error: "Error conectando con la base de datos"
- Verifica que las credenciales en `supabase-config.js` sean correctas
- Asegúrate de que el proyecto Supabase esté activo

### Error: "Error generando la propuesta"
- Verifica que todos los campos obligatorios estén llenos
- Revisa la consola del navegador para errores específicos

### La propuesta no se guarda en Supabase
- Verifica que el script SQL se haya ejecutado correctamente
- Revisa que las políticas de seguridad permitan inserción

## 📁 **Archivos del Sistema**

- `admin-dashboard.html` - Panel de administración
- `cloud_pixels_proposal_ui_v3.html` - Template de propuesta
- `proposal-generator.js` - Generador de propuestas HTML
- `supabase-config.js` - Configuración de Supabase
- `dynamic-proposal.js` - Cargador dinámico de propuestas
- `supabase-schema.sql` - Esquema de la base de datos

## 🎯 **Próximos Pasos**

1. **Personalizar** los textos por defecto según tus necesidades
2. **Agregar más servicios** al formulario
3. **Implementar autenticación** para el panel de administración
4. **Desplegar** en un servidor web
5. **Configurar dominio personalizado**

---

**¡El sistema está listo para usar! 🎉**
