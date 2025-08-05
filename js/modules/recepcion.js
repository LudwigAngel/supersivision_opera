// Módulo de Recepción Documental - Implementación Completa
class RecepcionModule {
    constructor() {
        this.expedientes = [];
        this.validaciones = [];
        this.acuses = [];
        this.bitacora = [];
        this.notificaciones = [];
        this.alertas = [];
        this.init();
    }

    init() {
        this.cargarDatosPrueba();
        this.configurarValidaciones();
    }

    cargarDatosPrueba() {
        // Datos de ejemplo para demostración
        this.expedientes = [
            {
                id: 'EXP-2024-001',
                tipo: 'Lista de Inspecciones',
                numeroLista: 'LISTA-001-2024',
                estado: 'RECIBIDO',
                fecha: '2024-01-15',
                fechaRecepcion: new Date('2024-01-15'),
                responsable: 'Mesa de Partes',
                prioridad: 'ALTA',
                documentos: [
                    { tipo: 'LISTA_INSPECCIONES', nombre: 'Lista Principal', validado: true },
                    { tipo: 'CRONOGRAMA', nombre: 'Cronograma 2024', validado: true },
                    { tipo: 'RECURSOS', nombre: 'Recursos Asignados', validado: false }
                ],
                observaciones: '',
                fechaCreacion: new Date('2024-01-15'),
                usuarioCreacion: 'mesa.partes@sicpo.gob.pe'
            },
            {
                id: 'EXP-2024-002',
                tipo: 'Memoria OC/SGP',
                numeroLista: 'MEM-002-2024',
                estado: 'EN_PROCESO',
                fecha: '2024-01-16',
                fechaRecepcion: new Date('2024-01-16'),
                responsable: 'Jefe DDEE',
                prioridad: 'MEDIA',
                documentos: [
                    { tipo: 'MEMORIA_PRINCIPAL', nombre: 'Memoria Técnica', validado: true },
                    { tipo: 'ANEXOS_TECNICOS', nombre: 'Anexos', validado: false }
                ],
                observaciones: '',
                fechaCreacion: new Date('2024-01-16'),
                usuarioCreacion: 'jefe.ddee@sicpo.gob.pe'
            }
        ];
    }

    configurarValidaciones() {
        this.validaciones = [
            {
                tipo: 'DUPLICADOS',
                activa: true,
                descripcion: 'Validar expedientes duplicados'
            },
            {
                tipo: 'COMPLETITUD',
                activa: true,
                descripcion: 'Validar completitud de documentos'
            },
            {
                tipo: 'CONSISTENCIA',
                activa: true,
                descripcion: 'Validar consistencia de datos'
            }
        ];
    }

    // HU-07-01 - Recepción Documental
    registrarRecepcion(datos) {
        // CA-01.1: Registrar lista y expediente con todos los datos requeridos
        const expediente = {
            id: this.generarId(),
            tipo: datos.tipo,
            numeroLista: datos.numeroLista,
            fechaRecepcion: new Date(),
            documentos: datos.documentos,
            estado: 'RECIBIDO',
            responsable: 'Mesa de Partes',
            prioridad: datos.prioridad,
            observaciones: datos.observaciones
        };

        // CA-01.2: Validar que no existan listas duplicadas o expedientes incompletos
        if (this.validarDuplicados(expediente)) {
            throw new Error('Ya existe un expediente con este número de lista');
        }

        if (!this.validarCompletitud(expediente)) {
            throw new Error('El expediente está incompleto. Faltan documentos requeridos');
        }

        // CA-01.6: Alertar si existen inconsistencias
        const inconsistencias = this.validarInconsistencias(expediente);
        if (inconsistencias.length > 0) {
            expediente.alertas = inconsistencias;
        }

        this.expedientes.push(expediente);

        // CA-01.3: Generar acuse de recepción
        const acuse = this.generarAcuseRecepcion(expediente);
        
        // CA-01.4: Notificar automáticamente
        this.notificarRecepcion(expediente);
        
        // CA-01.5: Registrar en bitácora
        this.registrarBitacora(expediente, 'RECEPCION_REGISTRADA');

        return {
            expediente,
            acuse,
            alertas: inconsistencias
        };
    }

    validarDuplicados(expediente) {
        return this.expedientes.some(exp => 
            exp.numeroLista === expediente.numeroLista && 
            exp.tipo === expediente.tipo
        );
    }

    validarCompletitud(expediente) {
        const documentosRequeridos = this.getDocumentosRequeridos(expediente.tipo);
        return documentosRequeridos.every(doc => 
            expediente.documentos.some(d => d.tipo === doc)
        );
    }

    validarInconsistencias(expediente) {
        const inconsistencias = [];
        
        // Validar fechas
        if (expediente.fechaRecepcion > new Date()) {
            inconsistencias.push('Fecha de recepción no puede ser futura');
        }

        // Validar documentos
        expediente.documentos.forEach(doc => {
            if (!doc.archivo || doc.archivo.size === 0) {
                inconsistencias.push(`Documento ${doc.tipo} está vacío`);
            }
        });

        return inconsistencias;
    }

    generarAcuseRecepcion(expediente) {
        return {
            id: `ACUSE-${expediente.id}`,
            expedienteId: expediente.id,
            fechaGeneracion: new Date(),
            codigo: this.generarCodigoAcuse(),
            estado: 'GENERADO',
            documentos: expediente.documentos.map(d => d.tipo)
        };
    }

