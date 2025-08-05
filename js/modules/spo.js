// Módulo SPO - HU-07-18 a HU-07-24
class SPOModule {
    constructor() {
        this.memoriasSPO = [];
        this.planesSeguridadSPO = [];
        this.evaluacionesSPO = [];
        this.derivacionesSPO = [];
        this.expedientesOC = [];
        this.notificacionesSPO = [];
        this.init();
    }

    init() {
        this.cargarDatosPrueba();
    }

    cargarDatosPrueba() {
        this.memoriasSPO = [
            {
                id: 'MEM-SPO-2024-001',
                numeroMemoria: 'SPO-001-2024',
                titulo: 'Memoria Plan de Seguridad Minera',
                fechaRecepcion: new Date('2024-01-16'),
                remitente: 'OC/SGP',
                estado: 'RECIBIDA',
                documentos: [
                    { tipo: 'MEMORIA_PRINCIPAL', nombre: 'Memoria_Seguridad.pdf', validado: false },
                    { tipo: 'ANEXOS_TECNICOS', nombre: 'Anexos_Seguridad.pdf', validado: false },
                    { tipo: 'EVALUACION_RIESGOS', nombre: 'Evaluacion_Riesgos.xlsx', validado: true }
                ],
                verificacionCompleta: false
            }
        ];

        this.planesSeguridadSPO = [
            {
                id: 'PLAN-SEG-2024-001',
                memoriaBaseId: 'MEM-SPO-2024-001',
                titulo: 'Plan de Seguridad Operaciones Mineras 2024',
                tipo: 'PLAN_SEGURIDAD',
                estado: 'BORRADOR',
                fechaCreacion: new Date('2024-01-17'),
                elaboradoPor: 'Especialista SPO',
                firmaDigital: false,
                validado: false
            }
        ];
    }

    // HU-07-18: Derivar resultados de supervisión (SPO)
    // CA-18.1, CA-18.2, CA-18.3, CA-18.4: Verificar memoria OC/SGP
    verificarMemoriaOCSGP(memoriaId) {
        const memoria = this.memoriasSPO.find(m => m.id === memoriaId);
        if (!memoria) {
            throw new Error('Memoria no encontrada');
        }

        // CA-18.1: Visualizar memoria, anexos y documentos
        const vistaCompleta = {
            memoria: memoria,
            anexos: memoria.documentos.filter(d => d.tipo === 'ANEXOS_TECNICOS'),
            documentosRelacionados: this.obtenerDocumentosRelacionados(memoriaId),
            historialVerificaciones: this.obtenerHistorialVerificaciones(memoriaId)
        };

        // CA-18.2: Validar completitud, corrección y consistencia
        const validacion = {
            completitud: this.validarCompletitudSPO(memoria),
            correccion: this.validarCorreccionSPO(memoria),
            consistencia: this.validarConsistenciaSPO(memoria),
            fechaValidacion: new Date(),
            validadoPor: 'Especialista SPO'
        };

        // CA-18.4: Alertar automáticamente errores, duplicidad o falta de documentos
        const alertas = this.generarAlertasAutomaticasSPO(memoriaId);

        memoria.verificacionCompleta = validacion.completitud.valida && 
                                      validacion.correccion.valida && 
                                      validacion.consistencia.valida;

        return { vistaCompleta, validacion, alertas };
    }

    // CA-18.3: Adjuntar observaciones, solicitar subsanación o rechazar
    gestionarObservacionesMemoriaSPO(memoriaId, accion, observaciones) {
        const memoria = this.memoriasSPO.find(m => m.id === memoriaId);
        if (!memoria) {
            throw new Error('Memoria no encontrada');
        }

        const gestion = {
            id: this.generarId(),
            memoriaId: memoriaId,
            accion: accion, // 'OBSERVACIONES', 'SUBSANACION', 'RECHAZO'
            observaciones: observaciones,
            fechaGestion: new Date(),
            gestionadoPor: 'Especialista SPO',
            estado: 'ENVIADA'
        };

        // Actualizar estado según acción
        switch (accion) {
            case 'OBSERVACIONES':
                memoria.estado = 'CON_OBSERVACIONES_SPO';
                break;
            case 'SUBSANACION':
                memoria.estado = 'REQUIERE_SUBSANACION_SPO';
                break;
            case 'RECHAZO':
                memoria.estado = 'RECHAZADA_SPO';
                break;
        }

        this.notificarGestionMemoriaSPO(gestion);
        this.registrarEnBitacora(gestion, `MEMORIA_SPO_${accion}`);

        return gestion;
    }

