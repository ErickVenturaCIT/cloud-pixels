import { createClient } from '@supabase/supabase-js'

// Importar configuración local
let supabaseUrl: string;
let supabaseAnonKey: string;

try {
  // Intentar usar variables de entorno primero
  supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  
  // Si no están disponibles, usar configuración local
  if (!supabaseUrl || !supabaseAnonKey) {
    const config = await import('../config/supabase-config');
    supabaseUrl = config.SUPABASE_CONFIG.url;
    supabaseAnonKey = config.SUPABASE_CONFIG.anonKey;
  }
} catch (error) {
  console.warn('No se pudo cargar la configuración de Supabase:', error);
  // Usar valores por defecto o mostrar error
  supabaseUrl = '';
  supabaseAnonKey = '';
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Please check your config file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para las propuestas
export interface Propuesta {
  id?: number
  codigo_propuesta: string
  nombre_proyecto: string
  fecha_propuesta?: string
  cliente_nombre: string
  cliente_empresa: string
  texto_introductorio?: string
  resumen_ejecutivo?: string
  objetivos_alcance?: string
  servicios_seleccionados?: string[]
  entregables?: string[]
  valor_proyecto?: string
  terminos_pago?: string
  contacto_email?: string
  contacto_whatsapp?: string
  horarios_atencion?: string
  descripcion_empresa?: string
  terminos_condiciones?: string
  terminos_validez?: string
  texto_aceptacion?: string
  created_at?: string
  updated_at?: string
}

// Servicio para propuestas
export class PropuestasClientService {
  static async createProposal(data: Omit<Propuesta, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Propuesta | null; error: any }> {
    try {
      const { data: result, error } = await supabase
        .from('propuestas')
        .insert([data])
        .select()
        .single()

      return { data: result, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async getProposalByCode(codigo: string): Promise<{ data: Propuesta | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('propuestas')
        .select('*')
        .eq('codigo_propuesta', codigo)
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async getAllProposals(): Promise<{ data: Propuesta[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('propuestas')
        .select('*')
        .order('created_at', { ascending: false })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async updateProposal(id: number, data: Partial<Propuesta>): Promise<{ data: Propuesta | null; error: any }> {
    try {
      const { data: result, error } = await supabase
        .from('propuestas')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      return { data: result, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async deleteProposal(id: number): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('propuestas')
        .delete()
        .eq('id', id)

      return { error }
    } catch (error) {
      return { error }
    }
  }
}
