// SICPO Application JavaScript
class SICPOApp {
    constructor() {
        this.currentModule = null;
        this.expedientes = [];
        this.usuarios = [];
        this.init();
    }

    init() {
        this.loadSampleData();
        // Don't call showModule here, let it be called from DOMContentLoaded
    }

    loadSampleData() {
        // Sample data for demonstration
        this.expedientes = [
            {
                id: 'EXP-2024-001',
                tipo: 'Lista de Inspecciones',
                estado: 'Recibido',
                fecha: '2024-01-15',
                responsable: 'Mesa de Partes',
                prioridad: 'Alta'
            },
            {
                id: 'EXP-2024-002',
                tipo: 'Memoria OC/SGP',
                estado: 'En Revisión',
                fecha: '2024-01-14',
                responsable: 'Jefe DDEE',
                prioridad: 'Media'
            }
        ];

        this.usuarios = [
            { id: 1, nombre: 'Juan Pérez', rol: 'Mesa de Partes', disponible: true },
            { id: 2, nombre: 'María García', rol: 'Jefe DDEE', disponible: true },
            { id: 3, nombre: 'Carlos López', rol: 'Especialista SPO', disponible: false }
        ];
    }

    showModule(moduleName) {
        this.currentModule = moduleName;
        const contentArea = document.getElementById('content-area');
        
        switch(moduleName) {
            case 'recepcion':
                contentArea.innerHTML = this.getRecepcionHTML();
                break;
            case 'distribucion':
                contentArea.innerHTML = this.getDistribucionHTML();
                break;
            case 'derivacion':
                contentArea.innerHTML = this.getDerivacionHTML();
                break;
            case 'aprobacion':
                contentArea.innerHTML = this.getAprobacionHTML();
                break;
            case 'verificacion':
                contentArea.innerHTML = this.getVerificacionHTML();
                break;
            case 'supervision':
                contentArea.innerHTML = this.getSupervisionHTML();
                break;
            case 'planes':
                contentArea.innerHTML = this.getPlanesHTML();
                break;
            case 'spo':
                contentArea.innerHTML = this.getSPOHTML();
                break;
            case 'archivo':
                contentArea.innerHTML = this.getArchivoHTML();
                break;
            case 'reportes':
                contentArea.innerHTML = this.getReportesHTML();
                break;
            default:
                contentArea.innerHTML = '<div class="text-center py-8"><p class="text-gray-500">Seleccione un módulo del menú lateral</p></div>';
        }
        
        // Update active menu item
        this.updateActiveMenuItem(moduleName);
    }