    // HU-07-19: Derivar Plan de acción OC/SGP (SPO)
    // CA-19.1, CA-19.2, CA-19.3, CA-19.4: Elaborar plan de seguridad
    elaborarPlanSeguridad(memoriaId, plantillaId = 'PLANTILLA_SEGURIDAD_001') {
        const memoria = this.memoriasSPO.find(m => m.id === memoriaId);
        if (!memoria) {
            throw new Error('Memoria no encontrada');
        }

        if (!memoria.verificacionCompleta) {
            throw new Error('La memoria debe estar completamente verificada');
        }

        // CA-19.1: Generar con plantilla predefinida y datos validados
        const planSeguridad = {
            id: this.generarId(),
            memoriaBaseId: memoriaId,
            plantillaId: plantillaId,
            titulo: `Plan de Seguridad - ${memoria.titulo}`,
            tipo: 'PLAN_SEGURIDAD',
            estado: 'BORRADOR',
            fechaCreacion: new Date(),
            elaboradoPor: 'Especialista SPO',
            contenido: this.generarContenidoPlanSeguridad(memoria),
            documentos: [],
            firmaDigital: false,
            validado: false
        };

        this.planesSeguridadSPO.push(planSeguridad);

        // CA-19.3: Registrar en SICPO y vincular
        this.registrarPlanSeguridadSICPO(planSeguridad);
        this.vincularPlanConMemoriaSPO(planSeguridad.id, memoriaId);

        return planSeguridad;
    }

    // CA-19.2: Validar datos correctos, completos y firmados digitalmente
    validarPlanSeguridad(planId) {
        const plan = this.planesSeguridadSPO.find(p => p.id === planId);
        if (!plan) {
            throw new Error('Plan de seguridad no encontrado');
        }

        const validacion = {
            datosCorrectos: this.validarDatosPlanSeguridad(plan),
            datosCompletos: this.validarCompletitudPlanSeguridad(plan),
            firmaDigital: this.validarFirmaDigitalSPO(plan),
            fechaValidacion: new Date(),
            validadoPor: 'Especialista SPO'
        };

        plan.validado = validacion.datosCorrectos.valido && 
                       validacion.datosCompletos.valido && 
                       validacion.firmaDigital.valido;

        return validacion;
    }

    // CA-19.4: Enviar plan de seguridad a responsables para revisión
    enviarPlanSeguridadRevision(planId, responsables) {
        const plan = this.planesSeguridadSPO.find(p => p.id === planId);
        if (!plan) {
            throw new Error('Plan de seguridad no encontrado');
        }

        const validacion = this.validarPlanSeguridad(planId);
        if (!validacion.datosCorrectos.valido || !validacion.datosCompletos.valido) {
            throw new Error('Plan no cumple requisitos para envío');
        }

        const envios = responsables.map(responsable => {
            const envio = {
                id: this.generarId(),
                planId: planId,
                responsable: responsable,
                fechaEnvio: new Date(),
                estado: 'ENVIADO',
                requiereRevision: true,
                fechaLimiteRevision: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 días
            };

            this.notificarEnvioRevisionSPO(envio);
            return envio;
        });

        plan.estado = 'EN_REVISION_SPO';
        return envios;
    }

