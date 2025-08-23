// Tipos para las propuestas
interface Propuesta {
  id: string;
  codigo_propuesta: string;
  nombre_proyecto: string;
  cliente_nombre: string;
  cliente_empresa: string;
  fecha_propuesta?: string;
  valor_proyecto?: string;
  texto_introductorio?: string;
  resumen_ejecutivo?: string;
  created_at?: string;
}

// Variables globales
let propuestas: Propuesta[] = [];
let filteredPropuestas: Propuesta[] = [];

// Elementos del DOM
const elements = {
  tbody: document.getElementById('propuestasTableBody') as HTMLTableSectionElement,
  loadingState: document.getElementById('loadingState') as HTMLDivElement,
  emptyState: document.getElementById('emptyState') as HTMLDivElement,
  searchInput: document.getElementById('searchInput') as HTMLInputElement,
  dateFilter: document.getElementById('dateFilter') as HTMLSelectElement,
  sortBy: document.getElementById('sortBy') as HTMLSelectElement,
  detailsModal: document.getElementById('detailsModal') as HTMLDivElement,
  modalContent: document.getElementById('modalContent') as HTMLDivElement
};

// Inicialización
export function initPropuestas(): void {
  // Cargar propuestas al iniciar la página
  loadPropuestas();

  // Eventos de filtros
  elements.searchInput?.addEventListener('input', filterPropuestas);
  elements.dateFilter?.addEventListener('change', filterPropuestas);
  elements.sortBy?.addEventListener('change', sortPropuestas);
}