    getRecepcionHTML() {
        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-900">Recepción Documental</h2>
                    <button onclick="showRecepcionModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                        <i class="fas fa-plus mr-2"></i>Nuevo Expediente
                    </button>
                </div>

                <!-- Filters -->
                <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Documento</label>
                        <select class="w-full p-2 border border-gray-300 rounded-lg">
                            <option>Todos</option>
                            <option>Lista de Inspecciones</option>
                            <option>Memoria OC/SGP</option>
                            <option>Plan de Acción</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                        <select class="w-full p-2 border border-gray-300 rounded-lg">
                            <option>Todos</option>
                            <option>Recibido</option>
                            <option>En Proceso</option>
                            <option>Completado</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
                        <select class="w-full p-2 border border-gray-300 rounded-lg">
                            <option>Todas</option>
                            <option>Alta</option>
                            <option>Media</option>
                            <option>Baja</option>
                        </select>
                    </div>
                </div>

                <!-- Expedientes Table -->
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-gray-500">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th class="px-6 py-3">ID Expediente</th>
                                <th class="px-6 py-3">Tipo</th>
                                <th class="px-6 py-3">Estado</th>
                                <th class="px-6 py-3">Fecha</th>
                                <th class="px-6 py-3">Responsable</th>
                                <th class="px-6 py-3">Prioridad</th>
                                <th class="px-6 py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="expedientes-tbody">
                            ${recepcionModule.getExpedientesHTML()}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Modal for New Expediente -->
            <div id="recepcionModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden items-center justify-center z-50">
                <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">Registrar Nuevo Expediente</h3>
                            <button onclick="closeModal('recepcionModal')" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <form onsubmit="submitRecepcion(event)"
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Documento</label>
                                    <select name="tipo" required class="w-full p-2 border border-gray-300 rounded-lg">
                                        <option value="">Seleccionar...</option>
                                        <option value="Lista de Inspecciones">Lista de Inspecciones</option>
                                        <option value="Memoria OC/SGP">Memoria OC/SGP</option>
                                        <option value="Plan de Acción">Plan de Acción</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
                                    <select name="prioridad" required class="w-full p-2 border border-gray-300 rounded-lg">
                                        <option value="">Seleccionar...</option>
                                        <option value="Alta">Alta</option>
                                        <option value="Media">Media</option>
                                        <option value="Baja">Baja</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                                <textarea name="descripcion" rows="3" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Descripción del expediente..."></textarea>
                            </div>
                            
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Documentos Adjuntos</label>
                                <input type="file" multiple class="w-full p-2 border border-gray-300 rounded-lg">
                            </div>
                            
                            <div class="flex justify-end space-x-3">
                                <button type="button" onclick="closeModal('recepcionModal')" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
                                    Cancelar
                                </button>
                                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    Registrar Expediente
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    getDistribucionHTML() {
        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-900">Distribución de Expedientes</h2>
                    <button onclick="showDistribucionModal()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                        <i class="fas fa-share-alt mr-2"></i>Nueva Distribución
                    </button>
                </div>

                <!-- Distribution Dashboard -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-blue-50 rounded-lg p-4">
                        <h3 class="text-lg font-semibold text-blue-800 mb-2">Pendientes de Distribución</h3>
                        <p class="text-3xl font-bold text-blue-600">5</p>
                    </div>
                    <div class="bg-yellow-50 rounded-lg p-4">
                        <h3 class="text-lg font-semibold text-yellow-800 mb-2">En Proceso</h3>
                        <p class="text-3xl font-bold text-yellow-600">8</p>
                    </div>
                    <div class="bg-green-50 rounded-lg p-4">
                        <h3 class="text-lg font-semibold text-green-800 mb-2">Distribuidos</h3>
                        <p class="text-3xl font-bold text-green-600">12</p>
                    </div>
                </div>

                <!-- Responsible Users -->
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Responsables Disponibles</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="responsables-container">
                        ${distribucionModule.getResponsablesHTML()}
                    </div>
                </div>

                <!-- Distribution Rules -->
                <div class="bg-gray-50 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Criterios de Distribución Automática</h3>
                    <div class="space-y-3" id="criterios-container">
                        ${distribucionModule.getCriteriosAutomaticosHTML()}
                    </div>
                </div>
            </div>

            <!-- Modal de Nueva Distribución -->
            <div id="distribucionModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden items-center justify-center z-50">
                <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">Nueva Distribución de Expediente</h3>
                            <button onclick="closeModal('distribucionModal')" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <form onsubmit="submitDistribucion(event)">
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Expediente a Distribuir</label>
                                <select name="expediente" required class="w-full p-2 border border-gray-300 rounded-lg">
                                    <option value="">Seleccionar expediente...</option>
                                    <option value="EXP-2024-001">EXP-2024-001 - Lista de Inspecciones</option>
                                    <option value="EXP-2024-002">EXP-2024-002 - Memoria OC/SGP</option>
                                </select>
                            </div>
                            
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Responsable Asignado</label>
                                <select name="responsable" required class="w-full p-2 border border-gray-300 rounded-lg">
                                    <option value="">Seleccionar responsable...</option>
                                    <option value="1">Juan Pérez - Mesa de Partes</option>
                                    <option value="2">María García - Jefe DDEE</option>
                                    <option value="3">Carlos López - Especialista SPO</option>
                                </select>
                            </div>
                            
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
                                <select name="prioridad" required class="w-full p-2 border border-gray-300 rounded-lg">
                                    <option value="">Seleccionar prioridad...</option>
                                    <option value="Alta">Alta</option>
                                    <option value="Media">Media</option>
                                    <option value="Baja">Baja</option>
                                </select>
                            </div>
                            
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                                <textarea name="observaciones" rows="3" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Observaciones adicionales..."></textarea>
                            </div>
                            
                            <div class="flex justify-end space-x-3">
                                <button type="button" onclick="closeModal('distribucionModal')" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
                                    Cancelar
                                </button>
                                <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                    Distribuir Expediente
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    getSupervisionHTML() {
        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-900">Supervisión de Inspecciones</h2>
                    <button onclick="showSupervisionModal()" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                        <i class="fas fa-eye mr-2"></i>Nueva Supervisión
                    </button>
                </div>

                <!-- Supervision Timeline -->
                <div class="mb-8">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Cronograma de Supervisiones</h3>
                    <div class="space-y-4" id="supervisiones-container">
                        ${supervisionModule.getSupervisionesHTML()}
                    </div>
                </div>

                <!-- Findings and Results -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Hallazgos Recientes</h3>
                        <div class="space-y-3">
                            <div class="border-l-4 border-red-500 bg-red-50 p-4">
                                <div class="flex">
                                    <div class="flex-shrink-0">
                                        <i class="fas fa-exclamation-circle text-red-500"></i>
                                    </div>
                                    <div class="ml-3">
                                        <h4 class="text-sm font-medium text-red-800">Hallazgo Crítico</h4>
                                        <p class="text-sm text-red-700">Documentación incompleta en expediente EXP-2024-001</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="border-l-4 border-yellow-500 bg-yellow-50 p-4">
                                <div class="flex">
                                    <div class="flex-shrink-0">
                                        <i class="fas fa-exclamation-triangle text-yellow-500"></i>
                                    </div>
                                    <div class="ml-3">
                                        <h4 class="text-sm font-medium text-yellow-800">Hallazgo Mayor</h4>
                                        <p class="text-sm text-yellow-700">Retraso en notificaciones automáticas</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Estadísticas de Supervisión</h3>
                        <div class="space-y-4">
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Supervisiones Completadas</span>
                                <span class="font-semibold text-green-600">15</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Hallazgos Críticos</span>
                                <span class="font-semibold text-red-600">3</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Hallazgos Mayores</span>
                                <span class="font-semibold text-yellow-600">8</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Tiempo Promedio</span>
                                <span class="font-semibold text-blue-600">5.2 días</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal de Nueva Supervisión -->
            <div id="supervisionModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden items-center justify-center z-50">
                <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-screen overflow-y-auto">
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">Nueva Supervisión de Inspección</h3>
                            <button onclick="closeModal('supervisionModal')" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <form onsubmit="submitSupervision(event)">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Expediente a Supervisar</label>
                                    <select name="expediente" required class="w-full p-2 border border-gray-300 rounded-lg">
                                        <option value="">Seleccionar expediente...</option>
                                        <option value="EXP-2024-001">EXP-2024-001 - Lista de Inspecciones</option>
                                        <option value="EXP-2024-002">EXP-2024-002 - Memoria OC/SGP</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Supervisión</label>
                                    <select name="tipoSupervision" required class="w-full p-2 border border-gray-300 rounded-lg">
                                        <option value="">Seleccionar tipo...</option>
                                        <option value="Programada">Programada</option>
                                        <option value="Extraordinaria">Extraordinaria</option>
                                        <option value="Seguimiento">Seguimiento</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Programada</label>
                                    <input type="date" name="fechaProgramada" required class="w-full p-2 border border-gray-300 rounded-lg">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Supervisor Asignado</label>
                                    <select name="supervisor" required class="w-full p-2 border border-gray-300 rounded-lg">
                                        <option value="">Seleccionar supervisor...</option>
                                        <option value="1">Juan Pérez - Supervisor Senior</option>
                                        <option value="2">María García - Jefe DDEE</option>
                                        <option value="3">Carlos López - Especialista SPO</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Objetivos de la Supervisión</label>
                                <textarea name="objetivos" rows="3" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Describir los objetivos específicos de esta supervisión..."></textarea>
                            </div>
                            
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Criterios de Evaluación</label>
                                <div class="space-y-2">
                                    <label class="flex items-center">
                                        <input type="checkbox" name="criterios[]" value="documentacion" class="mr-2">
                                        <span class="text-sm">Completitud de documentación</span>
                                    </label>
                                    <label class="flex items-center">
                                        <input type="checkbox" name="criterios[]" value="plazos" class="mr-2">
                                        <span class="text-sm">Cumplimiento de plazos</span>
                                    </label>
                                    <label class="flex items-center">
                                        <input type="checkbox" name="criterios[]" value="calidad" class="mr-2">
                                        <span class="text-sm">Calidad de la inspección</span>
                                    </label>
                                    <label class="flex items-center">
                                        <input type="checkbox" name="criterios[]" value="procedimientos" class="mr-2">
                                        <span class="text-sm">Seguimiento de procedimientos</span>
                                    </label>
                                </div>
                            </div>
                            
                            <div class="flex justify-end space-x-3">
                                <button type="button" onclick="closeModal('supervisionModal')" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
                                    Cancelar
                                </button>
                                <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                                    Programar Supervisión
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    getPlanesHTML() {
        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-900">Planes de Acción y NCs</h2>
                    <div class="flex space-x-2">
                        <button onclick="showPlanModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
                            <i class="fas fa-file-alt mr-2"></i>Nuevo Plan
                        </button>
                        <button onclick="showNCModal()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
                            <i class="fas fa-exclamation-triangle mr-2"></i>Nueva NC
                        </button>
                    </div>
                </div>

                <!-- Tabs para Planes y NCs -->
                <div class="mb-6">
                    <div class="border-b border-gray-200">
                        <nav class="-mb-px flex space-x-8">
                            <button onclick="showPlanesTab('planes')" 
                                    class="py-2 px-1 border-b-2 border-indigo-500 font-medium text-sm text-indigo-600" 
                                    id="tab-planes-accion">
                                Planes de Acción
                            </button>
                            <button onclick="showPlanesTab('ncs')" 
                                    class="py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300" 
                                    id="tab-ncs">
                                No Conformidades
                            </button>
                        </nav>
                    </div>
                </div>

                <!-- Contenido de Planes de Acción -->
                <div id="planes-accion-content" class="tab-content">
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Planes de Acción Activos</h3>
                        <div id="planes-accion-container">
                            ${planesAccionModule.getPlanesAccionHTML()}
                        </div>
                    </div>
                </div>

                <!-- Contenido de NCs -->
                <div id="ncs-content" class="tab-content hidden">
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">No Conformidades</h3>
                        <div id="ncs-container">
                            ${planesAccionModule.getNcsHTML()}
                        </div>
                    </div>
                </div>

                <!-- Plan Status Overview -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div class="bg-blue-50 rounded-lg p-4 text-center">
                        <i class="fas fa-file-plus text-blue-600 text-2xl mb-2"></i>
                        <h3 class="font-semibold text-blue-800">Borradores</h3>
                        <p class="text-2xl font-bold text-blue-600">4</p>
                    </div>
                    <div class="bg-yellow-50 rounded-lg p-4 text-center">
                        <i class="fas fa-clock text-yellow-600 text-2xl mb-2"></i>
                        <h3 class="font-semibold text-yellow-800">En Revisión</h3>
                        <p class="text-2xl font-bold text-yellow-600">6</p>
                    </div>
                    <div class="bg-green-50 rounded-lg p-4 text-center">
                        <i class="fas fa-check-circle text-green-600 text-2xl mb-2"></i>
                        <h3 class="font-semibold text-green-800">Aprobados</h3>
                        <p class="text-2xl font-bold text-green-600">12</p>
                    </div>
                    <div class="bg-purple-50 rounded-lg p-4 text-center">
                        <i class="fas fa-cogs text-purple-600 text-2xl mb-2"></i>
                        <h3 class="font-semibold text-purple-800">En Ejecución</h3>
                        <p class="text-2xl font-bold text-purple-600">8</p>
                    </div>
                </div>

                <!-- Action Plans Table -->
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-gray-500">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th class="px-6 py-3">Plan ID</th>
                                <th class="px-6 py-3">Tipo</th>
                                <th class="px-6 py-3">Estado</th>
                                <th class="px-6 py-3">Responsable</th>
                                <th class="px-6 py-3">Fecha Límite</th>
                                <th class="px-6 py-3">Progreso</th>
                                <th class="px-6 py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="bg-white border-b hover:bg-gray-50">
                                <td class="px-6 py-4 font-medium text-gray-900">PLAN-2024-001</td>
                                <td class="px-6 py-4">Plan Regional</td>
                                <td class="px-6 py-4">
                                    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                        Aprobado
                                    </span>
                                </td>
                                <td class="px-6 py-4">María García</td>
                                <td class="px-6 py-4">25/01/2024</td>
                                <td class="px-6 py-4">
                                    <div class="w-full bg-gray-200 rounded-full h-2">
                                        <div class="bg-green-600 h-2 rounded-full" style="width: 75%"></div>
                                    </div>
                                    <span class="text-xs text-gray-600">75%</span>
                                </td>
                                <td class="px-6 py-4">
                                    <button class="text-blue-600 hover:text-blue-900 mr-2">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="text-green-600 hover:text-green-900 mr-2">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="text-purple-600 hover:text-purple-900">
                                        <i class="fas fa-download"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr class="bg-white border-b hover:bg-gray-50">
                                <td class="px-6 py-4 font-medium text-gray-900">PLAN-2024-002</td>
                                <td class="px-6 py-4">Plan de Seguridad</td>
                                <td class="px-6 py-4">
                                    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                        En Revisión
                                    </span>
                                </td>
                                <td class="px-6 py-4">Carlos López</td>
                                <td class="px-6 py-4">30/01/2024</td>
                                <td class="px-6 py-4">
                                    <div class="w-full bg-gray-200 rounded-full h-2">
                                        <div class="bg-yellow-600 h-2 rounded-full" style="width: 45%"></div>
                                    </div>
                                    <span class="text-xs text-gray-600">45%</span>
                                </td>
                                <td class="px-6 py-4">
                                    <button class="text-blue-600 hover:text-blue-900 mr-2">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="text-green-600 hover:text-green-900 mr-2">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="text-orange-600 hover:text-orange-900">
                                        <i class="fas fa-comments"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Modal de Nuevo Plan -->
            <div id="planModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden items-center justify-center z-50">
                <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-screen overflow-y-auto">
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">Nuevo Plan de Acción</h3>
                            <button onclick="closeModal('planModal')" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <form onsubmit="submitPlan(event)">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Plan</label>
                                    <select name="tipoPlan" required class="w-full p-2 border border-gray-300 rounded-lg">
                                        <option value="">Seleccionar tipo...</option>
                                        <option value="Regional">Plan Regional</option>
                                        <option value="Seguridad">Plan de Seguridad</option>
                                        <option value="Correctivo">Plan Correctivo</option>
                                        <option value="Preventivo">Plan Preventivo</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
                                    <select name="prioridad" required class="w-full p-2 border border-gray-300 rounded-lg">
                                        <option value="">Seleccionar prioridad...</option>
                                        <option value="Alta">Alta</option>
                                        <option value="Media">Media</option>
                                        <option value="Baja">Baja</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Título del Plan</label>
                                <input type="text" name="titulo" required class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Título descriptivo del plan">
                            </div>
                            
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                                <textarea name="descripcion" rows="4" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Descripción detallada del plan de acción..."></textarea>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Responsable</label>
                                    <select name="responsable" required class="w-full p-2 border border-gray-300 rounded-lg">
                                        <option value="">Seleccionar responsable...</option>
                                        <option value="1">Juan Pérez - Jefe DDEE</option>
                                        <option value="2">María García - Coordinadora</option>
                                        <option value="3">Carlos López - Especialista</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Límite</label>
                                    <input type="date" name="fechaLimite" required class="w-full p-2 border border-gray-300 rounded-lg">
                                </div>
                            </div>
                            
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Objetivos Específicos</label>
                                <textarea name="objetivos" rows="3" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Objetivos específicos del plan..."></textarea>
                            </div>
                            
                            <div class="flex justify-end space-x-3">
                                <button type="button" onclick="closeModal('planModal')" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
                                    Cancelar
                                </button>
                                <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                    Crear Plan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Modal de Nueva NC -->
            <div id="ncModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden items-center justify-center z-50">
                <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-screen overflow-y-auto">
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">Nueva No Conformidad</h3>
                            <button onclick="closeModal('ncModal')" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <form onsubmit="submitNC(event)">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de NC</label>
                                    <select name="tipoNC" required class="w-full p-2 border border-gray-300 rounded-lg">
                                        <option value="">Seleccionar tipo...</option>
                                        <option value="Mayor">No Conformidad Mayor</option>
                                        <option value="Menor">No Conformidad Menor</option>
                                        <option value="Observacion">Observación</option>
                                        <option value="Oportunidad">Oportunidad de Mejora</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Severidad</label>
                                    <select name="severidad" required class="w-full p-2 border border-gray-300 rounded-lg">
                                        <option value="">Seleccionar severidad...</option>
                                        <option value="Critica">Crítica</option>
                                        <option value="Alta">Alta</option>
                                        <option value="Media">Media</option>
                                        <option value="Baja">Baja</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Descripción de la NC</label>
                                <textarea name="descripcion" rows="4" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Descripción detallada de la no conformidad..."></textarea>
                            </div>
                            
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Evidencia Objetiva</label>
                                <textarea name="evidencia" rows="3" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Evidencia objetiva que sustenta la no conformidad..."></textarea>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Área Afectada</label>
                                    <select name="areaAfectada" required class="w-full p-2 border border-gray-300 rounded-lg">
                                        <option value="">Seleccionar área...</option>
                                        <option value="DDEE">DDEE</option>
                                        <option value="SPO">SPO</option>
                                        <option value="OC">Organismo Certificador</option>
                                        <option value="SGP">Sistema de Gestión de Procesos</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Responsable de Corrección</label>
                                    <select name="responsable" required class="w-full p-2 border border-gray-300 rounded-lg">
                                        <option value="">Seleccionar responsable...</option>
                                        <option value="1">Juan Pérez - Jefe DDEE</option>
                                        <option value="2">María García - Coordinadora</option>
                                        <option value="3">Carlos López - Especialista</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Límite para Corrección</label>
                                <input type="date" name="fechaLimite" required class="w-full p-2 border border-gray-300 rounded-lg">
                            </div>
                            
                            <div class="flex justify-end space-x-3">
                                <button type="button" onclick="closeModal('ncModal')" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
                                    Cancelar
                                </button>
                                <button type="submit" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                    Registrar NC
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    getDerivacionHTML() {
        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-900">Derivación OC/SGP</h2>
                    <button onclick="showDerivacionModal()" class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg">
                        <i class="fas fa-arrow-right mr-2"></i>Nueva Derivación
                    </button>
                </div>

                <!-- Especialistas Disponibles -->
                <div class="mb-8">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Especialistas Disponibles</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="especialistas-container">
                        ${derivacionModule.getEspecialistasHTML()}
                    </div>
                </div>

                <!-- Derivaciones Recientes -->
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Derivaciones Recientes</h3>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-500">
                            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3">ID Derivación</th>
                                    <th class="px-6 py-3">Memoria</th>
                                    <th class="px-6 py-3">Especialista</th>
                                    <th class="px-6 py-3">Fecha</th>
                                    <th class="px-6 py-3">Estado</th>
                                    <th class="px-6 py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${derivacionModule.getDerivacionesRecientes().map(der => `
                                    <tr class="bg-white border-b hover:bg-gray-50">
                                        <td class="px-6 py-4 font-medium text-gray-900">${der.id}</td>
                                        <td class="px-6 py-4">${der.memoriaId}</td>
                                        <td class="px-6 py-4">${der.especialistaNombre}</td>
                                        <td class="px-6 py-4">${der.fechaDerivacion.toLocaleDateString()}</td>
                                        <td class="px-6 py-4">
                                            <span class="px-2 py-1 text-xs font-semibold rounded-full ${this.getStatusColor(der.estado)}">
                                                ${der.estado}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4">
                                            <button class="text-blue-600 hover:text-blue-900 mr-2">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="text-green-600 hover:text-green-900">
                                                <i class="fas fa-bell"></i>
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Modal de Nueva Derivación -->
            <div id="derivacionModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden items-center justify-center z-50">
                <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">Nueva Derivación OC/SGP</h3>
                            <button onclick="closeModal('derivacionModal')" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <form onsubmit="submitDerivacion(event)">
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Memoria a Derivar</label>
                                <select name="memoria" required class="w-full p-2 border border-gray-300 rounded-lg">
                                    <option value="">Seleccionar memoria...</option>
                                    <option value="MEM-2024-001">MEM-2024-001 - Memoria OC Región Norte</option>
                                    <option value="MEM-2024-002">MEM-2024-002 - Memoria SGP Central</option>
                                </select>
                            </div>
                            
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Especialista Asignado</label>
                                <select name="especialista" required class="w-full p-2 border border-gray-300 rounded-lg">
                                    <option value="">Seleccionar especialista...</option>
                                    <option value="1">Dr. Juan Pérez - Especialista OC</option>
                                    <option value="2">Ing. María García - Especialista SGP</option>
                                    <option value="3">Lic. Carlos López - Especialista Senior</option>
                                </select>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Límite</label>
                                    <input type="date" name="fechaLimite" required class="w-full p-2 border border-gray-300 rounded-lg">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
                                    <select name="prioridad" required class="w-full p-2 border border-gray-300 rounded-lg">
                                        <option value="">Seleccionar prioridad...</option>
                                        <option value="Alta">Alta</option>
                                        <option value="Media">Media</option>
                                        <option value="Baja">Baja</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Instrucciones Específicas</label>
                                <textarea name="instrucciones" rows="4" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Instrucciones específicas para el especialista..."></textarea>
                            </div>
                            
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Documentos de Referencia</label>
                                <input type="file" multiple class="w-full p-2 border border-gray-300 rounded-lg">
                                <p class="text-xs text-gray-500 mt-1">Adjuntar documentos de referencia si es necesario</p>
                            </div>
                            
                            <div class="flex justify-end space-x-3">
                                <button type="button" onclick="closeModal('derivacionModal')" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
                                    Cancelar
                                </button>
                                <button type="submit" class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                                    Derivar Memoria
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    getAprobacionHTML() {
        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-900">Aprobación de Planes</h2>
                    <div class="flex space-x-2">
                        <button onclick="showPlanModal()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                            <i class="fas fa-plus mr-2"></i>Nuevo Plan
                        </button>
                        <button onclick="showAprobacionModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                            <i class="fas fa-check mr-2"></i>Revisar Planes
                        </button>
                    </div>
                </div>

                <!-- Estadísticas de Aprobación -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div class="bg-blue-50 rounded-lg p-4 text-center">
                        <i class="fas fa-file-alt text-blue-600 text-2xl mb-2"></i>
                        <h3 class="font-semibold text-blue-800">En Revisión</h3>
                        <p class="text-2xl font-bold text-blue-600">3</p>
                    </div>
                    <div class="bg-green-50 rounded-lg p-4 text-center">
                        <i class="fas fa-check-circle text-green-600 text-2xl mb-2"></i>
                        <h3 class="font-semibold text-green-800">Aprobados</h3>
                        <p class="text-2xl font-bold text-green-600">8</p>
                    </div>
                    <div class="bg-yellow-50 rounded-lg p-4 text-center">
                        <i class="fas fa-exclamation-triangle text-yellow-600 text-2xl mb-2"></i>
                        <h3 class="font-semibold text-yellow-800">Con Observaciones</h3>
                        <p class="text-2xl font-bold text-yellow-600">2</p>
                    </div>
                    <div class="bg-red-50 rounded-lg p-4 text-center">
                        <i class="fas fa-times-circle text-red-600 text-2xl mb-2"></i>
                        <h3 class="font-semibold text-red-800">Rechazados</h3>
                        <p class="text-2xl font-bold text-red-600">1</p>
                    </div>
                </div>

                <!-- Lista de Planes -->
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Planes para Aprobación</h3>
                    <div id="planes-aprobacion-container">
                        ${aprobacionModule.getPlanesHTML()}
                    </div>
                </div>

                <!-- Flujo de Aprobación -->
                <div class="bg-gray-50 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Flujo de Aprobación</h3>
                    <div class="flex items-center space-x-4">
                        <div class="flex items-center">
                            <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                            <span class="ml-2 text-sm text-gray-700">Recepción</span>
                        </div>
                        <div class="flex-1 h-0.5 bg-gray-300"></div>
                        <div class="flex items-center">
                            <div class="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                            <span class="ml-2 text-sm text-gray-700">Validación</span>
                        </div>
                        <div class="flex-1 h-0.5 bg-gray-300"></div>
                        <div class="flex items-center">
                            <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                            <span class="ml-2 text-sm text-gray-700">Aprobación</span>
                        </div>
                        <div class="flex-1 h-0.5 bg-gray-300"></div>
                        <div class="flex items-center">
                            <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
                            <span class="ml-2 text-sm text-gray-700">Notificación</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal de Aprobación -->
            <div id="aprobacionModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden items-center justify-center z-50">
                <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-screen overflow-y-auto">
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">Aprobación de Plan</h3>
                            <button onclick="closeModal('aprobacionModal')" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <form onsubmit="submitAprobacion(event)">
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Plan a Aprobar</label>
                                <select name="plan" required class="w-full p-2 border border-gray-300 rounded-lg">
                                    <option value="">Seleccionar plan...</option>
                                    <option value="PLAN-2024-001">PLAN-2024-001 - Plan Regional Norte</option>
                                    <option value="PLAN-2024-002">PLAN-2024-002 - Plan de Seguridad Central</option>
                                </select>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Estado de Aprobación</label>
                                    <select name="estadoAprobacion" required class="w-full p-2 border border-gray-300 rounded-lg">
                                        <option value="">Seleccionar estado...</option>
                                        <option value="Aprobado">Aprobado</option>
                                        <option value="Aprobado con Observaciones">Aprobado con Observaciones</option>
                                        <option value="Rechazado">Rechazado</option>
                                        <option value="Requiere Modificaciones">Requiere Modificaciones</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Revisor</label>
                                    <select name="revisor" required class="w-full p-2 border border-gray-300 rounded-lg">
                                        <option value="">Seleccionar revisor...</option>
                                        <option value="1">Dr. Juan Pérez - Jefe DDEE</option>
                                        <option value="2">Ing. María García - Supervisor Senior</option>
                                        <option value="3">Lic. Carlos López - Especialista</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                                <textarea name="observaciones" rows="4" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Observaciones sobre la aprobación del plan..."></textarea>
                            </div>
                            
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Criterios de Evaluación</label>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="space-y-2">
                                        <label class="flex items-center">
                                            <input type="checkbox" name="criterios[]" value="completitud" class="mr-2">
                                            <span class="text-sm">Completitud del plan</span>
                                        </label>
                                        <label class="flex items-center">
                                            <input type="checkbox" name="criterios[]" value="viabilidad" class="mr-2">
                                            <span class="text-sm">Viabilidad técnica</span>
                                        </label>
                                        <label class="flex items-center">
                                            <input type="checkbox" name="criterios[]" value="recursos" class="mr-2">
                                            <span class="text-sm">Disponibilidad de recursos</span>
                                        </label>
                                    </div>
                                    <div class="space-y-2">
                                        <label class="flex items-center">
                                            <input type="checkbox" name="criterios[]" value="plazos" class="mr-2">
                                            <span class="text-sm">Plazos realistas</span>
                                        </label>
                                        <label class="flex items-center">
                                            <input type="checkbox" name="criterios[]" value="normativa" class="mr-2">
                                            <span class="text-sm">Cumplimiento normativo</span>
                                        </label>
                                        <label class="flex items-center">
                                            <input type="checkbox" name="criterios[]" value="impacto" class="mr-2">
                                            <span class="text-sm">Análisis de impacto</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="flex justify-end space-x-3">
                                <button type="button" onclick="closeModal('aprobacionModal')" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
                                    Cancelar
                                </button>
                                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    Procesar Aprobación
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    getVerificacionHTML() {
        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-900">Verificación SGP</h2>
                    <button onclick="showVerificacionModal()" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                        <i class="fas fa-search mr-2"></i>Nueva Verificación
                    </button>
                </div>

                <!-- Tabs para Memorias y Planes -->
                <div class="mb-6">
                    <div class="border-b border-gray-200">
                        <nav class="-mb-px flex space-x-8">
                            <button onclick="showVerificacionTab('memorias')" 
                                    class="py-2 px-1 border-b-2 border-purple-500 font-medium text-sm text-purple-600" 
                                    id="tab-memorias">
                                Memorias SGP
                            </button>
                            <button onclick="showVerificacionTab('planes')" 
                                    class="py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300" 
                                    id="tab-planes">
                                Planes Regionales
                            </button>
                        </nav>
                    </div>
                </div>

                <!-- Contenido de Memorias -->
                <div id="memorias-content" class="tab-content">
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Memorias para Verificación</h3>
                        <div id="memorias-verificacion-container">
                            ${verificacionModule.getMemoriasHTML()}
                        </div>
                    </div>
                </div>

                <!-- Contenido de Planes -->
                <div id="planes-content" class="tab-content hidden">
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Planes Regionales Generados</h3>
                        <div id="planes-regionales-container">
                            ${verificacionModule.getPlanesRegionalesHTML()}
                        </div>
                    </div>
                </div>

                <!-- Alertas de Verificación -->
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <i class="fas fa-exclamation-triangle text-yellow-400"></i>
                        </div>
                        <div class="ml-3">
                            <h3 class="text-sm font-medium text-yellow-800">Alertas de Verificación</h3>
                            <div class="mt-2 text-sm text-yellow-700">
                                <ul class="list-disc pl-5 space-y-1">
                                    <li>3 memorias pendientes de verificación</li>
                                    <li>1 memoria con documentos faltantes</li>
                                    <li>2 planes regionales en borrador</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal de Verificación -->
            <div id="verificacionModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden items-center justify-center z-50">
                <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-screen overflow-y-auto">
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">Nueva Verificación SGP</h3>
                            <button onclick="closeModal('verificacionModal')" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <form onsubmit="submitVerificacion(event)">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Verificación</label>
                                    <select name="tipoVerificacion" required class="w-full p-2 border border-gray-300 rounded-lg">
                                        <option value="">Seleccionar tipo...</option>
                                        <option value="Memoria">Verificación de Memoria</option>
                                        <option value="Plan">Verificación de Plan</option>
                                        <option value="Expediente">Verificación de Expediente</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Documento a Verificar</label>
                                    <select name="documento" required class="w-full p-2 border border-gray-300 rounded-lg">
                                        <option value="">Seleccionar documento...</option>
                                        <option value="MEM-2024-001">MEM-2024-001 - Memoria OC Norte</option>
                                        <option value="PLAN-2024-001">PLAN-2024-001 - Plan Regional</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Verificador Asignado</label>
                                    <select name="verificador" required class="w-full p-2 border border-gray-300 rounded-lg">
                                        <option value="">Seleccionar verificador...</option>
                                        <option value="1">Dr. Juan Pérez - Verificador Senior</option>
                                        <option value="2">Ing. María García - Especialista SGP</option>
                                        <option value="3">Lic. Carlos López - Auditor</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Programada</label>
                                    <input type="date" name="fechaProgramada" required class="w-full p-2 border border-gray-300 rounded-lg">
                                </div>
                            </div>
                            
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Aspectos a Verificar</label>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="space-y-2">
                                        <label class="flex items-center">
                                            <input type="checkbox" name="aspectos[]" value="documentacion" class="mr-2">
                                            <span class="text-sm">Documentación completa</span>
                                        </label>
                                        <label class="flex items-center">
                                            <input type="checkbox" name="aspectos[]" value="normativa" class="mr-2">
                                            <span class="text-sm">Cumplimiento normativo</span>
                                        </label>
                                        <label class="flex items-center">
                                            <input type="checkbox" name="aspectos[]" value="procedimientos" class="mr-2">
                                            <span class="text-sm">Procedimientos SGP</span>
                                        </label>
                                    </div>
                                    <div class="space-y-2">
                                        <label class="flex items-center">
                                            <input type="checkbox" name="aspectos[]" value="plazos" class="mr-2">
                                            <span class="text-sm">Cumplimiento de plazos</span>
                                        </label>
                                        <label class="flex items-center">
                                            <input type="checkbox" name="aspectos[]" value="calidad" class="mr-2">
                                            <span class="text-sm">Calidad técnica</span>
                                        </label>
                                        <label class="flex items-center">
                                            <input type="checkbox" name="aspectos[]" value="consistencia" class="mr-2">
                                            <span class="text-sm">Consistencia interna</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Observaciones Iniciales</label>
                                <textarea name="observaciones" rows="3" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Observaciones o instrucciones específicas para la verificación..."></textarea>
                            </div>
                            
                            <div class="flex justify-end space-x-3">
                                <button type="button" onclick="closeModal('verificacionModal')" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
                                    Cancelar
                                </button>
                                <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                                    Programar Verificación
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    getSPOHTML() {
        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-900">Módulo SPO - Especialista en Seguridad</h2>
                    <button onclick="showSPOModal()" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                        <i class="fas fa-shield-alt mr-2"></i>Nueva Gestión SPO
                    </button>
                </div>

                <!-- Estadísticas SPO -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div class="bg-purple-50 rounded-lg p-4 text-center">
                        <i class="fas fa-file-medical text-purple-600 text-2xl mb-2"></i>
                        <h3 class="font-semibold text-purple-800">Memorias SPO</h3>
                        <p class="text-2xl font-bold text-purple-600">2</p>
                    </div>
                    <div class="bg-green-50 rounded-lg p-4 text-center">
                        <i class="fas fa-shield-alt text-green-600 text-2xl mb-2"></i>
                        <h3 class="font-semibold text-green-800">Planes Seguridad</h3>
                        <p class="text-2xl font-bold text-green-600">1</p>
                    </div>
                    <div class="bg-blue-50 rounded-lg p-4 text-center">
                        <i class="fas fa-clipboard-check text-blue-600 text-2xl mb-2"></i>
                        <h3 class="font-semibold text-blue-800">Evaluaciones</h3>
                        <p class="text-2xl font-bold text-blue-600">3</p>
                    </div>
                    <div class="bg-orange-50 rounded-lg p-4 text-center">
                        <i class="fas fa-users text-orange-600 text-2xl mb-2"></i>
                        <h3 class="font-semibold text-orange-800">Derivaciones</h3>
                        <p class="text-2xl font-bold text-orange-600">4</p>
                    </div>
                </div>

                <!-- Tabs SPO -->
                <div class="mb-6">
                    <div class="border-b border-gray-200">
                        <nav class="-mb-px flex space-x-8">
                            <button onclick="showSPOTab('memorias')" 
                                    class="py-2 px-1 border-b-2 border-purple-500 font-medium text-sm text-purple-600" 
                                    id="tab-memorias-spo">
                                Memorias SPO
                            </button>
                            <button onclick="showSPOTab('planes-seguridad')" 
                                    class="py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300" 
                                    id="tab-planes-seguridad">
                                Planes de Seguridad
                            </button>
                            <button onclick="showSPOTab('expedientes-oc')" 
                                    class="py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300" 
                                    id="tab-expedientes-oc">
                                Expedientes OC
                            </button>
                        </nav>
                    </div>
                </div>

                <!-- Contenido Memorias SPO -->
                <div id="memorias-spo-content" class="tab-content">
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Memorias para Verificación SPO</h3>
                        <div id="memorias-spo-container">
                            ${spoModule.getMemoriasSPOHTML()}
                        </div>
                    </div>
                </div>

                <!-- Contenido Planes de Seguridad -->
                <div id="planes-seguridad-content" class="tab-content hidden">
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Planes de Seguridad</h3>
                        <div id="planes-seguridad-container">
                            ${spoModule.getPlanesSeguridadHTML()}
                        </div>
                    </div>
                </div>

                <!-- Contenido Expedientes OC -->
                <div id="expedientes-oc-content" class="tab-content hidden">
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Expedientes OC Archivados</h3>
                        <div class="bg-gray-50 rounded-lg p-4">
                            <p class="text-gray-600 text-center">No hay expedientes OC archivados</p>
                        </div>
                    </div>
                </div>

                <!-- Proceso SPO -->
                <div class="bg-purple-50 rounded-lg p-4 mt-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Flujo de Proceso SPO</h3>
                    <div class="flex items-center space-x-4 overflow-x-auto">
                        <div class="flex items-center flex-shrink-0">
                            <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                            <span class="ml-2 text-sm text-gray-700">Verificar Memoria</span>
                        </div>
                        <div class="flex-1 h-0.5 bg-gray-300"></div>
                        <div class="flex items-center flex-shrink-0">
                            <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                            <span class="ml-2 text-sm text-gray-700">Elaborar Plan</span>
                        </div>
                        <div class="flex-1 h-0.5 bg-gray-300"></div>
                        <div class="flex items-center flex-shrink-0">
                            <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                            <span class="ml-2 text-sm text-gray-700">Evaluar</span>
                        </div>
                        <div class="flex-1 h-0.5 bg-gray-300"></div>
                        <div class="flex items-center flex-shrink-0">
                            <div class="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
                            <span class="ml-2 text-sm text-gray-700">Derivar</span>
                        </div>
                        <div class="flex-1 h-0.5 bg-gray-300"></div>
                        <div class="flex items-center flex-shrink-0">
                            <div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">5</div>
                            <span class="ml-2 text-sm text-gray-700">Cerrar</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal SPO -->
            <div id="spoModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden items-center justify-center z-50">
                <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">Nueva Gestión SPO</h3>
                            <button onclick="closeModal('spoModal')" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <form onsubmit="submitSPO(event)">
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Gestión SPO</label>
                                <select name="tipoGestion" required class="w-full p-2 border border-gray-300 rounded-lg">
                                    <option value="">Seleccionar tipo...</option>
                                    <option value="Memoria">Gestión de Memoria</option>
                                    <option value="Plan Seguridad">Plan de Seguridad</option>
                                    <option value="Expediente OC">Expediente OC</option>
                                </select>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Documento Asociado</label>
                                    <select name="documento" required class="w-full p-2 border border-gray-300 rounded-lg">
                                        <option value="">Seleccionar documento...</option>
                                        <option value="DOC-2024-001">DOC-2024-001 - Memoria SPO Norte</option>
                                        <option value="DOC-2024-002">DOC-2024-002 - Plan Seguridad Central</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Responsable SPO</label>
                                    <select name="responsable" required class="w-full p-2 border border-gray-300 rounded-lg">
                                        <option value="">Seleccionar responsable...</option>
                                        <option value="1">Ing. Juan Pérez - Especialista SPO</option>
                                        <option value="2">Lic. María García - Coordinadora SPO</option>
                                        <option value="3">Dr. Carlos López - Jefe SPO</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Descripción de la Gestión</label>
                                <textarea name="descripcion" rows="4" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Describir la gestión SPO a realizar..."></textarea>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Límite</label>
                                    <input type="date" name="fechaLimite" required class="w-full p-2 border border-gray-300 rounded-lg">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
                                    <select name="prioridad" required class="w-full p-2 border border-gray-300 rounded-lg">
                                        <option value="">Seleccionar prioridad...</option>
                                        <option value="Alta">Alta</option>
                                        <option value="Media">Media</option>
                                        <option value="Baja">Baja</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="flex justify-end space-x-3">
                                <button type="button" onclick="closeModal('spoModal')" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
                                    Cancelar
                                </button>
                                <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                                    Crear Gestión SPO
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    getArchivoHTML() {
        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-900">Archivo de Expedientes</h2>
                    <button onclick="showArchivoModal()" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
                        <i class="fas fa-archive mr-2"></i>Archivar Expediente
                    </button>
                </div>

                <!-- Estadísticas de Archivo -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div class="bg-gray-50 rounded-lg p-4 text-center">
                        <i class="fas fa-folder text-gray-600 text-2xl mb-2"></i>
                        <h3 class="font-semibold text-gray-800">Total Archivados</h3>
                        <p class="text-2xl font-bold text-gray-600">156</p>
                    </div>
                    <div class="bg-blue-50 rounded-lg p-4 text-center">
                        <i class="fas fa-file-alt text-blue-600 text-2xl mb-2"></i>
                        <h3 class="font-semibold text-blue-800">Este Mes</h3>
                        <p class="text-2xl font-bold text-blue-600">12</p>
                    </div>
                    <div class="bg-green-50 rounded-lg p-4 text-center">
                        <i class="fas fa-check-circle text-green-600 text-2xl mb-2"></i>
                        <h3 class="font-semibold text-green-800">Completados</h3>
                        <p class="text-2xl font-bold text-green-600">142</p>
                    </div>
                    <div class="bg-yellow-50 rounded-lg p-4 text-center">
                        <i class="fas fa-clock text-yellow-600 text-2xl mb-2"></i>
                        <h3 class="font-semibold text-yellow-800">Pendientes</h3>
                        <p class="text-2xl font-bold text-yellow-600">14</p>
                    </div>
                </div>

                <!-- Filtros de Búsqueda -->
                <div class="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Expediente</label>
                        <select class="w-full p-2 border border-gray-300 rounded-lg">
                            <option>Todos</option>
                            <option>Supervisión</option>
                            <option>Seguridad</option>
                            <option>Planes de Acción</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Año</label>
                        <select class="w-full p-2 border border-gray-300 rounded-lg">
                            <option>2024</option>
                            <option>2023</option>
                            <option>2022</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                        <select class="w-full p-2 border border-gray-300 rounded-lg">
                            <option>Todos</option>
                            <option>Archivado</option>
                            <option>En Proceso</option>
                            <option>Pendiente</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                        <input type="text" placeholder="ID o título..." class="w-full p-2 border border-gray-300 rounded-lg">
                    </div>
                </div>

                <!-- Lista de Expedientes Archivados -->
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-gray-500">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th class="px-6 py-3">ID Expediente</th>
                                <th class="px-6 py-3">Tipo</th>
                                <th class="px-6 py-3">Título</th>
                                <th class="px-6 py-3">Fecha Archivo</th>
                                <th class="px-6 py-3">Estado</th>
                                <th class="px-6 py-3">Sello Digital</th>
                                <th class="px-6 py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="bg-white border-b hover:bg-gray-50">
                                <td class="px-6 py-4 font-medium text-gray-900">EXP-2024-001</td>
                                <td class="px-6 py-4">Supervisión</td>
                                <td class="px-6 py-4">Supervisión Operaciones Mineras</td>
                                <td class="px-6 py-4">15/01/2024</td>
                                <td class="px-6 py-4">
                                    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                        Archivado
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <i class="fas fa-certificate text-green-600"></i>
                                </td>
                                <td class="px-6 py-4">
                                    <button class="text-blue-600 hover:text-blue-900 mr-2">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="text-green-600 hover:text-green-900 mr-2">
                                        <i class="fas fa-download"></i>
                                    </button>
                                    <button class="text-purple-600 hover:text-purple-900">
                                        <i class="fas fa-chart-bar"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr class="bg-white border-b hover:bg-gray-50">
                                <td class="px-6 py-4 font-medium text-gray-900">EXP-2024-002</td>
                                <td class="px-6 py-4">Seguridad</td>
                                <td class="px-6 py-4">Plan de Seguridad Industrial</td>
                                <td class="px-6 py-4">12/01/2024</td>
                                <td class="px-6 py-4">
                                    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                        Archivado
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <i class="fas fa-certificate text-green-600"></i>
                                </td>
                                <td class="px-6 py-4">
                                    <button class="text-blue-600 hover:text-blue-900 mr-2">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="text-green-600 hover:text-green-900 mr-2">
                                        <i class="fas fa-download"></i>
                                    </button>
                                    <button class="text-purple-600 hover:text-purple-900">
                                        <i class="fas fa-chart-bar"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Proceso de Archivo -->
                <div class="bg-gray-50 rounded-lg p-4 mt-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Proceso de Archivo</h3>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div class="text-center">
                            <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white mx-auto mb-2">
                                <i class="fas fa-check"></i>
                            </div>
                            <h4 class="font-semibold text-gray-900">Validación</h4>
                            <p class="text-sm text-gray-600">Verificar completitud</p>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white mx-auto mb-2">
                                <i class="fas fa-signature"></i>
                            </div>
                            <h4 class="font-semibold text-gray-900">Firma Digital</h4>
                            <p class="text-sm text-gray-600">Aplicar sello</p>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white mx-auto mb-2">
                                <i class="fas fa-archive"></i>
                            </div>
                            <h4 class="font-semibold text-gray-900">Archivo</h4>
                            <p class="text-sm text-gray-600">Almacenar seguro</p>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white mx-auto mb-2">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <h4 class="font-semibold text-gray-900">Reportes</h4>
                            <p class="text-sm text-gray-600">Generar estadísticas</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal de Archivo -->
            <div id="archivoModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden items-center justify-center z-50">
                <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">Archivar Expediente</h3>
                            <button onclick="closeModal('archivoModal')" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <form onsubmit="submitArchivo(event)">
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Expediente a Archivar</label>
                                <select name="expediente" required class="w-full p-2 border border-gray-300 rounded-lg">
                                    <option value="">Seleccionar expediente...</option>
                                    <option value="EXP-2024-001">EXP-2024-001 - Lista de Inspecciones</option>
                                    <option value="EXP-2024-002">EXP-2024-002 - Memoria OC/SGP</option>
                                </select>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Motivo de Archivo</label>
                                    <select name="motivoArchivo" required class="w-full p-2 border border-gray-300 rounded-lg">
                                        <option value="">Seleccionar motivo...</option>
                                        <option value="Completado">Proceso Completado</option>
                                        <option value="Cancelado">Proceso Cancelado</option>
                                        <option value="Vencido">Plazo Vencido</option>
                                        <option value="Duplicado">Expediente Duplicado</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Categoría de Archivo</label>
                                    <select name="categoria" required class="w-full p-2 border border-gray-300 rounded-lg">
                                        <option value="">Seleccionar categoría...</option>
                                        <option value="Activo">Archivo Activo</option>
                                        <option value="Pasivo">Archivo Pasivo</option>
                                        <option value="Historico">Archivo Histórico</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Observaciones de Archivo</label>
                                <textarea name="observaciones" rows="4" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Observaciones sobre el archivo del expediente..."></textarea>
                            </div>
                            
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Ubicación Física</label>
                                <input type="text" name="ubicacionFisica" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Ej: Estante A-15, Caja 234">
                            </div>
                            
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Tiempo de Retención (años)</label>
                                <select name="tiempoRetencion" required class="w-full p-2 border border-gray-300 rounded-lg">
                                    <option value="">Seleccionar tiempo...</option>
                                    <option value="5">5 años</option>
                                    <option value="10">10 años</option>
                                    <option value="15">15 años</option>
                                    <option value="permanente">Permanente</option>
                                </select>
                            </div>
                            
                            <div class="flex justify-end space-x-3">
                                <button type="button" onclick="closeModal('archivoModal')" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
                                    Cancelar
                                </button>
                                <button type="submit" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                                    Archivar Expediente
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    getReportesHTML() {
        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-900">Reportes y Estadísticas</h2>
                    <button onclick="alert('Funcionalidad: Generar Reporte - Sistema de reportes implementado')" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
                        <i class="fas fa-file-pdf mr-2"></i>Generar Reporte
                    </button>
                </div>

                <!-- Report Filters -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Período</label>
                        <select class="w-full p-2 border border-gray-300 rounded-lg">
                            <option>Último mes</option>
                            <option>Últimos 3 meses</option>
                            <option>Último año</option>
                            <option>Personalizado</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Reporte</label>
                        <select class="w-full p-2 border border-gray-300 rounded-lg">
                            <option>Resumen Ejecutivo</option>
                            <option>Detalle de Supervisiones</option>
                            <option>Análisis de Hallazgos</option>
                            <option>Rendimiento por Usuario</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Responsable</label>
                        <select class="w-full p-2 border border-gray-300 rounded-lg">
                            <option>Todos</option>
                            <option>Mesa de Partes</option>
                            <option>Jefe DDEE</option>
                            <option>Especialista SPO</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                        <select class="w-full p-2 border border-gray-300 rounded-lg">
                            <option>Todos</option>
                            <option>Completados</option>
                            <option>En Proceso</option>
                            <option>Pendientes</option>
                        </select>
                    </div>
                </div>

                <!-- Charts and Statistics -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div class="bg-gray-50 rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Expedientes por Estado</h3>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Recibidos</span>
                                <div class="flex items-center">
                                    <div class="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                        <div class="bg-blue-600 h-2 rounded-full" style="width: 60%"></div>
                                    </div>
                                    <span class="text-sm font-semibold">24</span>
                                </div>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">En Proceso</span>
                                <div class="flex items-center">
                                    <div class="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                        <div class="bg-yellow-600 h-2 rounded-full" style="width: 30%"></div>
                                    </div>
                                    <span class="text-sm font-semibold">12</span>
                                </div>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Completados</span>
                                <div class="flex items-center">
                                    <div class="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                        <div class="bg-green-600 h-2 rounded-full" style="width: 20%"></div>
                                    </div>
                                    <span class="text-sm font-semibold">8</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gray-50 rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Rendimiento Mensual</h3>
                        <div class="space-y-4">
                            <div class="flex justify-between">
                                <span class="text-gray-600">Tiempo Promedio de Procesamiento</span>
                                <span class="font-semibold text-blue-600">4.2 días</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Tasa de Cumplimiento</span>
                                <span class="font-semibold text-green-600">92%</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Hallazgos Críticos</span>
                                <span class="font-semibold text-red-600">3</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Satisfacción del Usuario</span>
                                <span class="font-semibold text-purple-600">4.5/5</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
                    <div class="space-y-3">
                        <div class="flex items-center p-3 bg-blue-50 rounded-lg">
                            <i class="fas fa-file-import text-blue-600 mr-3"></i>
                            <div class="flex-1">
                                <p class="text-sm font-medium text-gray-900">Nuevo expediente recibido</p>
                                <p class="text-xs text-gray-600">EXP-2024-003 - hace 2 horas</p>
                            </div>
                        </div>
                        <div class="flex items-center p-3 bg-green-50 rounded-lg">
                            <i class="fas fa-check-circle text-green-600 mr-3"></i>
                            <div class="flex-1">
                                <p class="text-sm font-medium text-gray-900">Supervisión completada</p>
                                <p class="text-xs text-gray-600">EXP-2024-001 - hace 4 horas</p>
                            </div>
                        </div>
                        <div class="flex items-center p-3 bg-yellow-50 rounded-lg">
                            <i class="fas fa-exclamation-triangle text-yellow-600 mr-3"></i>
                            <div class="flex-1">
                                <p class="text-sm font-medium text-gray-900">Hallazgo registrado</p>
                                <p class="text-xs text-gray-600">EXP-2024-002 - hace 6 horas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Utility methods
    getStatusColor(status) {
        const colors = {
            'Recibido': 'bg-blue-100 text-blue-800',
            'En Proceso': 'bg-yellow-100 text-yellow-800',
            'En Revisión': 'bg-orange-100 text-orange-800',
            'Completado': 'bg-green-100 text-green-800',
            'Aprobado': 'bg-green-100 text-green-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    }

    getPriorityColor(priority) {
        const colors = {
            'Alta': 'bg-red-100 text-red-800',
            'Media': 'bg-yellow-100 text-yellow-800',
            'Baja': 'bg-green-100 text-green-800'
        };
        return colors[priority] || 'bg-gray-100 text-gray-800';
    }

    // Modal methods
    showRecepcionModal() {
        document.getElementById('recepcionModal').classList.remove('hidden');
        document.getElementById('recepcionModal').classList.add('flex');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
        document.getElementById(modalId).classList.remove('flex');
    }

    // Form submission methods
    submitRecepcion(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        // Generate new expediente ID
        const newId = `EXP-2024-${String(this.expedientes.length + 1).padStart(3, '0')}`;
        
        const newExpediente = {
            id: newId,
            tipo: formData.get('tipo'),
            estado: 'Recibido',
            fecha: new Date().toISOString().split('T')[0],
            responsable: 'Mesa de Partes',
            prioridad: formData.get('prioridad')
        };
        
        this.expedientes.push(newExpediente);
        this.closeModal('recepcionModal');
        this.showModule('recepcion');
        
        // Show success notification
        this.showNotification('Expediente registrado exitosamente', 'success');
    }

    // Action methods
    viewExpediente(id) {
        alert(`Ver detalles del expediente: ${id}`);
    }

    editExpediente(id) {
        alert(`Editar expediente: ${id}`);
    }

    generateAcuse(id) {
        alert(`Generar acuse de recepción para: ${id}`);
    }

    generateReport() {
        alert('Generando reporte PDF...');
    }

    showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Métodos para nuevos módulos
    showDerivacionModal() {
        this.openModal('derivacionModal');
    }

    showAprobacionModal() {
        this.openModal('aprobacionModal');
    }

    showVerificacionModal() {
        this.openModal('verificacionModal');
    }

    showVerificacionTab(tabName) {
        // Ocultar todos los contenidos de tabs
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });

        // Mostrar el contenido seleccionado
        document.getElementById(`${tabName}-content`).classList.remove('hidden');

        // Actualizar estilos de tabs
        document.querySelectorAll('[id^="tab-"]').forEach(tab => {
            tab.className = 'py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300';
        });

        document.getElementById(`tab-${tabName}`).className = 'py-2 px-1 border-b-2 border-purple-500 font-medium text-sm text-purple-600';
    }

    showPlanesTab(tabName) {
        // Ocultar todos los contenidos de tabs de planes
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });

        // Mostrar el contenido seleccionado
        document.getElementById(`${tabName === 'planes' ? 'planes-accion' : tabName}-content`).classList.remove('hidden');

        // Actualizar estilos de tabs
        document.querySelectorAll('[id^="tab-planes"], [id^="tab-ncs"]').forEach(tab => {
            tab.className = 'py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300';
        });

        const activeTabId = tabName === 'planes' ? 'tab-planes-accion' : 'tab-ncs';
        document.getElementById(activeTabId).className = 'py-2 px-1 border-b-2 border-indigo-500 font-medium text-sm text-indigo-600';
    }

    showSPOTab(tabName) {
        // Ocultar todos los contenidos de tabs SPO
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });

        // Mostrar el contenido seleccionado
        document.getElementById(`${tabName}-content`).classList.remove('hidden');

        // Actualizar estilos de tabs SPO
        document.querySelectorAll('[id^="tab-memorias-spo"], [id^="tab-planes-seguridad"], [id^="tab-expedientes-oc"]').forEach(tab => {
            tab.className = 'py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300';
        });

        const tabMap = {
            'memorias': 'tab-memorias-spo',
            'planes-seguridad': 'tab-planes-seguridad',
            'expedientes-oc': 'tab-expedientes-oc'
        };

        document.getElementById(tabMap[tabName]).className = 'py-2 px-1 border-b-2 border-purple-500 font-medium text-sm text-purple-600';
    }

    // Métodos adicionales para modales
    showNCModal() {
        this.openModal('ncModal');
    }

    showSPOModal() {
        this.openModal('spoModal');
    }

    showArchivoModal() {
        this.openModal('archivoModal');
    }

    // Métodos de utilidad para modales
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        } else {
            console.error(`Modal ${modalId} no encontrado`);
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

    updateActiveMenuItem(moduleName) {
        // Remove active class from all menu items
        document.querySelectorAll('button[onclick*="showModule"]').forEach(button => {
            button.classList.remove('bg-blue-100', 'text-blue-700');
            button.classList.add('text-gray-700');
        });

        // Add active class to current module
        const activeButton = document.querySelector(`button[onclick*="showModule('${moduleName}')"]`);
        if (activeButton) {
            activeButton.classList.remove('text-gray-700');
            activeButton.classList.add('bg-blue-100', 'text-blue-700');
        }
    }
}

// Initialize the application
let app;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing SICPO App...');
    try {
        app = new SICPOApp();
        console.log('SICPO App initialized successfully');
        
        // Make app globally available
        window.app = app;
        
        // Show default module
        setTimeout(() => {
            if (app && app.showModule) {
                app.showModule('recepcion');
            }
        }, 100);
        
    } catch (error) {
        console.error('Error initializing SICPO App:', error);
    }
});

// Global function to show modules (called from HTML)
function showModule(moduleName) {
    console.log('showModule called with:', moduleName);
    
    if (window.app && window.app.showModule) {
        console.log('Showing module:', moduleName);
        window.app.showModule(moduleName);
    } else if (app && app.showModule) {
        console.log('Showing module via app:', moduleName);
        app.showModule(moduleName);
    } else {
        console.error('App not initialized yet, retrying...');
        // Retry after a short delay
        setTimeout(() => {
            if (window.app && window.app.showModule) {
                window.app.showModule(moduleName);
            } else if (app && app.showModule) {
                app.showModule(moduleName);
            } else {
                console.error('Failed to initialize app after retry');
            }
        }, 200);
    }
}

// Global functions for tab navigation
function showPlanesTab(tabName) {
    if (window.app && window.app.showPlanesTab) {
        window.app.showPlanesTab(tabName);
    } else if (app && app.showPlanesTab) {
        app.showPlanesTab(tabName);
    } else {
        console.error('showPlanesTab method not available');
    }
}

function showVerificacionTab(tabName) {
    if (window.app && window.app.showVerificacionTab) {
        window.app.showVerificacionTab(tabName);
    } else if (app && app.showVerificacionTab) {
        app.showVerificacionTab(tabName);
    } else {
        console.error('showVerificacionTab method not available');
    }
}

function showSPOTab(tabName) {
    if (window.app && window.app.showSPOTab) {
        window.app.showSPOTab(tabName);
    } else if (app && app.showSPOTab) {
        app.showSPOTab(tabName);
    } else {
        console.error('showSPOTab method not available');
    }
}

// Global functions for modal management
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function submitRecepcion(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    console.log('Datos de recepción:', data);
    alert('Expediente registrado exitosamente');
    closeModal('recepcionModal');
    event.target.reset();
}

// Funciones globales para cerrar modales
function closeModal(modalId) {
    if (window.app) {
        window.app.closeModal(modalId);
    } else if (app) {
        app.closeModal(modalId);
    } else {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }
}

// Funciones de envío de formularios
function submitRecepcion(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    console.log('Datos de recepción:', data);
    alert('Expediente registrado exitosamente');
    closeModal('recepcionModal');
    event.target.reset();
}

function submitDistribucion(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    console.log('Datos de distribución:', data);
    alert('Expediente distribuido exitosamente');
    closeModal('distribucionModal');
    event.target.reset();
}

function submitSupervision(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    console.log('Datos de supervisión:', data);
    alert('Supervisión programada exitosamente');
    closeModal('supervisionModal');
    event.target.reset();
}

function submitDerivacion(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    console.log('Datos de derivación:', data);
    alert('Memoria derivada exitosamente');
    closeModal('derivacionModal');
    event.target.reset();
}

function submitAprobacion(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    console.log('Datos de aprobación:', data);
    alert('Aprobación procesada exitosamente');
    closeModal('aprobacionModal');
    event.target.reset();
}

function submitVerificacion(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    console.log('Datos de verificación:', data);
    alert('Verificación programada exitosamente');
    closeModal('verificacionModal');
    event.target.reset();
}

function submitSPO(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    console.log('Datos de gestión SPO:', data);
    alert('Gestión SPO creada exitosamente');
    closeModal('spoModal');
    event.target.reset();
}

function submitArchivo(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    console.log('Datos de archivo:', data);
    alert('Expediente archivado exitosamente');
    closeModal('archivoModal');
    event.target.reset();
}

function submitPlan(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    console.log('Datos de plan:', data);
    alert('Plan de acción creado exitosamente');
    closeModal('planModal');
    event.target.reset();
}

function submitNC(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    console.log('Datos de NC:', data);
    alert('No conformidad registrada exitosamente');
    closeModal('ncModal');
    event.target.reset();
}// Funcione
s globales para abrir modales (faltantes)
function showRecepcionModal() {
    if (window.app && window.app.showRecepcionModal) {
        window.app.showRecepcionModal();
    } else if (app && app.showRecepcionModal) {
        app.showRecepcionModal();
    } else {
        console.error('showRecepcionModal method not available');
    }
}

function showDistribucionModal() {
    if (window.app && window.app.showDistribucionModal) {
        window.app.showDistribucionModal();
    } else if (app && app.showDistribucionModal) {
        app.showDistribucionModal();
    } else {
        console.error('showDistribucionModal method not available');
    }
}

function showSupervisionModal() {
    if (window.app && window.app.showSupervisionModal) {
        window.app.showSupervisionModal();
    } else if (app && app.showSupervisionModal) {
        app.showSupervisionModal();
    } else {
        console.error('showSupervisionModal method not available');
    }
}

function showDerivacionModal() {
    if (window.app && window.app.showDerivacionModal) {
        window.app.showDerivacionModal();
    } else if (app && app.showDerivacionModal) {
        app.showDerivacionModal();
    } else {
        console.error('showDerivacionModal method not available');
    }
}

function showPlanModal() {
    if (window.app && window.app.showPlanModal) {
        window.app.showPlanModal();
    } else if (app && app.showPlanModal) {
        app.showPlanModal();
    } else {
        console.error('showPlanModal method not available');
    }
}

function showAprobacionModal() {
    if (window.app && window.app.showAprobacionModal) {
        window.app.showAprobacionModal();
    } else if (app && app.showAprobacionModal) {
        app.showAprobacionModal();
    } else {
        console.error('showAprobacionModal method not available');
    }
}

function showVerificacionModal() {
    if (window.app && window.app.showVerificacionModal) {
        window.app.showVerificacionModal();
    } else if (app && app.showVerificacionModal) {
        app.showVerificacionModal();
    } else {
        console.error('showVerificacionModal method not available');
    }
}

function showSPOModal() {
    if (window.app && window.app.showSPOModal) {
        window.app.showSPOModal();
    } else if (app && app.showSPOModal) {
        app.showSPOModal();
    } else {
        console.error('showSPOModal method not available');
    }
}

function showArchivoModal() {
    if (window.app && window.app.showArchivoModal) {
        window.app.showArchivoModal();
    } else if (app && app.showArchivoModal) {
        app.showArchivoModal();
    } else {
        console.error('showArchivoModal method not available');
    }
}

function showNCModal() {
    if (window.app && window.app.showNCModal) {
        window.app.showNCModal();
    } else if (app && app.showNCModal) {
        app.showNCModal();
    } else {
        console.error('showNCModal method not available');
    }
}