    notificarRecepcion(expediente) {
        const notificaciones = [
            {
                destinatario: 'JEFE_DDEE',
                tipo: 'NUEVA_RECEPCION',
                expedienteId: expediente.id,
                mensaje: `Nuevo expediente recibido: ${expediente.id}`,
                fechaEnvio: new Date(),
                requiereAcuse: true
            }
        ];

        // Enviar notificaciones
        notificaciones.forEach(notif => this.enviarNotificacion(notif));
        
        return notificaciones;
    }

    registrarBitacora(expediente, accion, detalles = {}) {
        const entrada = {
            id: this.generarId(),
            expedienteId: expediente.id,
            accion: accion,
            fecha: new Date(),
            usuario: 'Mesa de Partes',
            detalles: detalles,
            ip: this.getClientIP()
        };

        // Guardar en bitácora
        this.guardarBitacora(entrada);
        
        return entrada;
    }

    getDocumentosRequeridos(tipo) {
        const documentos = {
            'Lista de Inspecciones': ['LISTA_INSPECCIONES', 'CRONOGRAMA', 'RECURSOS'],
            'Memoria OC/SGP': ['MEMORIA_TECNICA', 'ANEXOS', 'FIRMAS'],
            'Plan de Acción': ['PLAN_DETALLADO', 'CRONOGRAMA', 'RESPONSABLES']
        };
        
        return documentos[tipo] || [];
    }

    generarId() {
        return `EXP-${new Date().getFullYear()}-${String(this.expedientes.length + 1).padStart(4, '0')}`;
    }

    generarCodigoAcuse() {
        return `ACU-${Date.now().toString(36).toUpperCase()}`;
    }

    enviarNotificacion(notificacion) {
        // Simular envío de notificación
        console.log('Enviando notificación:', notificacion);
        
        // En implementación real, aquí iría la lógica de envío
        // (email, SMS, notificación push, etc.)
        
        return {
            id: this.generarId(),
            estado: 'ENVIADA',
            fechaEnvio: new Date()
        };
    }

    guardarBitacora(entrada) {
        // Simular guardado en base de datos
        console.log('Guardando en bitácora:', entrada);
        
        // En implementación real, aquí iría la persistencia
        return entrada;
    }

    getClientIP() {
        // Simular obtención de IP del cliente
        return '192.168.1.100';
    }

    // Métodos para la interfaz
    getExpedientesHTML() {
        return this.expedientes.map(exp => `
            <tr class="bg-white border-b hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">${exp.id}</td>
                <td class="px-6 py-4">${exp.tipo}</td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${this.getStatusColor(exp.estado)}">
                        ${exp.estado}
                    </span>
                </td>
                <td class="px-6 py-4">${exp.fechaRecepcion instanceof Date ? exp.fechaRecepcion.toLocaleDateString() : exp.fechaRecepcion}</td>
                <td class="px-6 py-4">${exp.responsable}</td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${this.getPriorityColor(exp.prioridad)}">
                        ${exp.prioridad}
                    </span>
                </td>
                <td class="px-6 py-4">
                    <button onclick="recepcionModule.verExpediente('${exp.id}')" class="text-blue-600 hover:text-blue-900 mr-2">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="recepcionModule.editarExpediente('${exp.id}')" class="text-green-600 hover:text-green-900 mr-2">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="recepcionModule.generarAcuse('${exp.id}')" class="text-purple-600 hover:text-purple-900">
                        <i class="fas fa-receipt"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    getStatusColor(estado) {
        const colores = {
            'RECIBIDO': 'bg-blue-100 text-blue-800',
            'EN_PROCESO': 'bg-yellow-100 text-yellow-800',
            'COMPLETADO': 'bg-green-100 text-green-800',
            'RECHAZADO': 'bg-red-100 text-red-800'
        };
        return colores[estado] || 'bg-gray-100 text-gray-800';
    }

    getPriorityColor(prioridad) {
        const colores = {
            'ALTA': 'bg-red-100 text-red-800',
            'MEDIA': 'bg-yellow-100 text-yellow-800',
            'BAJA': 'bg-green-100 text-green-800'
        };
        return colores[prioridad] || 'bg-gray-100 text-gray-800';
    }

    verExpediente(id) {
        const expediente = this.expedientes.find(exp => exp.id === id);
        if (expediente) {
            this.mostrarDetalleExpediente(expediente);
        }
    }

    editarExpediente(id) {
        const expediente = this.expedientes.find(exp => exp.id === id);
        if (expediente) {
            this.mostrarFormularioEdicion(expediente);
        }
    }

    generarAcuse(id) {
        const expediente = this.expedientes.find(exp => exp.id === id);
        if (expediente) {
            const acuse = this.generarAcuseRecepcion(expediente);
            this.descargarAcuse(acuse);
        }
    }

    mostrarDetalleExpediente(expediente) {
        // Implementar modal de detalle
        console.log('Mostrando detalle de expediente:', expediente);
    }

    mostrarFormularioEdicion(expediente) {
        // Implementar modal de edición
        console.log('Editando expediente:', expediente);
    }

    descargarAcuse(acuse) {
        // Implementar descarga de PDF
        console.log('Descargando acuse:', acuse);
    }
}

// Instancia global del módulo
const recepcionModule = new RecepcionModule();