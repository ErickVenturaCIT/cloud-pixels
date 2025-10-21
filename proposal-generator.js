// Generador de Propuestas Cloud Pixels
// Este archivo contiene la lógica para generar propuestas HTML personalizadas

function generateProposalHTML(data) {
    // Leer la plantilla base
    const template = getBaseTemplate();
    
    // Reemplazar todos los campos dinámicos usando un enfoque más directo
    let html = template;
    
    // Información básica del proyecto
    html = html.replace('>Nombre del Proyecto<', `>${data.nombre_proyecto || 'Nombre del Proyecto'}<`);
    html = html.replace('>Persona del Cliente<', `>${data.cliente_nombre || 'Persona del Cliente'}<`);
    html = html.replace('>Empresa del Cliente<', `>${data.cliente_empresa || 'Empresa del Cliente'}<`);
    html = html.replace('>DD/MM/AAAA<', `>${formatDate(data.fecha_propuesta) || 'DD/MM/AAAA'}<`);
    
    // Texto introductorio
    html = html.replace('>Soluciones creativas para impulsar tu presencia digital con diseño, desarrollo, branding y estrategias de marketing.<', 
        `>${data.texto_introductorio || 'Soluciones creativas para impulsar tu presencia digital con diseño, desarrollo, branding y estrategias de marketing.'}<`);
    
    // Resumen ejecutivo
    html = html.replace('>Esta sección ofrece una visión general del proyecto y debe adaptarse a cada cliente. Describe brevemente los retos que enfrenta la empresa y cómo tus servicios ayudarán a resolverlos. Explica tu propuesta de valor de manera concisa para enganchar al lector desde el principio.<', 
        `>${data.resumen_ejecutivo || 'Esta sección ofrece una visión general del proyecto y debe adaptarse a cada cliente.'}<`);
    
    // Descripción de la empresa
    html = html.replace('>Con más de 9&nbsp;años de experiencia, Cloud Pixels es un equipo global con oficinas en Honduras, Estados&nbsp;Unidos, Estonia y Panamá. Combinamos talento de diseño y desarrollo de todo el mundo para crear soluciones digitales excepcionales y escalables. Nuestro enfoque se centra en resultados tangibles y experiencias memorables para tus clientes. Trabajamos de forma colaborativa y cercana para adaptarnos a tus necesidades y crear productos digitales de gran impacto.<', 
        `>${data.descripcion_empresa || 'Con más de 9 años de experiencia, Cloud Pixels es un equipo global con oficinas en Honduras, Estados Unidos, Estonia y Panamá. Combinamos talento de diseño y desarrollo de todo el mundo para crear soluciones digitales excepcionales y escalables.'}<`);
    
    // Objetivos y alcance
    html = html.replace('>Describe en esta sección los objetivos específicos del proyecto y el alcance del trabajo. Por ejemplo, puedes mencionar la mejora de la presencia digital, el aumento de conversiones o la expansión del alcance de la marca. Aclara también las funcionalidades y servicios que estarán incluidos, así como aquellos que quedan fuera del alcance.<', 
        `>${data.objetivos_alcance || 'Describe en esta sección los objetivos específicos del proyecto y el alcance del trabajo.'}<`);
    
    // Servicios (filtrar solo los seleccionados)
    html = html.replace(/<div class="services-grid" id="services-grid" data-configurable="true">[\s\S]*?<\/div>/s, 
        generateServicesHTML(data.servicios_seleccionados));
    
    // Entregables
    html = html.replace(/<ul class="deliverables-list" id="deliverables-list" data-configurable="true">[\s\S]*?<\/ul>/s, 
        generateDeliverablesHTML(data.entregables));
    
    // Timeline del proceso
    html = html.replace(/<div class="timeline" id="process-timeline" data-configurable="true">[\s\S]*?<\/div>/s, 
        generateTimelineHTML(data.proceso_timeline));
    
    // Propuesta económica
    html = html.replace('>$X,XXX<', `>${data.valor_proyecto || '$X,XXX'}<`);
    
    // Condiciones de pago
    html = html.replace(/<ul id="payment-terms" data-configurable="true">[\s\S]*?<\/ul>/s, 
        generatePaymentTermsHTML(data.terminos_pago));
    
    // Horarios de atención
    html = html.replace('>Nuestro equipo está disponible de lunes a viernes de 9:00&nbsp;a.m. a 6:00&nbsp;p.m. (aplican días feriados). Para consultas fuera de este horario, responderemos al siguiente día laboral.<', 
        `>${data.horarios_atencion || 'Nuestro equipo está disponible de lunes a viernes de 9:00 a.m. a 6:00 p.m. (aplican días feriados). Para consultas fuera de este horario, responderemos al siguiente día laboral.'}<`);
    
    // Información de contacto
    html = html.replace('>tu.correo@cloudpixels.com<', `>${data.contacto_email || 'tu.correo@cloudpixels.com'}<`);
    html = html.replace('>+XX&nbsp;XXX&nbsp;XXX&nbsp;XXXX<', `>${data.contacto_whatsapp || '+XX XXX XXX XXXX'}<`);
    
    // Términos y condiciones
    html = html.replace('>Al aceptar esta propuesta, el cliente se compromete a abonar un anticipo del 50% para iniciar el proyecto. El saldo restante se pagará al finalizar, antes del lanzamiento. Cualquier modificación fuera del alcance definido se cotizará aparte. La propiedad intelectual de los entregables se transfiere al cliente una vez realizado el pago total.<', 
        `>${data.terminos_condiciones || 'Al aceptar esta propuesta, el cliente se compromete a abonar un anticipo del 50% para iniciar el proyecto. El saldo restante se pagará al finalizar, antes del lanzamiento.'}<`);
    
    html = html.replace('>Esta propuesta es válida durante 30&nbsp;días a partir de la fecha de emisión. Los servicios de mantenimiento, hosting o funcionalidades adicionales no mencionadas aquí se considerarán extras opcionales y se presupuestarán por separado.<', 
        `>${data.terminos_validez || 'Esta propuesta es válida durante 30 días a partir de la fecha de emisión. Los servicios de mantenimiento, hosting o funcionalidades adicionales no mencionadas aquí se considerarán extras opcionales.'}<`);
    
    // Texto de aceptación
    html = html.replace('>¿Listo para comenzar? Haz clic en el botón de abajo para aceptar la propuesta. Podrás firmar digitalmente y realizar el pago inicial. Posteriormente, te enviaremos las credenciales para acceder a tu panel de cliente, donde podrás seguir el avance del proyecto, revisar facturas y descargar entregables.<', 
        `>${data.texto_aceptacion || '¿Listo para comenzar? Haz clic en el botón de abajo para aceptar la propuesta. Podrás firmar digitalmente y realizar el pago inicial.'}<`);
    
    return html;
}

