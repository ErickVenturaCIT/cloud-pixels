// admin-main.js - Archivo principal que coordina todos los módulos del admin

import { 
    showTab, 
    showError, 
    showSuccess, 
    showLog, 
    clearLogs, 
    exportLogs, 
    closeModal, 
    closePreviewModal 
} from './ui-helpers.js';

import { 
    setFormMode, 
    addDeliverable, 
    removeDeliverable, 
    cancelEdit, 
    addCancelEditButton, 
    handleCreateProposal, 
    handleUpdateProposal, 
    getIsEditMode 
} from './form-manager.js';

import { 
    initSupabase, 
    // loadProposalsList, // DEPRECATED - usando componente ProposalsList.astro
    editProposal, 
    previewProposal, 
    deleteProposal, 
    openProposal, 
    copyProposalLinkFromCode, 
    getDatabase 
} from './supabase-manager.js';

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

// Inicialización principal cuando el DOM está listo
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
    showLog('📱 Versión: 3.0 - Panel de Administración Modular', 'info');
    showLog('🌐 Navegador: ' + navigator.userAgent.split(' ')[0], 'info');
    showLog('⏰ Fecha: ' + new Date().toLocaleDateString('es-ES'), 'info');
    
    initSupabase();
});

// Hacer funciones disponibles globalmente para compatibilidad
if (typeof window !== 'undefined') {
    window.showTab = showTab;
    window.setFormMode = setFormMode;
    // window.loadProposalsList = loadProposalsList; // DEPRECATED
}