// Módulo de Supervisión de Inspecciones
class SupervisionModule {
    constructor() {
        this.supervisiones = [];
        this.hallazgos = [];
        this.cronogramas = [];
        this.informes = [];
        this.init();
    }

    init() {
        this.cargarDatosPrueba();
    }

    cargarDatosPrueba() {
        this.supervisiones = [
            {
                id: 'SUP-2024-001',
                expedienteId: 'EXP-2024-001',
                estado: 'PROGRAMADA',
                fechaProgramada: new Date('2024-01-20'),
                responsable: 'María García',
                tipo: 'SUPERVISION_INSPECCION',
                prioridad: 'ALTA'
            }
        ];
    }

    // HU-07-10 - Coordina fecha de supervisión
    coordinarSupervision(datos) {
        // CA-10.1: Asignar responsables, recursos, cronograma y actividades
        const supervision = {
            id: this.generarId(),
            expedienteId: datos.expedienteId,
            responsables: datos.responsables,
            recursos: datos.recursos,
            cronograma: datos.cronograma,
            actividades: datos.actividades,
            fechaCreacion: new Date(),
            estado: 'COORDINANDO',
            observaciones: datos.observaciones
        };

        // Validar disponibilidad de recursos
        const validacionRecursos = this.validarRecursos(supervision.recursos);
        if (!validacionRecursos.valido) {
            throw new Error(validacionRecursos.mensaje);
        }

        this.supervisiones.push(supervision);

        // CA-10.3: Notificar a responsables
        this.notificarResponsables(supervision);

        // CA-10.4: Programar alertas
        this.programarAlertas(supervision);

        return supervision;
    }

    // HU-07-11 - Ejecutar supervisión
    ejecutarSupervision(supervisionId, datos) {
        const supervision = this.supervisiones.find(s => s.id === supervisionId);
        if (!supervision) {
            throw new Error('Supervisión no encontrada');
        }

        // Actualizar estado
        supervision.estado = 'EN_EJECUCION';
        supervision.fechaInicio = new Date();

        // CA-11.1: Registrar hallazgos, resultados y evidencias
        if (datos.hallazgos) {
            datos.hallazgos.forEach(hallazgo => {
                this.registrarHallazgo(supervisionId, hallazgo);
            });
        }

        // CA-11.2: Validar completitud antes de cerrar
        const validacion = this.validarCompletitudSupervision(supervision);
        
        // CA-11.4: Marcar hallazgos por criticidad
        this.clasificarHallazgos(supervisionId);

        return {
            supervision,
            validacion,
            hallazgosRegistrados: datos.hallazgos?.length || 0
        };
    }

    registrarHallazgo(supervisionId, hallazgo) {
        const nuevoHallazgo = {
            id: this.generarId(),
            supervisionId: supervisionId,
            tipo: hallazgo.tipo,
            descripcion: hallazgo.descripcion,
            criticidad: hallazgo.criticidad || 'MENOR',
            evidencias: hallazgo.evidencias || [],
            responsableAsignado: hallazgo.responsableAsignado,
            fechaRegistro: new Date(),
            estado: 'ABIERTO',
            accionesRequeridas: hallazgo.accionesRequeridas || []
        };

        this.hallazgos.push(nuevoHallazgo);

        // Notificar según criticidad
        if (nuevoHallazgo.criticidad === 'CRITICO') {
            this.notificarHallazgoCritico(nuevoHallazgo);
        }

        return nuevoHallazgo;
    }

    clasificarHallazgos(supervisionId) {
        const hallazgosSupervision = this.hallazgos.filter(h => h.supervisionId === supervisionId);
        
        hallazgosSupervision.forEach(hallazgo => {
            // Lógica de clasificación automática basada en criterios
            if (this.esCritico(hallazgo)) {
                hallazgo.criticidad = 'CRITICO';
                hallazgo.plazoMaximo = 24; // horas
            } else if (this.esMayor(hallazgo)) {
                hallazgo.criticidad = 'MAYOR';
                hallazgo.plazoMaximo = 72; // horas
            } else {
                hallazgo.criticidad = 'MENOR';
                hallazgo.plazoMaximo = 168; // horas (1 semana)
            }
        });
    }

