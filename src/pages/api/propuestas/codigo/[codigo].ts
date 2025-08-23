import type { APIRoute } from 'astro';
import { PropuestasService } from '../../../../lib/supabase';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { codigo } = params;
    
    if (!codigo) {
      return new Response(JSON.stringify({ error: 'Código de propuesta requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const propuesta = await PropuestasService.getProposalByCode(codigo);
    
    return new Response(JSON.stringify(propuesta), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al obtener propuesta por código:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Error al obtener propuesta',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
