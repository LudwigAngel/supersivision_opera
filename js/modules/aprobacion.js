// Módulo de Aprobación de Planes - HU-07-05, HU-07-06, HU-07-07
class AprobacionModule {
    constructor() {
        this.planes = [];
        this.aprobaciones = [];
        this.notificaciones = [];
        this.acuses = [];
        this.observaciones = [];
        this.init();
    }

    init() {
        this.cargarPlanesPrueba();
    }

    cargarPlanesPrueba() {
        this.planes = [
            {
                id: 'PLAN-2024-001',
                tipo: 'PLAN_REGIONAL',
                titulo: 'Plan Regional de Supervisión 2024',
                estado: 'EN_REVISION',
                fechaRecepcion: new Date('2024-01-10'),
                remitente: 'OC/SGP',
                documentos: [
                    { tipo: 'PLAN_PRINCIPAL', nombre: 'Plan Regional 2024.pdf', validado: true },
                    { tipo: 'ANEXOS_TECNICOS', nombre: 'Anexos Técnicos.pdf', validado: true },
                    { tipo: 'CRONOGRAMA', nombre: 'Cronograma Ejecución.xlsx', validado: false },
                    { tipo: 'PRESUPUESTO', nombre: 'Presupuesto Detallado.xlsx', validado: true }
                ],
                requisitosTecnicos: {
                    cumpleNormativa: null,
                    cumpleLegal: null,
                    cumpleEstandares: null
                },
                observacionesPrevias: []
            }
        ];
    }

    // HU-07-05: Aprobar Plan y remitir a DDEE
    // CA-05.1: Visualizar el plan y todos los documentos asociados
    visualizarPlan(planId) {
        const plan = this.planes.find(p => p.id === planId);
        if (!plan) {
            throw new Error('Plan no encontrado');
        }

        // Preparar vista completa del plan
        const vistaCompleta = {
            plan: plan,
            documentosAsociados: plan.documentos,
            historialRevisiones: this.obtenerHistorialRevisiones(planId),
            observacionesAnteriores: plan.observacionesPrevias,
            estadoValidacion: this.obtenerEstadoValidacion(plan)
        };

        return vistaCompleta;
    }

    // CA-05.2: Validar requisitos técnicos, normativos y legales
    validarRequisitosPlan(planId) {
        const plan = this.planes.find(p => p.id === planId);
        if (!plan) {
            throw new Error('Plan no encontrado');
        }

        const validacion = {
            tecnico: this.validarRequisitosTecnicos(plan),
            normativo: this.validarRequisitosNormativos(plan),
            legal: this.validarRequisitosLegales(plan),
            fechaValidacion: new Date(),
            validadoPor: 'Jefe DDEE'
        };

        // Actualizar estado de requisitos en el plan
        plan.requisitosTecnicos = {
            cumpleNormativa: validacion.normativo.cumple,
            cumpleLegal: validacion.legal.cumple,
            cumpleEstandares: validacion.tecnico.cumple
        };

        return validacion;
    }

    validarRequisitosTecnicos(plan) {
        const errores = [];
        const advertencias = [];

        // Validar documentos técnicos requeridos
        const documentosTecnicos = ['PLAN_PRINCIPAL', 'ANEXOS_TECNICOS', 'CRONOGRAMA'];
        documentosTecnicos.forEach(docTipo => {
            const documento = plan.documentos.find(d => d.tipo === docTipo);
            if (!documento) {
                errores.push(`Falta documento técnico: ${docTipo}`);
            } else if (!documento.validado) {
                advertencias.push(`Documento ${docTipo} no ha sido validado`);
            }
        });

        // Validar contenido técnico
        if (!plan.objetivos || plan.objetivos.length === 0) {
            errores.push('Plan no define objetivos claros');
        }

        if (!plan.metodologia) {
            errores.push('Plan no especifica metodología');
        }

        return {
            cumple: errores.length === 0,
            errores: errores,
            advertencias: advertencias
        };
    }

    validarRequisitosNormativos(plan) {
        const errores = [];
        
        // Validar cumplimiento de normas específicas
        const normasRequeridas = ['DS-024-2016-EM', 'DS-040-2014-EM', 'LEY-29783'];
        normasRequeridas.forEach(norma => {
            if (!plan.normasAplicables?.includes(norma)) {
                errores.push(`Plan no referencia norma requerida: ${norma}`);
            }
        });

        return {
            cumple: errores.length === 0,
            errores: errores
        };
    }

    validarRequisitosLegales(plan) {
        const errores = [];

        // Validar aspectos legales
        if (!plan.marcoLegal) {
            errores.push('Plan no define marco legal aplicable');
        }

        if (!plan.competencias) {
            errores.push('Plan no define competencias institucionales');
        }

        return {
            cumple: errores.length === 0,
            errores: errores
        };
    }

