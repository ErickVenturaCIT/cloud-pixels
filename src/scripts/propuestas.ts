import { PropuestasClientService, type Propuesta } from '../lib/supabase-client';

// Estado global
let allProposals: Propuesta[] = [];
let filteredProposals: Propuesta[] = [];

// Elementos del DOM
const searchInput = document.getElementById('searchInput') as HTMLInputElement;
const dateFilter = document.getElementById('dateFilter') as HTMLSelectElement;
const sortBy = document.getElementById('sortBy') as HTMLSelectElement;
const propuestasTableBody = document.getElementById('propuestasTableBody') as HTMLTableSectionElement;
const loadingState = document.getElementById('loadingState') as HTMLDivElement;
const emptyState = document.getElementById('emptyState') as HTMLDivElement;

// Inicialización
export function initPropuestas(): void {
  if (!searchInput || !dateFilter || !sortBy || !propuestasTableBody) {
    console.error('Elementos del DOM no encontrados');
    return;
  }

  // Cargar propuestas iniciales
  loadProposals();

  // Event listeners
  searchInput.addEventListener('input', handleSearch);
  dateFilter.addEventListener('change', handleDateFilter);
  sortBy.addEventListener('change', handleSort);
}

// Cargar propuestas desde Supabase
async function loadProposals(): Promise<void> {
  try {
    showLoading(true);
    
    const { data, error } = await PropuestasClientService.getAllProposals();
    
    if (error) {
      console.error('Error al cargar propuestas:', error);
      showError('Error al cargar las propuestas');
      return;
    }

    allProposals = data || [];
    filteredProposals = [...allProposals];
    
    renderProposals();
    showLoading(false);
    
  } catch (error) {
    console.error('Error inesperado:', error);
    showError('Error inesperado al cargar las propuestas');
    showLoading(false);
  }
}

