// Módulo de Distribución de Expedientes
class DistribucionModule {
    constructor() {
        this.distribuciones = [];
        this.responsables = [];
        this.criteriosAutomaticos = [];
        this.init();
    }

    init() {
        this.cargarResponsables();
        this.configurarCriteriosAutomaticos();
    }

    cargarResponsables() {
        this.responsables = [
            {
                id: 1,
                nombre: 'María García',
                rol: 'JEFE_DDEE',
                disponible: true,
                cargaTrabajo: 3,
                especialidades: ['SUPERVISION', 'PLANES_REGIONALES'],
                ubicacion: 'LIMA'
            },
            {
                id: 2,
                nombre: 'Carlos López',
                rol: 'ESPECIALISTA_SPO',
                disponible: true,
                cargaTrabajo: 2,
                especialidades: ['SEGURIDAD', 'PLANES_ACCION'],
                ubicacion: 'AREQUIPA'
            },
            {
                id: 3,
                nombre: 'Ana Rodríguez',
                rol: 'INSPECTOR',
                disponible: false,
                cargaTrabajo: 5,
                especialidades: ['INSPECCIONES', 'SUPERVISION'],
                ubicacion: 'CUSCO'
            }
        ];
    }

    configurarCriteriosAutomaticos() {
        this.criteriosAutomaticos = [
            {
                id: 1,
                nombre: 'Prioridad Alta a Jefe DDEE',
                condicion: (expediente) => expediente.prioridad === 'ALTA',
                accion: (expediente) => this.asignarPorRol(expediente, 'JEFE_DDEE'),
                activo: true
            },
            {
                id: 2,
                nombre: 'Memoria OC/SGP a Especialista SPO',
                condicion: (expediente) => expediente.tipo === 'Memoria OC/SGP',
                accion: (expediente) => this.asignarPorRol(expediente, 'ESPECIALISTA_SPO'),
                activo: true
            },
            {
                id: 3,
                nombre: 'Distribución por Ubicación',
                condicion: (expediente) => expediente.ubicacion,
                accion: (expediente) => this.asignarPorUbicacion(expediente),
                activo: true
            }
        ];
    }

    // HU-07-02 - Solicita lista de operadores certificados
    seleccionarListaInspecciones(criterios) {
        // CA-02.1: Visualizar y elegir listas según criterios
        const listasDisponibles = this.obtenerListasDisponibles(criterios);
        
        return {
            listas: listasDisponibles,
            criteriosAplicados: criterios,
            totalListas: listasDisponibles.length
        };
    }

    distribuirExpediente(expedienteId, responsableId = null) {
        const expediente = this.obtenerExpediente(expedienteId);
        
        if (!expediente) {
            throw new Error('Expediente no encontrado');
        }

        let responsableAsignado;

        if (responsableId) {
            // Asignación manual
            responsableAsignado = this.responsables.find(r => r.id === responsableId);
        } else {
            // Asignación automática usando criterios
            responsableAsignado = this.aplicarCriteriosAutomaticos(expediente);
        }

        // CA-02.2: Validar disponibilidad y conflictos de agenda
        const validacion = this.validarDisponibilidad(responsableAsignado, expediente);
        if (!validacion.valido) {
            throw new Error(validacion.mensaje);
        }

        // Crear distribución
        const distribucion = {
            id: this.generarId(),
            expedienteId: expediente.id,
            responsableId: responsableAsignado.id,
            fechaDistribucion: new Date(),
            estado: 'DISTRIBUIDO',
            criteriosAplicados: this.criteriosAutomaticos.filter(c => c.activo),
            observaciones: ''
        };

        this.distribuciones.push(distribucion);

        // CA-02.4: Registrar en SICPO
        this.registrarDistribucion(distribucion);

        // CA-02.5: Enviar notificación y solicitar acuse
        this.enviarNotificacionDistribucion(distribucion);

        return distribucion;
    }

