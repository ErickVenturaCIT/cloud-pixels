// CONFIGURACIÓN DE SUPABASE - ARCHIVO DE EJEMPLO
// 
// 1. Copia este archivo a .env.local en la raíz del proyecto
// 2. Reemplaza con tus credenciales reales de Supabase
// 3. NO subas .env.local a git (ya está en .gitignore)

// Ejemplo de .env.local:
/*
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
*/

// Para obtener credenciales:
// 1. Ve a https://supabase.com
// 2. Crea un proyecto o selecciona uno existente
// 3. Ve a Settings > API
// 4. Copia Project URL y anon public key

export const SUPABASE_CONFIG = {
  url: 'https://tu-proyecto.supabase.co',
  anonKey: 'tu-anon-key-aqui'
};
