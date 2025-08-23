import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cgchcozsszowdizlupkc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnY2hjb3pzc3pvd2Rpemx1cGtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NTM1OTQsImV4cCI6MjA3MTMyOTU5NH0.HunwagMGHZsPJa1GwYNl4UgxpYCOWWrUV6shUzacow4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para las propuestas
export interface Propuesta {
  id: string;
  codigo_propuesta: string;
  nombre_proyecto: string;
  cliente_nombre: string;
  cliente_empresa: string;
  fecha_propuesta?: string;
  texto_introductorio?: string;
  resumen_ejecutivo?: string;
  descripcion_empresa?: string;
  objetivos_alcance?: string;
  servicios_seleccionados?: any;
  entregables?: any;
  proceso_timeline?: any;
  valor_proyecto?: string;
  terminos_pago?: string;
  contacto_email?: string;
  contacto_whatsapp?: string;
  horarios_atencion?: string;
  terminos_condiciones?: string;
  terminos_validez?: string;
  texto_aceptacion?: string;
  created_at?: string;
  updated_at?: string;
}

// Clase para manejar propuestas
export class PropuestasService {
  // Obtener todas las propuestas
  static async getAllProposals() {
    const { data, error } = await supabase
      .from('propuestas')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  // Obtener propuesta por código
  static async getProposalByCode(codigo: string) {
    const { data, error } = await supabase
      .from('propuestas')
      .select('*')
      .eq('codigo_propuesta', codigo)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Obtener propuesta por ID
  static async getProposalById(id: string) {
    const { data, error } = await supabase
      .from('propuestas')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Guardar nueva propuesta
  static async saveProposal(proposalData: Partial<Propuesta>) {
    // Generar código único
    proposalData.codigo_propuesta = this.generateProposalCode();
    
    const { data, error } = await supabase
      .from('propuestas')
      .insert([proposalData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Actualizar propuesta
  static async updateProposal(id: string, updatedData: Partial<Propuesta>) {
    const { data, error } = await supabase
      .from('propuestas')
      .update(updatedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Eliminar propuesta
  static async deleteProposal(id: string) {
    const { error } = await supabase
      .from('propuestas')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Generar código único de propuesta
  private static generateProposalCode(): string {
    const date = new Date();
    const dateStr = date.getFullYear().toString() + 
                   (date.getMonth() + 1).toString().padStart(2, '0') + 
                   date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `CP-${dateStr}-${random}`;
  }
}
