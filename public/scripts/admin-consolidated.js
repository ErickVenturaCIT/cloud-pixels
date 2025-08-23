// ===== ADMIN CONSOLIDATED SCRIPT =====
// Sistema de Propuestas Cloud Pixels - Panel de Administración Consolidado
// Versión: 3.0 - Archivo único consolidado

// ===== VARIABLES GLOBALES =====
let db = null;
let isEditMode = false;
let currentProposalId = null;

// ===== LOGGING SYSTEM =====
function showLog(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString('es-ES');
    const logMessage = `[${timestamp}] ${message}`;
    
    switch (type) {
        case 'success':
            console.log(`%c${logMessage}`, 'color: #28a745; font-weight: bold;');
            break;
        case 'warning':
            console.warn(`%c${logMessage}`, 'color: #ffc107; font-weight: bold;');
            break;
        case 'error':
            console.error(`%c${logMessage}`, 'color: #dc3545; font-weight: bold;');
            break;
        default:
            console.log(`%c${logMessage}`, 'color: #17a2b8; font-weight: bold;');
    }
}

// ===== UI HELPERS =====
function showTab(tabName) {
    // Ocultar todas las pestañas
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Desactivar todos los botones de pestaña
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Mostrar la pestaña seleccionada
    const selectedTab = document.getElementById(`${tabName}-tab`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Activar el botón de la pestaña seleccionada
    const selectedTabButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (selectedTabButton) {
        selectedTabButton.classList.add('active');
    }
    
    showLog(`📱 Cambiando a pestaña: ${tabName}`, 'info');
    
    // Si es la pestaña de lista, cargar las propuestas
    if (tabName === 'list') {
        loadProposalsList();
    }
}

function showSuccess(message) {
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    if (successMessage) {
        successMessage.style.display = 'block';
        successMessage.querySelector('#successContent').textContent = message;
    }
    
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        if (successMessage) {
            successMessage.style.display = 'none';
        }
    }, 5000);
}

function showError(message) {
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    if (errorMessage) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = message;
    }
    
    if (successMessage) {
        successMessage.style.display = 'none';
    }
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    }, 5000);
}

// ===== FORM MANAGER =====
function setFormMode(mode) {
    isEditMode = mode === 'edit';
    showLog(`🔄 Modo del formulario cambiado a: ${mode}`, 'info');
    
    const form = document.getElementById('proposalForm');
    if (!form) return;
    
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.textContent = isEditMode ? '✏️ Actualizar Propuesta' : '🚀 Crear Propuesta';
    }
    
    // Agregar/quitar botón de cancelar edición
    if (isEditMode) {
        addCancelEditButton();
    } else {
        removeCancelEditButton();
    }
}

function getIsEditMode() {
    return isEditMode;
}

function addDeliverable() {
    const deliverablesContainer = document.querySelector('.deliverables-container');
    if (!deliverablesContainer) return;
    
    const deliverableItem = document.createElement('div');
    deliverableItem.className = 'deliverable-item';
    deliverableItem.innerHTML = `
        <input type="text" name="deliverables[]" placeholder="Nuevo entregable" required>
        <button type="button" class="btn btn-danger" data-action="remove-deliverable">🗑️</button>
    `;
    
    deliverablesContainer.appendChild(deliverableItem);
    showLog('➕ Nuevo entregable agregado', 'info');
}

function removeDeliverable(target) {
    const deliverableItem = target.closest('.deliverable-item');
    if (deliverableItem) {
        deliverableItem.remove();
        showLog('➖ Entregable removido', 'info');
    }
}

function cancelEdit() {
    setFormMode('create');
    showLog('❌ Edición cancelada', 'info');
    
    const form = document.getElementById('proposalForm');
    if (form) {
        form.reset();
    }
    
    currentProposalId = null;
}