    obtenerListasDisponibles(criterios) {
        // Simular obtención de listas desde base de datos
        const todasLasListas = [
            {
                id: 'LISTA-2024-001',
                tipo: 'Inspecciones Mineras',
                prioridad: 'ALTA',
                ubicacion: 'LIMA',
                fechaCreacion: new Date('2024-01-15'),
                estado: 'PENDIENTE'
            },
            {
                id: 'LISTA-2024-002',
                tipo: 'Inspecciones Energéticas',
                prioridad: 'MEDIA',
                ubicacion: 'AREQUIPA',
                fechaCreacion: new Date('2024-01-14'),
                estado: 'PENDIENTE'
            }
        ];

        // Aplicar filtros según criterios
        return todasLasListas.filter(lista => {
            if (criterios.prioridad && lista.prioridad !== criterios.prioridad) return false;
            if (criterios.ubicacion && lista.ubicacion !== criterios.ubicacion) return false;
            if (criterios.tipo && lista.tipo !== criterios.tipo) return false;
            return true;
        });
    }

    aplicarCriteriosAutomaticos(expediente) {
        for (const criterio of this.criteriosAutomaticos) {
            if (criterio.activo && criterio.condicion(expediente)) {
                return criterio.accion(expediente);
            }
        }

        // Si no se aplica ningún criterio, asignar por carga de trabajo
        return this.asignarPorCargaTrabajo(expediente);
    }

    asignarPorRol(expediente, rol) {
        const responsablesDisponibles = this.responsables.filter(r => 
            r.rol === rol && r.disponible
        );

        if (responsablesDisponibles.length === 0) {
            throw new Error(`No hay responsables disponibles con rol ${rol}`);
        }

        // Seleccionar el que tenga menor carga de trabajo
        return responsablesDisponibles.reduce((min, current) => 
            current.cargaTrabajo < min.cargaTrabajo ? current : min
        );
    }

    asignarPorUbicacion(expediente) {
        const responsablesEnUbicacion = this.responsables.filter(r => 
            r.ubicacion === expediente.ubicacion && r.disponible
        );

        if (responsablesEnUbicacion.length > 0) {
            return responsablesEnUbicacion.reduce((min, current) => 
                current.cargaTrabajo < min.cargaTrabajo ? current : min
            );
        }

        // Si no hay responsables en la ubicación, asignar por carga de trabajo
        return this.asignarPorCargaTrabajo(expediente);
    }

    asignarPorCargaTrabajo(expediente) {
        const responsablesDisponibles = this.responsables.filter(r => r.disponible);
        
        if (responsablesDisponibles.length === 0) {
            throw new Error('No hay responsables disponibles');
        }

        return responsablesDisponibles.reduce((min, current) => 
            current.cargaTrabajo < min.cargaTrabajo ? current : min
        );
    }

    validarDisponibilidad(responsable, expediente) {
        if (!responsable) {
            return { valido: false, mensaje: 'Responsable no encontrado' };
        }

        if (!responsable.disponible) {
            return { valido: false, mensaje: 'Responsable no disponible' };
        }

        if (responsable.cargaTrabajo >= 5) {
            return { valido: false, mensaje: 'Responsable con carga de trabajo máxima' };
        }

        // Validar especialidades si es requerido
        if (expediente.requiereEspecialidad) {
            const tieneEspecialidad = responsable.especialidades.includes(expediente.requiereEspecialidad);
            if (!tieneEspecialidad) {
                return { valido: false, mensaje: 'Responsable no tiene la especialidad requerida' };
            }
        }

        return { valido: true, mensaje: 'Responsable válido para asignación' };
    }

    enviarNotificacionDistribucion(distribucion) {
        const responsable = this.responsables.find(r => r.id === distribucion.responsableId);
        const expediente = this.obtenerExpediente(distribucion.expedienteId);

        const notificacion = {
            id: this.generarId(),
            tipo: 'DISTRIBUCION_EXPEDIENTE',
            destinatario: responsable.nombre,
            destinatarioId: responsable.id,
            asunto: `Nuevo expediente asignado: ${expediente.id}`,
            mensaje: `Se le ha asignado el expediente ${expediente.id} de tipo ${expediente.tipo}`,
            fechaEnvio: new Date(),
            requiereAcuse: true,
            estado: 'ENVIADA',
            expedienteId: expediente.id
        };

        // Simular envío
        console.log('Enviando notificación de distribución:', notificacion);

        // CA-02.6: Alertar si no responde
        this.programarAlertaRespuesta(notificacion);

        return notificacion;
    }

