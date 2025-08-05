// Módulo de Verificación SGP - HU-07-08, HU-07-09
class VerificacionModule {
    constructor() {
        this.memorias = [];
        this.planesRegionales = [];
        this.verificaciones = [];
        this.alertas = [];
        this.plantillas = [];
        this.init();
    }

    init() {
        this.cargarMemoriasPrueba();
        this.cargarPlantillas();
    }

    cargarMemoriasPrueba() {
        this.memorias = [
            {
                id: 'MEM-SGP-2024-001',
                numeroMemoria: 'SGP-001-2024',
                titulo: 'Memoria Técnica Plan Regional Lima',
                fechaRecepcion: new Date('2024-01-12'),
                remitente: 'OC/SGP',
                estado: 'RECIBIDA',
                documentos: [
                    { tipo: 'MEMORIA_PRINCIPAL', nombre: 'Memoria_Principal.pdf', validado: false },
                    { tipo: 'ANEXOS_TECNICOS', nombre: 'Anexos_Tecnicos.pdf', validado: false },
                    { tipo: 'CRONOGRAMA', nombre: 'Cronograma_2024.xlsx', validado: true },
                    { tipo: 'PRESUPUESTO', nombre: 'Presupuesto_Detallado.xlsx', validado: false }
                ],
                contenido: {
                    objetivos: 'Supervisar operaciones mineras en región Lima',
                    alcance: 'Operaciones mineras activas en Lima',
                    metodologia: 'Inspecciones programadas y aleatorias',
                    recursos: 'Personal técnico especializado'
                },
                verificacionCompleta: false,
                observaciones: []
            }
        ];
    }

    cargarPlantillas() {
        this.plantillas = [
            {
                id: 'PLANTILLA_REGIONAL_001',
                nombre: 'Plan Regional Estándar',
                tipo: 'PLAN_REGIONAL',
                secciones: [
                    'RESUMEN_EJECUTIVO',
                    'OBJETIVOS',
                    'ALCANCE',
                    'METODOLOGIA',
                    'CRONOGRAMA',
                    'RECURSOS',
                    'PRESUPUESTO',
                    'INDICADORES',
                    'RIESGOS',
                    'ANEXOS'
                ],
                camposObligatorios: [
                    'titulo',
                    'objetivos',
                    'alcance',
                    'metodologia',
                    'responsable',
                    'fechaInicio',
                    'fechaFin'
                ]
            }
        ];
    }

    // HU-07-08: Verificar información remitida por SGP
    // CA-08.1: Visualizar memoria, anexos y documentos relacionados
    visualizarMemoriaSGP(memoriaId) {
        const memoria = this.memorias.find(m => m.id === memoriaId);
        if (!memoria) {
            throw new Error('Memoria no encontrada');
        }

        const vistaCompleta = {
            memoria: memoria,
            documentosRelacionados: this.obtenerDocumentosRelacionados(memoriaId),
            anexos: memoria.documentos.filter(d => d.tipo === 'ANEXOS_TECNICOS'),
            historialVerificaciones: this.obtenerHistorialVerificaciones(memoriaId),
            estadoValidacion: this.calcularEstadoValidacion(memoria)
        };

        return vistaCompleta;
    }

    // CA-08.2: Validar completitud, corrección y consistencia
    validarMemoriaSGP(memoriaId) {
        const memoria = this.memorias.find(m => m.id === memoriaId);
        if (!memoria) {
            throw new Error('Memoria no encontrada');
        }

        const validacion = {
            completitud: this.validarCompletitud(memoria),
            correccion: this.validarCorreccion(memoria),
            consistencia: this.validarConsistencia(memoria),
            fechaValidacion: new Date(),
            validadoPor: 'Jefe DDEE'
        };

        // Actualizar estado de verificación
        memoria.verificacionCompleta = validacion.completitud.valida && 
                                      validacion.correccion.valida && 
                                      validacion.consistencia.valida;

        // Registrar verificación
        this.registrarVerificacion(memoriaId, validacion);

        return validacion;
    }

