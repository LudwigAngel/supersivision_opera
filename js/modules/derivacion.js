// Módulo de Derivación OC - HU-07-03, HU-07-04
class DerivacionModule {
    constructor() {
        this.especialistas = [];
        this.derivaciones = [];
        this.notificacionesOC = [];
        this.acusesOC = [];
        this.init();
    }

    init() {
        this.cargarEspecialistas();
    }

    cargarEspecialistas() {
        this.especialistas = [
            {
                id: 1,
                nombre: 'Dr. Carlos Mendoza',
                perfil: 'ESPECIALISTA_MINERIA',
                disponible: true,
                especialidades: ['MINERIA', 'SEGURIDAD_MINERA', 'MEDIO_AMBIENTE'],
                cargaTrabajo: 2,
                ubicacion: 'LIMA',
                agenda: []
            },
            {
                id: 2,
                nombre: 'Ing. Ana Vargas',
                perfil: 'ESPECIALISTA_ENERGIA',
                disponible: true,
                especialidades: ['ENERGIA', 'HIDROCARBUROS', 'ELECTRICIDAD'],
                cargaTrabajo: 1,
                ubicacion: 'AREQUIPA',
                agenda: []
            },
            {
                id: 3,
                nombre: 'Lic. Roberto Silva',
                perfil: 'ESPECIALISTA_LEGAL',
                disponible: false,
                especialidades: ['LEGAL', 'NORMATIVO', 'REGULATORIO'],
                cargaTrabajo: 4,
                ubicacion: 'CUSCO',
                agenda: ['2024-01-20', '2024-01-21']
            }
        ];
    }

    // CA-03.1: Seleccionar especialistas según perfil y disponibilidad
    seleccionarEspecialista(criterios) {
        const especialistasDisponibles = this.especialistas.filter(esp => {
            // Verificar disponibilidad
            if (!esp.disponible) return false;
            
            // Verificar perfil si se especifica
            if (criterios.perfil && esp.perfil !== criterios.perfil) return false;
            
            // Verificar especialidades
            if (criterios.especialidad && !esp.especialidades.includes(criterios.especialidad)) return false;
            
            // Verificar ubicación si se especifica
            if (criterios.ubicacion && esp.ubicacion !== criterios.ubicacion) return false;
            
            // Verificar carga de trabajo
            if (esp.cargaTrabajo >= 5) return false;
            
            return true;
        });

        // Ordenar por carga de trabajo (menor primero)
        return especialistasDisponibles.sort((a, b) => a.cargaTrabajo - b.cargaTrabajo);
    }

    // CA-03.2: Validar conflictos de agenda e incompatibilidades
    validarConflictos(especialistaId, fechaAsignacion) {
        const especialista = this.especialistas.find(e => e.id === especialistaId);
        
        if (!especialista) {
            return { valido: false, mensaje: 'Especialista no encontrado' };
        }

        if (!especialista.disponible) {
            return { valido: false, mensaje: 'Especialista no disponible' };
        }

        if (especialista.cargaTrabajo >= 5) {
            return { valido: false, mensaje: 'Especialista con carga máxima de trabajo' };
        }

        // Verificar conflictos de agenda
        const fechaStr = fechaAsignacion.toISOString().split('T')[0];
        if (especialista.agenda.includes(fechaStr)) {
            return { valido: false, mensaje: 'Conflicto de agenda en la fecha especificada' };
        }

        return { valido: true, mensaje: 'Especialista disponible para asignación' };
    }

    // CA-03.3: Notificar al especialista y solicitar acuse
    derivarMemoriaOC(memoriaId, especialistaId, observaciones = '') {
        const especialista = this.especialistas.find(e => e.id === especialistaId);
        const fechaDerivacion = new Date();

        // Validar conflictos
        const validacion = this.validarConflictos(especialistaId, fechaDerivacion);
        if (!validacion.valido) {
            throw new Error(validacion.mensaje);
        }

        // Crear derivación
        const derivacion = {
            id: this.generarId(),
            memoriaId: memoriaId,
            especialistaId: especialistaId,
            fechaDerivacion: fechaDerivacion,
            observaciones: observaciones,
            estado: 'DERIVADA',
            acuseRecibido: false
        };

        this.derivaciones.push(derivacion);

        // CA-03.3: Notificar al especialista
        const notificacion = this.notificarEspecialista(derivacion, especialista);

        // CA-03.4: Registrar en bitácora
        this.registrarEnBitacora(derivacion, 'DERIVACION_CREADA');

        // Actualizar carga de trabajo del especialista
        especialista.cargaTrabajo++;

        return {
            derivacion,
            notificacion,
            especialista: especialista.nombre
        };
    }