    // HU-07-20: Evaluar plan de acción SGP/OC propuesto
    // CA-20.1, CA-20.2, CA-20.3, CA-20.4: Revisar cumplimiento plan de seguridad
    evaluarCumplimientoPlanSeguridad(planId, criteriosEvaluacion) {
        const plan = this.planesSeguridadSPO.find(p => p.id === planId);
        if (!plan) {
            throw new Error('Plan de seguridad no encontrado');
        }

        // CA-20.1: Visualizar y verificar cumplimiento según criterios
        const evaluacion = {
            id: this.generarId(),
            planId: planId,
            criterios: criteriosEvaluacion,
            resultados: this.evaluarCriteriosTecnicos(plan, criteriosEvaluacion),
            fechaEvaluacion: new Date(),
            evaluadoPor: 'Especialista SPO',
            estado: 'COMPLETADA'
        };

        this.evaluacionesSPO.push(evaluacion);

        // CA-20.2: Registrar observaciones y requerir acciones correctivas
        if (evaluacion.resultados.requiereAcciones) {
            this.registrarObservacionesEvaluacion(evaluacion);
        }

        // CA-20.3: Notificar resultados automáticamente
        this.notificarResultadosEvaluacionSPO(evaluacion);

        // CA-20.4: Generar alertas para acciones no cumplidas
        if (evaluacion.resultados.accionesNoCumplidas.length > 0) {
            this.generarAlertasAccionesNoCumplidas(evaluacion);
        }

        return evaluacion;
    }

    // HU-07-21: Derivar Plan de acción de OC (SPO)
    // CA-21.1, CA-21.2, CA-21.3, CA-21.4: Derivar plan a supervisores
    derivarPlanSeguridadSupervisores(planId, supervisores) {
        const plan = this.planesSeguridadSPO.find(p => p.id === planId);
        if (!plan) {
            throw new Error('Plan de seguridad no encontrado');
        }

        // CA-21.1: Enviar a supervisores y vincular al expediente
        const derivaciones = supervisores.map(supervisor => {
            const derivacion = {
                id: this.generarId(),
                planId: planId,
                supervisor: supervisor,
                fechaDerivacion: new Date(),
                estado: 'DERIVADO',
                vinculadoExpediente: true,
                acuseRecibido: false
            };

            // CA-21.2: Validar notificación y acuse de recepción
            this.notificarDerivacionSupervisor(derivacion);
            this.validarNotificacionSupervisor(derivacion);

            return derivacion;
        });

        this.derivacionesSPO.push(...derivaciones);

        // CA-21.3: Rastrear estado de ejecución
        this.iniciarRastreoEjecucion(planId, derivaciones);

        // CA-21.4: Alertar retrasos, incumplimientos o desviaciones
        this.programarAlertasDerivacion(derivaciones);

        return derivaciones;
    }

    // HU-07-22: Evaluar Plan de acción OC propuesto
    // CA-22.1, CA-22.2, CA-22.3, CA-22.4: Evaluar respuesta OC/SGP
    evaluarRespuestaOCSGP(planId, respuestaOC) {
        const plan = this.planesSeguridadSPO.find(p => p.id === planId);
        if (!plan) {
            throw new Error('Plan de seguridad no encontrado');
        }

        // CA-22.1: Visualizar respuesta y evaluar cumplimiento
        const evaluacionRespuesta = {
            id: this.generarId(),
            planId: planId,
            respuestaOC: respuestaOC,
            evaluacionTecnica: this.evaluarCriteriosTecnicosRespuesta(respuestaOC),
            evaluacionNormativa: this.evaluarCriteriosNormativosRespuesta(respuestaOC),
            fechaEvaluacion: new Date(),
            evaluadoPor: 'Especialista SPO'
        };

        // CA-22.2: Registrar observaciones y requerir acciones correctivas
        if (evaluacionRespuesta.evaluacionTecnica.requiereAcciones) {
            evaluacionRespuesta.observaciones = this.generarObservacionesRespuesta(evaluacionRespuesta);
            evaluacionRespuesta.accionesCorrectivas = this.definirAccionesCorrectivas(evaluacionRespuesta);
        }

        // CA-22.3: Notificar resultados automáticamente
        this.notificarResultadosEvaluacionRespuesta(evaluacionRespuesta);

        // CA-22.4: Generar alertas para NCs pendientes
        this.generarAlertasNCsPendientes(evaluacionRespuesta);

        return evaluacionRespuesta;
    }