    validarCompletitud(memoria) {
        const errores = [];
        const advertencias = [];

        // Validar documentos requeridos
        const documentosRequeridos = ['MEMORIA_PRINCIPAL', 'ANEXOS_TECNICOS', 'CRONOGRAMA', 'PRESUPUESTO'];
        documentosRequeridos.forEach(docTipo => {
            const documento = memoria.documentos.find(d => d.tipo === docTipo);
            if (!documento) {
                errores.push(`Falta documento requerido: ${docTipo}`);
            }
        });

        // Validar campos de contenido
        const camposRequeridos = ['objetivos', 'alcance', 'metodologia', 'recursos'];
        camposRequeridos.forEach(campo => {
            if (!memoria.contenido[campo] || memoria.contenido[campo].trim() === '') {
                errores.push(`Campo requerido vacío: ${campo}`);
            }
        });

        // Validar información básica
        if (!memoria.numeroMemoria) errores.push('Falta número de memoria');
        if (!memoria.titulo) errores.push('Falta título de memoria');
        if (!memoria.remitente) errores.push('Falta información del remitente');

        return {
            valida: errores.length === 0,
            errores: errores,
            advertencias: advertencias
        };
    }

    validarCorreccion(memoria) {
        const errores = [];

        // Validar formato de número de memoria
        if (memoria.numeroMemoria && !memoria.numeroMemoria.match(/^SGP-\d{3}-\d{4}$/)) {
            errores.push('Formato incorrecto de número de memoria');
        }

        // Validar fechas
        if (memoria.fechaRecepcion > new Date()) {
            errores.push('Fecha de recepción no puede ser futura');
        }

        // Validar contenido técnico
        if (memoria.contenido.objetivos && memoria.contenido.objetivos.length < 50) {
            errores.push('Objetivos demasiado breves, requiere mayor detalle');
        }

        return {
            valida: errores.length === 0,
            errores: errores
        };
    }

    validarConsistencia(memoria) {
        const errores = [];
        const inconsistencias = [];

        // Validar consistencia entre documentos
        const cronograma = memoria.documentos.find(d => d.tipo === 'CRONOGRAMA');
        const presupuesto = memoria.documentos.find(d => d.tipo === 'PRESUPUESTO');

        if (cronograma && presupuesto) {
            // Simular validación de consistencia
            if (!this.validarConsistenciaCronogramaPresupuesto(cronograma, presupuesto)) {
                inconsistencias.push('Inconsistencia entre cronograma y presupuesto');
            }
        }

        // Validar consistencia interna
        if (memoria.contenido.recursos && memoria.contenido.metodologia) {
            if (!this.validarConsistenciaRecursosMetodologia(memoria.contenido)) {
                inconsistencias.push('Recursos no alineados con metodología propuesta');
            }
        }

        return {
            valida: inconsistencias.length === 0,
            errores: errores,
            inconsistencias: inconsistencias
        };
    }

    // CA-08.3: Adjuntar observaciones, solicitar subsanación o rechazar
    gestionarObservacionesMemoria(memoriaId, accion, observaciones) {
        const memoria = this.memorias.find(m => m.id === memoriaId);
        if (!memoria) {
            throw new Error('Memoria no encontrada');
        }

        const gestion = {
            id: this.generarId(),
            memoriaId: memoriaId,
            accion: accion, // 'OBSERVACIONES', 'SUBSANACION', 'RECHAZO'
            observaciones: observaciones,
            fechaGestion: new Date(),
            gestionadoPor: 'Jefe DDEE',
            estado: 'ENVIADA'
        };

        memoria.observaciones.push(gestion);

        // Actualizar estado de memoria según acción
        switch (accion) {
            case 'OBSERVACIONES':
                memoria.estado = 'CON_OBSERVACIONES';
                break;
            case 'SUBSANACION':
                memoria.estado = 'REQUIERE_SUBSANACION';
                break;
            case 'RECHAZO':
                memoria.estado = 'RECHAZADA';
                break;
        }

        // Notificar a OC/SGP
        this.notificarGestionMemoria(gestion);

        // Registrar en bitácora
        this.registrarEnBitacora(gestion, `MEMORIA_${accion}`);

        return gestion;
    }

