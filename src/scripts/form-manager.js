// form-manager.js - Manejo de formularios y modos de edición/creación

import { showLog, showSuccess, showError, showProposalLink, startAutoRedirect } from './ui-helpers.js';

// Variables globales para el modo de edición
let isEditMode = false;
let currentEditingProposal = null;

// Función para cambiar entre modo crear/editar
export function setFormMode(mode, proposalData = null) {
    const form = document.getElementById('proposalForm');
    const submitButton = form?.querySelector('button[type="submit"]');
    const formTitle = document.querySelector('#create-tab h3') || document.querySelector('.form-section h3');
    
    if (mode === 'edit' && proposalData) {
        isEditMode = true;
        currentEditingProposal = proposalData;
        
        // Cambiar título y botón
        if (formTitle) formTitle.textContent = '✏️ Editar Propuesta';
        if (submitButton) submitButton.textContent = '💾 Actualizar Propuesta';
        
        // Llenar formulario con datos
        fillFormWithData(proposalData);
        
        // Cambiar a la pestaña de crear
        if (window.showTab) {
            window.showTab('create');
        }
        
        // Actualizar UI
        updateFormUI();
        
        showLog(`✏️ Modo edición activado para: ${proposalData.nombre_proyecto}`, 'info');
    } else {
        isEditMode = false;
        currentEditingProposal = null;
        
        // Restaurar título y botón
        if (formTitle) formTitle.textContent = '📝 Crear Nueva Propuesta';
        if (submitButton) submitButton.textContent = '🚀 Generar Propuesta';
        
        // Limpiar formulario
        if (form) form.reset();
        resetDeliverables();
        
        // Actualizar UI
        updateFormUI();
        
        showLog('📝 Modo creación activado', 'info');
    }
}

