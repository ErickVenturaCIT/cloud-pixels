// ui-helpers.js - Funciones para manejo de UI, logs y interfaz

// Funciones de UI
export function showTab(tabName) {
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

    // Si es la pestaña de lista, la lista ya está renderizada por el componente ProposalsList.astro
    if (tabName === 'list') {
        // No es necesario cargar propuestas dinámicamente, ya están renderizadas por el componente Astro
    }
}

export function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    const successElement = document.getElementById('successMessage');
    if (successElement) {
        successElement.style.display = 'none';
    }
    
    console.error('❌ ERROR:', message);
}

export function showSuccess(message) {
    const successElement = document.getElementById('successContent');
    if (successElement) {
        successElement.textContent = message;
    }
    
    const successContainer = document.getElementById('successMessage');
    if (successContainer) {
        successContainer.style.display = 'block';
    }
    
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
    
    console.log('✅ ÉXITO:', message);
}

export function showProposalLink(proposalUrl, proposalCode) {
    // Mostrar la sección del enlace
    const linkSection = document.getElementById('proposalLinkSection');
    if (linkSection) {
        linkSection.style.display = 'block';
    }
    
    // Configurar el botón de abrir propuesta
    const openBtn = document.getElementById('openProposalBtn');
    if (openBtn) {
        openBtn.href = proposalUrl;
        openBtn.onclick = function(e) {
            e.preventDefault();
            window.open(proposalUrl, '_blank');
            showLog('🚀 Propuesta abierta manualmente', 'success');
        };
    }
    
    // Mostrar el código de la propuesta
    const codeDisplay = document.getElementById('proposalCodeDisplay');
    if (codeDisplay) {
        codeDisplay.textContent = proposalCode;
    }
    
    // Guardar la URL para poder copiarla
    window.currentProposalUrl = proposalUrl;
}

export function startAutoRedirect(proposalUrl, seconds) {
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

export function copyProposalLink() {
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
        
        alert('¡Enlace copiado al portapapeles!\\n\\n' + window.currentProposalUrl);
    });
}

// Sistema de logs
export function showLog(message, type = 'info') {
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

export function clearLogs() {
    const logsContent = document.getElementById('logsContent');
    if (!logsContent) return;
    
    logsContent.innerHTML = `
        <div class="log-entry log-info">
            <span class="log-time">[Sistema]</span>
            <span class="log-message">Logs limpiados. Panel reiniciado.</span>
        </div>
    `;
}

export function exportLogs() {
    const logsContent = document.getElementById('logsContent');
    if (!logsContent) return;
    
    const logs = Array.from(logsContent.children).map(log => {
        const time = log.querySelector('.log-time').textContent;
        const message = log.querySelector('.log-message').textContent;
        return `${time} ${message}`;
    }).join('\\n');
    
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

// Funciones para modales
export function closeModal() {
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.style.display = 'none';
    }
}

export function closePreviewModal() {
    const previewModal = document.getElementById('previewModal');
    if (previewModal) {
        previewModal.style.display = 'none';
    }
}