    notificarEspecialista(derivacion, especialista) {
        const notificacion = {
            id: this.generarId(),
            tipo: 'DERIVACION_MEMORIA_OC',
            destinatario: especialista.nombre,
            destinatarioEmail: `${especialista.nombre.toLowerCase().replace(' ', '.')}@sicpo.gob.pe`,
            asunto: `Nueva memoria OC/SGP asignada - ${derivacion.memoriaId}`,
            mensaje: `Se le ha asignado la revisión de la memoria ${derivacion.memoriaId}. ${derivacion.observaciones}`,
            fechaEnvio: new Date(),
            requiereAcuse: true,
            estado: 'ENVIADA',
            derivacionId: derivacion.id
        };

        // Simular envío
        console.log('Enviando notificación a especialista:', notificacion);
        
        // Programar seguimiento de acuse
        this.programarSeguimientoAcuse(notificacion);

        return notificacion;
    }

    // CA-03.5: Alertar si existe duplicidad, error o falta de información
    validarMemoriaOC(memoria) {
        const errores = [];
        const alertas = [];

        // Validar duplicidad
        const memoriaExistente = this.derivaciones.find(d => 
            d.memoriaId === memoria.id && d.estado !== 'CANCELADA'
        );
        if (memoriaExistente) {
            errores.push('Ya existe una derivación activa para esta memoria');
        }

        // Validar completitud de información
        if (!memoria.numeroMemoria) errores.push('Falta número de memoria');
        if (!memoria.fechaEmision) errores.push('Falta fecha de emisión');
        if (!memoria.remitente) errores.push('Falta información del remitente');
        if (!memoria.documentos || memoria.documentos.length === 0) {
            errores.push('No se han adjuntado documentos');
        }

        // Validar documentos requeridos
        const documentosRequeridos = ['MEMORIA_PRINCIPAL', 'ANEXOS_TECNICOS', 'FIRMAS'];
        documentosRequeridos.forEach(docReq => {
            const tieneDocumento = memoria.documentos?.some(doc => doc.tipo === docReq);
            if (!tieneDocumento) {
                errores.push(`Falta documento requerido: ${docReq}`);
            }
        });

        // Generar alertas si hay errores
        if (errores.length > 0) {
            const alerta = {
                id: this.generarId(),
                tipo: 'ERROR_MEMORIA_OC',
                memoriaId: memoria.id,
                errores: errores,
                fechaGeneracion: new Date(),
                estado: 'ACTIVA'
            };
            
            this.alertas.push(alerta);
            console.log('Alerta generada para memoria OC:', alerta);
        }

        return {
            valida: errores.length === 0,
            errores: errores,
            alertas: alertas
        };
    }

    // HU-07-04: Notificar observaciones del OC
    // CA-04.1: Notificar automáticamente a OC/SGP la recepción
    notificarRecepcionMemoriaOC(memoriaId) {
        const notificacion = {
            id: this.generarId(),
            tipo: 'RECEPCION_MEMORIA_OC',
            destinatario: 'OC/SGP',
            destinatarioEmail: 'oc.sgp@entidad.gob.pe',
            asunto: `Confirmación de recepción - Memoria ${memoriaId}`,
            mensaje: `Se confirma la recepción de la memoria ${memoriaId} en el sistema SICPO.`,
            fechaEnvio: new Date(),
            memoriaId: memoriaId,
            estado: 'ENVIADA'
        };

        this.notificacionesOC.push(notificacion);

        // CA-04.2: Generar acuse de recepción para OC/SGP
        const acuse = this.generarAcuseRecepcionOC(memoriaId);

        // CA-04.4: Registrar en bitácora
        this.registrarEnBitacora({ memoriaId }, 'NOTIFICACION_OC_ENVIADA');

        return { notificacion, acuse };
    }

    // CA-04.2: Generar acuse de recepción para OC/SGP
    generarAcuseRecepcionOC(memoriaId) {
        const acuse = {
            id: this.generarId(),
            memoriaId: memoriaId,
            numeroAcuse: `ACU-OC-${Date.now().toString(36).toUpperCase()}`,
            fechaGeneracion: new Date(),
            estado: 'GENERADO',
            contenido: `Se acusa recibo de la memoria ${memoriaId} recibida en SICPO.`
        };

        this.acusesOC.push(acuse);
        return acuse;
    }

