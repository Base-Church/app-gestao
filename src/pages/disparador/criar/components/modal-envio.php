<!-- Modal de Envio -->
<div id="sendModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Enviar Campanha</h3>
            <button class="text-gray-400 hover:text-gray-600" onclick="closeSendModal()">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
        
        <div class="p-6">
            <div class="space-y-4">
                <div class="grid grid-cols-3 gap-4">
                    <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                        <div class="text-lg font-bold text-blue-600" id="modalTotalGrupos">0</div>
                        <div class="text-xs text-gray-600 dark:text-gray-400">Grupos</div>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                        <div class="text-lg font-bold text-blue-600" id="modalTotalMensagens">0</div>
                        <div class="text-xs text-gray-600 dark:text-gray-400">Mensagens</div>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                        <div class="text-lg font-bold text-blue-600" id="modalTotalEnvio">0</div>
                        <div class="text-xs text-gray-600 dark:text-gray-400">Total</div>
                    </div>
                </div>
                
                <div class="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
                    <div class="flex">
                        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                        </svg>
                        <span class="text-sm">A campanha será enviada imediatamente para todos os grupos selecionados.</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button id="btnCancelarEnvio" class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors" onclick="closeSendModal()">
                Cancelar
            </button>
            <button id="btnEnviarCampanha" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors" onclick="enviarCampanha()">
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
                Enviar Campanha
            </button>
        </div>
    </div>
</div> 