    esCritico(hallazgo) {
        const criteriosCriticos = [
            'SEGURIDAD_PERSONAL',
            'RIESGO_AMBIENTAL_ALTO',
            'INCUMPLIMIENTO_LEGAL_GRAVE'
        ];
        return criteriosCriticos.includes(hallazgo.tipo);
    }

    esMayor(hallazgo) {
        const criteriosMayores = [
            'PROCEDIMIENTO_INCORRECTO',
            'DOCUMENTACION_FALTANTE',
            'CAPACITACION_INSUFICIENTE'
        ];
        return criteriosMayores.includes(hallazgo.tipo);
    }

    // HU-07-12 - Elaborar informe de resultados
    elaborarInforme(supervisionId) {
        const supervision = this.supervisiones.find(s => s.id === supervisionId);
        if (!supervision) {
            throw new Error('Supervisión no encontrada');
        }

        const hallazgosSupervision = this.hallazgos.filter(h => h.supervisionId === supervisionId);

        // CA-12.1: Generar informe técnico con datos, hallazgos, recomendaciones
        const informe = {
            id: this.generarId(),
            supervisionId: supervisionId,
            fechaElaboracion: new Date(),
            resumenEjecutivo: this.generarResumenEjecutivo(supervision, hallazgosSupervision),
            hallazgosDetallados: hallazgosSupervision,
            recomendaciones: this.generarRecomendaciones(hallazgosSupervision),
            anexos: this.recopilarAnexos(supervision),
            estado: 'BORRADOR',
            elaboradoPor: supervision.responsable
        };

        // CA-12.2: Validar campos obligatorios y firmas
        const validacion = this.validarInforme(informe);
        if (!validacion.valido) {
            throw new Error(validacion.mensaje);
        }

        this.informes.push(informe);

        return informe;
    }

    generarResumenEjecutivo(supervision, hallazgos) {
        const totalHallazgos = hallazgos.length;
        const criticos = hallazgos.filter(h => h.criticidad === 'CRITICO').length;
        const mayores = hallazgos.filter(h => h.criticidad === 'MAYOR').length;
        const menores = hallazgos.filter(h => h.criticidad === 'MENOR').length;

        return {
            expedienteId: supervision.expedienteId,
            fechaSupervision: supervision.fechaInicio,
            duracion: this.calcularDuracion(supervision),
            totalHallazgos: totalHallazgos,
            distribucionCriticidad: { criticos, mayores, menores },
            estadoGeneral: this.determinarEstadoGeneral(hallazgos),
            recomendacionPrincipal: this.obtenerRecomendacionPrincipal(hallazgos)
        };
    }

    generarRecomendaciones(hallazgos) {
        const recomendaciones = [];

        // Recomendaciones basadas en hallazgos críticos
        const criticos = hallazgos.filter(h => h.criticidad === 'CRITICO');
        if (criticos.length > 0) {
            recomendaciones.push({
                prioridad: 'ALTA',
                descripcion: 'Implementar acciones correctivas inmediatas para hallazgos críticos',
                plazo: '24 horas',
                responsable: 'Jefe DDEE'
            });
        }

        // Recomendaciones basadas en patrones
        const tiposRecurrentes = this.identificarPatrones(hallazgos);
        tiposRecurrentes.forEach(tipo => {
            recomendaciones.push({
                prioridad: 'MEDIA',
                descripcion: `Revisar y fortalecer procedimientos relacionados con ${tipo}`,
                plazo: '1 semana',
                responsable: 'Especialista SPO'
            });
        });

        return recomendaciones;
    }

    // HU-07-13 - Comunicar resultados a SPO
    comunicarResultadosSPO(informeId) {
        const informe = this.informes.find(i => i.id === informeId);
        if (!informe) {
            throw new Error('Informe no encontrado');
        }

        // CA-13.1: Enviar comunicación formal con informe y acciones recomendadas
        const comunicacion = {
            id: this.generarId(),
            informeId: informeId,
            destinatario: 'SPO',
            asunto: `Resultados de Supervisión - ${informe.supervisionId}`,
            contenido: this.generarContenidoComunicacion(informe),
            adjuntos: [informe],
            fechaEnvio: new Date(),
            requiereAcuse: true,
            estado: 'ENVIADA'
        };

        // CA-13.2: Generar acuse de recepción
        this.generarAcuseRecepcion(comunicacion);

        // CA-13.4: Archivar automáticamente
        this.archivarComunicacion(comunicacion);

        return comunicacion;
    }