// Cargar propuestas desde la API
async function loadPropuestas(): Promise<void> {
  try {
    const response = await fetch('/api/propuestas');
    if (response.ok) {
      propuestas = await response.json();
      filteredPropuestas = [...propuestas];
      renderPropuestas();
    } else {
      console.error('Error al cargar propuestas');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Renderizar propuestas en la tabla
function renderPropuestas(): void {
  if (!elements.tbody || !elements.loadingState || !elements.emptyState) return;

  elements.loadingState.classList.add('hidden');

  if (filteredPropuestas.length === 0) {
    elements.emptyState.classList.remove('hidden');
    elements.tbody.innerHTML = '';
    return;
  }

  elements.emptyState.classList.add('hidden');
  
  elements.tbody.innerHTML = filteredPropuestas.map(propuesta => `
    <tr class="hover:bg-gray-50">
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
        ${propuesta.codigo_propuesta}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        ${propuesta.nombre_proyecto}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        ${propuesta.cliente_nombre}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        ${propuesta.cliente_empresa}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        ${propuesta.fecha_propuesta ? new Date(propuesta.fecha_propuesta).toLocaleDateString() : '-'}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        ${propuesta.valor_proyecto || '-'}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
        <button
          onclick="window.viewDetails('${propuesta.id}')"
          class="text-blue-600 hover:text-blue-900"
        >
          Ver
        </button>
        <button
          onclick="window.editProposal('${propuesta.id}')"
          class="text-green-600 hover:text-green-900"
        >
          Editar
        </button>
        <button
          onclick="window.deleteProposal('${propuesta.id}')"
          class="text-red-600 hover:text-red-900"
        >
          Eliminar
        </button>
      </td>
    </tr>
  `).join('');
}

// Filtrar propuestas
function filterPropuestas(): void {
  if (!elements.searchInput || !elements.dateFilter) return;

  const searchTerm = elements.searchInput.value.toLowerCase();
  const dateFilter = elements.dateFilter.value;

  filteredPropuestas = propuestas.filter(propuesta => {
    // Filtro de búsqueda
    const matchesSearch = 
      propuesta.nombre_proyecto.toLowerCase().includes(searchTerm) ||
      propuesta.cliente_nombre.toLowerCase().includes(searchTerm) ||
      propuesta.cliente_empresa.toLowerCase().includes(searchTerm);

    // Filtro de fecha
    let matchesDate = true;
    if (dateFilter && propuesta.fecha_propuesta) {
      const propuestaDate = new Date(propuesta.fecha_propuesta);
      const today = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = propuestaDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = propuestaDate >= weekAgo;
          break;
        case 'month':
          matchesDate = propuestaDate.getMonth() === today.getMonth() && 
                       propuestaDate.getFullYear() === today.getFullYear();
          break;
        case 'year':
          matchesDate = propuestaDate.getFullYear() === today.getFullYear();
          break;
      }
    }

    return matchesSearch && matchesDate;
  });

  renderPropuestas();
}

// Ordenar propuestas
function sortPropuestas(): void {
  if (!elements.sortBy) return;

  const sortBy = elements.sortBy.value;
  
  filteredPropuestas.sort((a, b) => {
    switch (sortBy) {
      case 'nombre_proyecto':
        return a.nombre_proyecto.localeCompare(b.nombre_proyecto);
      case 'cliente_nombre':
        return a.cliente_nombre.localeCompare(b.cliente_nombre);
      case 'fecha_propuesta':
        if (!a.fecha_propuesta) return 1;
        if (!b.fecha_propuesta) return -1;
        return new Date(a.fecha_propuesta).getTime() - new Date(b.fecha_propuesta).getTime();
      default:
        if (!a.created_at || !b.created_at) return 0;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  renderPropuestas();
}

// Ver detalles de una propuesta
export async function viewDetails(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/propuestas/${id}`);
    if (response.ok) {
      const propuesta = await response.json();
      
      if (!elements.modalContent) return;

      elements.modalContent.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 class="font-semibold text-gray-700">Código:</h4>
            <p class="text-gray-900">${propuesta.codigo_propuesta}</p>
          </div>
          <div>
            <h4 class="font-semibold text-gray-700">Proyecto:</h4>
            <p class="text-gray-900">${propuesta.nombre_proyecto}</p>
          </div>
          <div>
            <h4 class="font-semibold text-gray-700">Cliente:</h4>
            <p class="text-gray-900">${propuesta.cliente_nombre}</p>
          </div>
          <div>
            <h4 class="font-semibold text-gray-700">Empresa:</h4>
            <p class="text-gray-900">${propuesta.cliente_empresa}</p>
          </div>
          <div>
            <h4 class="font-semibold text-gray-700">Fecha:</h4>
            <p class="text-gray-900">${propuesta.fecha_propuesta ? new Date(propuesta.fecha_propuesta).toLocaleDateString() : '-'}</p>
          </div>
          <div>
            <h4 class="font-semibold text-gray-700">Valor:</h4>
            <p class="text-gray-900">${propuesta.valor_proyecto || '-'}</p>
          </div>
        </div>
        ${propuesta.texto_introductorio ? `
          <div>
            <h4 class="font-semibold text-gray-700">Texto Introductorio:</h4>
            <p class="text-gray-900">${propuesta.texto_introductorio}</p>
          </div>
        ` : ''}
        ${propuesta.resumen_ejecutivo ? `
          <div>
            <h4 class="font-semibold text-gray-700">Resumen Ejecutivo:</h4>
            <p class="text-gray-900">${propuesta.resumen_ejecutivo}</p>
          </div>
        ` : ''}
      `;
      
      if (elements.detailsModal) {
        elements.detailsModal.classList.remove('hidden');
      }
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al cargar los detalles');
  }
}

// Cerrar modal
export function closeModal(): void {
  if (elements.detailsModal) {
    elements.detailsModal.classList.add('hidden');
  }
}

// Editar propuesta
export function editProposal(id: string): void {
  // Redirigir a la página de edición
  window.location.href = `/editar-propuesta/${id}`;
}

// Eliminar propuesta
export async function deleteProposal(id: string): Promise<void> {
  if (confirm('¿Estás seguro de que quieres eliminar esta propuesta?')) {
    try {
      const response = await fetch(`/api/propuestas/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert('Propuesta eliminada exitosamente');
        loadPropuestas(); // Recargar la lista
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar la propuesta');
    }
  }
}

// Hacer funciones disponibles globalmente
declare global {
  interface Window {
    viewDetails: (id: string) => Promise<void>;
    closeModal: () => void;
    editProposal: (id: string) => void;
    deleteProposal: (id: string) => Promise<void>;
  }
}

window.viewDetails = viewDetails;
window.closeModal = closeModal;
window.editProposal = editProposal;
window.deleteProposal = deleteProposal;