// Renderizar propuestas en la tabla
function renderProposals(): void {
  if (!propuestasTableBody) return;

  if (filteredProposals.length === 0) {
    showEmptyState(true);
    return;
  }

  showEmptyState(false);

  const rows = filteredProposals.map(proposal => `
    <tr class="hover:bg-gray-50">
      <td class="px-4 py-3">
        <a href="/${proposal.codigo_propuesta}" class="text-blue-600 hover:text-blue-800 font-medium">
          ${proposal.codigo_propuesta}
        </a>
      </td>
      <td class="px-4 py-3">${proposal.nombre_proyecto}</td>
      <td class="px-4 py-3">${proposal.cliente_nombre}</td>
      <td class="px-4 py-3">${proposal.cliente_empresa}</td>
      <td class="px-4 py-3">${formatDate(proposal.fecha_propuesta || proposal.created_at)}</td>
      <td class="px-4 py-3">${proposal.valor_proyecto || 'No especificado'}</td>
      <td class="px-4 py-3">
        <div class="flex space-x-2">
          <button
            onclick="viewProposalDetails('${proposal.codigo_propuesta}')"
            class="btn btn-secondary btn-small"
          >
            👁️ Ver
          </button>
          <button
            onclick="editProposal('${proposal.codigo_propuesta}')"
            class="btn btn-primary btn-small"
          >
            ✏️ Editar
          </button>
          <button
            onclick="deleteProposal(${proposal.id})"
            class="btn btn-danger btn-small"
          >
            🗑️ Eliminar
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  propuestasTableBody.innerHTML = rows;
}

// Manejar búsqueda
function handleSearch(): void {
  const searchTerm = searchInput.value.toLowerCase();
  
  filteredProposals = allProposals.filter(proposal => 
    proposal.nombre_proyecto.toLowerCase().includes(searchTerm) ||
    proposal.cliente_nombre.toLowerCase().includes(searchTerm) ||
    proposal.cliente_empresa.toLowerCase().includes(searchTerm) ||
    proposal.codigo_propuesta.toLowerCase().includes(searchTerm)
  );
  
  renderProposals();
}

// Manejar filtro de fecha
function handleDateFilter(): void {
  const filterValue = dateFilter.value;
  const today = new Date();
  
  filteredProposals = allProposals.filter(proposal => {
    const proposalDate = new Date(proposal.fecha_propuesta || proposal.created_at || '');
    
    switch (filterValue) {
      case 'today':
        return isSameDay(proposalDate, today);
      case 'week':
        return isSameWeek(proposalDate, today);
      case 'month':
        return isSameMonth(proposalDate, today);
      case 'year':
        return isSameYear(proposalDate, today);
      default:
        return true;
    }
  });
  
  renderProposals();
}

// Manejar ordenamiento
function handleSort(): void {
  const sortValue = sortBy.value;
  
  filteredProposals.sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortValue) {
      case 'nombre_proyecto':
        aValue = a.nombre_proyecto.toLowerCase();
        bValue = b.nombre_proyecto.toLowerCase();
        break;
      case 'cliente_nombre':
        aValue = a.cliente_nombre.toLowerCase();
        bValue = b.cliente_nombre.toLowerCase();
        break;
      case 'fecha_propuesta':
        aValue = new Date(a.fecha_propuesta || a.created_at || '');
        bValue = new Date(b.fecha_propuesta || b.created_at || '');
        break;
      default:
        aValue = new Date(a.created_at || '');
        bValue = new Date(b.created_at || '');
    }
    
    if (aValue < bValue) return -1;
    if (aValue > bValue) return 1;
    return 0;
  });
  
  renderProposals();
}

// Funciones de utilidad
function formatDate(dateString: string): string {
  if (!dateString) return 'No especificada';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'Fecha inválida';
  }
}

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
}

function isSameWeek(date1: Date, date2: Date): boolean {
  const week1 = getWeekNumber(date1);
  const week2 = getWeekNumber(date2);
  return week1 === week2 && date1.getFullYear() === date2.getFullYear();
}

function isSameMonth(date1: Date, date2: Date): boolean {
  return date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
}

function isSameYear(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear();
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// Funciones de UI
function showLoading(show: boolean): void {
  if (loadingState) {
    loadingState.style.display = show ? 'block' : 'none';
  }
}

function showEmptyState(show: boolean): void {
  if (emptyState) {
    emptyState.style.display = show ? 'block' : 'none';
  }
}

function showError(message: string): void {
  alert(message); // En producción, usar un toast o notificación más elegante
}

// Funciones globales para los botones
declare global {
  interface Window {
    viewProposalDetails: (code: string) => void;
    editProposal: (code: string) => void;
    deleteProposal: (id: number) => void;
  }
}

// Ver detalles de propuesta
window.viewProposalDetails = async function(code: string): Promise<void> {
  try {
    const { data, error } = await PropuestasClientService.getProposalByCode(code);
    
    if (error || !data) {
      alert('Error al cargar los detalles de la propuesta');
      return;
    }
    
    // Aquí puedes implementar la lógica para mostrar el modal con los detalles
    console.log('Detalles de la propuesta:', data);
    alert(`Detalles de la propuesta ${code} cargados. Revisa la consola para más información.`);
    
  } catch (error) {
    console.error('Error al cargar detalles:', error);
    alert('Error al cargar los detalles de la propuesta');
  }
};

// Editar propuesta
window.editProposal = function(code: string): void {
  window.location.href = `/editar-propuesta/${code}`;
};

// Eliminar propuesta
window.deleteProposal = async function(id: number): Promise<void> {
  if (!confirm('¿Estás seguro de que quieres eliminar esta propuesta?')) {
    return;
  }
  
  try {
    const { error } = await PropuestasClientService.deleteProposal(id);
    
    if (error) {
      alert(`Error al eliminar la propuesta: ${error.message}`);
      return;
    }
    
    alert('Propuesta eliminada exitosamente');
    loadProposals(); // Recargar la lista
    
  } catch (error) {
    console.error('Error al eliminar:', error);
    alert('Error al eliminar la propuesta');
  }
};