    // CA-08.4: Alertar automáticamente errores, duplicidad o falta de documentos
    generarAlertasAutomaticas(memoriaId) {
        const memoria = this.memorias.find(m => m.id === memoriaId);
        if (!memoria) {
            throw new Error('Memoria no encontrada');
        }

        const alertasGeneradas = [];

        // Verificar duplicidad
        const memoriasDuplicadas = this.memorias.filter(m => 
            m.id !== memoriaId && 
            m.numeroMemoria === memoria.numeroMemoria
        );
        if (memoriasDuplicadas.length > 0) {
            alertasGeneradas.push(this.crearAlerta('DUPLICIDAD', memoriaId, 
                'Se detectó memoria duplicada con el mismo número'));
        }

        // Verificar documentos faltantes
        const documentosRequeridos = ['MEMORIA_PRINCIPAL', 'ANEXOS_TECNICOS', 'CRONOGRAMA'];
        const documentosFaltantes = documentosRequeridos.filter(docTipo => 
            !memoria.documentos.some(d => d.tipo === docTipo)
        );
        if (documentosFaltantes.length > 0) {
            alertasGeneradas.push(this.crearAlerta('DOCUMENTOS_FALTANTES', memoriaId, 
                `Faltan documentos: ${documentosFaltantes.join(', ')}`));
        }

        // Verificar errores de validación
        const validacion = this.validarMemoriaSGP(memoriaId);
        if (!validacion.completitud.valida || !validacion.correccion.valida) {
            alertasGeneradas.push(this.crearAlerta('ERRORES_VALIDACION', memoriaId, 
                'Se detectaron errores en la validación de la memoria'));
        }

        this.alertas.push(...alertasGeneradas);
        return alertasGeneradas;
    }

    // HU-07-09: Elaborar plan regional
    // CA-09.1: Generar plan regional con plantilla predefinida y datos validados
    generarPlanRegional(memoriaId, plantillaId) {
        const memoria = this.memorias.find(m => m.id === memoriaId);
        const plantilla = this.plantillas.find(p => p.id === plantillaId);

        if (!memoria) throw new Error('Memoria no encontrada');
        if (!plantilla) throw new Error('Plantilla no encontrada');

        // Verificar que la memoria esté validada
        if (!memoria.verificacionCompleta) {
            throw new Error('La memoria debe estar completamente verificada antes de generar el plan');
        }

        const planRegional = {
            id: this.generarId(),
            memoriaBaseId: memoriaId,
            plantillaId: plantillaId,
            titulo: `Plan Regional - ${memoria.titulo}`,
            tipo: 'PLAN_REGIONAL',
            estado: 'BORRADOR',
            fechaCreacion: new Date(),
            elaboradoPor: 'Jefe DDEE',
            contenido: this.generarContenidoPlan(memoria, plantilla),
            documentos: [],
            firmaDigital: false,
            validado: false
        };

        this.planesRegionales.push(planRegional);

        // CA-09.3: Registrar en SICPO y vincular
        this.registrarPlanEnSICPO(planRegional);
        this.vincularPlanConMemoria(planRegional.id, memoriaId);

        return planRegional;
    }

    generarContenidoPlan(memoria, plantilla) {
        const contenido = {};

        // Generar contenido basado en la plantilla y datos de la memoria
        plantilla.secciones.forEach(seccion => {
            switch (seccion) {
                case 'RESUMEN_EJECUTIVO':
                    contenido[seccion] = this.generarResumenEjecutivo(memoria);
                    break;
                case 'OBJETIVOS':
                    contenido[seccion] = memoria.contenido.objetivos;
                    break;
                case 'ALCANCE':
                    contenido[seccion] = memoria.contenido.alcance;
                    break;
                case 'METODOLOGIA':
                    contenido[seccion] = memoria.contenido.metodologia;
                    break;
                case 'RECURSOS':
                    contenido[seccion] = memoria.contenido.recursos;
                    break;
                case 'CRONOGRAMA':
                    contenido[seccion] = this.generarCronogramaPlan(memoria);
                    break;
                default:
                    contenido[seccion] = `Contenido de ${seccion} generado automáticamente`;
            }
        });

        return contenido;
    }