    // HU-07-23: Notificar OC cierre de supervisión
    // CA-23.1, CA-23.2, CA-23.3, CA-23.4: Notificar cierre
    notificarCierrePlanSeguridadOC(planId, informeFinal) {
        const plan = this.planesSeguridadSPO.find(p => p.id === planId);
        if (!plan) {
            throw new Error('Plan de seguridad no encontrado');
        }

        // CA-23.1: Enviar notificación formal de cierre
        const notificacionCierre = {
            id: this.generarId(),
            planId: planId,
            tipo: 'CIERRE_PLAN_SEGURIDAD',
            destinatarios: ['OC/SGP', 'SOLICITANTE'],
            informeFinal: informeFinal,
            fechaEnvio: new Date(),
            estado: 'ENVIADA'
        };

        // CA-23.2: Generar acuse de recepción y solicitar confirmación
        const acuseCierre = this.generarAcuseCierreSPO(notificacionCierre);

        // CA-23.3: Archivar automáticamente documentos
        this.archivarDocumentosCierreSPO(planId);

        // CA-23.4: Registrar comentarios y retroalimentación
        this.habilitarRetroalimentacionCierre(notificacionCierre);

        this.notificacionesSPO.push(notificacionCierre);
        plan.estado = 'CERRADO';

        return { notificacionCierre, acuseCierre };
    }

    // HU-07-24: Registrar y archivar expediente OC
    // CA-24.1, CA-24.2, CA-24.3, CA-24.4: Archivar expediente completo
    registrarArchivarExpedienteOC(planId) {
        const plan = this.planesSeguridadSPO.find(p => p.id === planId);
        if (!plan) {
            throw new Error('Plan de seguridad no encontrado');
        }

        // CA-24.1: Registrar todos los documentos generados
        const expedienteOC = {
            id: this.generarId(),
            planId: planId,
            tipo: 'EXPEDIENTE_SEGURIDAD_OC',
            documentosGenerados: this.recopilarDocumentosGenerados(planId),
            fechaCreacion: new Date(),
            creadoPor: 'Especialista SPO'
        };

        // CA-24.2: Validar completitud, firma y autorización
        const validacionExpediente = this.validarExpedienteCompleto(expedienteOC);
        if (!validacionExpediente.valido) {
            throw new Error(`Expediente incompleto: ${validacionExpediente.errores.join(', ')}`);
        }

        // CA-24.3: Generar sello de cierre y almacenar
        const selloCierre = this.generarSelloCierreSPO(expedienteOC);
        expedienteOC.selloCierre = selloCierre;
        expedienteOC.estado = 'ARCHIVADO';

        this.almacenarEnRepositorioSeguridad(expedienteOC);
        this.expedientesOC.push(expedienteOC);

        // CA-24.4: Generar reportes y estadísticas
        const reporteProcesoSeguridad = this.generarReporteProcesoSeguridad(expedienteOC);

        return { expedienteOC, reporteProcesoSeguridad };
    }

    // Métodos auxiliares de validación
    validarCompletitudSPO(memoria) {
        const errores = [];
        const documentosRequeridos = ['MEMORIA_PRINCIPAL', 'ANEXOS_TECNICOS', 'EVALUACION_RIESGOS'];
        
        documentosRequeridos.forEach(docTipo => {
            if (!memoria.documentos.some(d => d.tipo === docTipo)) {
                errores.push(`Falta documento: ${docTipo}`);
            }
        });

        return { valida: errores.length === 0, errores };
    }