function addCancelEditButton() {
    const form = document.getElementById('proposalForm');
    if (!form) return;
    
    // Verificar si ya existe el botón
    if (form.querySelector('[data-action="cancel-edit"]')) return;
    
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.className = 'btn btn-secondary';
        cancelButton.setAttribute('data-action', 'cancel-edit');
        cancelButton.textContent = '❌ Cancelar Edición';
        cancelButton.style.marginLeft = '10px';
        
        submitButton.parentNode.insertBefore(cancelButton, submitButton.nextSibling);
    }
}

function removeCancelEditButton() {
    const cancelButton = document.querySelector('[data-action="cancel-edit"]');
    if (cancelButton) {
        cancelButton.remove();
    }
}

// ===== SUPABASE MANAGER =====
async function initSupabase() {
    showLog('🔧 Iniciando inicialización de base de datos...', 'info');
    
    try {
        showLog('📡 Verificando servicio de Supabase...', 'info');
        
        // Crear servicio de Supabase directo
        showLog('🔌 Creando conexión directa a Supabase...', 'info');
        db = createSupabaseService();
        
        showLog('🔌 Conectando a Supabase...', 'info');
        const startTime = Date.now();
        
        // Probar la conexión
        try {
            const testResult = await db.getAllProposals();
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            showLog(`✅ Supabase conectado correctamente en ${duration}ms`, 'success');
            showLog(`📊 Propuestas encontradas: ${testResult.length}`, 'success');
            showLog('🌐 URL de Supabase: https://cgchcozsszowdizlupkc.supabase.co', 'info');
            
        } catch (dbError) {
            showLog(`❌ Error conectando a Supabase: ${dbError.message}`, 'error');
            showLog('🔄 Cambiando a modo mock...', 'warning');
            db = createMockService();
        }
        
    } catch (error) {
        showLog(`💥 Error crítico en inicialización: ${error.message}`, 'error');
        db = createMockService();
    }
}

function createMockService() {
    showLog('🎭 Usando servicio mock - sin datos reales', 'warning');
    return {
        getAllProposals: async () => {
            return [];
        },
        getProposalByCode: async (code) => null,
        getProposalById: async (id) => null,
        saveProposal: async (data) => ({ id: 'mock-id', codigo_propuesta: 'MOCK-001' }),
        updateProposal: async (id, data) => ({ id, ...data }),
        deleteProposal: async (id) => true
    };
}

