// Sistema de Propuestas Dinámicas Cloud Pixels
// Este archivo maneja la carga dinámica de propuestas desde Supabase

class DynamicProposalLoader {
    constructor() {
        this.db = null;
        this.proposalData = null;
        this.init();
    }

    async init() {
        // Inicializar Supabase
        try {
            this.db = new SupabaseClient();
            await this.db.init();
            
            // Obtener el código de propuesta de la URL
            const urlParams = new URLSearchParams(window.location.search);
            const proposalCode = urlParams.get('propuesta') || urlParams.get('code');
            
            if (proposalCode) {
                await this.loadProposal(proposalCode);
            } else {
                this.showError('No se especificó un código de propuesta válido');
            }
        } catch (error) {
            console.error('Error inicializando Supabase:', error);
            this.showError('Error conectando con la base de datos');
        }
    }

    async loadProposal(proposalCode) {
        try {
            // Buscar la propuesta en Supabase
            const proposal = await this.db.getProposalByCode(proposalCode);
            
            if (!proposal) {
                this.showError('Propuesta no encontrada');
                return;
            }

            this.proposalData = proposal;
            this.populateProposal();
            
        } catch (error) {
            console.error('Error al cargar la propuesta:', error);
            this.showError('Error al cargar la propuesta');
        }
    }

    populateProposal() {
        if (!this.proposalData) return;

        // Información básica del proyecto
        this.setElementText('project-name', this.proposalData.nombre_proyecto);
        this.setElementText('client-person', this.proposalData.cliente_nombre);
        this.setElementText('client-company', this.proposalData.cliente_empresa);
        this.setElementText('proposal-date-value', this.formatDate(this.proposalData.fecha_propuesta));
        
        // Texto introductorio
        this.setElementText('hero-intro-text', this.proposalData.texto_introductorio || 
            'Soluciones creativas para impulsar tu presencia digital con diseño, desarrollo, branding y estrategias de marketing.');
        
        // Resumen ejecutivo
        this.setElementText('executive-summary', this.proposalData.resumen_ejecutivo);
        
        // Descripción de la empresa
        this.setElementText('company-description', this.proposalData.descripcion_empresa || 
            'Con más de 9 años de experiencia, Cloud Pixels es un equipo global con oficinas en Honduras, Estados Unidos, Estonia y Panamá. Combinamos talento de diseño y desarrollo de todo el mundo para crear soluciones digitales excepcionales y escalables.');
        
        // Objetivos y alcance
        this.setElementText('objectives-scope', this.proposalData.objetivos_alcance);
        
        // Servicios (generar dinámicamente)
        this.populateServices();
        
        // Entregables (generar dinámicamente)
        this.populateDeliverables();
        
        // Timeline del proceso
        this.populateTimeline();
        
        // Propuesta económica
        this.setElementText('project-price', this.proposalData.valor_proyecto);
        this.populatePaymentTerms();
        
        // Horarios de atención
        this.setElementText('business-hours', this.proposalData.horarios_atencion || 
            'Nuestro equipo está disponible de lunes a viernes de 9:00 a.m. a 6:00 p.m. (aplican días feriados). Para consultas fuera de este horario, responderemos al siguiente día laboral.');
        
        // Información de contacto
        this.setElementText('contact-email', this.proposalData.contacto_email || 'tu.correo@cloudpixels.com');
        this.setElementText('contact-whatsapp', this.proposalData.contacto_whatsapp || '+XX XXX XXX XXXX');
        
        // Términos y condiciones
        this.setElementText('terms-conditions', this.proposalData.terminos_condiciones || 
            'Al aceptar esta propuesta, el cliente se compromete a abonar un anticipo del 50% para iniciar el proyecto. El saldo restante se pagará al finalizar, antes del lanzamiento.');
        
        this.setElementText('terms-validity', this.proposalData.terminos_validez || 
            'Esta propuesta es válida durante 30 días a partir de la fecha de emisión. Los servicios de mantenimiento, hosting o funcionalidades adicionales no mencionadas aquí se considerarán extras opcionales.');
        
        // Texto de aceptación
        this.setElementText('acceptance-text', this.proposalData.texto_aceptacion || 
            '¿Listo para comenzar? Haz clic en el botón de abajo para aceptar la propuesta. Podrás firmar digitalmente y realizar el pago inicial.');
    }