// Función para obtener la plantilla base usando el contenido exacto del archivo
function getBaseTemplate() {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Propuesta Cloud Pixels</title>
    <!-- Google Fonts: Liebling for headings and Manrope for body text -->
    <link href="https://fonts.googleapis.com/css2?family=Liebling:wght@400;700&family=Manrope:wght@300;400;600;700;800&display=swap" rel="stylesheet">
    <style>
        /*
         * Versión 3 de la propuesta de Cloud Pixels
         *
         * Esta plantilla incorpora las mejoras solicitadas: uso del logo adjunto en la barra de navegación,
         * secciones claramente editables (Resumen, Objetivos & Alcance, Entregables, Proceso, Propuesta Económica,
         * Horarios de atención y canales de comunicación) y nueva copia para la sección "¿Por qué Cloud Pixels?".
         * La estructura sigue las recomendaciones de propuestas modernas de Webflow【931404632822730†L299-L347】.
         * Se mantienen los colores y tipografías especificadas en las guías de marca【915977023511791†L237-L256】【915977023511791†L176-L224】.
         */
        :root {
            --primary: #08002B; /* Oxford Blue */
            --accent: #F27E2A; /* Safety Orange */
            --secondary: #5AB9D5; /* Aero Blue */
            --pink: #CC3983; /* Pantone Magenta */
            --light-bg: #F9FAFB;
            --font-heading: 'Liebling', sans-serif;
            --font-body: 'Manrope', sans-serif;
        }

        body {
            margin: 0;
            font-family: var(--font-body);
            color: var(--primary);
            line-height: 1.6;
            scroll-behavior: smooth;
            background-color: #FFFFFF;
        }

        /* Navegación fija */
        header {
            position: sticky;
            top: 0;
            width: 100%;
            background: rgba(8, 0, 43, 0.85);
            backdrop-filter: blur(6px);
            z-index: 1000;
        }
        header nav {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 20px;
        }
        header .brand-logo img {
            height: 40px;
            margin-top: 2px;
        }
        header .brand-logo a {
            text-decoration: none;
        }
        header ul {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            gap: 24px;
        }
        header ul li a {
            color: #FFFFFF;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: color 0.3s ease;
        }
        header ul li a:hover {
            color: var(--accent);
        }
        header ul li a.active {
            color: var(--accent);
            position: relative;
        }
        header ul li a.active::after {
            content: '';
            position: absolute;
            bottom: -14px;
            left: 50%;
            transform: translateX(-50%);
            width: 20px;
            height: 2px;
            background-color: var(--accent);
        }

        /* Hero */
        .hero {
            background: linear-gradient(135deg, var(--primary) 0%, var(--pink) 100%);
            color: #FFFFFF;
            padding: 120px 20px 100px;
            text-align: center;
        }
        .hero h1 {
            font-family: var(--font-heading);
            font-size: 48px;
            margin: 0 0 12px;
            font-weight: 700;
        }
        .hero p {
            font-size: 18px;
            margin: 4px 0;
        }
        .hero .hero-intro {
            max-width: 720px;
            margin: 20px auto 0;
            color: rgba(255, 255, 255, 0.85);
            font-size: 20px;
        }
        .hero .cta {
            display: inline-block;
            margin-top: 60px;
            padding: 14px 32px;
            background-color: var(--accent);
            color: #FFFFFF;
            border-radius: 8px;
            font-weight: 700;
            font-size: 16px;
            text-decoration: none;
            transition: background-color 0.3s ease;
        }
        .hero .cta:hover {
            background-color: #d86621;
        }

        /* Secciones genéricas */
        section.section {
            padding: 80px 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        .section-title {
            font-family: var(--font-heading);
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 20px;
            position: relative;
            display: inline-block;
        }
        .section-title::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: -8px;
            width: 60px;
            height: 4px;
            background-color: var(--accent);
        }
        .section.light {
            background-color: #FFFFFF;
        }
        .section.alt {
            background-color: var(--light-bg);
        }

        /* Tarjetas de servicios */
        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 24px;
            margin-top: 20px;
        }
        .service-card {
            background-color: #FFFFFF;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .service-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }
        .service-card .icon {
            font-size: 32px;
            color: var(--accent);
            margin-bottom: 12px;
        }
        .service-card h3 {
            margin: 0 0 8px;
            font-size: 20px;
            font-weight: 700;
        }
        .service-card p {
            margin: 0;
            font-size: 15px;
            color: #555;
        }

        /* Línea de tiempo horizontal */
        .timeline {
            display: flex;
            flex-wrap: wrap;
            gap: 40px;
            margin-top: 20px;
        }
        .timeline-item {
            flex: 1 1 260px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }
        .timeline-item .circle {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: var(--accent);
            margin-bottom: 12px;
        }
        .timeline-item h4 {
            margin: 0 0 8px;
            font-size: 18px;
            font-weight: 700;
        }
        .timeline-item p {
            margin: 0;
            font-size: 14px;
            color: #555;
        }

        /* Cartas de propuesta económica */
        .pricing-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
            margin-top: 20px;
        }
        .pricing-card {
            border: 1px solid #eaeaea;
            border-radius: 12px;
            padding: 32px;
            text-align: center;
            background-color: #FFFFFF;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .pricing-card.featured {
            border-color: var(--accent);
            transform: scale(1.02);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }
        .pricing-card h3 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
        }
        .pricing-card .price {
            font-size: 32px;
            margin: 12px 0;
            color: var(--primary);
            font-weight: 700;
        }
        .pricing-card ul {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        .pricing-card li {
            margin: 8px 0;
            font-size: 14px;
            color: #555;
        }

        /* Listas de entregables y contactos */
        .deliverables-list,
        .contact-list {
            margin: 0;
            padding-left: 20px;
        }
        .deliverables-list li,
        .contact-list li {
            margin: 6px 0;
            font-size: 14px;
            color: #555;
        }

        /* Contenedor de términos */
        .terms {
            background-color: var(--light-bg);
            border-radius: 12px;
            padding: 32px;
            font-size: 14px;
            color: #555;
            margin-top: 20px;
        }

        /* Sección de aceptación */
        .accept-section {
            text-align: center;
        }
        .accept-section .cta-accept {
            display: inline-block;
            background-color: var(--accent);
            color: #FFFFFF;
            padding: 16px 36px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 18px;
            text-decoration: none;
            margin-top: 24px;
            transition: background-color 0.3s ease;
        }
        .accept-section .cta-accept:hover {
            background-color: #d86621;
        }

        /* Footer */
        footer {
            background-color: var(--primary);
            color: #DAD4E3;
            text-align: center;
            padding: 40px 20px;
        }
        footer p {
            margin: 4px 0;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <!-- Barra de navegación -->
    <header>
        <nav>
            <div class="brand-logo">
                <!-- Logo proporcionado en el archivo adjunto -->
                <a href="#home">
                    <img src="Cloud Pixels.png" alt="Logo Cloud Pixels">
                </a>
            </div>
            <ul>
                <li><a href="#resumen">Resumen</a></li>
                <li><a href="#sobre">Nosotros</a></li>
                <li><a href="#servicios">Servicios</a></li>
                <li><a href="#objetivos">Objetivos</a></li>
                <li><a href="#entregables">Entregables</a></li>
                <li><a href="#proceso">Proceso</a></li>
                <li><a href="#propuesta">Propuesta Económica</a></li>
                <li><a href="#horarios">Horarios</a></li>
                <li><a href="#terminos">Términos</a></li>
                <li><a href="#aceptacion">Aceptar</a></li>
            </ul>
        </nav>
    </header>

    <!-- Hero: información del proyecto -->
    <section class="hero" id="home">
        <!-- CAMPO CONFIGURABLE: Nombre del Proyecto -->
        <h1 id="project-name" data-configurable="true">Nombre del Proyecto</h1>
        
        <!-- CAMPO CONFIGURABLE: Información del Cliente -->
        <p id="client-info" data-configurable="true">
            <strong>Para:</strong> <span id="client-person">Persona del Cliente</span> &nbsp;—&nbsp; <span id="client-company">Empresa del Cliente</span>
        </p>
        
        <!-- CAMPO CONFIGURABLE: Fecha de la Propuesta -->
        <p id="proposal-date" data-configurable="true">
            <strong>Fecha:</strong> <span id="proposal-date-value">DD/MM/AAAA</span>
        </p>
        
        <!-- CAMPO CONFIGURABLE: Texto Introductorio -->
        <p class="hero-intro" id="hero-intro-text" data-configurable="true">
            Soluciones creativas para impulsar tu presencia digital con diseño, desarrollo, branding y estrategias de marketing.
        </p>
        <a class="cta" href="#resumen">Explorar</a>
    </section>

    <!-- Resumen Ejecutivo -->
    <section class="section light" id="resumen">
        <h2 class="section-title">Resumen Ejecutivo</h2>
        <!-- CAMPO CONFIGURABLE: Resumen Ejecutivo -->
        <p id="executive-summary" data-configurable="true">
            Esta sección ofrece una visión general del proyecto y debe adaptarse a cada cliente. Describe brevemente los retos que enfrenta la empresa y cómo tus servicios ayudarán a resolverlos. Explica tu propuesta de valor de manera concisa para enganchar al lector desde el principio.
        </p>
    </section>

    <!-- ¿Por qué Cloud Pixels? -->
    <section class="section alt" id="sobre">
        <h2 class="section-title">¿Por qué Cloud&nbsp;Pixels?</h2>
        <!-- CAMPO CONFIGURABLE: Descripción de la Empresa -->
        <p id="company-description" data-configurable="true">
            Con más de 9&nbsp;años de experiencia, Cloud Pixels es un equipo global con oficinas en Honduras, Estados&nbsp;Unidos, Estonia y Panamá. Combinamos talento de diseño y desarrollo de todo el mundo para crear soluciones digitales excepcionales y escalables. Nuestro enfoque se centra en resultados tangibles y experiencias memorables para tus clientes. Trabajamos de forma colaborativa y cercana para adaptarnos a tus necesidades y crear productos digitales de gran impacto.
        </p>
    </section>

    <!-- Servicios -->
    <section class="section light" id="servicios">
        <h2 class="section-title">Servicios</h2>
        <!-- CAMPO CONFIGURABLE: Grid de Servicios (se genera dinámicamente) -->
        <div class="services-grid" id="services-grid" data-configurable="true">
            <div class="service-card">
                <div class="icon">🖥️</div>
                <h3>Website Design</h3>
                <p>Diseño completo y responsive para tu sitio web, optimizado para conversión y experiencia de usuario.</p>
            </div>
            <div class="service-card">
                <div class="icon">📄</div>
                <h3>Landing Page</h3>
                <p>Páginas de aterrizaje enfocadas en conversiones, integradas con campañas de marketing.</p>
            </div>
            <div class="service-card">
                <div class="icon">🎨</div>
                <h3>Logo &amp; Branding</h3>
                <p>Desarrollo de identidad visual, logos e imagen corporativa para fortalecer tu marca.</p>
            </div>
            <div class="service-card">
                <div class="icon">✉️</div>
                <h3>Email Marketing</h3>
                <p>Diseño y automatización de campañas de email marketing efectivas.</p>
            </div>
            <div class="service-card">
                <div class="icon">🔍</div>
                <h3>SEO Review &amp; Consulting</h3>
                <p>Análisis SEO detallado y recomendaciones para mejorar tu posicionamiento en buscadores.</p>
            </div>
            <div class="service-card">
                <div class="icon">🛒</div>
                <h3>Ecommerce Site</h3>
                <p>Desarrollo e integración de tiendas en línea con pasarelas de pago y gestión de productos.</p>
            </div>
        </div>
    </section>

    <!-- Objetivos y alcance -->
    <section class="section alt" id="objetivos">
        <h2 class="section-title">Objetivos &amp; Alcance</h2>
        <!-- CAMPO CONFIGURABLE: Objetivos y Alcance -->
        <p id="objectives-scope" data-configurable="true">
            Describe en esta sección los objetivos específicos del proyecto y el alcance del trabajo. Por ejemplo, puedes mencionar la mejora de la presencia digital, el aumento de conversiones o la expansión del alcance de la marca. Aclara también las funcionalidades y servicios que estarán incluidos, así como aquellos que quedan fuera del alcance.
        </p>
    </section>

    <!-- Entregables -->
    <section class="section light" id="entregables">
        <h2 class="section-title">Entregables</h2>
        <!-- CAMPO CONFIGURABLE: Lista de Entregables (se genera dinámicamente) -->
        <ul class="deliverables-list" id="deliverables-list" data-configurable="true">
            <li>Diseño UI/UX completo para desktop y mobile</li>
            <li>Desarrollo del sitio web e integraciones necesarias</li>
            <li>Integración de ecommerce y pasarela de pago</li>
            <li>Manual de marca y activos visuales</li>
            <li>Capacitación en video de 30&nbsp;minutos para el equipo</li>
        </ul>
    </section>

    <!-- Proceso & Timeline -->
    <section class="section alt" id="proceso">
        <h2 class="section-title">Proceso &amp; Timeline</h2>
        <!-- CAMPO CONFIGURABLE: Timeline del Proceso (se genera dinámicamente) -->
        <div class="timeline" id="process-timeline" data-configurable="true">
            <div class="timeline-item">
                <div class="circle"></div>
                <h4>Fase&nbsp;1: Brief &amp; Investigación<br><small>(1 semana)</small></h4>
                <p>Recolección de requisitos, análisis de mercado y definición del alcance del proyecto.</p>
            </div>
            <div class="timeline-item">
                <div class="circle"></div>
                <h4>Fase&nbsp;2: Diseño UI/UX<br><small>(1‑2 semanas)</small></h4>
                <p>Creación de wireframes y prototipos visuales, iteraciones según tu feedback.</p>
            </div>
            <div class="timeline-item">
                <div class="circle"></div>
                <h4>Fase&nbsp;3: Desarrollo &amp; Integraciones<br><small>(2‑3 semanas)</small></h4>
                <p>Implementación técnica del sitio, carga de contenido y configuraciones.</p>
            </div>
            <div class="timeline-item">
                <div class="circle"></div>
                <h4>Fase&nbsp;4: Pruebas &amp; Lanzamiento<br><small>(1 semana)</small></h4>
                <p>Revisión final, pruebas de calidad y puesta en línea del proyecto.</p>
            </div>
        </div>
    </section>

    <!-- Propuesta económica -->
    <section class="section light" id="propuesta">
        <h2 class="section-title">Propuesta Económica</h2>
        <p>La inversión total para este proyecto es:</p>
        <div class="pricing-grid">
            <div class="pricing-card featured">
                <h3>Valor del Proyecto</h3>
                <!-- CAMPO CONFIGURABLE: Precio del Proyecto -->
                <div class="price" id="project-price" data-configurable="true">$X,XXX</div>
                <!-- CAMPO CONFIGURABLE: Condiciones de Pago (se genera dinámicamente) -->
                <ul id="payment-terms" data-configurable="true">
                    <li>Incluye todos los servicios y entregables definidos en esta propuesta</li>
                    <li>Pago inicial del 50% al aceptar la propuesta</li>
                    <li>Saldo restante al finalizar el proyecto</li>
                </ul>
            </div>
        </div>
    </section>

    <!-- Horarios de atención y canales de comunicación -->
    <section class="section alt" id="horarios">
        <h2 class="section-title">Horarios de Atención &amp; Canales de Comunicación</h2>
        <!-- CAMPO CONFIGURABLE: Horarios de Atención -->
        <p id="business-hours" data-configurable="true">
            Nuestro equipo está disponible de lunes a viernes de 9:00&nbsp;a.m. a 6:00&nbsp;p.m. (aplican días feriados). Para consultas fuera de este horario, responderemos al siguiente día laboral.
        </p>
        <p>Nos puedes contactar a través de los siguientes canales:</p>
        <!-- CAMPO CONFIGURABLE: Información de Contacto -->
        <ul class="contact-list" id="contact-info" data-configurable="true">
            <li><strong>Email:</strong> <span id="contact-email">tu.correo@cloudpixels.com</span></li>
            <li><strong>WhatsApp:</strong> <span id="contact-whatsapp">+XX&nbsp;XXX&nbsp;XXX&nbsp;XXXX</span></li>
        </ul>
    </section>

    <!-- Términos y condiciones -->
    <section class="section light" id="terminos">
        <h2 class="section-title">Términos &amp; Condiciones</h2>
        <div class="terms">
            <!-- CAMPO CONFIGURABLE: Términos y Condiciones -->
            <p id="terms-conditions" data-configurable="true">
                Al aceptar esta propuesta, el cliente se compromete a abonar un anticipo del 50% para iniciar el proyecto. El saldo restante se pagará al finalizar, antes del lanzamiento. Cualquier modificación fuera del alcance definido se cotizará aparte. La propiedad intelectual de los entregables se transfiere al cliente una vez realizado el pago total.
            </p>
            <p id="terms-validity" data-configurable="true">
                Esta propuesta es válida durante 30&nbsp;días a partir de la fecha de emisión. Los servicios de mantenimiento, hosting o funcionalidades adicionales no mencionadas aquí se considerarán extras opcionales y se presupuestarán por separado.
            </p>
        </div>
    </section>

    <!-- Aceptación y próximos pasos -->
    <section class="section alt accept-section" id="aceptacion">
        <h2 class="section-title">Aceptación &amp; Próximos Pasos</h2>
        <!-- CAMPO CONFIGURABLE: Texto de Aceptación -->
        <p id="acceptance-text" data-configurable="true">
            ¿Listo para comenzar? Haz clic en el botón de abajo para aceptar la propuesta. Podrás firmar digitalmente y realizar el pago inicial. Posteriormente, te enviaremos las credenciales para acceder a tu panel de cliente, donde podrás seguir el avance del proyecto, revisar facturas y descargar entregables.
        </p>
        <a class="cta-accept" href="#">Aceptar Propuesta</a>
    </section>

    <!-- Footer -->
    <footer>
        <p>© 2025 Cloud Pixels. Todos los derechos reservados.</p>
    </footer>

    <script>
        // Función para actualizar la navegación activa
        function updateActiveNav() {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('header nav ul li a');
            
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        }
        
        // Ejecutar al cargar la página
        document.addEventListener('DOMContentLoaded', updateActiveNav);
        
        // Ejecutar al hacer scroll
        window.addEventListener('scroll', updateActiveNav);
        
        // Ejecutar al hacer clic en los enlaces de navegación
        document.querySelectorAll('header nav ul li a').forEach(link => {
            link.addEventListener('click', function(e) {
                // Remover clase active de todos los enlaces
                document.querySelectorAll('header nav ul li a').forEach(l => l.classList.remove('active'));
                // Agregar clase active al enlace clickeado
                this.classList.add('active');
            });
        });
    </script>
    
    <!-- Script para cargar propuestas dinámicamente -->
    <script src="dynamic-proposal.js"></script>
</body>
</html>`;
}

function generateServicesHTML(selectedServices) {
    const serviceData = {
        'Website Design': { icon: '🖥️', description: 'Diseño completo y responsive para tu sitio web, optimizado para conversión y experiencia de usuario.' },
        'Landing Page': { icon: '📄', description: 'Páginas de aterrizaje enfocadas en conversiones, integradas con campañas de marketing.' },
        'Logo & Branding': { icon: '🎨', description: 'Desarrollo de identidad visual, logos e imagen corporativa para fortalecer tu marca.' },
        'Email Marketing': { icon: '✉️', description: 'Diseño y automatización de campañas de email marketing efectivas.' },
        'SEO Review & Consulting': { icon: '🔍', description: 'Análisis SEO detallado y recomendaciones para mejorar tu posicionamiento en buscadores.' },
        'Ecommerce Site': { icon: '🛒', description: 'Desarrollo e integración de tiendas en línea con pasarelas de pago y gestión de productos.' }
    };

    let servicesHTML = '<div class="services-grid" id="services-grid" data-configurable="true">';
    
    selectedServices.forEach(service => {
        if (serviceData[service]) {
            servicesHTML += `
                <div class="service-card">
                    <div class="icon">${serviceData[service].icon}</div>
                    <h3>${service}</h3>
                    <p>${serviceData[service].description}</p>
                </div>
            `;
        }
    });
    
    servicesHTML += '</div>';
    return servicesHTML;
}

function generateDeliverablesHTML(deliverables) {
    if (!deliverables || deliverables.length === 0) {
        return '<ul class="deliverables-list" id="deliverables-list" data-configurable="true"><li>No se especificaron entregables</li></ul>';
    }
    
    let deliverablesHTML = '<ul class="deliverables-list" id="deliverables-list" data-configurable="true">';
    
    deliverables.forEach(deliverable => {
        deliverablesHTML += `<li>${deliverable}</li>`;
    });
    
    deliverablesHTML += '</ul>';
    return deliverablesHTML;
}

function generateTimelineHTML(processTimeline) {
    if (!processTimeline || processTimeline.length === 0) {
        return `<div class="timeline" id="process-timeline" data-configurable="true">
            <div class="timeline-item">
                <div class="circle"></div>
                <h4>Fase 1: Brief &amp; Investigación<br><small>(1 semana)</small></h4>
                <p>Recolección de requisitos, análisis de mercado y definición del alcance del proyecto.</p>
            </div>
            <div class="timeline-item">
                <div class="circle"></div>
                <h4>Fase 2: Diseño UI/UX<br><small>(1-2 semanas)</small></h4>
                <p>Creación de wireframes y prototipos visuales, iteraciones según tu feedback.</p>
            </div>
            <div class="timeline-item">
                <div class="circle"></div>
                <h4>Fase 3: Desarrollo &amp; Integraciones<br><small>(2-3 semanas)</small></h4>
                <p>Implementación técnica del sitio, carga de contenido y configuraciones.</p>
            </div>
            <div class="timeline-item">
                <div class="circle"></div>
                <h4>Fase 4: Pruebas &amp; Lanzamiento<br><small>(1 semana)</small></h4>
                <p>Revisión final, pruebas de calidad y puesta en línea del proyecto.</p>
            </div>
        </div>`;
    }
    
    const timelineHTML = processTimeline.map(phase => `
        <div class="timeline-item">
            <div class="circle"></div>
            <h4>${phase.title}<br><small>(${phase.duration})</small></h4>
            <p>${phase.description}</p>
        </div>
    `).join('');
    
    return `<div class="timeline" id="process-timeline" data-configurable="true">${timelineHTML}</div>`;
}

function generatePaymentTermsHTML(paymentTerms) {
    if (!paymentTerms) {
        return `<ul id="payment-terms" data-configurable="true">
            <li>Incluye todos los servicios y entregables definidos en esta propuesta</li>
            <li>Pago inicial del 50% al aceptar la propuesta</li>
            <li>Saldo restante al finalizar el proyecto</li>
        </ul>`;
    }
    
    const termsHTML = paymentTerms.split('\n').map(term => `<li>${term.trim()}</li>`).join('');
    return `<ul id="payment-terms" data-configurable="true">${termsHTML}</ul>`;
}

function formatDate(dateString) {
    if (!dateString) return 'DD/MM/AAAA';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Exportar funciones para uso en el admin dashboard
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateProposalHTML,
        generateServicesHTML,
        generateDeliverablesHTML,
        generateTimelineHTML,
        generatePaymentTermsHTML,
        formatDate
    };
}