function createSupabaseService() {
    showLog('🔌 Creando conexión directa a Supabase...', 'info');
    
    // Configuración de Supabase
    const supabaseUrl = 'https://cgchcozsszowdizlupkc.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnY2hjb3pzc3pvd2Rpemx1cGtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NTM1OTQsImV4cCI6MjA3MTMyOTU5NH0.HunwagMGHZsPJa1GwYNl4UgxpYCOWWrUV6shUzacow4';
    
    return {
        getAllProposals: async () => {
            try {
                showLog('📡 Consultando propuestas desde Supabase...', 'info');
                
                const response = await fetch(`${supabaseUrl}/rest/v1/propuestas?select=*&order=created_at.desc`, {
                    headers: {
                        'apikey': supabaseAnonKey,
                        'Authorization': `Bearer ${supabaseAnonKey}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                showLog(`✅ ${data.length} propuestas obtenidas de Supabase`, 'success');
                return data || [];
                
            } catch (error) {
                showLog(`❌ Error obteniendo propuestas: ${error.message}`, 'error');
                throw error;
            }
        },
        getProposalByCode: async (code) => {
            try {
                const response = await fetch(`${supabaseUrl}/rest/v1/propuestas?select=*&codigo_propuesta=eq.${code}&limit=1`, {
                    headers: {
                        'apikey': supabaseAnonKey,
                        'Authorization': `Bearer ${supabaseAnonKey}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                return data[0] || null;
                
            } catch (error) {
                showLog(`❌ Error obteniendo propuesta por código: ${error.message}`, 'error');
                return null;
            }
        },
        getProposalById: async (id) => {
            try {
                const response = await fetch(`${supabaseUrl}/rest/v1/propuestas?select=*&id=eq.${id}&limit=1`, {
                    headers: {
                        'apikey': supabaseAnonKey,
                        'Authorization': `Bearer ${supabaseAnonKey}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                return data[0] || null;
                
            } catch (error) {
                showLog(`❌ Error obteniendo propuesta por ID: ${error.message}`, 'error');
                return null;
            }
        },
        saveProposal: async (proposalData) => {
            try {
                // Generar código único
                proposalData.codigo_propuesta = generateProposalCode();
                
                const response = await fetch(`${supabaseUrl}/rest/v1/propuestas`, {
                    method: 'POST',
                    headers: {
                        'apikey': supabaseAnonKey,
                        'Authorization': `Bearer ${supabaseAnonKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(proposalData)
                });
                
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                return data[0] || null;
                
            } catch (error) {
                showLog(`❌ Error guardando propuesta: ${error.message}`, 'error');
                throw error;
            }
        },
        updateProposal: async (id, updatedData) => {
            try {
                const response = await fetch(`${supabaseUrl}/rest/v1/propuestas?id=eq.${id}`, {
                    method: 'PATCH',
                    headers: {
                        'apikey': supabaseAnonKey,
                        'Authorization': `Bearer ${supabaseAnonKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedData)
                });
                
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                return data[0] || null;
                
            } catch (error) {
                showLog(`❌ Error actualizando propuesta: ${error.message}`, 'error');
                throw error;
            }
        },
        deleteProposal: async (id) => {
            try {
                const response = await fetch(`${supabaseUrl}/rest/v1/propuestas?id=eq.${id}`, {
                    method: 'DELETE',
                    headers: {
                        'apikey': supabaseAnonKey,
                        'Authorization': `Bearer ${supabaseAnonKey}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return true;
                
            } catch (error) {
                showLog(`❌ Error eliminando propuesta: ${error.message}`, 'error');
                throw error;
            }
        }
    };
}

function generateProposalCode() {
    const date = new Date();
    const dateStr = date.getFullYear().toString() + 
                   (date.getMonth() + 1).toString().padStart(2, '0') + 
                   date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `CP-${dateStr}-${random}`;
}

function getDatabase() {
    return db;
}

// ===== PROPOSALS LIST =====
async function loadProposalsList() {
    showLog('📋 Cargando lista de propuestas...', 'info');
    
    try {
        const proposals = await db.getAllProposals();
        showLog(`📊 ${proposals.length} propuestas encontradas`, 'info');
        
        const proposalsContainer = document.getElementById('proposalsList');
        if (!proposalsContainer) {
            showLog('❌ Contenedor de propuestas no encontrado', 'error');
            return;
        }
        
        if (proposals.length === 0) {
            proposalsContainer.innerHTML = `
                <div class="no-proposals">
                    <p>📝 No hay propuestas creadas aún.</p>
                    <p>Haz clic en "Crear Nueva Propuesta" para comenzar.</p>
                </div>
            `;
            return;
        }
        
        // Generar HTML para cada propuesta
        const proposalsHTML = proposals.map(proposal => `
            <div class="proposal-item" data-id="${proposal.id}">
                <div class="proposal-header">
                    <h4>${proposal.nombre_proyecto || 'Sin nombre'}</h4>
                    <span class="proposal-code">${proposal.codigo_propuesta}</span>
                </div>
                <div class="proposal-details">
                    <p><strong>Cliente:</strong> ${proposal.cliente_nombre || 'N/A'} - ${proposal.cliente_empresa || 'N/A'}</p>
                    <p><strong>Fecha:</strong> ${proposal.fecha_propuesta ? new Date(proposal.fecha_propuesta).toLocaleDateString('es-ES') : 'N/A'}</p>
                    <p><strong>Valor:</strong> ${proposal.valor_proyecto || 'N/A'}</p>
                </div>
                <div class="proposal-actions">
                    <button class="btn btn-primary btn-sm" data-action="open-proposal" data-code="${proposal.codigo_propuesta}">
                        🌐 Abrir
                    </button>
                    <button class="btn btn-secondary btn-sm" data-action="preview-proposal" data-id="${proposal.id}">
                        👁️ Vista Previa
                    </button>
                    <button class="btn btn-warning btn-sm" data-action="edit-proposal" data-id="${proposal.id}">
                        ✏️ Editar
                    </button>
                    <button class="btn btn-info btn-sm" data-action="copy-proposal-link-code" data-code="${proposal.codigo_propuesta}">
                        📋 Copiar Link
                    </button>
                    <button class="btn btn-danger btn-sm" data-action="delete-proposal" data-id="${proposal.id}">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        `).join('');
        
        proposalsContainer.innerHTML = proposalsHTML;
        showLog('✅ Lista de propuestas renderizada correctamente', 'success');
        
    } catch (error) {
        showLog(`❌ Error cargando propuestas: ${error.message}`, 'error');
        const proposalsContainer = document.getElementById('proposalsList');
        if (proposalsContainer) {
            proposalsContainer.innerHTML = `
                <div class="error-state">
                    <p>❌ Error cargando las propuestas.</p>
                    <p>Por favor, recarga la página.</p>
                </div>
            `;
        }
    }
}

// ===== PROPOSAL ACTIONS =====
async function editProposal(id) {
    showLog(`✏️ Editando propuesta ID: ${id}`, 'info');
    setFormMode('edit');
    currentProposalId = id;
    
    try {
        const proposal = await db.getProposalById(id);
        if (!proposal) {
            showError('❌ No se pudo encontrar la propuesta para editar.');
            return;
        }
        
        // Aquí podrías implementar la lógica para cargar los datos en el formulario
        showLog('✅ Propuesta cargada para edición', 'success');
        
    } catch (error) {
        showLog(`❌ Error cargando propuesta para editar: ${error.message}`, 'error');
        showError('❌ Error al cargar la propuesta para editar.');
    }
}

async function previewProposal(id) {
    showLog(`👁️ Vista previa de propuesta ID: ${id}`, 'info');
    
    try {
        const proposal = await db.getProposalById(id);
        if (!proposal) {
            showError('❌ No se pudo encontrar la propuesta.');
            return;
        }
        
        // Mostrar modal de vista previa
        const previewModal = document.getElementById('previewModal');
        const previewContent = document.getElementById('previewContent');
        
        if (previewModal && previewContent) {
            previewContent.innerHTML = `
                <h3>${proposal.nombre_proyecto || 'Sin nombre'}</h3>
                <p><strong>Código:</strong> ${proposal.codigo_propuesta}</p>
                <p><strong>Cliente:</strong> ${proposal.cliente_nombre} - ${proposal.cliente_empresa}</p>
                <p><strong>Fecha:</strong> ${proposal.fecha_propuesta ? new Date(proposal.fecha_propuesta).toLocaleDateString('es-ES') : 'N/A'}</p>
                <p><strong>Valor:</strong> ${proposal.valor_proyecto || 'N/A'}</p>
                <div style="margin-top: 20px;">
                    <h4>Resumen Ejecutivo:</h4>
                    <p>${proposal.resumen_ejecutivo || 'No especificado'}</p>
                </div>
            `;
            previewModal.style.display = 'block';
        }
        
    } catch (error) {
        showLog(`❌ Error en vista previa: ${error.message}`, 'error');
        showError('❌ Error al mostrar la vista previa.');
    }
}

async function deleteProposal(id) {
    showLog(`🗑️ Eliminando propuesta ID: ${id}`, 'info');
    
    if (!confirm('¿Estás seguro de que quieres eliminar esta propuesta? Esta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        await db.deleteProposal(id);
        showLog('✅ Propuesta eliminada correctamente', 'success');
        showSuccess('✅ Propuesta eliminada correctamente.');
        
        // Recargar la lista
        await loadProposalsList();
        
    } catch (error) {
        showLog(`❌ Error eliminando propuesta: ${error.message}`, 'error');
        showError('❌ Error al eliminar la propuesta.');
    }
}

function openProposal(code) {
    showLog(`🌐 Abriendo propuesta código: ${code}`, 'info');
    
    const proposalUrl = `${window.location.origin}/${code}`;
    window.open(proposalUrl, '_blank');
    showLog(`🚀 Propuesta abierta en nueva pestaña: ${proposalUrl}`, 'success');
}

function copyProposalLinkFromCode(code) {
    showLog(`📋 Copiando enlace de propuesta código: ${code}`, 'info');
    
    const proposalUrl = `${window.location.origin}/${code}`;
    
    // Crear elemento temporal para copiar
    const textArea = document.createElement('textarea');
    textArea.value = proposalUrl;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showLog('✅ Enlace copiado al portapapeles', 'success');
        showSuccess('✅ Enlace copiado al portapapeles.');
    } catch (error) {
        showLog('❌ Error copiando enlace', 'error');
        showError('❌ Error al copiar el enlace.');
    }
    
    document.body.removeChild(textArea);
}

// ===== EVENT HANDLERS =====
function handleGlobalClick(event) {
    const target = event.target;
    
    // Manejar clics en botones de pestañas
    if (target.hasAttribute('data-tab')) {
        const tabName = target.getAttribute('data-tab');
        showTab(tabName);
        return;
    }
    
    // Manejar clics en botones de acción
    if (target.hasAttribute('data-action')) {
        const action = target.getAttribute('data-action');
        
        switch (action) {
            case 'remove-deliverable':
                removeDeliverable(target);
                break;
            case 'cancel-edit':
                cancelEdit();
                break;
            case 'close-modal':
                closeModal('editModal');
                break;
            case 'close-preview-modal':
                closeModal('previewModal');
                break;
            case 'open-proposal':
                const code = target.getAttribute('data-code');
                openProposal(code);
                break;
            case 'preview-proposal':
                const previewId = target.getAttribute('data-id');
                previewProposal(previewId);
                break;
            case 'edit-proposal':
                const editId = target.getAttribute('data-id');
                editProposal(editId);
                break;
            case 'delete-proposal':
                const deleteId = target.getAttribute('data-id');
                deleteProposal(deleteId);
                break;
            case 'copy-proposal-link-code':
                const copyCode = target.getAttribute('data-code');
                copyProposalLinkFromCode(copyCode);
                break;
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
    showLog('🚀 Sistema de Propuestas Cloud Pixels iniciando...', 'info');
    showLog('📱 Versión: 3.0 - Panel de Administración Consolidado', 'info');
    showLog(`🌐 Navegador: ${navigator.userAgent.split(' ')[0]}`, 'info');
    showLog(`⏰ Fecha: ${new Date().toLocaleDateString('es-ES')}`, 'info');
    
    // Inicializar Supabase
    await initSupabase();
    
    // Agregar event listeners
    document.addEventListener('click', handleGlobalClick);
    
    // Cerrar modales al hacer clic fuera
    window.addEventListener('click', (event) => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    showLog('✅ Sistema inicializado correctamente', 'success');
});

// ===== EXPORT FUNCTIONS FOR GLOBAL ACCESS =====
window.AdminDashboard = {
    showTab,
    showSuccess,
    showError,
    setFormMode,
    getIsEditMode,
    addDeliverable,
    removeDeliverable,
    cancelEdit,
    loadProposalsList,
    editProposal,
    previewProposal,
    deleteProposal,
    openProposal,
    copyProposalLinkFromCode
};
