
// Sistema de base de datos Supabase
let db = null;

// Inicializar Supabase cuando se carga la página
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
        showLog(`❌ ERROR inicializando Supabase: ${error.message}`, 'error');
        showLog(`🔍 Stack trace: ${error.stack}`, 'error');
        showLog(`📊 Tipo de error: ${error.name}`, 'error');
        
        // Información adicional para debugging
        if (error.code) {
            showLog(`🔢 Código de error: ${error.code}`, 'error');
        }
        if (error.details) {
            showLog(`📋 Detalles: ${error.details}`, 'error');
        }
        if (error.hint) {
            showLog(`💡 Sugerencia: ${error.hint}`, 'error');
        }
        
        showError('Error conectando con la base de datos');
    }
}

// Crear servicio mock como fallback
function createMockService() {
    showLog('🔄 Creando servicio mock como fallback', 'warning');
    
    return {
        getAllProposals: async () => {
            return [
                {
                    id: 'mock-1',
                    codigo_propuesta: 'CP-MOCK-001',
                    nombre_proyecto: 'Proyecto Mock',
                    cliente_nombre: 'Cliente Mock',
                    cliente_empresa: 'Empresa Mock',
                    fecha_propuesta: '2024-01-01',
                    valor_proyecto: '$0',
                    created_at: '2024-01-01T00:00:00Z'
                }
            ];
        },
        getProposalById: async (id) => {
            return {
                id: id,
                codigo_propuesta: 'CP-MOCK-001',
                nombre_proyecto: 'Proyecto Mock',
                cliente_nombre: 'Cliente Mock',
                cliente_empresa: 'Empresa Mock'
            };
        },
        saveProposal: async (data) => {
            return { ...data, id: 'mock-' + Date.now() };
        },
        updateProposal: async (id, data) => {
            return { ...data, id: id };
        },
        deleteProposal: async (id) => {
            return true;
        }
    };
}

// Funciones de UI
function showTab(tabName) {
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Mostrar la pestaña seleccionada
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Encontrar el botón activo y marcarlo
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }

    // Si es la pestaña de lista, cargar las propuestas
    if (tabName === 'list') {
        loadProposalsList();
    }
}

function addDeliverable() {
    const container = document.getElementById('deliverablesList');
    const newItem = document.createElement('div');
    newItem.className = 'deliverable-item';
    newItem.innerHTML = `
        <input type="text" name="deliverables[]" placeholder="Nuevo entregable" required>
        <button type="button" class="btn btn-danger btn-small" data-action="remove-deliverable">❌</button>
    `;
    container.appendChild(newItem);
}

function removeDeliverable(button) {
    const items = document.querySelectorAll('.deliverable-item');
    if (items.length > 1) {
        button.parentElement.remove();
    }
}

function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorMessage').style.display = 'block';
    document.getElementById('successMessage').style.display = 'none';
    console.error('❌ ERROR:', message);
}

function showSuccess(message) {
    document.getElementById('successContent').textContent = message;
    document.getElementById('successMessage').style.display = 'block';
    document.getElementById('errorMessage').style.display = 'none';
    console.log('✅ ÉXITO:', message);
}

function showProposalLink(proposalUrl, proposalCode) {
    // Mostrar la sección del enlace
    document.getElementById('proposalLinkSection').style.display = 'block';
    
    // Configurar el botón de abrir propuesta
    const openBtn = document.getElementById('openProposalBtn');
    openBtn.href = proposalUrl;
    openBtn.onclick = function(e) {
        e.preventDefault();
        window.open(proposalUrl, '_blank');
        showLog('🚀 Propuesta abierta manualmente', 'success');
    };
    
    // Mostrar el código de la propuesta
    document.getElementById('proposalCodeDisplay').textContent = proposalCode;
    
    // Guardar la URL para poder copiarla
    window.currentProposalUrl = proposalUrl;
}