    // CA-04.3: Adjuntar observaciones o requerimientos adicionales
    adjuntarObservacionesOC(memoriaId, observaciones, requerimientos = []) {
        const notificacion = {
            id: this.generarId(),
            tipo: 'OBSERVACIONES_MEMORIA_OC',
            destinatario: 'OC/SGP',
            memoriaId: memoriaId,
            observaciones: observaciones,
            requerimientos: requerimientos,
            fechaEnvio: new Date(),
            requiereRespuesta: requerimientos.length > 0,
            estado: 'ENVIADA'
        };

        this.notificacionesOC.push(notificacion);

        // Registrar en bitácora
        this.registrarEnBitacora({ memoriaId, observaciones }, 'OBSERVACIONES_OC_ENVIADAS');

        return notificacion;
    }

    programarSeguimientoAcuse(notificacion) {
        // Simular seguimiento después de 24 horas
        setTimeout(() => {
            this.verificarAcuseRecibido(notificacion.id);
        }, 24 * 60 * 60 * 1000);
    }

    verificarAcuseRecibido(notificacionId) {
        const notificacion = this.notificaciones?.find(n => n.id === notificacionId);
        if (notificacion && !notificacion.acuseRecibido) {
            this.generarAlertaNoAcuse(notificacionId);
        }
    }

    generarAlertaNoAcuse(notificacionId) {
        const alerta = {
            id: this.generarId(),
            tipo: 'NO_ACUSE_ESPECIALISTA',
            notificacionId: notificacionId,
            fechaGeneracion: new Date(),
            mensaje: 'Especialista no ha confirmado recepción de derivación',
            estado: 'ACTIVA'
        };

        this.alertas.push(alerta);
        console.log('Alerta de no acuse generada:', alerta);
    }

    registrarEnBitacora(objeto, accion) {
        const entrada = {
            id: this.generarId(),
            accion: accion,
            fecha: new Date(),
            usuario: 'Jefe DDEE',
            detalles: objeto,
            modulo: 'DERIVACION_OC'
        };

        // En implementación real, esto se guardaría en base de datos
        console.log('Registro en bitácora:', entrada);
        return entrada;
    }

    generarId() {
        return `DER-${Date.now().toString(36).toUpperCase()}`;
    }

    // Métodos para la interfaz
    getEspecialistasHTML() {
        return this.especialistas.map(esp => `
            <div class="border rounded-lg p-4 ${esp.disponible ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}">
                <div class="flex items-center justify-between mb-2">
                    <div>
                        <h4 class="font-semibold text-gray-900">${esp.nombre}</h4>
                        <p class="text-sm text-gray-600">${esp.perfil}</p>
                        <p class="text-xs text-gray-500">${esp.ubicacion}</p>
                    </div>
                    <div class="flex items-center">
                        <span class="w-3 h-3 rounded-full ${esp.disponible ? 'bg-green-400' : 'bg-red-400'} mr-2"></span>
                        <span class="text-sm ${esp.disponible ? 'text-green-600' : 'text-red-600'}">
                            ${esp.disponible ? 'Disponible' : 'Ocupado'}
                        </span>
                    </div>
                </div>
                <div class="flex justify-between items-center text-sm mb-2">
                    <span class="text-gray-600">Carga: ${esp.cargaTrabajo}/5</span>
                    <div class="w-20 bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-600 h-2 rounded-full" style="width: ${(esp.cargaTrabajo / 5) * 100}%"></div>
                    </div>
                </div>
                <div class="mt-2">
                    <div class="flex flex-wrap gap-1">
                        ${esp.especialidades.map(especialidad => `
                            <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">${especialidad}</span>
                        `).join('')}
                    </div>
                </div>
                ${esp.disponible ? `
                    <button onclick="derivacionModule.asignarEspecialista(${esp.id})" 
                            class="mt-2 w-full px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                        Asignar
                    </button>
                ` : ''}
            </div>
        `).join('');
    }

    getDerivacionesRecientes() {
        return this.derivaciones.slice(-5).map(der => {
            const especialista = this.especialistas.find(e => e.id === der.especialistaId);
            return {
                ...der,
                especialistaNombre: especialista ? especialista.nombre : 'Desconocido'
            };
        });
    }

    asignarEspecialista(especialistaId) {
        // Simular asignación
        const memoria = { id: 'MEM-OC-001', numeroMemoria: 'MEM-001-2024' };
        try {
            const resultado = this.derivarMemoriaOC(memoria.id, especialistaId, 'Revisión urgente requerida');
            alert(`Memoria asignada exitosamente a ${resultado.especialista}`);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }
}

// Instancia global del módulo
const derivacionModule = new DerivacionModule();