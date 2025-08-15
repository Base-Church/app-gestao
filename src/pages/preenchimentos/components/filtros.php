<?php
/**
 * Filtros de Preenchimentos
 * Componente para filtrar e buscar preenchimentos
 */
?>

<!-- Filtros e Busca -->
<div class="mt-4 sm:mt-0 flex items-center gap-4">
    <!-- Filtro de Busca -->
    <div class="relative">
        <input type="text" 
               id="search-input"
               class="block w-full rounded-md border-0 py-2 pl-10 pr-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 sm:text-sm sm:leading-6" 
               placeholder="Buscar formulário..."
               autocomplete="off">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
            </svg>
        </div>
    </div>

    <!-- Filtro por Data -->
    <input type="date" 
           id="date-filter"
           class="block rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 sm:text-sm sm:leading-6"
           title="Filtrar por data de criação">
</div>
