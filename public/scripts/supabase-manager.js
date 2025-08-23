// supabase-manager.js - Manejo de operaciones de Supabase y gestión de propuestas

import { showLog, showError } from './ui-helpers.js';

// Variable global para la instancia de base de datos
let db = null;

// Inicializar Supabase cuando se carga la página
export async function initSupabase() {
    showLog('🔧 Iniciando inicialización de base de datos...', 'info');
    
    try {
        showLog('📡 Verificando servicio de Supabase...', 'info');
        
        // Importar el servicio de Supabase
        try {
            const { PropuestasService } = await import('/scripts/supabase-client.js');
            db = PropuestasService;
            showLog('✅ PropuestasService importado correctamente', 'success');
        } catch (importError) {
            showLog('❌ Error importando PropuestasService, usando mock', 'warning');
            db = createMockService();
        }
        
        showLog('🔌 Conectando a Supabase...', 'info');
        const startTime = Date.now();
        
        // Probar la conexión haciendo una consulta simple
        try {
            const proposals = await db.getAllProposals();
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            showLog(`✅ Conexión exitosa a Supabase (${responseTime}ms)`, 'success');
            showLog(`📊 ${proposals.length || 0} propuestas encontradas`, 'info');
            
        } catch (error) {
            showLog(`❌ Error de conexión: ${error.message}`, 'error');
            showLog('🔧 Verificando configuración de Supabase...', 'info');
            
            // Verificar si las credenciales están configuradas
            if (typeof window !== 'undefined') {
                const envUrl = window.location.hostname === 'localhost' ? 'localhost' : 'deploy';
                showLog(`🌐 Entorno detectado: ${envUrl}`, 'info');
                
                if (envUrl === 'deploy') {
                    showLog('⚠️ En deploy, verifica que las variables de entorno estén configuradas', 'warning');
                    showLog('📝 PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_ANON_KEY', 'info');
                }
            }
        }
        
    } catch (error) {
        showLog(`❌ Error en inicialización: ${error.message}`, 'error');
        db = createMockService();
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
        getProposalByCode: async (code) => {
            return {
                id: 'mock-1',
                codigo_propuesta: code,
                nombre_proyecto: 'Proyecto Mock',
                cliente_nombre: 'Cliente Mock',
                cliente_empresa: 'Empresa Mock'
            };
        },
        saveProposal: async (data) => {
            return { ...data, id: 'mock-' + Date.now(), codigo_propuesta: 'CP-MOCK-' + Date.now() };
        },
        updateProposal: async (id, data) => {
            return { ...data, id: id };
        },
        deleteProposal: async (id) => {
            return true;
        }
    };
}

// DEPRECATED: Función para cargar la lista de propuestas (ahora se usa componente ProposalsList.astro)
// export async function loadProposalsList() {
//     // Esta función ya no es necesaria porque usamos el componente ProposalsList.astro
//     // que renderiza la lista directamente en el servidor
// }

// Función para editar una propuesta
export async function editProposal(proposalId) {
    if (!db) return;
    
    try {
        showLog('🔍 Cargando propuesta para editar...', 'info');
        
        // Obtener la propuesta completa por ID
        const proposal = await db.getProposalById(proposalId);
        if (!proposal) {
            showError('No se encontró la propuesta');
            return;
        }
        
        // Si necesitamos más datos, obtener por código
        let fullProposal = proposal;
        if (proposal.codigo_propuesta) {
            try {
                const detailedProposal = await db.getProposalByCode(proposal.codigo_propuesta);
                if (detailedProposal) {
                    fullProposal = detailedProposal;
                }
            } catch (error) {
                showLog('⚠️ No se pudieron cargar los detalles completos, usando datos básicos', 'warning');
            }
        }
        
        // Activar modo edición y llenar formulario
        if (window.setFormMode) {
            window.setFormMode('edit', fullProposal);
        }
        
        showLog('✅ Propuesta cargada para edición', 'success');
        
    } catch (error) {
        showLog(`❌ Error cargando propuesta: ${error.message}`, 'error');
        showError('Error cargando la propuesta para editar');
    }
}

// Función para mostrar vista previa de una propuesta
export async function previewProposal(proposalId) {
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
        
        const previewContentDiv = document.getElementById('previewContent');
        const previewModal = document.getElementById('previewModal');
        
        if (previewContentDiv) {
            previewContentDiv.innerHTML = previewContent;
        }
        if (previewModal) {
            previewModal.style.display = 'block';
        }
    } catch (error) {
        console.error('Error cargando propuesta:', error);
        showError('Error cargando la propuesta');
    }
}

// Función para eliminar una propuesta
export async function deleteProposal(proposalId) {
    if (!db) return;
    
    if (confirm('¿Estás seguro de que quieres eliminar esta propuesta? Esta acción no se puede deshacer.')) {
        try {
            await db.deleteProposal(proposalId);
            // No recargar automáticamente - solo mostrar mensaje
            showLog('✅ Operación completada. La lista se actualizará al cambiar de pestaña.', 'success');
            showLog('✅ Propuesta eliminada exitosamente', 'success');
        } catch (error) {
            console.error('Error eliminando propuesta:', error);
            showError('Error eliminando la propuesta');
        }
    }
}

// Función para abrir una propuesta
export function openProposal(proposalCode) {
    if (!proposalCode) {
        alert('Esta propuesta no tiene un código válido');
        return;
    }

    const proposalUrl = `${window.location.origin}/${proposalCode}`;
    
    // Abrir la propuesta en una nueva pestaña
    window.open(proposalUrl, '_blank');
    
    showLog(`🚀 Propuesta abierta en nueva pestaña: ${proposalCode}`, 'success');
}

// Función para copiar enlace de propuesta por código
export function copyProposalLinkFromCode(proposalCode) {
    if (!proposalCode) {
        alert('Esta propuesta no tiene un código válido');
        return;
    }

    const proposalUrl = `${window.location.origin}/${proposalCode}`;
    
    navigator.clipboard.writeText(proposalUrl).then(() => {
        alert('¡Enlace copiado al portapapeles!\\n\\n' + proposalUrl);
    }).catch(() => {
        // Fallback para navegadores que no soportan clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = proposalUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('¡Enlace copiado al portapapeles!\\n\\n' + proposalUrl);
    });
}

// Getter para obtener la instancia de la base de datos
export function getDatabase() {
    return db;
}

// Hacer las funciones disponibles globalmente para compatibilidad
if (typeof window !== 'undefined') {
    // window.loadProposalsList = loadProposalsList; // DEPRECATED
    window.editProposal = editProposal;
    window.previewProposal = previewProposal;
    window.deleteProposal = deleteProposal;
    window.openProposal = openProposal;
    window.copyProposalLinkFromCode = copyProposalLinkFromCode;
}