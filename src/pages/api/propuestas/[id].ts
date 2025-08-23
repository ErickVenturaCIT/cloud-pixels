import type { APIRoute } from 'astro';
import { PropuestasService } from '../../../lib/supabase';

// GET - Obtener propuesta por ID
export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID de propuesta requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const propuesta = await PropuestasService.getProposalById(id);
    
    return new Response(JSON.stringify(propuesta), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al obtener propuesta:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Error al obtener propuesta',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// PUT - Actualizar propuesta
export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID de propuesta requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const propuestaActualizada = await PropuestasService.updateProposal(id, body);
    
    return new Response(JSON.stringify(propuestaActualizada), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al actualizar propuesta:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Error al actualizar propuesta',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// DELETE - Eliminar propuesta
export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID de propuesta requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await PropuestasService.deleteProposal(id);
    
    return new Response(JSON.stringify({ message: 'Propuesta eliminada exitosamente' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al eliminar propuesta:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Error al eliminar propuesta',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
