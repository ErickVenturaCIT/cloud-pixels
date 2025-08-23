// Tipos para el Dashboard de Administración de Cloud Pixels

export interface ProposalData {
    id?: number;
    codigo_propuesta?: string;
    nombre_proyecto: string;
    cliente_nombre: string;
    cliente_empresa: string;
    fecha_propuesta: string;
    texto_introductorio?: string;
    resumen_ejecutivo: string;
    descripcion_empresa?: string;
    objetivos_alcance: string;
    servicios_seleccionados: string[];
    entregables: string[];
    proceso_timeline?: TimelineItem[];
    valor_proyecto: string;
    terminos_pago: string;
    contacto_email?: string;
    contacto_whatsapp?: string;
    horarios_atencion?: string;
    terminos_condiciones?: string;
    terminos_validez?: string;
    texto_aceptacion?: string;
    created_at?: string;
}

export interface TimelineItem {
    title: string;
    duration: string;
    description: string;
}

export interface LogEntry {
    timestamp: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

export interface SupabaseResponse<T> {
    data: T | null;
    error: any;
}

// Tipos para los servicios
export type ServiceType = 
    | 'Website Design'
    | 'Landing Page'
    | 'Logo & Branding'
    | 'Email Marketing'
    | 'SEO Review & Consulting'
    | 'Ecommerce Site';

// Tipos para el estado del formulario
export interface FormState {
    isSubmitting: boolean;
    isValid: boolean;
    errors: Record<string, string>;
}

// Tipos para las acciones de propuestas
export interface ProposalAction {
    id: string;
    type: 'view' | 'edit' | 'delete' | 'preview' | 'copy';
    label: string;
    icon: string;
    onClick: (proposalId: string) => void;
}
