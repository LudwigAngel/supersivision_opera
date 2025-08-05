// Módulo de Planes de Acción y NCs - HU-07-14, HU-07-15, HU-07-16
class PlanesAccionModule {
    constructor() {
        this.planesAccion = [];
        this.ncs = []; // No Conformidades
        this.seguimientoEjecucion = [];
        this.evaluacionesNC = [];
        this.notificacionesCierre = [];
        this.init();
    }

    init() {
        this.cargarDatosPrueba();
    }

    cargarDatosPrueba() {
        this.planesAccion = [
            {
                id: 'PA-2024-001',
                titulo: 'Plan de Acción Correctiva - Supervisión Minera',
                tipo: 'PLAN_ACCION_CORRECTIVA',
                origen: 'OC/SGP',
                fechaRecepcion: new Date('2024-01-18'),
                estado: 'RECIBIDO',
                responsables: ['SUPERVISOR_OPERACIONES', 'JEFE_SEGURIDAD'],
                acciones: [
                    {
                        id: 'ACC-001',
                        descripcion: 'Implementar protocolo de seguridad actualizado',
                        responsable: 'JEFE_SEGURIDAD',
                        fechaLimite: new Date('2024-02-15'),
                        estado: 'PENDIENTE',
                        prioridad: 'ALTA'
                    },
                    {
                        id: 'ACC-002',
                        descripcion: 'Capacitar personal en nuevos procedimientos',
                        responsable: 'SUPERVISOR_OPERACIONES',
                        fechaLimite: new Date('2024-02-28'),
                        estado: 'EN_PROGRESO',
                        prioridad: 'MEDIA'
                    }
                ],
                expedienteId: 'EXP-2024-001'
            }
        ];

        this.ncs = [
            {
                id: 'NC-2024-001',
                titulo: 'No Conformidad - Procedimientos de Seguridad',
                tipo: 'NO_CONFORMIDAD_MAYOR',
                descripcion: 'Incumplimiento en procedimientos de seguridad operacional',
                fechaDeteccion: new Date('2024-01-15'),
                estado: 'ABIERTA',
                criticidad: 'ALTA',
                responsableCorreccion: 'JEFE_SEGURIDAD',
                planAccionId: 'PA-2024-001',
                fechaLimiteCorreccion: new Date('2024-02-15'),
                evidencias: ['Foto_incumplimiento.jpg', 'Reporte_auditoria.pdf']
            }
        ];
    }

    // HU-07-14: Derivar Plan de acción de SGP
    // CA-14.1: Enviar plan de acción a responsables y vincular al expediente
    derivarPlanAccion(planId, responsables, expedienteId) {
        const plan = this.planesAccion.find(p => p.id === planId);
        if (!plan) {
            throw new Error('Plan de acción no encontrado');
        }

        const derivacion = {
            id: this.generarId(),
            planId: planId,
            responsables: responsables,
            expedienteId: expedienteId,
            fechaDerivacion: new Date(),
            estado: 'DERIVADO',
            notificacionesEnviadas: []
        };

        // Vincular al expediente
        plan.expedienteId = expedienteId;
        plan.estado = 'DERIVADO';

        // CA-14.2: Validar notificaciones y acuse de recepción
        const notificaciones = this.enviarNotificacionesResponsables(derivacion);
        derivacion.notificacionesEnviadas = notificaciones;

        // CA-14.3: Iniciar rastreo de ejecución
        this.iniciarRastreoEjecucionPlan(derivacion);

        // CA-14.4: Programar alertas de seguimiento
        this.programarAlertasSeguimiento(derivacion);

        // Registrar en bitácora
        this.registrarEnBitacora(derivacion, 'PLAN_ACCION_DERIVADO');

        return derivacion;
    }