    // CA-05.3: Registrar aprobación y fecha en expediente y bitácora
    aprobarPlan(planId, observaciones = '') {
        const plan = this.planes.find(p => p.id === planId);
        if (!plan) {
            throw new Error('Plan no encontrado');
        }

        // Validar requisitos antes de aprobar
        const validacion = this.validarRequisitosPlan(planId);
        if (!validacion.tecnico.cumple || !validacion.normativo.cumple || !validacion.legal.cumple) {
            throw new Error('Plan no cumple con todos los requisitos para aprobación');
        }

        const aprobacion = {
            id: this.generarId(),
            planId: planId,
            fechaAprobacion: new Date(),
            aprobadoPor: 'Jefe DDEE',
            observaciones: observaciones,
            estado: 'APROBADO',
            validacion: validacion
        };

        this.aprobaciones.push(aprobacion);
        plan.estado = 'APROBADO';
        plan.fechaAprobacion = aprobacion.fechaAprobacion;

        // Registrar en bitácora
        this.registrarEnBitacora(aprobacion, 'PLAN_APROBADO');

        // CA-05.6: Notificar automáticamente
        this.notificarAprobacion(aprobacion);

        return aprobacion;
    }

    // CA-05.4: Adjuntar observaciones, solicitar corrección o rechazar
    solicitarCorreccionPlan(planId, observaciones, tipoAccion = 'CORRECCION') {
        const plan = this.planes.find(p => p.id === planId);
        if (!plan) {
            throw new Error('Plan no encontrado');
        }

        const solicitud = {
            id: this.generarId(),
            planId: planId,
            tipoAccion: tipoAccion, // 'CORRECCION' o 'RECHAZO'
            observaciones: observaciones,
            fechaSolicitud: new Date(),
            solicitadoPor: 'Jefe DDEE',
            estado: 'PENDIENTE'
        };

        this.observaciones.push(solicitud);
        plan.estado = tipoAccion === 'RECHAZO' ? 'RECHAZADO' : 'REQUIERE_CORRECCION';
        plan.observacionesPrevias.push(solicitud);

        // Registrar en bitácora
        this.registrarEnBitacora(solicitud, `PLAN_${tipoAccion}`);

        // Notificar al remitente
        this.notificarSolicitudCorreccion(solicitud);

        return solicitud;
    }

    // CA-05.5: Alertar si existen errores, omisiones o incompatibilidades
    verificarErroresPlan(planId) {
        const plan = this.planes.find(p => p.id === planId);
        if (!plan) {
            throw new Error('Plan no encontrado');
        }

        const errores = [];
        const omisiones = [];
        const incompatibilidades = [];

        // Verificar errores en documentos
        plan.documentos.forEach(doc => {
            if (!doc.validado) {
                errores.push(`Documento ${doc.nombre} no validado`);
            }
        });

        // Verificar omisiones
        const camposRequeridos = ['objetivos', 'metodologia', 'cronograma', 'recursos'];
        camposRequeridos.forEach(campo => {
            if (!plan[campo]) {
                omisiones.push(`Campo requerido faltante: ${campo}`);
            }
        });

        // Verificar incompatibilidades
        if (plan.fechaInicio && plan.fechaFin && plan.fechaInicio >= plan.fechaFin) {
            incompatibilidades.push('Fecha de inicio posterior a fecha de fin');
        }

        // Generar alerta si hay problemas
        if (errores.length > 0 || omisiones.length > 0 || incompatibilidades.length > 0) {
            const alerta = {
                id: this.generarId(),
                planId: planId,
                tipo: 'ERRORES_PLAN',
                errores: errores,
                omisiones: omisiones,
                incompatibilidades: incompatibilidades,
                fechaGeneracion: new Date(),
                estado: 'ACTIVA'
            };

            console.log('Alerta de errores generada:', alerta);
            return alerta;
        }

        return null;
    }

    // HU-07-06: Notificar resultado de aprobación
    // CA-06.1: Enviar notificación formal de aprobación, rechazo o corrección
    notificarResultadoAprobacion(planId, resultado, destinatarios = ['OC/SGP', 'SOLICITANTE']) {
        const plan = this.planes.find(p => p.id === planId);
        if (!plan) {
            throw new Error('Plan no encontrado');
        }

        const notificaciones = destinatarios.map(destinatario => {
            const notificacion = {
                id: this.generarId(),
                planId: planId,
                destinatario: destinatario,
                tipo: 'RESULTADO_APROBACION',
                resultado: resultado, // 'APROBADO', 'RECHAZADO', 'REQUIERE_CORRECCION'
                asunto: `Resultado de evaluación - Plan ${plan.titulo}`,
                fechaEnvio: new Date(),
                requiereConfirmacion: true,
                estado: 'ENVIADA'
            };

            return notificacion;
        });

        this.notificaciones.push(...notificaciones);

        // CA-06.2: Adjuntar observaciones, motivos y requerimientos
        notificaciones.forEach(notif => {
            this.adjuntarObservacionesNotificacion(notif.id, plan);
        });

        // CA-06.3: Generar acuse y solicitar confirmación
        notificaciones.forEach(notif => {
            this.generarAcuseNotificacion(notif);
        });

        return notificaciones;
    }

