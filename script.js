// Variables globales
let qrcode = null;
let currentQRData = '';

// Elementos del DOM
const qrText = document.getElementById('qrText');
const qrSize = document.getElementById('qrSize');
const qrColor = document.getElementById('qrColor');
const qrBackground = document.getElementById('qrBackground');
const qrLevel = document.getElementById('qrLevel');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');
const qrcodeContainer = document.getElementById('qrcode');
const qrPlaceholder = document.querySelector('.qr-placeholder');
const templateModal = document.getElementById('templateModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const applyTemplate = document.getElementById('applyTemplate');
const closeModal = document.querySelector('.close');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    generateQR(); // Generar QR inicial
});

// Configurar event listeners
function setupEventListeners() {
    generateBtn.addEventListener('click', generateQR);
    downloadBtn.addEventListener('click', downloadQR);
    copyBtn.addEventListener('click', copyQR);
    
    // Auto-generar mientras se escribe (con debounce)
    let timeout;
    qrText.addEventListener('input', function() {
        clearTimeout(timeout);
        timeout = setTimeout(generateQR, 500);
    });
    
    // Cambios en opciones
    [qrSize, qrColor, qrBackground, qrLevel].forEach(element => {
        element.addEventListener('change', generateQR);
    });
    
    // Plantillas
    document.querySelectorAll('.template-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const template = this.dataset.template;
            openTemplateModal(template);
        });
    });
    
    // Modal
    closeModal.addEventListener('click', () => {
        templateModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === templateModal) {
            templateModal.style.display = 'none';
        }
    });
    
    applyTemplate.addEventListener('click', applyTemplateData);
}

// Generar código QR
function generateQR() {
    const text = qrText.value.trim();
    
    if (!text) {
        showMessage('Por favor ingresa algún texto o URL', 'error');
        return;
    }
    
    // Limpiar QR anterior
    qrcodeContainer.innerHTML = '';
    
    // Opciones del QR
    const options = {
        text: text,
        width: parseInt(qrSize.value),
        height: parseInt(qrSize.value),
        colorDark: qrColor.value,
        colorLight: qrBackground.value,
        correctLevel: QRCode.CorrectLevel[qrLevel.value]
    };
    
    try {
        // Crear nuevo QR
        qrcode = new QRCode(qrcodeContainer, options);
        currentQRData = text;
        
        // Mostrar QR y ocultar placeholder
        qrcodeContainer.style.display = 'block';
        qrPlaceholder.style.display = 'none';
        
        // Habilitar botones
        downloadBtn.disabled = false;
        copyBtn.disabled = false;
        
        showMessage('¡Código QR generado exitosamente!', 'success');
    } catch (error) {
        showMessage('Error al generar el código QR: ' + error.message, 'error');
    }
}