    // CA-14.2: Validar notificaciones y acuse de recepción
    enviarNotificacionesResponsables(derivacion) {
        const notificaciones = derivacion.responsables.map(responsable => {
            const notificacion = {
                id: this.generarId(),
                derivacionId: derivacion.id,
                destinatario: responsable,
                tipo: 'DERIVACION_PLAN_ACCION',
                asunto: `Plan de Acción Asignado - ${derivacion.planId}`,
                mensaje: `Se le ha asignado el plan de acción ${derivacion.planId} para su ejecución`,
                fechaEnvio: new Date(),
                requiereAcuse: true,
                acuseRecibido: false,
                estado: 'ENVIADA'
            };

            // Simular envío
            console.log('Enviando notificación plan de acción:', notificacion);

            // Programar seguimiento de acuse
            this.programarSeguimientoAcuse(notificacion);

            return notificacion;
        });

        return notificaciones;
    }

    // CA-14.3: Rastrear estado de ejecución del plan y acciones correctivas
    iniciarRastreoEjecucionPlan(derivacion) {
        const rastreo = {
            id: this.generarId(),
            planId: derivacion.planId,
            derivacionId: derivacion.id,
            fechaInicio: new Date(),
            estado: 'ACTIVO',
            progreso: 0,
            accionesCompletadas: 0,
            accionesTotales: 0,
            alertasGeneradas: [],
            ultimaActualizacion: new Date()
        };

        // Calcular total de acciones
        const plan = this.planesAccion.find(p => p.id === derivacion.planId);
        if (plan) {
            rastreo.accionesTotales = plan.acciones.length;
        }

        this.seguimientoEjecucion.push(rastreo);

        // Programar actualizaciones periódicas
        this.programarActualizacionesRastreo(rastreo);

        return rastreo;
    }

    // CA-14.4: Alertar retrasos, incumplimientos o desviaciones
    programarAlertasSeguimiento(derivacion) {
        const plan = this.planesAccion.find(p => p.id === derivacion.planId);
        if (!plan) return;

        // Programar alertas para cada acción
        plan.acciones.forEach(accion => {
            // Alerta 3 días antes del vencimiento
            const fechaAlerta = new Date(accion.fechaLimite.getTime() - 3 * 24 * 60 * 60 * 1000);
            
            if (fechaAlerta > new Date()) {
                setTimeout(() => {
                    this.generarAlertaVencimiento(accion, derivacion);
                }, fechaAlerta.getTime() - new Date().getTime());
            }

            // Alerta de vencimiento
            if (accion.fechaLimite > new Date()) {
                setTimeout(() => {
                    this.generarAlertaVencido(accion, derivacion);
                }, accion.fechaLimite.getTime() - new Date().getTime());
            }
        });
    }

    generarAlertaVencimiento(accion, derivacion) {
        const alerta = {
            id: this.generarId(),
            tipo: 'PROXIMO_VENCIMIENTO',
            accionId: accion.id,
            planId: derivacion.planId,
            mensaje: `La acción "${accion.descripcion}" vence en 3 días`,
            fechaGeneracion: new Date(),
            prioridad: accion.prioridad,
            estado: 'ACTIVA'
        };

        console.log('Alerta de próximo vencimiento:', alerta);
        this.notificarAlerta(alerta, accion.responsable);
    }

    generarAlertaVencido(accion, derivacion) {
        if (accion.estado !== 'COMPLETADA') {
            const alerta = {
                id: this.generarId(),
                tipo: 'ACCION_VENCIDA',
                accionId: accion.id,
                planId: derivacion.planId,
                mensaje: `La acción "${accion.descripcion}" ha vencido y no está completada`,
                fechaGeneracion: new Date(),
                prioridad: 'CRITICA',
                estado: 'ACTIVA'
            };

            console.log('Alerta de acción vencida:', alerta);
            this.notificarAlerta(alerta, accion.responsable);
            this.escalarAlerta(alerta);
        }
    }

