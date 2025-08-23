// Exportar todos los scripts principales
export { initPropuestas } from './propuestas';
export { initCrearPropuesta } from './crear-propuesta';
export { initDashboard } from './dashboard';

// Re-exportar funciones específicas si es necesario
export { viewDetails, closeModal, editProposal, deleteProposal } from './propuestas';
export { clearForm, previewProposal } from './crear-propuesta';
export { refreshStats } from './dashboard';