    populateServices() {
        const servicesGrid = document.getElementById('services-grid');
        if (!servicesGrid || !this.proposalData.servicios_seleccionados) return;

        const serviceData = {
            'Website Design': { icon: '🖥️', description: 'Diseño completo y responsive para tu sitio web, optimizado para conversión y experiencia de usuario.' },
            'Landing Page': { icon: '📄', description: 'Páginas de aterrizaje enfocadas en conversiones, integradas con campañas de marketing.' },
            'Logo & Branding': { icon: '🎨', description: 'Desarrollo de identidad visual, logos e imagen corporativa para fortalecer tu marca.' },
            'Email Marketing': { icon: '✉️', description: 'Diseño y automatización de campañas de email marketing efectivas.' },
            'SEO Review & Consulting': { icon: '🔍', description: 'Análisis SEO detallado y recomendaciones para mejorar tu posicionamiento en buscadores.' },
            'Ecommerce Site': { icon: '🛒', description: 'Desarrollo e integración de tiendas en línea con pasarelas de pago y gestión de productos.' }
        };

        const servicesHTML = this.proposalData.servicios_seleccionados.map(service => {
            if (serviceData[service]) {
                return `
                    <div class="service-card">
                        <div class="icon">${serviceData[service].icon}</div>
                        <h3>${service}</h3>
                        <p>${serviceData[service].description}</p>
                    </div>
                `;
            }
            return '';
        }).join('');

        servicesGrid.innerHTML = servicesHTML;
    }

    populateDeliverables() {
        const deliverablesList = document.getElementById('deliverables-list');
        if (!deliverablesList || !this.proposalData.entregables) return;

        const deliverablesHTML = this.proposalData.entregables.map(deliverable => 
            `<li>${deliverable}</li>`
        ).join('');

        deliverablesList.innerHTML = deliverablesHTML;
    }

    populateTimeline() {
        const timeline = document.getElementById('process-timeline');
        if (!timeline || !this.proposalData.processTimeline) return;

        const timelineHTML = this.proposalData.processTimeline.map(phase => `
            <div class="timeline-item">
                <div class="circle"></div>
                <h4>${phase.title}<br><small>(${phase.duration})</small></h4>
                <p>${phase.description}</p>
            </div>
        `).join('');

        timeline.innerHTML = timelineHTML;
    }

    populatePaymentTerms() {
        const paymentTerms = document.getElementById('payment-terms');
        if (!paymentTerms || !this.proposalData.terminos_pago) return;

        const termsHTML = this.proposalData.terminos_pago.split('\n').map(term => 
            `<li>${term.trim()}</li>`
        ).join('');

        paymentTerms.innerHTML = termsHTML;
    }

    setElementText(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
        }
    }

    formatDate(dateString) {
        if (!dateString) return 'DD/MM/AAAA';
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    showError(message) {
        const body = document.body;
        body.innerHTML = `
            <div style="
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                font-family: Arial, sans-serif;
                background: linear-gradient(135deg, #08002B 0%, #CC3983 100%);
                color: white;
                text-align: center;
            ">
                <div>
                    <h1 style="font-size: 2.5em; margin-bottom: 20px;">⚠️ Error</h1>
                    <p style="font-size: 1.2em; margin-bottom: 30px;">${message}</p>
                    <p style="font-size: 1em; opacity: 0.8;">
                        Verifica que el enlace sea correcto o contacta al administrador.
                    </p>
                </div>
            </div>
        `;
    }
}



// Inicializar el cargador de propuestas dinámicas cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    new DynamicProposalLoader();
});