    // HU-07-15: Notificar NCs y Observaciones al SGP
    // CA-15.1: Visualizar NCs y evaluar cumplimiento
    evaluarCumplimientoNCs(criteriosTecnicos, criteriosNormativos) {
        const evaluacion = {
            id: this.generarId(),
            fechaEvaluacion: new Date(),
            evaluadoPor: 'Jefe DDEE',
            criteriosTecnicos: criteriosTecnicos,
            criteriosNormativos: criteriosNormativos,
            ncsEvaluadas: [],
            resultados: {
                cumplidas: 0,
                pendientes: 0,
                vencidas: 0,
                noConformes: 0
            }
        };

        // Evaluar cada NC
        this.ncs.forEach(nc => {
            const evaluacionNC = this.evaluarNC(nc, criteriosTecnicos, criteriosNormativos);
            evaluacion.ncsEvaluadas.push(evaluacionNC);

            // Actualizar contadores
            switch (evaluacionNC.resultado) {
                case 'CUMPLIDA':
                    evaluacion.resultados.cumplidas++;
                    break;
                case 'PENDIENTE':
                    evaluacion.resultados.pendientes++;
                    break;
                case 'VENCIDA':
                    evaluacion.resultados.vencidas++;
                    break;
                case 'NO_CONFORME':
                    evaluacion.resultados.noConformes++;
                    break;
            }
        });

        this.evaluacionesNC.push(evaluacion);
        return evaluacion;
    }

    evaluarNC(nc, criteriosTecnicos, criteriosNormativos) {
        const evaluacionNC = {
            ncId: nc.id,
            fechaEvaluacion: new Date(),
            cumpleCriteriosTecnicos: this.verificarCriteriosTecnicos(nc, criteriosTecnicos),
            cumpleCriteriosNormativos: this.verificarCriteriosNormativos(nc, criteriosNormativos),
            observaciones: [],
            accionesRequeridas: [],
            resultado: 'PENDIENTE'
        };

        // Determinar resultado
        if (nc.estado === 'CERRADA' && evaluacionNC.cumpleCriteriosTecnicos && evaluacionNC.cumpleCriteriosNormativos) {
            evaluacionNC.resultado = 'CUMPLIDA';
        } else if (nc.fechaLimiteCorreccion < new Date() && nc.estado !== 'CERRADA') {
            evaluacionNC.resultado = 'VENCIDA';
        } else if (!evaluacionNC.cumpleCriteriosTecnicos || !evaluacionNC.cumpleCriteriosNormativos) {
            evaluacionNC.resultado = 'NO_CONFORME';
            evaluacionNC.accionesRequeridas = this.definirAccionesCorrectivas(nc, evaluacionNC);
        }

        return evaluacionNC;
    }

    // CA-15.2: Registrar observaciones y requerir acciones correctivas
    registrarObservacionesNC(ncId, observaciones, accionesCorrectivas) {
        const nc = this.ncs.find(n => n.id === ncId);
        if (!nc) {
            throw new Error('No Conformidad no encontrada');
        }

        const registro = {
            id: this.generarId(),
            ncId: ncId,
            observaciones: observaciones,
            accionesCorrectivas: accionesCorrectivas,
            fechaRegistro: new Date(),
            registradoPor: 'Jefe DDEE',
            estado: 'REGISTRADA'
        };

        // Actualizar NC
        nc.observaciones = nc.observaciones || [];
        nc.observaciones.push(registro);
        nc.accionesCorrectivas = nc.accionesCorrectivas || [];
        nc.accionesCorrectivas.push(...accionesCorrectivas);

        // Si hay acciones correctivas, cambiar estado
        if (accionesCorrectivas.length > 0) {
            nc.estado = 'REQUIERE_ACCION_CORRECTIVA';
        }

        return registro;
    }

    // CA-15.3: Notificar resultados automáticamente
    notificarResultadosEvaluacionNC(evaluacionId) {
        const evaluacion = this.evaluacionesNC.find(e => e.id === evaluacionId);
        if (!evaluacion) {
            throw new Error('Evaluación no encontrada');
        }

        const destinatarios = ['OC/SGP', 'RESPONSABLES_CORRECCION'];
        const notificaciones = destinatarios.map(destinatario => {
            const notificacion = {
                id: this.generarId(),
                evaluacionId: evaluacionId,
                destinatario: destinatario,
                tipo: 'RESULTADOS_EVALUACION_NC',
                asunto: 'Resultados de Evaluación de No Conformidades',
                contenido: this.generarContenidoNotificacionNC(evaluacion),
                fechaEnvio: new Date(),
                estado: 'ENVIADA',
                requiereAcuse: true
            };

            console.log('Notificando resultados evaluación NC:', notificacion);
            return notificacion;
        });

        return notificaciones;
    }

