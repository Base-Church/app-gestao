<div id="modal-resumo-escala" class="fixed inset-0 z-[5000] flex items-center justify-center bg-black/60">
    <div class="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-2xl max-w-5xl w-full p-0 overflow-hidden relative animate-fade-in">
        <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-primary-600">
            <h2 class="text-xl font-bold text-white">Resumo da Escala</h2>
            <button class="fechar-modal-resumo text-white hover:text-red-300 text-2xl leading-none">&times;</button>
        </div>
        <div class="flex flex-col">
            <div class="flex border-b border-gray-200 dark:border-gray-700">
                <button type="button" id="tab-btn-resumo" tabindex="0" class="tab-resumo-ativa flex-1 px-4 py-3 text-center font-semibold bg-primary-50 dark:bg-gray-800 text-primary-700 dark:text-primary-200 border-b-2 border-primary-600 focus:outline-none transition" data-tab="resumo">
                    Resumo
                </button>
                <button type="button" id="tab-btn-fora" tabindex="0" class="tab-resumo-inativa flex-1 px-4 py-3 text-center font-semibold bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-200 border-b-2 border-transparent focus:outline-none transition" data-tab="fora">
                    Fora da Escala
                </button>
            </div>
            <div id="tab-conteudo-resumo" class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 class="font-semibold text-primary-700 dark:text-primary-200 mb-2 text-base">Eventos Selecionados</h3>
                        <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 max-h-72 overflow-y-auto p-3">
                            <ul id="resumo-eventos-list" class="space-y-2 text-sm text-gray-800 dark:text-gray-100"></ul>
                        </div>
                    </div>
                    <div>
                        <h3 class="font-semibold text-primary-700 dark:text-primary-200 mb-2 text-base">Voluntários Escolhidos</h3>
                        <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 max-h-72 overflow-y-auto p-3">
                            <ul id="resumo-voluntarios-list" class="space-y-2 text-sm text-gray-800 dark:text-gray-100"></ul>
                        </div>
                    </div>
                </div>
            </div>
            <div id="tab-conteudo-fora" class="p-6 hidden">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 class="font-semibold text-primary-700 dark:text-primary-200 mb-2 text-base">Eventos fora da escala</h3>
                        <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 max-h-72 overflow-y-auto p-3">
                            <div id="fora-eventos-list" class="grid grid-cols-1 gap-2"></div>
                        </div>
                    </div>
                    <div>
                        <h3 class="font-semibold text-primary-700 dark:text-primary-200 mb-2 text-base">Voluntários não escolhidos</h3>
                        <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 max-h-72 overflow-y-auto p-3">
                            <div id="fora-voluntarios-list" class="grid grid-cols-1 gap-2"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>