export function fillFormWithData(proposalData) {
    const form = document.getElementById('proposalForm');
    if (!form) return;
    
    // Mapeo de campos de la base de datos a campos del formulario
    const fieldMapping = {
        'nombre_proyecto': 'projectName',
        'cliente_nombre': 'clientName', 
        'cliente_empresa': 'clientCompany',
        'fecha_propuesta': 'proposalDate',
        'texto_introductorio': 'introText',
        'resumen_ejecutivo': 'executiveSummary',
        'descripcion_empresa': 'companyDescription',
        'objetivos_alcance': 'objectivesScope',
        'valor_proyecto': 'projectValue',
        'terminos_pago': 'paymentTerms',
        'contacto_email': 'contactEmail',
        'contacto_whatsapp': 'contactWhatsApp',
        'horarios_atencion': 'attentionHours',
        'terminos_condiciones': 'termsConditions',
        'terminos_validez': 'validityTerms',
        'texto_aceptacion': 'acceptanceText'
    };
    
    // Llenar campos de texto
    Object.keys(fieldMapping).forEach(dbField => {
        const formField = fieldMapping[dbField];
        const input = form.querySelector(`[name="${formField}"]`);
        if (input && proposalData[dbField]) {
            input.value = proposalData[dbField];
        }
    });
    
    // Manejar servicios seleccionados
    if (proposalData.servicios_seleccionados && Array.isArray(proposalData.servicios_seleccionados)) {
        // Limpiar todos los checkboxes primero
        form.querySelectorAll('input[name="services"]').forEach(cb => cb.checked = false);
        
        // Marcar los servicios seleccionados
        proposalData.servicios_seleccionados.forEach(service => {
            const checkbox = form.querySelector(`input[name="services"][value="${service}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
    
    // Manejar entregables
    if (proposalData.entregables && Array.isArray(proposalData.entregables)) {
        const deliverablesContainer = document.getElementById('deliverablesList');
        if (deliverablesContainer) {
            deliverablesContainer.innerHTML = '';
            proposalData.entregables.forEach(deliverable => {
                addDeliverableWithValue(deliverable);
            });
        }
    }
}

export function addDeliverable() {
    addDeliverableWithValue('');
}

export function addDeliverableWithValue(value = '') {
    const container = document.getElementById('deliverablesList');
    if (!container) return;
    
    const newItem = document.createElement('div');
    newItem.className = 'deliverable-item';
    newItem.innerHTML = `
        <input type="text" name="deliverables[]" placeholder="Nuevo entregable" value="${value}" required>
        <button type="button" class="btn btn-danger btn-small" data-action="remove-deliverable">❌</button>
    `;
    container.appendChild(newItem);
}

export function removeDeliverable(button) {
    const items = document.querySelectorAll('.deliverable-item');
    if (items.length > 1) {
        button.parentElement.remove();
    }
}

export function resetDeliverables() {
    const container = document.getElementById('deliverablesList');
    if (container) {
        container.innerHTML = `
            <div class="deliverable-item">
                <input type="text" name="deliverables[]" placeholder="Entregable 1" required>
                <button type="button" class="btn btn-danger btn-small" data-action="remove-deliverable">❌</button>
            </div>
        `;
    }
}

export function cancelEdit() {
    setFormMode('create');
    showLog('❌ Edición cancelada', 'info');
}

export function updateFormUI() {
    const cancelBtn = document.getElementById('cancelEditBtn');
    if (cancelBtn) {
        cancelBtn.style.display = isEditMode ? 'inline-block' : 'none';
    }
}

export function addCancelEditButton() {
    const form = document.getElementById('proposalForm');
    if (!form) return;
    
    // Buscar si ya existe el botón
    if (document.getElementById('cancelEditBtn')) return;
    
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.id = 'cancelEditBtn';
        cancelButton.className = 'btn btn-secondary';
        cancelButton.textContent = '❌ Cancelar Edición';
        cancelButton.style.display = 'none';
        cancelButton.style.marginLeft = '10px';
        
        cancelButton.addEventListener('click', cancelEdit);
        
        submitButton.parentNode.insertBefore(cancelButton, submitButton.nextSibling);
    }
}

// Función para recopilar datos del formulario
export function collectFormData(form) {
    showLog('📝 Recopilando datos del formulario...', 'info');
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Procesar servicios seleccionados
    data.servicios_seleccionados = Array.from(form.querySelectorAll('input[name="services"]:checked')).map(cb => cb.value);
    showLog(`🔧 Servicios: ${data.servicios_seleccionados.join(', ')}`, 'info');
    
    // Procesar entregables
    data.entregables = Array.from(form.querySelectorAll('input[name="deliverables[]"]')).map(input => input.value).filter(value => value.trim() !== '');
    showLog(`📦 Entregables: ${data.entregables.length} items`, 'info');
    
    // Mapear a estructura de Supabase
    return {
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
}

// Funciones para manejar la creación y actualización de propuestas
export async function handleCreateProposal(form, db) {
    showLog('🚀 Iniciando proceso de creación de propuesta...', 'info');
    
    if (!db) {
        showLog('❌ Base de datos no inicializada', 'error');
        showError('Base de datos no inicializada');
        return;
    }
    
    try {
        const proposalData = collectFormData(form);
        
        showLog('💾 Guardando nueva propuesta...', 'info');
        const startTime = Date.now();
        
        const savedProposal = await db.saveProposal(proposalData);
        const duration = Date.now() - startTime;
        
        showLog(`✅ Propuesta creada exitosamente en ${duration}ms`, 'success');
        showLog(`🔑 Código: ${savedProposal.codigo_propuesta}`, 'success');
        
        const proposalUrl = `${window.location.origin}/${savedProposal.codigo_propuesta}`;
        showSuccess(`¡Propuesta creada! Código: ${savedProposal.codigo_propuesta}`);
        showProposalLink(proposalUrl, savedProposal.codigo_propuesta);
        startAutoRedirect(proposalUrl, 3);
        
        // Limpiar formulario
        form.reset();
        resetDeliverables();
        
        setTimeout(() => {
            const successMessage = document.getElementById('successMessage');
            if (successMessage) {
                successMessage.style.display = 'none';
            }
        }, 5000);
        
    } catch (error) {
        showLog(`❌ Error creando propuesta: ${error.message}`, 'error');
        showError(`Error creando la propuesta: ${error.message}`);
    }
}

export async function handleUpdateProposal(form, db) {
    showLog('💾 Iniciando actualización de propuesta...', 'info');
    
    if (!db || !currentEditingProposal) {
        showError('No hay propuesta para actualizar');
        return;
    }
    
    try {
        const proposalData = collectFormData(form);
        
        showLog('💾 Actualizando propuesta...', 'info');
        const startTime = Date.now();
        
        const updatedProposal = await db.updateProposal(currentEditingProposal.id, proposalData);
        const duration = Date.now() - startTime;
        
        showLog(`✅ Propuesta actualizada exitosamente en ${duration}ms`, 'success');
        
        const proposalUrl = `${window.location.origin}/${currentEditingProposal.codigo_propuesta}`;
        showSuccess(`¡Propuesta actualizada! Código: ${currentEditingProposal.codigo_propuesta}`);
        showProposalLink(proposalUrl, currentEditingProposal.codigo_propuesta);
        
        // Volver al modo creación (la lista se actualizará al cambiar de pestaña)
        setFormMode('create');
        
        setTimeout(() => {
            const successMessage = document.getElementById('successMessage');
            if (successMessage) {
                successMessage.style.display = 'none';
            }
        }, 5000);
        
    } catch (error) {
        showLog(`❌ Error actualizando propuesta: ${error.message}`, 'error');
        showError(`Error actualizando la propuesta: ${error.message}`);
    }
}

// Getter para saber si estamos en modo edición
export function getIsEditMode() {
    return isEditMode;
}

// Getter para obtener la propuesta en edición
export function getCurrentEditingProposal() {
    return currentEditingProposal;
}