    // CA-15.4: Generar alertas para NCs pendientes o no solucionadas
    generarAlertasNCsPendientes() {
        const alertas = [];
        const fechaActual = new Date();

        this.ncs.forEach(nc => {
            // Alerta para NCs vencidas
            if (nc.fechaLimiteCorreccion < fechaActual && nc.estado !== 'CERRADA') {
                alertas.push({
                    id: this.generarId(),
                    tipo: 'NC_VENCIDA',
                    ncId: nc.id,
                    mensaje: `NC ${nc.id} ha vencido sin solución`,
                    fechaGeneracion: fechaActual,
                    prioridad: 'CRITICA',
                    estado: 'ACTIVA'
                });
            }

            // Alerta para NCs próximas a vencer
            const diasParaVencimiento = Math.ceil((nc.fechaLimiteCorreccion - fechaActual) / (1000 * 60 * 60 * 24));
            if (diasParaVencimiento <= 3 && diasParaVencimiento > 0 && nc.estado !== 'CERRADA') {
                alertas.push({
                    id: this.generarId(),
                    tipo: 'NC_PROXIMO_VENCIMIENTO',
                    ncId: nc.id,
                    mensaje: `NC ${nc.id} vence en ${diasParaVencimiento} días`,
                    fechaGeneracion: fechaActual,
                    prioridad: 'ALTA',
                    estado: 'ACTIVA'
                });
            }
        });

        // Notificar alertas
        alertas.forEach(alerta => {
            this.notificarAlertaNC(alerta);
        });

        return alertas;
    }

    // HU-07-16: Notificar SGP cierre de supervisión
    // CA-16.1: Enviar notificación formal de cierre con informe final
    notificarCierreSupervision(planId, informeFinalCumplimiento) {
        const plan = this.planesAccion.find(p => p.id === planId);
        if (!plan) {
            throw new Error('Plan de acción no encontrado');
        }

        // Verificar que todas las NCs estén cerradas
        const ncsAbiertas = this.ncs.filter(nc => 
            nc.planAccionId === planId && nc.estado !== 'CERRADA'
        );

        if (ncsAbiertas.length > 0) {
            throw new Error(`No se puede cerrar: ${ncsAbiertas.length} NCs aún abiertas`);
        }

        const notificacionCierre = {
            id: this.generarId(),
            planId: planId,
            tipo: 'CIERRE_SUPERVISION',
            destinatarios: ['OC/SGP', 'SOLICITANTE'],
            informeFinal: informeFinalCumplimiento,
            fechaEnvio: new Date(),
            estado: 'ENVIADA',
            resumenCierre: this.generarResumenCierre(planId)
        };

        // CA-16.2: Generar acuse de recepción y solicitar confirmación
        const acuseCierre = this.generarAcuseCierre(notificacionCierre);

        // CA-16.3: Archivar automáticamente documentos
        this.archivarDocumentosCierre(planId);

        // Actualizar estado del plan
        plan.estado = 'CERRADO';
        plan.fechaCierre = new Date();

        this.notificacionesCierre.push(notificacionCierre);

        return { notificacionCierre, acuseCierre };
    }