function startAutoRedirect(proposalUrl, seconds) {
    let countdown = seconds;
    const countdownElement = document.querySelector('#proposalLinkSection .countdown');
    
    const timer = setInterval(() => {
        countdown--;
        
        if (countdownElement) {
            countdownElement.textContent = countdown;
        }
        
        if (countdown <= 0) {
            clearInterval(timer);
            window.open(proposalUrl, '_blank');
            showLog('🚀 Redirección automática completada', 'success');
        }
    }, 1000);
}

function copyProposalLink() {
    if (!window.currentProposalUrl) {
        alert('No hay enlace de propuesta disponible');
        return;
    }

    navigator.clipboard.writeText(window.currentProposalUrl).then(() => {
        // Cambiar temporalmente el texto del botón
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✅ ¡Copiado!';
        btn.style.background = '#28a745';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
        
        showLog('📋 Enlace copiado al portapapeles', 'success');
    }).catch(() => {
        // Fallback para navegadores que no soportan clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = window.currentProposalUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        alert('¡Enlace copiado al portapapeles!\n\n' + window.currentProposalUrl);
    });
}

function showLog(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    
    // Mostrar en consola del navegador
    switch(type) {
        case 'error':
            console.error('❌', logMessage);
            break;
        case 'success':
            console.log('✅', logMessage);
            break;
        case 'warning':
            console.warn('⚠️', logMessage);
            break;
        default:
            console.log('ℹ️', logMessage);
    }
    
    // También mostrar en la consola del navegador para debugging
    if (type === 'error') {
        console.error('🔍 DEBUG INFO:', {
            timestamp: new Date().toISOString(),
            message: message,
            userAgent: navigator.userAgent,
            url: window.location.href
        });
    }
    
    // Mostrar en el panel visual de logs
    addLogToPanel(message, type, timestamp);
}