    // CA-09.2: Validar datos correctos, completos y firmados digitalmente
    validarPlanRegional(planId) {
        const plan = this.planesRegionales.find(p => p.id === planId);
        if (!plan) {
            throw new Error('Plan regional no encontrado');
        }

        const validacion = {
            datosCorrectos: this.validarDatosPlan(plan),
            datosCompletos: this.validarCompletitudPlan(plan),
            firmaDigital: this.validarFirmaDigital(plan),
            fechaValidacion: new Date(),
            validadoPor: 'Jefe DDEE'
        };

        plan.validado = validacion.datosCorrectos.valido && 
                       validacion.datosCompletos.valido && 
                       validacion.firmaDigital.valido;

        return validacion;
    }

    validarDatosPlan(plan) {
        const errores = [];

        // Validar estructura del contenido
        const seccionesRequeridas = ['OBJETIVOS', 'ALCANCE', 'METODOLOGIA', 'RECURSOS'];
        seccionesRequeridas.forEach(seccion => {
            if (!plan.contenido[seccion] || plan.contenido[seccion].trim() === '') {
                errores.push(`Sección requerida vacía: ${seccion}`);
            }
        });

        // Validar formato de datos
        if (plan.titulo && plan.titulo.length < 10) {
            errores.push('Título del plan demasiado corto');
        }

        return {
            valido: errores.length === 0,
            errores: errores
        };
    }

    validarCompletitudPlan(plan) {
        const errores = [];
        const plantilla = this.plantillas.find(p => p.id === plan.plantillaId);

        if (plantilla) {
            // Validar campos obligatorios
            plantilla.camposObligatorios.forEach(campo => {
                if (!plan[campo] && !plan.contenido[campo]) {
                    errores.push(`Campo obligatorio faltante: ${campo}`);
                }
            });

            // Validar secciones completas
            plantilla.secciones.forEach(seccion => {
                if (!plan.contenido[seccion]) {
                    errores.push(`Sección faltante: ${seccion}`);
                }
            });
        }

        return {
            valido: errores.length === 0,
            errores: errores
        };
    }

    validarFirmaDigital(plan) {
        // Simular validación de firma digital
        return {
            valido: plan.firmaDigital === true,
            errores: plan.firmaDigital ? [] : ['Plan no cuenta con firma digital válida']
        };
    }

    // CA-09.4: Enviar plan regional a responsables para revisión
    enviarPlanParaRevision(planId, responsables) {
        const plan = this.planesRegionales.find(p => p.id === planId);
        if (!plan) {
            throw new Error('Plan regional no encontrado');
        }

        // Validar plan antes de envío
        const validacion = this.validarPlanRegional(planId);
        if (!validacion.datosCorrectos.valido || !validacion.datosCompletos.valido) {
            throw new Error('Plan no cumple con los requisitos para envío');
        }

        const envios = responsables.map(responsable => {
            const envio = {
                id: this.generarId(),
                planId: planId,
                responsable: responsable,
                fechaEnvio: new Date(),
                estado: 'ENVIADO',
                requiereRevision: true,
                fechaLimiteRevision: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
            };

            // Notificar al responsable
            this.notificarEnvioRevision(envio);

            return envio;
        });

        plan.estado = 'EN_REVISION';
        plan.enviosRevision = envios;

        return envios;
    }

    // Métodos auxiliares
    obtenerDocumentosRelacionados(memoriaId) {
        // Simular obtención de documentos relacionados
        return [];
    }

    obtenerHistorialVerificaciones(memoriaId) {
        return this.verificaciones.filter(v => v.memoriaId === memoriaId);
    }

    calcularEstadoValidacion(memoria) {
        const documentosValidados = memoria.documentos.filter(d => d.validado).length;
        const totalDocumentos = memoria.documentos.length;
        
        return {
            porcentajeValidacion: totalDocumentos > 0 ? (documentosValidados / totalDocumentos) * 100 : 0,
            documentosValidados: documentosValidados,
            totalDocumentos: totalDocumentos,
            verificacionCompleta: memoria.verificacionCompleta
        };
    }

