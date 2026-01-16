# 🎯 Generador de Códigos QR

Un generador de códigos QR moderno y fácil de usar, construido con JavaScript puro. Perfecto para crear códigos QR personalizados para URLs, texto, WiFi, contactos y más.

## ✨ Características

- **Generación instantánea** de códigos QR
- **Personalización completa**: tamaño, colores, nivel de corrección
- **Plantillas predefinidas**: WiFi, contactos, email, SMS
- **Descarga en PNG** de alta calidad
- **Copiar al portapapeles** con un clic
- **Interfaz responsive** para todos los dispositivos
- **Sin dependencias externas** (excepto la librería QRCode.js)

## 🚀 Uso rápido

1. Abre `index.html` en tu navegador
2. Ingresa el texto o URL deseado
3. Personaliza el aspecto (opcional)
4. Haz clic en "Generar QR"
5. ¡Descarga o copia tu código QR!

## 📋 Plantillas disponibles

### 📶 WiFi
Genera un código QR que conecta automáticamente a una red WiFi.
Formato: `WIFI:T:WPA;S:nombre_red;P:contraseña;;`

### 👤 Contacto
Crea un vCard con información de contacto.
Formato: Tarjeta de contacto estándar vCard

### 📧 Email
Genera un enlace `mailto:` prellenado.
Formato: `mailto:destinatario@email.com?subject=asunto&body=mensaje`

### 💬 SMS
Crea un enlace para enviar SMS.
Formato: `sms:número?body=mensaje`

## 🛠️ Tecnologías utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con variables CSS
- **JavaScript ES6+** - Funcionalidad interactiva
- **QRCode.js** - Generación de códigos QR
- **Font Awesome** - Iconos vectoriales

## 📁 Estructura del proyecto
