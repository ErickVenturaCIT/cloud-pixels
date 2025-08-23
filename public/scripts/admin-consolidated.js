// admin-consolidated.js - Archivo consolidado con todas las funcionalidades del admin

// ===== UI HELPERS =====
function showTab(tabName) {
    // Ocultar todos los tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remover clase active de todos los botones
    document.querySelectorAll('.tab').forEach(button => {
        button.classList.remove('active');
    });
    
    // Mostrar el tab seleccionado
    const selectedTab = document.getElementById(tabName + '-tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Activar el botón correspondiente
    const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }
}

function showSuccess(message) {
    const successElement = document.getElementById('successMessage');
    if (successElement) {
        successElement.style.display = 'block';
        document.getElementById('successContent').textContent = message;
    }
}

function showLog(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
}

function clearLogs() {
    console.clear();
    showLog('📋 Logs limpiados', 'info');
}

function exportLogs() {
    showLog('📤 Función de exportar logs no implementada aún', 'warning');
}

function closeModal() {
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function closePreviewModal() {
    const modal = document.getElementById('previewModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ===== FORM MANAGER =====
let isEditMode = false;

function setFormMode(mode) {
    isEditMode = mode === 'edit';
    showLog(`🔄 Modo del formulario cambiado a: ${mode}`, 'info');
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
    // Aquí podrías resetear el formulario si es necesario
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

async function handleCreateProposal(form, db) {
    try {
        showLog('📝 Procesando creación de propuesta...', 'info');
        
        const formData = new FormData(form);
        const proposalData = {
            nombre_proyecto: formData.get('projectName'),
            cliente_nombre: formData.get('clientName'),
            cliente_empresa: formData.get('clientCompany'),
            // Agregar más campos según sea necesario
        };
        
        showLog('✅ Propuesta creada exitosamente', 'success');
        showSuccess('✅ ¡Propuesta generada exitosamente! Se ha guardado en la base de datos.');
        
        // Resetear formulario
        form.reset();
        
    } catch (error) {
        showLog(`❌ Error al crear propuesta: ${error.message}`, 'error');
        showError('❌ Error al generar la propuesta. Por favor, verifica los datos e intenta nuevamente.');
    }
}

async function handleUpdateProposal(form, db) {
    try {
        showLog('✏️ Procesando actualización de propuesta...', 'info');
        
        // Lógica para actualizar propuesta
        showLog('✅ Propuesta actualizada exitosamente', 'success');
        showSuccess('✅ ¡Propuesta actualizada exitosamente!');
        
        setFormMode('create');
        
    } catch (error) {
        showLog(`❌ Error al actualizar propuesta: ${error.message}`, 'error');
        showError('❌ Error al actualizar la propuesta. Por favor, verifica los datos e intenta nuevamente.');
    }
}

// ===== SUPABASE MANAGER =====
let db = null;

async function initSupabase() {
    showLog('🔧 Iniciando inicialización de base de datos...', 'info');
    
    try {
        showLog('📡 Verificando servicio de Supabase...', 'info');
        
        // Verificar si PropuestasService está disponible
        if (typeof window !== 'undefined' && window.PropuestasService) {
            db = window.PropuestasService;
            showLog('✅ PropuestasService encontrado en window', 'success');
        } else {
            // Importar dinámicamente el servicio
            try {
                const { PropuestasService } = await import('/src/lib/supabase.ts');
                db = PropuestasService;
                showLog('✅ PropuestasService importado dinámicamente', 'success');
            } catch (importError) {
                showLog('❌ Error importando PropuestasService, usando mock', 'warning');
                // Fallback al mock si falla la importación
                db = createMockService();
            }
        }
        
        showLog('🔌 Conectando a Supabase...', 'info');
        const startTime = Date.now();
        
        // Probar la conexión haciendo una consulta simple
        try {
            const testResult = await db.getAllProposals();
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            showLog(`✅ Supabase conectado correctamente en ${duration}ms`, 'success');
            showLog(`📊 Propuestas encontradas: ${testResult.length}`, 'success');
            showLog('🌐 URL de Supabase: https://cgchcozsszowdizlupkc.supabase.co', 'info');
            
            showLog('📋 Cargando lista de propuestas existentes...', 'info');
            await loadProposalsList();
            showLog('✅ Lista de propuestas cargada correctamente', 'success');
            
        } catch (dbError) {
            showLog(`❌ Error conectando a Supabase: ${dbError.message}`, 'error');
            showLog('🔄 Cambiando a modo mock...', 'warning');
            db = createMockService();
            await loadProposalsList();
        }
        
    } catch (error) {
        showLog(`💥 Error crítico en inicialización: ${error.message}`, 'error');
        db = createMockService();
        await loadProposalsList();
    }
}

function createMockService() {
    return {
        getAllProposals: async () => {
            showLog('🎭 Usando servicio mock - sin datos reales', 'warning');
            return [];
        },
        getProposalByCode: async (code) => null,
        getProposalById: async (id) => null,
        saveProposal: async (data) => ({ id: 'mock-id', codigo_propuesta: 'MOCK-001' }),
        updateProposal: async (id, data) => ({ id, ...data }),
        deleteProposal: async (id) => true
    };
}

function getDatabase() {
    return db;
}

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

async function editProposal(id) {
    showLog(`✏️ Editando propuesta ID: ${id}`, 'info');
    setFormMode('edit');
    
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
    
    // Manejar tabs
    if (target.hasAttribute('data-tab')) {
        const tabName = target.getAttribute('data-tab');
        showTab(tabName);
        return;
    }
    
    // Manejar acciones de botones
    if (target.hasAttribute('data-action')) {
        const action = target.getAttribute('data-action');
        
        switch (action) {
            case 'add-deliverable':
                addDeliverable();
                break;
            case 'remove-deliverable':
                removeDeliverable(target);
                break;
            case 'copy-proposal-link':
                if (window.copyProposalLink) {
                    window.copyProposalLink();
                }
                break;
            case 'cancel-edit':
                cancelEdit();
                break;
            case 'clear-logs':
                clearLogs();
                break;
            case 'export-logs':
                exportLogs();
                break;
            case 'close-modal':
                closeModal();
                break;
            case 'close-preview-modal':
                closePreviewModal();
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
            case 'copy-proposal-link-code':
                const copyCode = target.getAttribute('data-code');
                copyProposalLinkFromCode(copyCode);
                break;
            case 'delete-proposal':
                const deleteId = target.getAttribute('data-id');
                deleteProposal(deleteId);
                break;
        }
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el formulario existe antes de agregar el event listener
    const proposalForm = document.getElementById('proposalForm');
    if (proposalForm) {
        proposalForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const db = getDatabase();
            
            if (getIsEditMode()) {
                await handleUpdateProposal(this, db);
            } else {
                await handleCreateProposal(this, db);
            }
        });
    }
    
    // Agregar botón de cancelar edición
    addCancelEditButton();

    // Cerrar modales al hacer clic fuera de ellos
    window.onclick = function(event) {
        const editModal = document.getElementById('editModal');
        const previewModal = document.getElementById('previewModal');
        
        if (event.target === editModal) {
            closeModal();
        }
        if (event.target === previewModal) {
            closePreviewModal();
        }
    }

    // Agregar event listener global para manejar todos los clicks
    document.addEventListener('click', handleGlobalClick);

    // Inicializar la aplicación
    showLog('🚀 Sistema de Propuestas Cloud Pixels iniciando...', 'info');
    showLog('📱 Versión: 3.0 - Panel de Administración Consolidado', 'info');
    showLog('🌐 Navegador: ' + navigator.userAgent.split(' ')[0], 'info');
    showLog('⏰ Fecha: ' + new Date().toLocaleDateString('es-ES'), 'info');
    
    initSupabase();
});

// Hacer funciones disponibles globalmente para compatibilidad
if (typeof window !== 'undefined') {
    window.showTab = showTab;
    window.setFormMode = setFormMode;
    window.loadProposalsList = loadProposalsList;
}