    validarRecursos(recursos) {
        // Validar disponibilidad de recursos humanos y materiales
        for (const recurso of recursos) {
            if (recurso.tipo === 'HUMANO' && !this.verificarDisponibilidadPersona(recurso)) {
                return { valido: false, mensaje: `Persona ${recurso.nombre} no disponible` };
            }
            if (recurso.tipo === 'MATERIAL' && !this.verificarDisponibilidadMaterial(recurso)) {
                return { valido: false, mensaje: `Material ${recurso.nombre} no disponible` };
            }
        }
        return { valido: true, mensaje: 'Recursos disponibles' };
    }

    notificarResponsables(supervision) {
        supervision.responsables.forEach(responsable => {
            const notificacion = {
                id: this.generarId(),
                destinatario: responsable.email,
                asunto: `Nueva supervisión asignada: ${supervision.id}`,
                mensaje: `Se le ha asignado la supervisión ${supervision.id}`,
                fechaEnvio: new Date(),
                tipo: 'ASIGNACION_SUPERVISION'
            };
            
            this.enviarNotificacion(notificacion);
        });
    }

    programarAlertas(supervision) {
        // CA-10.4: Alertar por retrasos, conflictos o incumplimientos
        const alertas = [
            {
                tipo: 'RECORDATORIO_24H',
                fechaActivacion: new Date(supervision.cronograma.fechaInicio.getTime() - 24 * 60 * 60 * 1000),
                mensaje: 'Supervisión programada para mañana'
            },
            {
                tipo: 'ALERTA_RETRASO',
                fechaActivacion: new Date(supervision.cronograma.fechaFin.getTime() + 60 * 60 * 1000),
                mensaje: 'Supervisión con retraso en finalización'
            }
        ];

        alertas.forEach(alerta => this.programarAlerta(alerta, supervision.id));
    }

    validarCompletitudSupervision(supervision) {
        const errores = [];

        // Verificar que todos los puntos del cronograma estén completados
        if (!supervision.cronograma?.completado) {
            errores.push('Cronograma no completado');
        }

        // Verificar que se hayan registrado hallazgos o justificación
        const hallazgosSupervision = this.hallazgos.filter(h => h.supervisionId === supervision.id);
        if (hallazgosSupervision.length === 0 && !supervision.justificacionSinHallazgos) {
            errores.push('No se han registrado hallazgos ni justificación');
        }

        // Verificar evidencias
        if (!supervision.evidencias || supervision.evidencias.length === 0) {
            errores.push('No se han adjuntado evidencias');
        }

        return {
            valido: errores.length === 0,
            errores: errores
        };
    }

    validarInforme(informe) {
        const errores = [];

        if (!informe.resumenEjecutivo) errores.push('Falta resumen ejecutivo');
        if (!informe.hallazgosDetallados || informe.hallazgosDetallados.length === 0) {
            errores.push('Falta detalle de hallazgos');
        }
        if (!informe.recomendaciones || informe.recomendaciones.length === 0) {
            errores.push('Faltan recomendaciones');
        }
        if (!informe.elaboradoPor) errores.push('Falta firma del elaborador');

        return {
            valido: errores.length === 0,
            errores: errores
        };
    }

    // Métodos auxiliares
    generarId() {
        return `SUP-${Date.now().toString(36).toUpperCase()}`;
    }

    calcularDuracion(supervision) {
        if (supervision.fechaInicio && supervision.fechaFin) {
            return Math.ceil((supervision.fechaFin - supervision.fechaInicio) / (1000 * 60 * 60 * 24));
        }
        return 0;
    }

    determinarEstadoGeneral(hallazgos) {
        const criticos = hallazgos.filter(h => h.criticidad === 'CRITICO').length;
        const mayores = hallazgos.filter(h => h.criticidad === 'MAYOR').length;

        if (criticos > 0) return 'CRITICO';
        if (mayores > 2) return 'PREOCUPANTE';
        if (mayores > 0) return 'ACEPTABLE_CON_OBSERVACIONES';
        return 'SATISFACTORIO';
    }