// Descargar QR como PNG
function downloadQR() {
    if (!qrcode) return;
    
    try {
        const canvas = qrcodeContainer.querySelector('canvas');
        if (!canvas) {
            showMessage('No hay código QR para descargar', 'error');
            return;
        }
        
        // Crear enlace de descarga
        const link = document.createElement('a');
        link.download = `qr-code-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        showMessage('¡Código QR descargado exitosamente!', 'success');
    } catch (error) {
        showMessage('Error al descargar: ' + error.message, 'error');
    }
}

// Copiar QR al portapapeles
async function copyQR() {
    if (!qrcode) return;
    
    try {
        const canvas = qrcodeContainer.querySelector('canvas');
        if (!canvas) {
            showMessage('No hay código QR para copiar', 'error');
            return;
        }
        
        // Convertir a blob y copiar
        canvas.toBlob(async function(blob) {
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        'image/png': blob
                    })
                ]);
                showMessage('¡Código QR copiado al portapapeles!', 'success');
            } catch (error) {
                showMessage('Error al copiar: ' + error.message, 'error');
            }
        });
    } catch (error) {
        showMessage('Error al copiar: ' + error.message, 'error');
    }
}

// Sistema de plantillas
const templates = {
    wifi: {
        title: 'Configurar WiFi',
        fields: [
            { name: 'ssid', label: 'Nombre de red (SSID)', type: 'text', placeholder: 'MiRedWiFi' },
            { name: 'password', label: 'Contraseña', type: 'password', placeholder: 'Contraseña' },
            { name: 'security', label: 'Seguridad', type: 'select', options: ['WPA', 'WEP', 'nopass'] }
        ],
        generate: function(data) {
            return `WIFI:T:${data.security};S:${data.ssid};P:${data.password};;`;
        }
    },
    contact: {
        title: 'Información de Contacto',
        fields: [
            { name: 'name', label: 'Nombre', type: 'text', placeholder: 'Juan Pérez' },
            { name: 'phone', label: 'Teléfono', type: 'tel', placeholder: '+1234567890' },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'juan@ejemplo.com' },
            { name: 'company', label: 'Empresa', type: 'text', placeholder: 'Empresa S.A.' }
        ],
        generate: function(data) {
            return `BEGIN:VCARD\nVERSION:3.0\nFN:${data.name}\nTEL:${data.phone}\nEMAIL:${data.email}\nORG:${data.company}\nEND:VCARD`;
        }
    },
    email: {
        title: 'Enviar Email',
        fields: [
            { name: 'to', label: 'Para', type: 'email', placeholder: 'destinatario@ejemplo.com' },
            { name: 'subject', label: 'Asunto', type: 'text', placeholder: 'Asunto del email' },
            { name: 'body', label: 'Mensaje', type: 'textarea', placeholder: 'Contenido del email' }
        ],
        generate: function(data) {
            return `mailto:${data.to}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.body)}`;
        }
    },
    sms: {
        title: 'Enviar SMS',
        fields: [
            { name: 'phone', label: 'Número de teléfono', type: 'tel', placeholder: '+1234567890' },
            { name: 'message', label: 'Mensaje', type: 'textarea', placeholder: 'Mensaje de texto' }
        ],
        generate: function(data) {
            return `sms:${data.phone}?body=${encodeURIComponent(data.message)}`;
        }
    }
};

// Abrir modal de plantilla
function openTemplateModal(templateType) {
    const template = templates[templateType];
    if (!template) return;
    
    modalTitle.textContent = template.title;
    
    // Construir formulario
    let formHTML = '';
    template.fields.forEach(field => {
        formHTML += `
            <div class="form-group">
                <label for="${field.name}">${field.label}:</label>
                ${field.type === 'select' ? 
                    `<select id="${field.name}" class="template-field">
                        ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                    </select>` :
                    field.type === 'textarea' ?
                    `<textarea id="${field.name}" class="template-field" placeholder="${field.placeholder}" rows="3"></textarea>` :
                    `<input type="${field.type}" id="${field.name}" class="template-field" placeholder="${field.placeholder}">`
                }
            </div>
        `;
    });
    
    modalBody.innerHTML = formHTML;
    templateModal.style.display = 'block';
    
    // Guardar tipo de plantilla actual
    applyTemplate.dataset.templateType = templateType;
}

// Aplicar datos de plantilla
function applyTemplateData() {
    const templateType = applyTemplate.dataset.templateType;
    const template = templates[templateType];
    if (!template) return;
    
    const data = {};
    const fields = modalBody.querySelectorAll('.template-field');
    
    fields.forEach(field => {
        data[field.id] = field.value;
    });
    
    // Validar campos requeridos
    const requiredFields = fields.filter(field => field.hasAttribute('required') || field.value.trim() === '');
    if (requiredFields.length > 0) {
        showMessage('Por favor completa todos los campos requeridos', 'error');
        return;
    }
    
    try {
        const qrContent = template.generate(data);
        qrText.value = qrContent;
        templateModal.style.display = 'none';
        generateQR();
        showMessage('Plantilla aplicada exitosamente', 'success');
    } catch (error) {
        showMessage('Error al aplicar plantilla: ' + error.message, 'error');
    }
}

// Sistema de mensajes
function showMessage(message, type) {
    // Eliminar mensajes anteriores
    const existingMessage = document.querySelector('.success-message, .error-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Crear nuevo mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;
    
    // Insertar después del botón generar
    generateBtn.parentNode.insertBefore(messageDiv, generateBtn.nextSibling);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Validación de entrada
qrText.addEventListener('input', function() {
    const text = this.value.trim();
    if (text.length > 1000) {
        showMessage('El texto no debe exceder 1000 caracteres', 'error');
        this.value = text.substring(0, 1000);
    }
});

// Atajos de teclado
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter para generar
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        generateQR();
    }
    
    // Ctrl/Cmd + S para descargar
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (!downloadBtn.disabled) {
            downloadQR();
        }
    }
});