function addLogToPanel(message, type, timestamp) {
    const logsContent = document.getElementById('logsContent');
    if (!logsContent) return;
    
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry log-${type}`;
    
    logEntry.innerHTML = `
        <span class="log-time">[${timestamp}]</span>
        <span class="log-message">${message}</span>
    `;
    
    logsContent.appendChild(logEntry);
    
    // Auto-scroll al final
    logsContent.scrollTop = logsContent.scrollHeight;
    
    // Limitar el número de logs para evitar sobrecarga
    const maxLogs = 100;
    while (logsContent.children.length > maxLogs) {
        logsContent.removeChild(logsContent.firstChild);
    }
}

function clearLogs() {
    const logsContent = document.getElementById('logsContent');
    if (!logsContent) return;
    
    logsContent.innerHTML = `
        <div class="log-entry log-info">
            <span class="log-time">[Sistema]</span>
            <span class="log-message">Logs limpiados. Panel reiniciado.</span>
        </div>
    `;
}

function exportLogs() {
    const logsContent = document.getElementById('logsContent');
    if (!logsContent) return;
    
    const logs = Array.from(logsContent.children).map(log => {
        const time = log.querySelector('.log-time').textContent;
        const message = log.querySelector('.log-message').textContent;
        return `${time} ${message}`;
    }).join('\n');
    
    const blob = new Blob([logs], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs_cloud_pixels_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showLog('📥 Logs exportados exitosamente', 'success');
}

async function loadProposalsList() {
    if (!db) {
        showLog('❌ Base de datos no inicializada', 'error');
        return;
    }

    try {
        showLog('📋 Consultando propuestas en la base de datos...', 'info');
        const startTime = Date.now();
        
        const proposals = await db.getAllProposals();
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        showLog(`✅ ${proposals.length} propuestas cargadas en ${duration}ms`, 'success');
        
        const container = document.getElementById('proposalsList');

        if (proposals.length === 0) {
            showLog('📭 No hay propuestas en la base de datos', 'info');
            container.innerHTML = `
                <div class="empty-state">
                    <h3>📭 No hay propuestas creadas</h3>
                    <p>Comienza creando tu primera propuesta en la pestaña "Crear Nueva Propuesta"</p>
                </div>
            `;
            return;
        }

        showLog('🎨 Renderizando lista de propuestas...', 'info');
        container.innerHTML = proposals.map(proposal => `
            <div class="proposal-card">
                <div class="proposal-header">
                    <div>
                        <div class="proposal-title">${proposal.nombre_proyecto || 'Sin título'}</div>
                        <div class="proposal-client">${proposal.cliente_nombre || 'Sin cliente'} - ${proposal.cliente_empresa || 'Sin empresa'}</div>
                        <div class="proposal-code"><strong>Código:</strong> <code>${proposal.codigo_propuesta || 'N/A'}</code></div>
                    </div>
                    <div class="proposal-date">${proposal.created_at ? new Date(proposal.created_at).toLocaleDateString('es-ES') : 'Sin fecha'}</div>
                </div>
                <div class="proposal-actions">
                    <button class="btn btn-primary btn-small" data-action="open-proposal" data-code="${proposal.codigo_propuesta}">🚀 Abrir</button>
                    <button class="btn btn-secondary btn-small" data-action="preview-proposal" data-id="${proposal.id}">👁️ Vista Previa</button>
                    <button class="btn btn-secondary btn-small" data-action="edit-proposal" data-id="${proposal.id}">✏️ Editar</button>
                    <button class="btn btn-info btn-small" data-action="copy-proposal-link-code" data-code="${proposal.codigo_propuesta}">🔗 Copiar Enlace</button>
                    <button class="btn btn-danger btn-small" data-action="delete-proposal" data-id="${proposal.id}">🗑️ Eliminar</button>
                </div>
            </div>
        `).join('');
        
        showLog('✅ Lista de propuestas renderizada correctamente', 'success');
        
    } catch (error) {
        showLog(`❌ ERROR cargando propuestas: ${error.message}`, 'error');
        showLog(`🔍 Stack trace: ${error.stack}`, 'error');
        showError('Error cargando las propuestas');
    }
}

async function previewProposal(proposalId) {
    if (!db) return;
    
    try {
        const proposal = await db.getProposalById(proposalId);
        if (!proposal) return;

        // Construir URL correcta para la propuesta
        const proposalUrl = `${window.location.origin}/${proposal.codigo_propuesta}`;

        // Mostrar vista previa simple con los datos de la propuesta
        const previewContent = `
            <div style="padding: 20px;">
                <h2 style="color: #08002B; margin-bottom: 20px;">👁️ Vista Previa de la Propuesta</h2>
                
                <div style="margin-bottom: 15px;">
                    <strong>📋 Proyecto:</strong> ${proposal.nombre_proyecto || 'Sin título'}
                </div>
                
                <div style="margin-bottom: 15px;">
                    <strong>👤 Cliente:</strong> ${proposal.cliente_nombre || 'Sin cliente'} - ${proposal.cliente_empresa || 'Sin empresa'}
                </div>
                
                <div style="margin-bottom: 15px;">
                    <strong>📅 Fecha:</strong> ${proposal.fecha_propuesta ? new Date(proposal.fecha_propuesta).toLocaleDateString('es-ES') : 'Sin fecha'}
                </div>
                
                <div style="margin-bottom: 15px;">
                    <strong>💰 Valor:</strong> ${proposal.valor_proyecto || 'Sin especificar'}
                </div>
                
                <div style="margin-bottom: 15px;">
                    <strong>🔑 Código:</strong> <code>${proposal.codigo_propuesta || 'N/A'}</code>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <strong>🌐 URL:</strong> <code>${proposalUrl}</code>
                </div>
                
                <div style="margin-top: 25px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <p><strong>💡 Para ver la propuesta completa:</strong></p>
                    <button class="btn btn-primary" data-action="open-proposal" data-code="${proposal.codigo_propuesta}" style="margin-top: 10px;">
                        🚀 Abrir Propuesta Completa
                    </button>
                    <button class="btn btn-secondary" onclick="window.open('${proposalUrl}', '_blank')" style="margin-top: 10px; margin-left: 10px;">
                        🔗 Abrir en Nueva Pestaña
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('previewContent').innerHTML = previewContent;
        document.getElementById('previewModal').style.display = 'block';
    } catch (error) {
        console.error('Error cargando propuesta:', error);
        showError('Error cargando la propuesta');
    }
}