    adjuntarObservacionesNotificacion(notificacionId, plan) {
        const notificacion = this.notificaciones.find(n => n.id === notificacionId);
        if (notificacion) {
            notificacion.observaciones = plan.observacionesPrevias;
            notificacion.motivosDecision = this.obtenerMotivosDecision(plan);
            notificacion.requerimientos = this.obtenerRequerimientos(plan);
        }
    }

    generarAcuseNotificacion(notificacion) {
        const acuse = {
            id: this.generarId(),
            notificacionId: notificacion.id,
            numeroAcuse: `ACU-PLAN-${Date.now().toString(36).toUpperCase()}`,
            fechaGeneracion: new Date(),
            destinatario: notificacion.destinatario,
            estado: 'GENERADO'
        };

        this.acuses.push(acuse);
        return acuse;
    }

    // HU-07-07: Derivar plan de Supervisión Nacional
    // CA-07.1: Registrar acuse de recepción y vincularlo al expediente
    registrarAcuseAprobacion(planId, acuseRecibido) {
        const plan = this.planes.find(p => p.id === planId);
        if (!plan) {
            throw new Error('Plan no encontrado');
        }

        const registro = {
            id: this.generarId(),
            planId: planId,
            acuseRecibido: acuseRecibido,
            fechaRegistro: new Date(),
            registradoPor: 'Jefe DDEE',
            vinculadoExpediente: true
        };

        // Vincular al expediente
        plan.acuseAprobacion = registro;

        // CA-07.2: Notificar derivación del acuse
        this.derivarAcuseResponsables(registro);

        return registro;
    }

    derivarAcuseResponsables(registroAcuse) {
        const responsables = ['SUPERVISOR_NACIONAL', 'COORDINADOR_REGIONAL', 'ESPECIALISTA_TECNICO'];
        
        const derivaciones = responsables.map(responsable => {
            const derivacion = {
                id: this.generarId(),
                acuseId: registroAcuse.id,
                responsable: responsable,
                fechaDerivacion: new Date(),
                estado: 'DERIVADO',
                confirmado: false
            };

            // Notificar al responsable
            this.notificarDerivacionAcuse(derivacion);

            return derivacion;
        });

        // CA-07.3: Alertar si no confirma recepción
        derivaciones.forEach(der => {
            this.programarAlertaConfirmacion(der);
        });

        // CA-07.4: Registrar en bitácora
        this.registrarEnBitacora(registroAcuse, 'ACUSE_DERIVADO');

        return derivaciones;
    }

    notificarDerivacionAcuse(derivacion) {
        const notificacion = {
            id: this.generarId(),
            tipo: 'DERIVACION_ACUSE',
            destinatario: derivacion.responsable,
            mensaje: `Se ha derivado acuse de aprobación de plan`,
            fechaEnvio: new Date(),
            derivacionId: derivacion.id,
            requiereConfirmacion: true
        };

        console.log('Notificando derivación de acuse:', notificacion);
        return notificacion;
    }

    programarAlertaConfirmacion(derivacion) {
        // Simular alerta después de 48 horas
        setTimeout(() => {
            if (!derivacion.confirmado) {
                const alerta = {
                    id: this.generarId(),
                    tipo: 'NO_CONFIRMACION_ACUSE',
                    derivacionId: derivacion.id,
                    responsable: derivacion.responsable,
                    fechaGeneracion: new Date(),
                    mensaje: `${derivacion.responsable} no ha confirmado recepción del acuse`
                };
                console.log('Alerta de no confirmación:', alerta);
            }
        }, 48 * 60 * 60 * 1000);
    }

    // Métodos auxiliares
    obtenerHistorialRevisiones(planId) {
        return this.observaciones.filter(obs => obs.planId === planId);
    }

    obtenerEstadoValidacion(plan) {
        return {
            documentosValidados: plan.documentos.filter(d => d.validado).length,
            totalDocumentos: plan.documentos.length,
            requisitosCumplidos: Object.values(plan.requisitosTecnicos).filter(Boolean).length,
            totalRequisitos: Object.keys(plan.requisitosTecnicos).length
        };
    }

    obtenerMotivosDecision(plan) {
        // Lógica para obtener motivos de la decisión
        return [`Plan evaluado según criterios técnicos y normativos`];
    }

    obtenerRequerimientos(plan) {
        // Lógica para obtener requerimientos adicionales
        return plan.observacionesPrevias.map(obs => obs.observaciones);
    }