    validarConsistenciaCronogramaPresupuesto(cronograma, presupuesto) {
        // Simular validación de consistencia
        return true;
    }

    validarConsistenciaRecursosMetodologia(contenido) {
        // Simular validación de consistencia
        return true;
    }

    registrarVerificacion(memoriaId, validacion) {
        const verificacion = {
            id: this.generarId(),
            memoriaId: memoriaId,
            validacion: validacion,
            fechaVerificacion: new Date(),
            verificadoPor: 'Jefe DDEE'
        };

        this.verificaciones.push(verificacion);
        return verificacion;
    }

    crearAlerta(tipo, memoriaId, mensaje) {
        return {
            id: this.generarId(),
            tipo: tipo,
            memoriaId: memoriaId,
            mensaje: mensaje,
            fechaGeneracion: new Date(),
            estado: 'ACTIVA',
            prioridad: tipo === 'DUPLICIDAD' ? 'ALTA' : 'MEDIA'
        };
    }

    generarResumenEjecutivo(memoria) {
        return `Resumen ejecutivo generado automáticamente para ${memoria.titulo}. ` +
               `Objetivos: ${memoria.contenido.objetivos}. ` +
               `Alcance: ${memoria.contenido.alcance}.`;
    }

    generarCronogramaPlan(memoria) {
        return {
            fechaInicio: new Date(),
            fechaFin: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año
            fases: [
                { nombre: 'Planificación', duracion: '30 días' },
                { nombre: 'Ejecución', duracion: '300 días' },
                { nombre: 'Cierre', duracion: '35 días' }
            ]
        };
    }

    registrarPlanEnSICPO(plan) {
        // Simular registro en SICPO
        console.log('Plan registrado en SICPO:', plan.id);
    }

    vincularPlanConMemoria(planId, memoriaId) {
        const memoria = this.memorias.find(m => m.id === memoriaId);
        if (memoria) {
            memoria.planRegionalId = planId;
        }
    }

    notificarGestionMemoria(gestion) {
        console.log('Notificando gestión de memoria:', gestion);
    }

    notificarEnvioRevision(envio) {
        console.log('Notificando envío para revisión:', envio);
    }

    registrarEnBitacora(objeto, accion) {
        const entrada = {
            id: this.generarId(),
            accion: accion,
            fecha: new Date(),
            usuario: 'Jefe DDEE',
            detalles: objeto,
            modulo: 'VERIFICACION_SGP'
        };

        console.log('Registro en bitácora:', entrada);
        return entrada;
    }

    generarId() {
        return `VER-${Date.now().toString(36).toUpperCase()}`;
    }

    // Métodos para la interfaz
    getMemoriasHTML() {
        return this.memorias.map(memoria => `
            <div class="border rounded-lg p-4 mb-4 ${this.getEstadoColorClass(memoria.estado)}">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h4 class="font-semibold text-gray-900">${memoria.titulo}</h4>
                        <p class="text-sm text-gray-600">Número: ${memoria.numeroMemoria}</p>
                        <p class="text-sm text-gray-600">Remitente: ${memoria.remitente}</p>
                    </div>
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${this.getEstadoBadgeClass(memoria.estado)}">
                        ${memoria.estado}
                    </span>
                </div>
                <div class="mb-3">
                    <p class="text-sm text-gray-600">Documentos: ${memoria.documentos.length}</p>
                    <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div class="bg-green-600 h-2 rounded-full" 
                             style="width: ${this.calcularEstadoValidacion(memoria).porcentajeValidacion}%"></div>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button onclick="verificacionModule.visualizarMemoria('${memoria.id}')" 
                            class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                        Ver Memoria
                    </button>
                    <button onclick="verificacionModule.validarMemoria('${memoria.id}')" 
                            class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                        Validar
                    </button>
                    <button onclick="verificacionModule.generarPlan('${memoria.id}')" 
                            class="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700">
                        Generar Plan
                    </button>
                </div>
            </div>
        `).join('');
    }

