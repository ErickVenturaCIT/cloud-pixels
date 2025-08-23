// Tipos para el formulario
interface PropuestaFormData {
  nombre_proyecto: string;
  fecha_propuesta?: string;
  cliente_nombre: string;
  cliente_empresa: string;
  texto_introductorio?: string;
  resumen_ejecutivo?: string;
  descripcion_empresa?: string;
  objetivos_alcance?: string;
  valor_proyecto?: string;
  terminos_pago?: string;
  contacto_email?: string;
  contacto_whatsapp?: string;
  horarios_atencion?: string;
}

// Elementos del DOM
const form = document.getElementById('propuestaForm') as HTMLFormElement;

// Inicialización
export function initCrearPropuesta(): void {
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
}

// Manejar el envío del formulario
async function handleSubmit(e: Event): Promise<void> {
  e.preventDefault();
  
  if (!form) return;

  const formData = new FormData(form);
  const propuestaData: PropuestaFormData = Object.fromEntries(formData.entries()) as PropuestaFormData;
  
  try {
    const response = await fetch('/api/propuestas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(propuestaData),
    });
    
    if (response.ok) {
      const result = await response.json();
      alert(`Propuesta creada exitosamente con código: ${result.codigo_propuesta}`);
      window.location.href = '/';
    } else {
      const error = await response.json();
      alert(`Error: ${error.error}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al crear la propuesta');
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