    validarCorreccionSPO(memoria) {
        const errores = [];
        
        if (!memoria.numeroMemoria?.match(/^SPO-\d{3}-\d{4}$/)) {
            errores.push('Formato incorrecto de número de memoria SPO');
        }

        return { valida: errores.length === 0, errores };
    }

    validarConsistenciaSPO(memoria) {
        const inconsistencias = [];
        // Lógica de validación de consistencia específica para SPO
        return { valida: inconsistencias.length === 0, inconsistencias };
    }

    generarAlertasAutomaticasSPO(memoriaId) {
        const alertas = [];
        // Lógica para generar alertas automáticas específicas de SPO
        return alertas;
    }

    generarContenidoPlanSeguridad(memoria) {
        return {
            objetivosSeguridad: `Objetivos de seguridad basados en ${memoria.titulo}`,
            alcanceSeguridad: 'Alcance de seguridad operacional',
            metodologiaSeguridad: 'Metodología de gestión de seguridad',
            recursosSeguridad: 'Recursos para implementación de seguridad',
            indicadoresSeguridad: 'KPIs de seguridad operacional',
            planContingencia: 'Plan de contingencia y respuesta a emergencias'
        };
    }

    // Métodos de notificación y registro
    notificarGestionMemoriaSPO(gestion) {
        console.log('Notificando gestión memoria SPO:', gestion);
    }

    registrarPlanSeguridadSICPO(plan) {
        console.log('Registrando plan de seguridad en SICPO:', plan.id);
    }

    vincularPlanConMemoriaSPO(planId, memoriaId) {
        const memoria = this.memoriasSPO.find(m => m.id === memoriaId);
        if (memoria) {
            memoria.planSeguridadId = planId;
        }
    }

    registrarEnBitacora(objeto, accion) {
        const entrada = {
            id: this.generarId(),
            accion: accion,
            fecha: new Date(),
            usuario: 'Especialista SPO',
            detalles: objeto,
            modulo: 'SPO'
        };

        console.log('Registro en bitácora SPO:', entrada);
        return entrada;
    }

    generarId() {
        return `SPO-${Date.now().toString(36).toUpperCase()}`;
    }

    // Métodos para la interfaz
    getMemoriasSPOHTML() {
        return this.memoriasSPO.map(memoria => `
            <div class="border rounded-lg p-4 mb-4 border-purple-200 bg-purple-50">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h4 class="font-semibold text-gray-900">${memoria.titulo}</h4>
                        <p class="text-sm text-gray-600">Número: ${memoria.numeroMemoria}</p>
                        <p class="text-sm text-gray-600">Remitente: ${memoria.remitente}</p>
                    </div>
                    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        ${memoria.estado}
                    </span>
                </div>
                <div class="flex space-x-2">
                    <button onclick="spoModule.verificarMemoria('${memoria.id}')" 
                            class="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700">
                        Verificar
                    </button>
                    <button onclick="spoModule.elaborarPlan('${memoria.id}')" 
                            class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                        Elaborar Plan
                    </button>
                </div>
            </div>
        `).join('');
    }