    getPlanesRegionalesHTML() {
        return this.planesRegionales.map(plan => `
            <div class="border rounded-lg p-4 mb-4 ${this.getEstadoColorClass(plan.estado)}">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h4 class="font-semibold text-gray-900">${plan.titulo}</h4>
                        <p class="text-sm text-gray-600">ID: ${plan.id}</p>
                        <p class="text-sm text-gray-600">Elaborado por: ${plan.elaboradoPor}</p>
                    </div>
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${this.getEstadoBadgeClass(plan.estado)}">
                        ${plan.estado}
                    </span>
                </div>
                <div class="mb-3">
                    <p class="text-sm text-gray-600">
                        Validado: ${plan.validado ? 'Sí' : 'No'} | 
                        Firma Digital: ${plan.firmaDigital ? 'Sí' : 'No'}
                    </p>
                </div>
                <div class="flex space-x-2">
                    <button onclick="verificacionModule.verPlan('${plan.id}')" 
                            class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                        Ver Plan
                    </button>
                    <button onclick="verificacionModule.enviarRevision('${plan.id}')" 
                            class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                        Enviar a Revisión
                    </button>
                </div>
            </div>
        `).join('');
    }

    getEstadoColorClass(estado) {
        const clases = {
            'RECIBIDA': 'border-blue-200 bg-blue-50',
            'EN_VERIFICACION': 'border-yellow-200 bg-yellow-50',
            'VERIFICADA': 'border-green-200 bg-green-50',
            'CON_OBSERVACIONES': 'border-orange-200 bg-orange-50',
            'RECHAZADA': 'border-red-200 bg-red-50',
            'BORRADOR': 'border-gray-200 bg-gray-50',
            'EN_REVISION': 'border-yellow-200 bg-yellow-50'
        };
        return clases[estado] || 'border-gray-200 bg-gray-50';
    }

    getEstadoBadgeClass(estado) {
        const clases = {
            'RECIBIDA': 'bg-blue-100 text-blue-800',
            'EN_VERIFICACION': 'bg-yellow-100 text-yellow-800',
            'VERIFICADA': 'bg-green-100 text-green-800',
            'CON_OBSERVACIONES': 'bg-orange-100 text-orange-800',
            'RECHAZADA': 'bg-red-100 text-red-800',
            'BORRADOR': 'bg-gray-100 text-gray-800',
            'EN_REVISION': 'bg-yellow-100 text-yellow-800'
        };
        return clases[estado] || 'bg-gray-100 text-gray-800';
    }

    // Métodos de interfaz
    visualizarMemoria(memoriaId) {
        try {
            const vista = this.visualizarMemoriaSGP(memoriaId);
            console.log('Vista de memoria:', vista);
            alert(`Memoria ${memoriaId} cargada para visualización`);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    validarMemoria(memoriaId) {
        try {
            const validacion = this.validarMemoriaSGP(memoriaId);
            const alertas = this.generarAlertasAutomaticas(memoriaId);
            console.log('Validación:', validacion);
            console.log('Alertas:', alertas);
            alert(`Memoria ${memoriaId} validada. Ver consola para detalles.`);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    generarPlan(memoriaId) {
        try {
            const plan = this.generarPlanRegional(memoriaId, 'PLANTILLA_REGIONAL_001');
            alert(`Plan regional ${plan.id} generado exitosamente`);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    verPlan(planId) {
        const plan = this.planesRegionales.find(p => p.id === planId);
        if (plan) {
            console.log('Plan regional:', plan);
            alert(`Plan ${planId} cargado. Ver consola para detalles.`);
        }
    }

    enviarRevision(planId) {
        const responsables = ['SUPERVISOR_REGIONAL', 'COORDINADOR_TECNICO'];
        try {
            const envios = this.enviarPlanParaRevision(planId, responsables);
            alert(`Plan ${planId} enviado para revisión a ${responsables.length} responsables`);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }
}

// Instancia global del módulo
const verificacionModule = new VerificacionModule();