function closePreviewModal() {
    document.getElementById('previewModal').style.display = 'none';
}

async function editProposal(proposalId) {
    if (!db) return;
    
    try {
        // Obtener la propuesta por ID primero
        const proposal = await db.getProposalById(proposalId);
        if (!proposal) return;

        // Ahora obtener la propuesta completa por código para tener todos los datos
        const fullProposal = await db.getProposalByCode(proposal.codigo_propuesta);
        if (!fullProposal) return;

        // Crear el formulario de edición dinámicamente
        const editFormContainer = document.getElementById('editFormContainer');
        
        // Crear un formulario de edición usando el componente ProposalForm
        const editFormHTML = `
            <form id="editForm">
                <input type="hidden" id="editProposalId" name="proposalId" value="${fullProposal.id}">
                <input type="hidden" id="editProposalCode" name="proposalCode" value="${fullProposal.codigo_propuesta}">
                
                <!-- Aquí se clonará el formulario original con los datos -->
                <div id="editFormContent">
                    <!-- El contenido se llenará dinámicamente -->
                </div>
                
                <div style="margin-top: 20px; display: flex; gap: 10px;">
                    <button type="submit" class="btn btn-primary">💾 Actualizar Propuesta</button>
                    <button type="button" class="btn btn-secondary" data-action="close-modal">Cancelar</button>
                </div>
            </form>
        `;
        
        editFormContainer.innerHTML = editFormHTML;
        
        // Clonar el formulario original y llenarlo con los datos
        const originalForm = document.getElementById('proposalForm');
        const editFormContent = document.getElementById('editFormContent');
        editFormContent.innerHTML = originalForm.innerHTML;
        
        // Llenar los campos con los datos de la propuesta
        Object.keys(fullProposal).forEach(key => {
            const field = editFormContent.querySelector(`[name="${key}"]`);
            if (field) {
                if (key === 'servicios_seleccionados') {
                    // Manejar checkboxes de servicios
                    if (Array.isArray(fullProposal.servicios_seleccionados)) {
                        fullProposal.servicios_seleccionados.forEach(service => {
                            const checkbox = editFormContent.querySelector(`input[value="${service}"]`);
                            if (checkbox) checkbox.checked = true;
                        });
                    }
                } else if (key === 'entregables') {
                    // Manejar entregables
                    if (Array.isArray(fullProposal.entregables)) {
                        const deliverablesContainer = editFormContent.querySelector('#deliverablesList');
                        if (deliverablesContainer) {
                            deliverablesContainer.innerHTML = '';
                            fullProposal.entregables.forEach((deliverable, index) => {
                                const newItem = document.createElement('div');
                                newItem.className = 'deliverable-item';
                                newItem.innerHTML = `
                                    <input type="text" name="deliverables[]" value="${deliverable}" required>
                                    <button type="button" class="btn btn-danger btn-small" data-action="remove-deliverable">❌</button>
                                `;
                                deliverablesContainer.appendChild(newItem);
                            });
                        }
                    }
                } else {
                    field.value = fullProposal[key] || '';
                }
            }
        });
        
        // Mostrar modal
        document.getElementById('editModal').style.display = 'block';
        
        // Mostrar enlace actualizado de la propuesta
        if (fullProposal.codigo_propuesta) {
            const proposalUrl = `${window.location.origin}/${fullProposal.codigo_propuesta}`;
            showProposalLink(proposalUrl, fullProposal.codigo_propuesta);
        }
        
        // Agregar event listener para el formulario de edición
        const editForm = document.getElementById('editForm');
        editForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                // Recopilar datos del formulario de edición
                const formData = new FormData(this);
                const data = Object.fromEntries(formData);
                
                // Procesar servicios seleccionados
                data.servicios_seleccionados = Array.from(editFormContent.querySelectorAll('input[name="services"]:checked')).map(cb => cb.value);
                
                // Procesar entregables
                data.entregables = Array.from(editFormContent.querySelectorAll('input[name="deliverables[]"]')).map(input => input.value).filter(value => value.trim() !== '');
                
                // Actualizar la propuesta
                const result = await updateProposal(fullProposal.id, data);
                if (result) {
                    showLog('✅ Propuesta actualizada exitosamente', 'success');
                    closeModal();
                    await loadProposalsList(); // Recargar la lista
                }
            } catch (error) {
                showLog(`❌ Error actualizando propuesta: ${error.message}`, 'error');
                showError('Error actualizando la propuesta');
            }
        });
        
    } catch (error) {
        console.error('Error cargando propuesta para editar:', error);
        showError('Error cargando la propuesta para editar');
    }
}