    // CA-16.4: Registrar comentarios y retroalimentación sobre el cierre
    registrarRetroalimentacionCierre(notificacionId, comentarios, retroalimentacion) {
        const notificacion = this.notificacionesCierre.find(n => n.id === notificacionId);
        if (!notificacion) {
            throw new Error('Notificación de cierre no encontrada');
        }

        const registro = {
            id: this.generarId(),
            notificacionId: notificacionId,
            comentarios: comentarios,
            retroalimentacion: retroalimentacion,
            fechaRegistro: new Date(),
            registradoPor: 'Sistema',
            fuente: 'OC/SGP'
        };

        notificacion.retroalimentacion = notificacion.retroalimentacion || [];
        notificacion.retroalimentacion.push(registro);

        // Analizar retroalimentación para mejoras
        this.analizarRetroalimentacion(registro);

        return registro;
    }

    // Métodos auxiliares
    verificarCriteriosTecnicos(nc, criterios) {
        // Lógica de verificación técnica
        return true; // Simplificado
    }

    verificarCriteriosNormativos(nc, criterios) {
        // Lógica de verificación normativa
        return true; // Simplificado
    }

    definirAccionesCorrectivas(nc, evaluacion) {
        const acciones = [];
        
        if (!evaluacion.cumpleCriteriosTecnicos) {
            acciones.push({
                tipo: 'CORRECCION_TECNICA',
                descripcion: 'Implementar corrección técnica según estándares',
                responsable: nc.responsableCorreccion,
                fechaLimite: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 días
            });
        }

        if (!evaluacion.cumpleCriteriosNormativos) {
            acciones.push({
                tipo: 'CORRECCION_NORMATIVA',
                descripcion: 'Ajustar según normativa vigente',
                responsable: nc.responsableCorreccion,
                fechaLimite: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 días
            });
        }

        return acciones;
    }

    generarContenidoNotificacionNC(evaluacion) {
        return {
            resumen: `Evaluación de ${evaluacion.ncsEvaluadas.length} No Conformidades`,
            resultados: evaluacion.resultados,
            detalles: evaluacion.ncsEvaluadas,
            recomendaciones: this.generarRecomendaciones(evaluacion)
        };
    }

    generarRecomendaciones(evaluacion) {
        const recomendaciones = [];
        
        if (evaluacion.resultados.vencidas > 0) {
            recomendaciones.push('Priorizar atención de NCs vencidas');
        }
        
        if (evaluacion.resultados.noConformes > 0) {
            recomendaciones.push('Implementar acciones correctivas para NCs no conformes');
        }

        return recomendaciones;
    }

    generarResumenCierre(planId) {
        const plan = this.planesAccion.find(p => p.id === planId);
        const ncsRelacionadas = this.ncs.filter(nc => nc.planAccionId === planId);
        
        return {
            planId: planId,
            totalAcciones: plan.acciones.length,
            accionesCompletadas: plan.acciones.filter(a => a.estado === 'COMPLETADA').length,
            totalNCs: ncsRelacionadas.length,
            ncsCerradas: ncsRelacionadas.filter(nc => nc.estado === 'CERRADA').length,
            fechaCierre: new Date(),
            cumplimientoGeneral: this.calcularCumplimientoGeneral(plan, ncsRelacionadas)
        };
    }

    calcularCumplimientoGeneral(plan, ncs) {
        const accionesCompletadas = plan.acciones.filter(a => a.estado === 'COMPLETADA').length;
        const ncsCerradas = ncs.filter(nc => nc.estado === 'CERRADA').length;
        
        const porcentajeAcciones = plan.acciones.length > 0 ? (accionesCompletadas / plan.acciones.length) * 100 : 100;
        const porcentajeNCs = ncs.length > 0 ? (ncsCerradas / ncs.length) * 100 : 100;
        
        return Math.round((porcentajeAcciones + porcentajeNCs) / 2);
    }

    // Métodos de notificación y utilidades
    programarSeguimientoAcuse(notificacion) {
        setTimeout(() => {
            if (!notificacion.acuseRecibido) {
                this.generarAlertaNoAcuse(notificacion);
            }
        }, 24 * 60 * 60 * 1000); // 24 horas
    }