    programarAlertaRespuesta(notificacion) {
        // Simular programación de alerta después de 24 horas
        setTimeout(() => {
            this.verificarRespuestaNotificacion(notificacion.id);
        }, 24 * 60 * 60 * 1000); // 24 horas
    }

    verificarRespuestaNotificacion(notificacionId) {
        // Verificar si el responsable ha respondido
        const respuesta = this.obtenerRespuestaNotificacion(notificacionId);
        
        if (!respuesta) {
            this.generarAlertaNoRespuesta(notificacionId);
        }
    }

    generarAlertaNoRespuesta(notificacionId) {
        const alerta = {
            id: this.generarId(),
            tipo: 'ALERTA_NO_RESPUESTA',
            notificacionId: notificacionId,
            fechaGeneracion: new Date(),
            mensaje: 'Responsable no ha confirmado recepción de expediente',
            estado: 'ACTIVA'
        };

        console.log('Alerta generada:', alerta);
        return alerta;
    }

    // CA-02.3: Configurar criterios automáticos
    configurarCriterioAutomatico(criterio) {
        const index = this.criteriosAutomaticos.findIndex(c => c.id === criterio.id);
        
        if (index >= 0) {
            this.criteriosAutomaticos[index] = { ...this.criteriosAutomaticos[index], ...criterio };
        } else {
            criterio.id = this.generarId();
            this.criteriosAutomaticos.push(criterio);
        }

        return criterio;
    }

    obtenerExpediente(id) {
        // Simular obtención de expediente
        return {
            id: id,
            tipo: 'Lista de Inspecciones',
            prioridad: 'ALTA',
            ubicacion: 'LIMA',
            requiereEspecialidad: 'SUPERVISION'
        };
    }

    registrarDistribucion(distribucion) {
        // Simular registro en SICPO
        console.log('Registrando distribución en SICPO:', distribucion);
        return distribucion;
    }

    obtenerRespuestaNotificacion(notificacionId) {
        // Simular verificación de respuesta
        return null; // No hay respuesta
    }

    generarId() {
        return `DIST-${Date.now().toString(36).toUpperCase()}`;
    }

    // Métodos para la interfaz
    getResponsablesHTML() {
        return this.responsables.map(responsable => `
            <div class="border rounded-lg p-4 ${responsable.disponible ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}">
                <div class="flex items-center justify-between mb-2">
                    <div>
                        <h4 class="font-semibold text-gray-900">${responsable.nombre}</h4>
                        <p class="text-sm text-gray-600">${responsable.rol}</p>
                        <p class="text-xs text-gray-500">${responsable.ubicacion}</p>
                    </div>
                    <div class="flex items-center">
                        <span class="w-3 h-3 rounded-full ${responsable.disponible ? 'bg-green-400' : 'bg-red-400'} mr-2"></span>
                        <span class="text-sm ${responsable.disponible ? 'text-green-600' : 'text-red-600'}">
                            ${responsable.disponible ? 'Disponible' : 'Ocupado'}
                        </span>
                    </div>
                </div>
                <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-600">Carga: ${responsable.cargaTrabajo}/5</span>
                    <div class="w-20 bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-600 h-2 rounded-full" style="width: ${(responsable.cargaTrabajo / 5) * 100}%"></div>
                    </div>
                </div>
                <div class="mt-2">
                    <div class="flex flex-wrap gap-1">
                        ${responsable.especialidades.map(esp => `
                            <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">${esp}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    getCriteriosAutomaticosHTML() {
        return this.criteriosAutomaticos.map(criterio => `
            <div class="flex items-center justify-between py-2">
                <span class="text-gray-700">${criterio.nombre}</span>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" ${criterio.activo ? 'checked' : ''} 
                           onchange="distribucionModule.toggleCriterio(${criterio.id})"
                           class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>
        `).join('');
    }

    toggleCriterio(criterioId) {
        const criterio = this.criteriosAutomaticos.find(c => c.id === criterioId);
        if (criterio) {
            criterio.activo = !criterio.activo;
        }
    }

    getDistribucionesRecientes() {
        return this.distribuciones.slice(-5).map(dist => {
            const responsable = this.responsables.find(r => r.id === dist.responsableId);
            return {
                ...dist,
                responsableNombre: responsable ? responsable.nombre : 'Desconocido'
            };
        });
    }
}

// Instancia global del módulo
const distribucionModule = new DistribucionModule();