async function updateProposal(proposalId, updateData) {
    if (!db) return;
    
    try {
        const result = await db.updateProposal(proposalId, updateData);
        if (!result) return;

        // Mostrar enlace actualizado de la propuesta
        if (result.codigo_propuesta) {
            const proposalUrl = `${window.location.origin}/${result.codigo_propuesta}`;
            showProposalLink(proposalUrl, result.codigo_propuesta);
        }
        
        showLog('✅ Propuesta actualizada exitosamente', 'success');
        return result;
    } catch (error) {
        console.error('Error actualizando propuesta:', error);
        showError('Error actualizando la propuesta');
    }
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

async function deleteProposal(proposalId) {
    if (!db) return;
    
    if (confirm('¿Estás seguro de que quieres eliminar esta propuesta? Esta acción no se puede deshacer.')) {
        try {
            await db.deleteProposal(proposalId);
            await loadProposalsList();
            showLog('✅ Propuesta eliminada exitosamente', 'success');
        } catch (error) {
            console.error('Error eliminando propuesta:', error);
            showError('Error eliminando la propuesta');
        }
    }
}

function openProposal(proposalCode) {
    if (!proposalCode) {
        alert('Esta propuesta no tiene un código válido');
        return;
    }

    const proposalUrl = `${window.location.origin}/${proposalCode}`;
    
    // Abrir la propuesta en una nueva pestaña
    window.open(proposalUrl, '_blank');
    
    showLog(`🚀 Propuesta abierta en nueva pestaña: ${proposalCode}`, 'success');
}

function copyProposalLinkFromCode(proposalCode) {
    if (!proposalCode) {
        alert('Esta propuesta no tiene un código válido');
        return;
    }

    const proposalUrl = `${window.location.origin}/${proposalCode}`;
    
    navigator.clipboard.writeText(proposalUrl).then(() => {
        alert('¡Enlace copiado al portapapeles!\n\n' + proposalUrl);
    }).catch(() => {
        // Fallback para navegadores que no soportan clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = proposalUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        alert('¡Enlace copiado al portapapeles!\n\n' + proposalUrl);
    });
}

async function getProposalById(id) {
    if (!db) return;
    
    try {
        const proposal = await db.getProposalById(id);
        if (!proposal) return;

        // Mostrar vista previa simple con los datos de la propuesta
        const previewContent = `
            <div style="padding: 20px;">
                <h2 style="color: #08002B; margin-bottom: 20px;">👁️ Vista Previa de la Propuesta</h2>
                
                <div style="margin-bottom: 15px;">
                    <strong>📋 Proyecto:</strong> ${proposal.nombre_proyecto || 'Sin título'}
                </div>
                
                <div style="margin-bottom: 15px;">
                    <strong>👤 Cliente:</strong> ${proposal.cliente_nombre || 'Sin cliente'} - ${proposal.cliente_empresa || 'Sin empresa'}
                </div>
                
                <div style="margin-bottom: 15px;">
                    <strong>📅 Fecha:</strong> ${proposal.fecha_propuesta ? new Date(proposal.fecha_propuesta).toLocaleDateString('es-ES') : 'Sin fecha'}
                </div>
                
                <div style="margin-bottom: 15px;">
                    <strong>💰 Valor:</strong> ${proposal.valor_proyecto || 'Sin especificar'}
                </div>
                
                <div style="margin-bottom: 15px;">
                    <strong>🔑 Código:</strong> <code>${proposal.codigo_propuesta || 'N/A'}</code>
                </div>
                
                <div style="margin-top: 25px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <p><strong>💡 Para ver la propuesta completa:</strong></p>
                    <button class="btn btn-primary" data-action="open-proposal" data-code="${proposal.codigo_propuesta}" style="margin-top: 10px;">
                        🚀 Abrir Propuesta Completa
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('previewContent').innerHTML = previewContent;
        document.getElementById('previewModal').style.display = 'block';
    } catch (error) {
        console.error('Error cargando propuesta:', error);
        showError('Error cargando la propuesta');
    }
}

// Event delegation para manejar todos los clicks
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
                copyProposalLink();
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

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el formulario existe antes de agregar el event listener
    const proposalForm = document.getElementById('proposalForm');
    if (proposalForm) {
        proposalForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            showLog('🚀 Iniciando proceso de generación de propuesta...', 'info');
            
            if (!db) {
                showLog('❌ Base de datos no inicializada', 'error');
                showError('Base de datos no inicializada');
                return;
            }
            
            showLog('✅ Base de datos inicializada correctamente', 'success');
            
            try {
                // Recopilar datos del formulario
                showLog('📝 Recopilando datos del formulario...', 'info');
                const formData = new FormData(this);
                const data = Object.fromEntries(formData);
                
                // Procesar servicios seleccionados
                data.servicios_seleccionados = Array.from(document.querySelectorAll('input[name="services"]:checked')).map(cb => cb.value);
                showLog(`🔧 Servicios seleccionados: ${data.servicios_seleccionados.join(', ')}`, 'info');
                
                // Procesar entregables
                data.entregables = Array.from(document.querySelectorAll('input[name="deliverables[]"]')).map(input => input.value).filter(value => value.trim() !== '');
                showLog(`📦 Entregables configurados: ${data.entregables.length} items`, 'info');
                
                // Mapear campos a la estructura de Supabase
                showLog('🔄 Mapeando datos a estructura de Supabase...', 'info');
                const proposalData = {
                    nombre_proyecto: data.projectName,
                    cliente_nombre: data.clientName,
                    cliente_empresa: data.clientCompany,
                    fecha_propuesta: data.proposalDate,
                    texto_introductorio: data.introText || 'Soluciones creativas para impulsar tu presencia digital con diseño, desarrollo, branding y estrategias de marketing.',
                    resumen_ejecutivo: data.executiveSummary,
                    descripcion_empresa: data.companyDescription || 'Con más de 9 años de experiencia, Cloud Pixels es un equipo global con oficinas en Honduras, Estados Unidos, Estonia y Panamá. Combinamos talento de diseño y desarrollo de todo el mundo para crear soluciones digitales excepcionales y escalables.',
                    objetivos_alcance: data.objectivesScope,
                    servicios_seleccionados: data.servicios_seleccionados,
                    entregables: data.entregables,
                    proceso_timeline: [
                        { title: 'Análisis y Planificación', duration: '1-2 semanas', description: 'Reunión inicial, análisis de requerimientos y planificación del proyecto.' },
                        { title: 'Diseño y Desarrollo', duration: '3-4 semanas', description: 'Creación de diseños, desarrollo frontend y backend según especificaciones.' },
                        { title: 'Pruebas y Ajustes', duration: '1 semana', description: 'Testing exhaustivo, correcciones y optimizaciones finales.' },
                        { title: 'Lanzamiento', duration: '1 día', description: 'Despliegue en producción y entrega final del proyecto.' }
                    ],
                    valor_proyecto: data.projectValue,
                    terminos_pago: data.paymentTerms,
                    contacto_email: data.contactEmail || 'tu.correo@cloudpixels.com',
                    contacto_whatsapp: data.contactWhatsApp || '+XX XXX XXX XXXX',
                    horarios_atencion: data.attentionHours || 'Nuestro equipo está disponible de lunes a viernes de 9:00 a.m. a 6:00 p.m. (aplican días feriados). Para consultas fuera de este horario, responderemos al siguiente día laboral.',
                    terminos_condiciones: data.termsConditions || 'Al aceptar esta propuesta, el cliente se compromete a abonar un anticipo del 50% para iniciar el proyecto. El saldo restante se pagará al finalizar, antes del lanzamiento.',
                    terminos_validez: data.validityTerms || 'Esta propuesta es válida durante 30 días a partir de la fecha de emisión. Los servicios de mantenimiento, hosting o funcionalidades adicionales no mencionadas aquí se considerarán extras opcionales.',
                    texto_aceptacion: data.acceptanceText || '¿Listo para comenzar? Haz clic en el botón de abajo para aceptar la propuesta. Podrás firmar digitalmente y realizar el pago inicial.'
                };
                
                showLog('📊 Datos de la propuesta preparados:', 'info');
                showLog(`   - Proyecto: ${proposalData.nombre_proyecto}`, 'info');
                showLog(`   - Cliente: ${proposalData.cliente_nombre} (${proposalData.cliente_empresa})`, 'info');
                showLog(`   - Valor: ${proposalData.valor_proyecto}`, 'info');
                
                // Guardar en Supabase
                showLog('💾 Intentando guardar en base de datos...', 'info');
                const startTime = Date.now();
                
                const savedProposal = await db.saveProposal(proposalData);
                const endTime = Date.now();
                const duration = endTime - startTime;
                
                showLog(`✅ Propuesta guardada exitosamente en ${duration}ms`, 'success');
                showLog(`🔑 Código de propuesta generado: ${savedProposal.codigo_propuesta}`, 'success');
                showLog(`🆔 ID de la propuesta: ${savedProposal.id}`, 'success');
                
                // Generar enlace directo a la propuesta
                const proposalUrl = `${window.location.origin}/${savedProposal.codigo_propuesta}`;
                
                showLog('🔗 Generando enlace de la propuesta...', 'info');
                showLog(`🌐 URL de la propuesta: ${proposalUrl}`, 'info');
                
                // Mostrar mensaje de éxito
                showSuccess(`¡Propuesta generada exitosamente! Código: ${savedProposal.codigo_propuesta}`);
                
                // Redirigir automáticamente a la propuesta después de 3 segundos
                showLog('🔄 Redirigiendo a la propuesta en 3 segundos...', 'info');
                startAutoRedirect(proposalUrl, 3);
                
                // Mostrar botón para abrir la propuesta inmediatamente
                showProposalLink(proposalUrl, savedProposal.codigo_propuesta);
                
                // Limpiar formulario
                showLog('🧹 Limpiando formulario...', 'info');
                this.reset();
                document.getElementById('deliverablesList').innerHTML = `
                    <div class="deliverable-item">
                        <input type="text" name="deliverables[]" placeholder="Entregable 1" required>
                        <button type="button" class="btn btn-danger btn-small" data-action="remove-deliverable">❌</button>
                    </div>
                `;
                
                showLog('🎉 Proceso completado exitosamente', 'success');
                
                setTimeout(() => {
                    document.getElementById('successMessage').style.display = 'none';
                }, 5000);
                
            } catch (error) {
                showLog(`❌ ERROR durante el proceso: ${error.message}`, 'error');
                showLog(`🔍 Stack trace: ${error.stack}`, 'error');
                showLog(`📊 Tipo de error: ${error.name}`, 'error');
                
                // Información adicional para debugging
                if (error.code) {
                    showLog(`🔢 Código de error: ${error.code}`, 'error');
                }
                if (error.details) {
                    showLog(`📋 Detalles: ${error.details}`, 'error');
                }
                if (error.hint) {
                    showLog(`💡 Sugerencia: ${error.hint}`, 'error');
                }
                
                showError(`Error generando la propuesta: ${error.message}`);
            }
        });
    }

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
    showLog('📱 Versión: 3.0 - Panel de Administración', 'info');
    showLog('🌐 Navegador: ' + navigator.userAgent.split(' ')[0], 'info');
    showLog('⏰ Fecha: ' + new Date().toLocaleDateString('es-ES'), 'info');
    
    initSupabase();
});
