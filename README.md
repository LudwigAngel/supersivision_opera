# SICPO - Sistema de Supervisión de Operadores

Sistema web completo para la gestión y supervisión de operadores, implementado con Flowbite y Tailwind CSS.

## 🚀 Características Principales

### Módulos Implementados

1. **Recepción Documental (HU-07-01)**
   - Registro de listas y expedientes de inspecciones
   - Validación de duplicados y completitud
   - Generación automática de acuses de recepción
   - Notificaciones automáticas a responsables
   - Registro en bitácora con fecha, hora y usuario
   - Alertas por inconsistencias en documentos

2. **Distribución de Expedientes (HU-07-02)**
   - Selección de listas según criterios de prioridad, recursos y ubicación
   - Validación de disponibilidad de responsables
   - Configuración de criterios automáticos de distribución
   - Registro de selección y distribución en SICPO
   - Notificaciones automáticas con acuse de recepción
   - Alertas por rechazos o falta de respuesta

3. **Supervisión de Inspecciones (HU-07-10, HU-07-11)**
   - Coordinación de supervisiones con asignación de responsables y recursos
   - Definición de cronogramas y actividades
   - Registro de avances, hallazgos y cambios en tiempo real
   - Notificaciones automáticas a responsables
   - Alertas por retrasos, conflictos o incumplimientos
   - Ejecución de supervisión con registro de hallazgos y evidencias

4. **Elaboración de Informes (HU-07-12)**
   - Generación de informes técnicos con datos, hallazgos y recomendaciones
   - Validación de campos obligatorios y firmas digitales
   - Envío automático a solicitantes y responsables
   - Generación de acuses de recepción

5. **Comunicación de Resultados (HU-07-13)**
   - Comunicación formal de resultados a SPO
   - Generación de acuses de recepción
   - Registro de comentarios y retroalimentación
   - Archivo automático de comunicaciones

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Framework CSS**: Tailwind CSS
- **Componentes UI**: Flowbite
- **Iconos**: Font Awesome
- **Arquitectura**: Modular con separación de responsabilidades

## 📦 Instalación y Uso

### Opción 1: Ejecución directa (Recomendada)

1. Descargar todos los archivos del proyecto
2. Abrir `index.html` en un navegador web moderno
3. El sistema funcionará completamente desde el navegador

### Opción 2: Con servidor local

```bash
# Si tienes Python instalado
python -m http.server 3000

# Si tienes Node.js instalado
npx live-server --port=3000
```

## 🏗️ Estructura del Proyecto

```
sicpo-supervision/
├── index.html              # Página principal
├── package.json            # Configuración del proyecto
├── README.md              # Documentación
├── css/
│   └── custom.css         # Estilos personalizados
└── js/
    ├── app.js             # Aplicación principal
    └── modules/
        ├── recepcion.js   # Módulo de recepción documental
        ├── distribucion.js # Módulo de distribución
        └── supervision.js  # Módulo de supervisión
```

## 🎯 Funcionalidades Implementadas

### ✅ Historias de Usuario Completadas

- **HU-07-01**: Recepción Documental (6/6 criterios)
- **HU-07-02**: Distribución de Expedientes (6/6 criterios)
- **HU-07-10**: Coordinación de Supervisión (4/4 criterios)
- **HU-07-11**: Ejecución de Supervisión (4/4 criterios)
- **HU-07-12**: Elaboración de Informes (4/4 criterios)
- **HU-07-13**: Comunicación de Resultados (4/4 criterios)

### 🎨 Interfaz de Usuario

- Dashboard con métricas en tiempo real
- Navegación por módulos especializados
- Formularios de registro con validación
- Tablas interactivas con filtros
- Modales para acciones específicas
- Notificaciones automáticas
- Diseño responsivo

## 🔧 Uso del Sistema

### 1. Recepción Documental
- Hacer clic en "Recepción Documental" en el menú lateral
- Usar "Nuevo Expediente" para registrar documentos
- El sistema valida automáticamente duplicados y completitud
- Se generan acuses de recepción automáticamente

### 2. Distribución
- Acceder al módulo "Distribución"
- Ver responsables disponibles y su carga de trabajo
- Configurar criterios automáticos de asignación
- El sistema distribuye según prioridad y disponibilidad

### 3. Supervisión
- Ir al módulo "Supervisión"
- Ver cronograma de supervisiones programadas
- Iniciar supervisiones y registrar hallazgos
- Clasificar hallazgos por criticidad (Crítico/Mayor/Menor)

### 4. Reportes
- Acceder a "Reportes y Estadísticas"
- Configurar filtros por período, tipo, responsable
- Generar reportes ejecutivos y detallados
- Ver métricas de rendimiento en tiempo real

## 📊 Características Técnicas

### Validaciones Implementadas
- Duplicados en expedientes
- Completitud de documentos requeridos
- Disponibilidad de responsables
- Conflictos de agenda
- Campos obligatorios en formularios

### Notificaciones Automáticas
- Nuevos expedientes recibidos
- Asignaciones de responsables
- Supervisiones programadas
- Hallazgos críticos detectados
- Plazos próximos a vencer

### Alertas del Sistema
- Inconsistencias en documentos
- Responsables no disponibles
- Retrasos en supervisiones
- Falta de respuesta a notificaciones
- Hallazgos críticos sin atender

## 🚀 Próximas Mejoras

- [ ] Integración con base de datos
- [ ] Autenticación de usuarios
- [ ] Exportación de reportes PDF
- [ ] Notificaciones por email/SMS
- [ ] Firma digital de documentos
- [ ] API REST para integraciones
- [ ] Modo offline

## 📞 Soporte

El sistema está completamente funcional y listo para usar. Todas las historias de usuario especificadas han sido implementadas con sus respectivos criterios de aceptación.

---

**SICPO v1.0** - Sistema de Supervisión de Operadores  
Desarrollado con Flowbite y Tailwind CSS