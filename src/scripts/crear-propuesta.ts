import { PropuestasClientService, type Propuesta } from '../lib/supabase-client';

// Tipos para el formulario
interface PropuestaFormData {
  nombre_proyecto: string;
  fecha_propuesta?: string;
  cliente_nombre: string;
  cliente_empresa: string;
  texto_introductorio?: string;
  resumen_ejecutivo?: string;
  objetivos_alcance?: string;
  servicios_seleccionados?: string[];
  entregables?: string[];
  valor_proyecto?: string;
  terminos_pago?: string;
  contacto_email?: string;
  contacto_whatsapp?: string;
  horarios_atencion?: string;
  descripcion_empresa?: string;
  terminos_condiciones?: string;
  terminos_validez?: string;
  texto_aceptacion?: string;
}

// Elementos del DOM
const form = document.getElementById('propuestaForm') as HTMLFormElement;

// Inicialización
export function initCrearPropuesta(): void {
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
}

// Generar código único para la propuesta
function generateProposalCode(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const time = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `CP-${year}${month}${day}-${random}`;
}

// Manejar el envío del formulario
async function handleSubmit(e: Event): Promise<void> {
  e.preventDefault();
  
  if (!form) return;

  const formData = new FormData(form);
  
  // Obtener servicios seleccionados
  const services = formData.getAll('services') as string[];
  
  // Obtener entregables
  const deliverables = formData.getAll('deliverables[]') as string[];
  
  const propuestaData: PropuestaFormData = {
    nombre_proyecto: formData.get('projectName') as string,
    fecha_propuesta: formData.get('proposalDate') as string,
    cliente_nombre: formData.get('clientName') as string,
    cliente_empresa: formData.get('clientCompany') as string,
    texto_introductorio: formData.get('introText') as string,
    resumen_ejecutivo: formData.get('executiveSummary') as string,
    objetivos_alcance: formData.get('objectivesScope') as string,
    servicios_seleccionados: services,
    entregables: deliverables.filter(d => d.trim() !== ''),
    valor_proyecto: formData.get('projectValue') as string,
    terminos_pago: formData.get('paymentTerms') as string,
    contacto_email: formData.get('contactEmail') as string,
    contacto_whatsapp: formData.get('contactWhatsApp') as string,
    horarios_atencion: formData.get('attentionHours') as string,
    descripcion_empresa: formData.get('companyDescription') as string,
    terminos_condiciones: formData.get('termsConditions') as string,
    terminos_validez: formData.get('validityTerms') as string,
    texto_aceptacion: formData.get('acceptanceText') as string,
  };

  if (!validateRequiredFields(propuestaData)) return;

  try {
    // Generar código único
    const codigo_propuesta = generateProposalCode();
    
    // Crear la propuesta en Supabase
    const { data, error } = await PropuestasClientService.createProposal({
      ...propuestaData,
      codigo_propuesta
    });

    if (error) {
      console.error('Error de Supabase:', error);
      alert(`Error al crear la propuesta: ${error.message || 'Error desconocido'}`);
      return;
    }

    if (data) {
      alert(`Propuesta creada exitosamente con código: ${codigo_propuesta}`);
      
      // Redirigir a la página de la propuesta
      window.location.href = `/${codigo_propuesta}`;
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al crear la propuesta. Verifica tu conexión a internet.');
  }
}

// Validar campos requeridos
function validateRequiredFields(data: PropuestaFormData): boolean {
  const requiredFields = ['nombre_proyecto', 'cliente_nombre', 'cliente_empresa'];
  
  for (const field of requiredFields) {
    if (!data[field as keyof PropuestaFormData] || data[field as keyof PropuestaFormData]?.toString().trim() === '') {
      alert(`El campo ${field.replace('_', ' ')} es obligatorio`);
      return false;
    }
  }
  
  return true;
}

// Limpiar formulario
export function clearForm(): void {
  if (form) {
    form.reset();
  }
}

// Previsualizar propuesta
export function previewProposal(): void {
  if (!form) return;
  
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries()) as PropuestaFormData;
  
  if (!validateRequiredFields(data)) return;
  
  const preview = `
    Nombre del Proyecto: ${data.nombre_proyecto}
    Cliente: ${data.cliente_nombre}
    Empresa: ${data.cliente_empresa}
    Fecha: ${data.fecha_propuesta || 'No especificada'}
    Valor: ${data.valor_proyecto || 'No especificado'}
    
    Texto Introductorio: ${data.texto_introductorio || 'No especificado'}
    Resumen Ejecutivo: ${data.resumen_ejecutivo || 'No especificado'}
  `;
  
  alert('Previsualización de la propuesta:\n\n' + preview);
}
