import type { APIRoute } from 'astro';
import { PropuestasService } from '../../../lib/supabase';

export const GET: APIRoute = async () => {
  try {
    const propuestas = await PropuestasService.getAllProposals();
    
    return new Response(JSON.stringify(propuestas), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error al obtener propuestas:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Error al obtener propuestas',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
