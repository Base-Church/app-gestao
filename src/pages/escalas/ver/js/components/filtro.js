const filterModuleUrl = new URL('./FilterModal.js', import.meta.url).href;
const repertorioModuleUrl = new URL('./RepertorioModal.js', import.meta.url).href;

let FilterModal;
let filterModal;
let repertorioModal;
let modulesLoaded = false;

// Função para aguardar os dados da escala
function waitForEscalaData() {
    return new Promise((resolve) => {
        if (window.escalaData) {
            resolve(window.escalaData);
            return;
        }

        // Listener para o evento quando os dados forem carregados
        document.addEventListener('escalaLoaded', (e) => {
            resolve(e.detail.data);
        }, { once: true });
    });
}

// Carrega os módulos primeiro
Promise.all([
    import(filterModuleUrl),
    import(repertorioModuleUrl),
    waitForEscalaData() // Aguarda os dados serem carregados
]).then(async ([filterModule, repertorioModule, escalaData]) => {
    
    FilterModal = filterModule.FilterModal;
    modulesLoaded = true;
    
    // Usar os dados carregados
    const normalizedData = escalaData?.data || escalaData || { eventos: [] };
    
    // Initialize repertorio modal
    repertorioModal = new repertorioModule.RepertorioModal(normalizedData);
    
    // Add click event for repertorio button
    document.getElementById('add-repertorio')?.addEventListener('click', () => {
        repertorioModal.show();
        document.getElementById('menu-dropdown').classList.add('hidden');
    });
    
    if (window.escalaData) {
        initializeModals(window.escalaData);
    }
}).catch(error => {
    console.error('Erro ao carregar módulos:', error);
});

// Função para inicializar os modais
function initializeModals(data) {
    if (!modulesLoaded) {
        window.escalaData = data;
        return;
    }

    // Initialize filter modal using the stored class
    if (!filterModal) { // Added check to prevent re-initialization
        filterModal = new FilterModal(data);

        // Add click event for opening filters
        document.getElementById('open-filters')?.addEventListener('click', () => {
            filterModal.show();
            // Close the menu dropdown when opening filters
            document.getElementById('menu-dropdown').classList.add('hidden');
        });
    }
}

// Listener para o evento escalaLoaded
document.addEventListener('escalaLoaded', (e) => {
    initializeModals(e.detail.data);
});