    generarAlertaNoAcuse(notificacion) {
        const alerta = {
            id: this.generarId(),
            tipo: 'NO_ACUSE_PLAN_ACCION',
            notificacionId: notificacion.id,
            mensaje: `${notificacion.destinatario} no ha confirmado recepción del plan de acción`,
            fechaGeneracion: new Date(),
            estado: 'ACTIVA'
        };

        console.log('Alerta de no acuse:', alerta);
    }

    notificarAlerta(alerta, responsable) {
        console.log(`Notificando alerta a ${responsable}:`, alerta);
    }

    escalarAlerta(alerta) {
        console.log('Escalando alerta crítica:', alerta);
    }

    notificarAlertaNC(alerta) {
        console.log('Notificando alerta NC:', alerta);
    }

    generarAcuseCierre(notificacion) {
        return {
            id: this.generarId(),
            notificacionId: notificacion.id,
            numeroAcuse: `ACU-CIERRE-${Date.now().toString(36).toUpperCase()}`,
            fechaGeneracion: new Date(),
            estado: 'GENERADO'
        };
    }

    archivarDocumentosCierre(planId) {
        console.log(`Archivando documentos de cierre para plan ${planId}`);
    }

    analizarRetroalimentacion(registro) {
        console.log('Analizando retroalimentación:', registro);
    }

    programarActualizacionesRastreo(rastreo) {
        // Programar actualizaciones cada 24 horas
        setInterval(() => {
            this.actualizarRastreo(rastreo);
        }, 24 * 60 * 60 * 1000);
    }

    actualizarRastreo(rastreo) {
        const plan = this.planesAccion.find(p => p.id === rastreo.planId);
        if (plan) {
            rastreo.accionesCompletadas = plan.acciones.filter(a => a.estado === 'COMPLETADA').length;
            rastreo.progreso = Math.round((rastreo.accionesCompletadas / rastreo.accionesTotales) * 100);
            rastreo.ultimaActualizacion = new Date();
        }
    }

    registrarEnBitacora(objeto, accion) {
        const entrada = {
            id: this.generarId(),
            accion: accion,
            fecha: new Date(),
            usuario: 'Jefe DDEE',
            detalles: objeto,
            modulo: 'PLANES_ACCION'
        };

        console.log('Registro en bitácora planes de acción:', entrada);
        return entrada;
    }

    generarId() {
        return `PA-${Date.now().toString(36).toUpperCase()}`;
    }

    // Métodos para la interfaz
    getPlanesAccionHTML() {
        return this.planesAccion.map(plan => `
            <div class="border rounded-lg p-4 mb-4 border-indigo-200 bg-indigo-50">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h4 class="font-semibold text-gray-900">${plan.titulo}</h4>
                        <p class="text-sm text-gray-600">ID: ${plan.id}</p>
                        <p class="text-sm text-gray-600">Origen: ${plan.origen}</p>
                    </div>
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${this.getEstadoBadgeClass(plan.estado)}">
                        ${plan.estado}
                    </span>
                </div>
                <div class="mb-3">
                    <p class="text-sm text-gray-600">Acciones: ${plan.acciones.length}</p>
                    <p class="text-sm text-gray-600">Responsables: ${plan.responsables.join(', ')}</p>
                </div>
                <div class="flex space-x-2">
                    <button onclick="planesAccionModule.derivarPlan('${plan.id}')" 
                            class="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">
                        Derivar
                    </button>
                    <button onclick="planesAccionModule.evaluarNCs('${plan.id}')" 
                            class="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700">
                        Evaluar NCs
                    </button>
                    <button onclick="planesAccionModule.cerrarPlan('${plan.id}')" 
                            class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                        Cerrar
                    </button>
                </div>
            </div>
        `).join('');
    }