    notificarAprobacion(aprobacion) {
        const notificacion = {
            id: this.generarId(),
            tipo: 'PLAN_APROBADO',
            planId: aprobacion.planId,
            mensaje: `Plan ${aprobacion.planId} ha sido aprobado`,
            fechaEnvio: new Date()
        };

        console.log('Notificando aprobación:', notificacion);
        return notificacion;
    }

    notificarSolicitudCorreccion(solicitud) {
        const notificacion = {
            id: this.generarId(),
            tipo: 'SOLICITUD_CORRECCION',
            planId: solicitud.planId,
            mensaje: `Se requieren correcciones en plan ${solicitud.planId}`,
            observaciones: solicitud.observaciones,
            fechaEnvio: new Date()
        };

        console.log('Notificando solicitud de corrección:', notificacion);
        return notificacion;
    }

    registrarEnBitacora(objeto, accion) {
        const entrada = {
            id: this.generarId(),
            accion: accion,
            fecha: new Date(),
            usuario: 'Jefe DDEE',
            detalles: objeto,
            modulo: 'APROBACION_PLANES'
        };

        console.log('Registro en bitácora:', entrada);
        return entrada;
    }

    generarId() {
        return `APR-${Date.now().toString(36).toUpperCase()}`;
    }

    // Métodos para la interfaz
    getPlanesHTML() {
        return this.planes.map(plan => `
            <div class="border rounded-lg p-4 mb-4 ${this.getEstadoColorClass(plan.estado)}">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h4 class="font-semibold text-gray-900">${plan.titulo}</h4>
                        <p class="text-sm text-gray-600">ID: ${plan.id}</p>
                        <p class="text-sm text-gray-600">Remitente: ${plan.remitente}</p>
                    </div>
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${this.getEstadoBadgeClass(plan.estado)}">
                        ${plan.estado}
                    </span>
                </div>
                <div class="mb-3">
                    <p class="text-sm text-gray-600">Documentos: ${plan.documentos.length}</p>
                    <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div class="bg-green-600 h-2 rounded-full" 
                             style="width: ${(plan.documentos.filter(d => d.validado).length / plan.documentos.length) * 100}%"></div>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button onclick="aprobacionModule.visualizarPlan('${plan.id}')" 
                            class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                        Ver Plan
                    </button>
                    ${plan.estado === 'EN_REVISION' ? `
                        <button onclick="aprobacionModule.aprobarPlan('${plan.id}')" 
                                class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                            Aprobar
                        </button>
                        <button onclick="aprobacionModule.solicitarCorreccion('${plan.id}')" 
                                class="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700">
                            Solicitar Corrección
                        </button>
                        <button onclick="aprobacionModule.rechazarPlan('${plan.id}')" 
                                class="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                            Rechazar
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    getEstadoColorClass(estado) {
        const clases = {
            'EN_REVISION': 'border-yellow-200 bg-yellow-50',
            'APROBADO': 'border-green-200 bg-green-50',
            'RECHAZADO': 'border-red-200 bg-red-50',
            'REQUIERE_CORRECCION': 'border-orange-200 bg-orange-50'
        };
        return clases[estado] || 'border-gray-200 bg-gray-50';
    }

    getEstadoBadgeClass(estado) {
        const clases = {
            'EN_REVISION': 'bg-yellow-100 text-yellow-800',
            'APROBADO': 'bg-green-100 text-green-800',
            'RECHAZADO': 'bg-red-100 text-red-800',
            'REQUIERE_CORRECCION': 'bg-orange-100 text-orange-800'
        };
        return clases[estado] || 'bg-gray-100 text-gray-800';
    }

    // Métodos de interfaz para botones
    visualizarPlan(planId) {
        try {
            const vista = this.visualizarPlan(planId);
            console.log('Vista del plan:', vista);
            alert(`Plan ${planId} cargado para revisión`);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    aprobarPlan(planId) {
        try {
            const aprobacion = this.aprobarPlan(planId, 'Plan aprobado tras revisión técnica');
            alert(`Plan ${planId} aprobado exitosamente`);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    solicitarCorreccion(planId) {
        const observaciones = prompt('Ingrese las observaciones para corrección:');
        if (observaciones) {
            try {
                this.solicitarCorreccionPlan(planId, observaciones, 'CORRECCION');
                alert(`Solicitud de corrección enviada para plan ${planId}`);
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        }
    }

    rechazarPlan(planId) {
        const motivos = prompt('Ingrese los motivos de rechazo:');
        if (motivos) {
            try {
                this.solicitarCorreccionPlan(planId, motivos, 'RECHAZO');
                alert(`Plan ${planId} rechazado`);
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        }
    }
}

// Instancia global del módulo
const aprobacionModule = new AprobacionModule();