// Cliente de Supabase para el navegador
// Este archivo se carga directamente en el HTML y expone las funciones globalmente

const SUPABASE_URL = 'https://cgchcozsszowdizlupkc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnY2hjb3pzc3pvd2Rpemx1cGtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NTM1OTQsImV4cCI6MjA3MTMyOTU5NH0.HunwagMGHZsPJa1GwYNl4UgxpYCOWWrUV6shUzacow4';

// Inicializar Supabase Client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Servicio de Propuestas
window.PropuestasService = {
  // Obtener todas las propuestas
  async getAllProposals() {
    try {
      const { data, error } = await supabase
        .from('propuestas')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting proposals:', error);
      throw error;
    }
  },

  // Obtener propuesta por código
  async getProposalByCode(codigo) {
    try {
      const { data, error } = await supabase
        .from('propuestas')
        .select('*')
        .eq('codigo_propuesta', codigo)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting proposal by code:', error);
      throw error;
    }
  },

  // Obtener propuesta por ID
  async getProposalById(id) {
    try {
      const { data, error } = await supabase
        .from('propuestas')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting proposal by ID:', error);
      throw error;
    }
  },

  // Guardar nueva propuesta
  async saveProposal(proposalData) {
    try {
      // Generar código único
      proposalData.codigo_propuesta = this.generateProposalCode();
      
      const { data, error } = await supabase
        .from('propuestas')
        .insert([proposalData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving proposal:', error);
      throw error;
    }
  },

  // Actualizar propuesta
  async updateProposal(id, updatedData) {
    try {
      const { data, error } = await supabase
        .from('propuestas')
        .update(updatedData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating proposal:', error);
      throw error;
    }
  },

  // Eliminar propuesta
  async deleteProposal(id) {
    try {
      const { error } = await supabase
        .from('propuestas')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting proposal:', error);
      throw error;
    }
  },

  // Generar código único de propuesta
  generateProposalCode() {
    const date = new Date();
    const dateStr = date.getFullYear().toString() + 
                   (date.getMonth() + 1).toString().padStart(2, '0') + 
                   date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `CP-${dateStr}-${random}`;
  }
};

// Exponer supabase globalmente por si se necesita
window.supabaseClient = supabase;