    getNcsHTML() {
        return this.ncs.map(nc => `
            <div class="border rounded-lg p-4 mb-4 ${this.getNCColorClass(nc.criticidad)}">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h4 class="font-semibold text-gray-900">${nc.titulo}</h4>
                        <p class="text-sm text-gray-600">ID: ${nc.id}</p>
                        <p class="text-sm text-gray-600">Tipo: ${nc.tipo}</p>
                    </div>
                    <div class="text-right">
                        <span class="px-2 py-1 text-xs font-semibold rounded-full ${this.getEstadoBadgeClass(nc.estado)}">
                            ${nc.estado}
                        </span>
                        <p class="text-xs text-gray-500 mt-1">Vence: ${nc.fechaLimiteCorreccion.toLocaleDateString()}</p>
                    </div>
                </div>
                <p class="text-sm text-gray-700 mb-3">${nc.descripcion}</p>
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Responsable: ${nc.responsableCorreccion}</span>
                    <div class="flex space-x-2">
                        <button onclick="planesAccionModule.verNC('${nc.id}')" 
                                class="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                            Ver
                        </button>
                        <button onclick="planesAccionModule.registrarObservacion('${nc.id}')" 
                                class="px-2 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700">
                            Observar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getEstadoBadgeClass(estado) {
        const clases = {
            'RECIBIDO': 'bg-blue-100 text-blue-800',
            'DERIVADO': 'bg-yellow-100 text-yellow-800',
            'EN_PROGRESO': 'bg-orange-100 text-orange-800',
            'COMPLETADA': 'bg-green-100 text-green-800',
            'CERRADO': 'bg-gray-100 text-gray-800',
            'ABIERTA': 'bg-red-100 text-red-800',
            'CERRADA': 'bg-green-100 text-green-800'
        };
        return clases[estado] || 'bg-gray-100 text-gray-800';
    }

    getNCColorClass(criticidad) {
        const clases = {
            'ALTA': 'border-red-200 bg-red-50',
            'MEDIA': 'border-yellow-200 bg-yellow-50',
            'BAJA': 'border-green-200 bg-green-50'
        };
        return clases[criticidad] || 'border-gray-200 bg-gray-50';
    }

    // Métodos de interfaz
    derivarPlan(planId) {
        const responsables = ['SUPERVISOR_OPERACIONES', 'JEFE_SEGURIDAD'];
        const expedienteId = 'EXP-2024-001';
        
        try {
            const derivacion = this.derivarPlanAccion(planId, responsables, expedienteId);
            alert(`Plan ${planId} derivado exitosamente a ${responsables.length} responsables`);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    evaluarNCs(planId) {
        const criteriosTecnicos = ['SEGURIDAD', 'CALIDAD', 'PROCEDIMIENTOS'];
        const criteriosNormativos = ['ISO-45001', 'DS-024-2016-EM'];
        
        try {
            const evaluacion = this.evaluarCumplimientoNCs(criteriosTecnicos, criteriosNormativos);
            this.notificarResultadosEvaluacionNC(evaluacion.id);
            alert(`Evaluación completada. ${evaluacion.resultados.cumplidas} NCs cumplidas de ${evaluacion.ncsEvaluadas.length} evaluadas`);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    cerrarPlan(planId) {
        const informeFinal = {
            resumen: 'Plan de acción completado satisfactoriamente',
            cumplimiento: '95%',
            observaciones: 'Todas las acciones críticas fueron implementadas'
        };
        
        try {
            const cierre = this.notificarCierreSupervision(planId, informeFinal);
            alert(`Plan ${planId} cerrado exitosamente`);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    verNC(ncId) {
        const nc = this.ncs.find(n => n.id === ncId);
        if (nc) {
            console.log('Detalle de NC:', nc);
            alert(`NC ${ncId} - Ver consola para detalles completos`);
        }
    }

    registrarObservacion(ncId) {
        const observaciones = prompt('Ingrese observaciones para la NC:');
        if (observaciones) {
            const accionesCorrectivas = [
                {
                    descripcion: 'Acción correctiva basada en observación',
                    responsable: 'RESPONSABLE_CORRECCION',
                    fechaLimite: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
                }
            ];
            
            try {
                const registro = this.registrarObservacionesNC(ncId, observaciones, accionesCorrectivas);
                alert(`Observaciones registradas para NC ${ncId}`);
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        }
    }
}

// Instancia global del módulo
const planesAccionModule = new PlanesAccionModule();