    identificarPatrones(hallazgos) {
        const conteoTipos = {};
        hallazgos.forEach(h => {
            conteoTipos[h.tipo] = (conteoTipos[h.tipo] || 0) + 1;
        });

        return Object.keys(conteoTipos).filter(tipo => conteoTipos[tipo] >= 2);
    }

    obtenerRecomendacionPrincipal(hallazgos) {
        const criticos = hallazgos.filter(h => h.criticidad === 'CRITICO');
        if (criticos.length > 0) {
            return 'Atención inmediata a hallazgos críticos de seguridad';
        }

        const mayores = hallazgos.filter(h => h.criticidad === 'MAYOR');
        if (mayores.length > 0) {
            return 'Implementar plan de mejora para hallazgos mayores';
        }

        return 'Mantener estándares actuales y monitorear mejora continua';
    }

    // Métodos para la interfaz
    getSupervisionesHTML() {
        return this.supervisiones.map(sup => `
            <div class="flex items-center p-4 bg-${this.getEstadoColor(sup.estado)}-50 rounded-lg">
                <div class="flex-shrink-0 w-10 h-10 bg-${this.getEstadoColor(sup.estado)}-600 rounded-full flex items-center justify-center">
                    <i class="fas fa-${this.getEstadoIcon(sup.estado)} text-white"></i>
                </div>
                <div class="ml-4 flex-1">
                    <h4 class="font-semibold text-gray-900">${sup.id}</h4>
                    <p class="text-sm text-gray-600">Responsable: ${sup.responsable}</p>
                    <p class="text-sm text-gray-600">Fecha: ${sup.fechaProgramada?.toLocaleDateString()}</p>
                </div>
                <div class="flex space-x-2">
                    ${this.getAccionesSupervision(sup)}
                </div>
            </div>
        `).join('');
    }

    getEstadoColor(estado) {
        const colores = {
            'PROGRAMADA': 'blue',
            'EN_EJECUCION': 'yellow',
            'COMPLETADA': 'green',
            'CANCELADA': 'red'
        };
        return colores[estado] || 'gray';
    }

    getEstadoIcon(estado) {
        const iconos = {
            'PROGRAMADA': 'calendar',
            'EN_EJECUCION': 'clock',
            'COMPLETADA': 'check-circle',
            'CANCELADA': 'times-circle'
        };
        return iconos[estado] || 'question';
    }

    getAccionesSupervision(supervision) {
        switch (supervision.estado) {
            case 'PROGRAMADA':
                return `
                    <button onclick="supervisionModule.iniciarSupervision('${supervision.id}')" 
                            class="px-3 py-1 bg-blue-600 text-white text-sm rounded">Iniciar</button>
                    <button onclick="supervisionModule.reprogramar('${supervision.id}')" 
                            class="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded">Reprogramar</button>
                `;
            case 'EN_EJECUCION':
                return `
                    <button onclick="supervisionModule.verProgreso('${supervision.id}')" 
                            class="px-3 py-1 bg-green-600 text-white text-sm rounded">Ver Progreso</button>
                    <button onclick="supervisionModule.registrarHallazgos('${supervision.id}')" 
                            class="px-3 py-1 bg-orange-600 text-white text-sm rounded">Registrar Hallazgos</button>
                `;
            default:
                return `
                    <button onclick="supervisionModule.verDetalle('${supervision.id}')" 
                            class="px-3 py-1 bg-gray-600 text-white text-sm rounded">Ver Detalle</button>
                `;
        }
    }

    // Métodos de interfaz
    iniciarSupervision(id) {
        const supervision = this.supervisiones.find(s => s.id === id);
        if (supervision) {
            supervision.estado = 'EN_EJECUCION';
            supervision.fechaInicio = new Date();
            console.log('Supervisión iniciada:', supervision);
            // Recargar interfaz
            app.showModule('supervision');
        }
    }

    verProgreso(id) {
        console.log('Ver progreso de supervisión:', id);
        // Implementar modal de progreso
    }

    registrarHallazgos(id) {
        console.log('Registrar hallazgos para supervisión:', id);
        // Implementar modal de registro de hallazgos
    }
}

// Instancia global del módulo
const supervisionModule = new SupervisionModule();