    getPlanesSeguridadHTML() {
        return this.planesSeguridadSPO.map(plan => `
            <div class="border rounded-lg p-4 mb-4 border-green-200 bg-green-50">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h4 class="font-semibold text-gray-900">${plan.titulo}</h4>
                        <p class="text-sm text-gray-600">ID: ${plan.id}</p>
                        <p class="text-sm text-gray-600">Elaborado por: ${plan.elaboradoPor}</p>
                    </div>
                    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        ${plan.estado}
                    </span>
                </div>
                <div class="flex space-x-2">
                    <button onclick="spoModule.evaluarPlan('${plan.id}')" 
                            class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                        Evaluar
                    </button>
                    <button onclick="spoModule.derivarSupervisores('${plan.id}')" 
                            class="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700">
                        Derivar
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Métodos de interfaz
    verificarMemoria(memoriaId) {
        try {
            const resultado = this.verificarMemoriaOCSGP(memoriaId);
            console.log('Verificación memoria SPO:', resultado);
            alert(`Memoria ${memoriaId} verificada. Ver consola para detalles.`);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    elaborarPlan(memoriaId) {
        try {
            const plan = this.elaborarPlanSeguridad(memoriaId);
            alert(`Plan de seguridad ${plan.id} elaborado exitosamente`);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    evaluarPlan(planId) {
        const criterios = ['SEGURIDAD_OPERACIONAL', 'CUMPLIMIENTO_NORMATIVO', 'GESTION_RIESGOS'];
        try {
            const evaluacion = this.evaluarCumplimientoPlanSeguridad(planId, criterios);
            alert(`Plan ${planId} evaluado. ID evaluación: ${evaluacion.id}`);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    derivarSupervisores(planId) {
        const supervisores = ['SUPERVISOR_SEGURIDAD_1', 'SUPERVISOR_SEGURIDAD_2'];
        try {
            const derivaciones = this.derivarPlanSeguridadSupervisores(planId, supervisores);
            alert(`Plan ${planId} derivado a ${derivaciones.length} supervisores`);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    // Métodos auxiliares adicionales (implementación básica)
    obtenerDocumentosRelacionados(memoriaId) { return []; }
    obtenerHistorialVerificaciones(memoriaId) { return []; }
    notificarEnvioRevisionSPO(envio) { console.log('Envío revisión SPO:', envio); }
    evaluarCriteriosTecnicos(plan, criterios) { return { requiereAcciones: false, accionesNoCumplidas: [] }; }
    registrarObservacionesEvaluacion(evaluacion) { console.log('Observaciones evaluación:', evaluacion); }
    notificarResultadosEvaluacionSPO(evaluacion) { console.log('Notificando resultados:', evaluacion); }
    generarAlertasAccionesNoCumplidas(evaluacion) { console.log('Alertas acciones:', evaluacion); }
    notificarDerivacionSupervisor(derivacion) { console.log('Notificando derivación:', derivacion); }
    validarNotificacionSupervisor(derivacion) { return true; }
    iniciarRastreoEjecucion(planId, derivaciones) { console.log('Iniciando rastreo:', planId); }
    programarAlertasDerivacion(derivaciones) { console.log('Programando alertas:', derivaciones); }
    evaluarCriteriosTecnicosRespuesta(respuesta) { return { requiereAcciones: false }; }
    evaluarCriteriosNormativosRespuesta(respuesta) { return { requiereAcciones: false }; }
    generarObservacionesRespuesta(evaluacion) { return []; }
    definirAccionesCorrectivas(evaluacion) { return []; }
    notificarResultadosEvaluacionRespuesta(evaluacion) { console.log('Notificando evaluación respuesta:', evaluacion); }
    generarAlertasNCsPendientes(evaluacion) { console.log('Alertas NCs pendientes:', evaluacion); }
    generarAcuseCierreSPO(notificacion) { return { id: this.generarId(), notificacionId: notificacion.id }; }
    archivarDocumentosCierreSPO(planId) { console.log('Archivando documentos:', planId); }
    habilitarRetroalimentacionCierre(notificacion) { console.log('Habilitando retroalimentación:', notificacion); }
    recopilarDocumentosGenerados(planId) { return []; }
    validarExpedienteCompleto(expediente) { return { valido: true, errores: [] }; }
    generarSelloCierreSPO(expediente) { return { id: this.generarId(), fecha: new Date() }; }
    almacenarEnRepositorioSeguridad(expediente) { console.log('Almacenando en repositorio:', expediente); }
    generarReporteProcesoSeguridad(expediente) { return { id: this.generarId(), expedienteId: expediente.id }; }
    validarDatosPlanSeguridad(plan) { return { valido: true, errores: [] }; }
    validarCompletitudPlanSeguridad(plan) { return { valido: true, errores: [] }; }
    validarFirmaDigitalSPO(plan) { return { valido: plan.firmaDigital, errores: [] }; }
}

// Instancia global del módulo
const spoModule = new SPOModule();