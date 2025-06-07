export class MinisterioManager {
    constructor() {
        this.baseUrl = window.APP_CONFIG?.baseUrl;
    }

    getMinisterioAtualId() {
        // Busca igual ao padrão das atividades
        let ministerioAtual = window.USER?.ministerio_atual;
        if (ministerioAtual && typeof ministerioAtual === 'object' && ministerioAtual.id) {
            return ministerioAtual.id;
        }
        // Tenta pegar do localStorage
        let localStorageValue = localStorage.getItem('ministerio_atual');
        if (localStorageValue) {
            try {
                // Pode ser um objeto JSON ou só o id
                let parsed = JSON.parse(localStorageValue);
                if (typeof parsed === 'object' && parsed.id) return parsed.id;
                if (!isNaN(parsed)) return Number(parsed);
            } catch {
                if (!isNaN(localStorageValue)) return Number(localStorageValue);
            }
        }
        // Pega o primeiro da lista de ministérios do usuário
        let ministerios = window.USER?.ministerios;
        if (Array.isArray(ministerios) && ministerios.length > 0) {
            if (typeof ministerios[0] === 'object' && ministerios[0].id) return ministerios[0].id;
            if (!isNaN(ministerios[0])) return Number(ministerios[0]);
        }
        return null;
    }

    async renderDashboard() {
        try {
            const ministerioId = this.getMinisterioAtualId();
            if (!ministerioId) {
                throw new Error('Nenhum ministério selecionado');
            }

            // Faz requisição para obter dados atualizados
            const response = await fetch(`${this.baseUrl}/src/services/api/ministerios/get.php?ministerio_id=${ministerioId}`);
            if (!response.ok) throw new Error('Erro ao carregar ministério');
            
            const data = await response.json();

            // Suporte para data.data ser array ou objeto
            let ministerio = null;
            if (Array.isArray(data.data)) {
                ministerio = data.data[0];
            } else if (data.data && typeof data.data === 'object') {
                // Pega o primeiro valor do objeto
                ministerio = Object.values(data.data)[0];
            }

            if (!ministerio) throw new Error('Ministério não encontrado');

            // Atualiza elementos do DOM com os dados obtidos
            this.updateUI(ministerio);

        } catch (error) {
            console.error('Erro:', error);
        }
    }

    updateUI(ministerio) {
        // Atualiza foto (desktop)
        this.updateElementImage('ministerio-foto', ministerio);
        // Atualiza foto (mobile)
        this.updateElementImage('ministerio-foto-mobile', ministerio);

        // Atualiza nome e descrição
        this.updateElementText('ministerio-nome', ministerio.nome);
        this.updateElementText('ministerio-nome-mobile', ministerio.nome);
        this.updateElementText('ministerio-descricao', ministerio.descricao);

        // Anima os contadores (desktop e mobile)
        const quantidade = parseInt(ministerio.quantidade_voluntarios) || 0;
        this.animateCounter('contador-voluntarios', quantidade);
        this.animateCounter('contador-voluntarios-mobile', quantidade);

        // Atualiza fundo do hero com imagem grande e blur mais forte
        const heroEl = document.getElementById('ministerio-hero');
        if (heroEl && ministerio.foto) {
            let bgImg = heroEl.querySelector('.ministerio-bg-blur');
            if (!bgImg) {
                bgImg = document.createElement('div');
                bgImg.className = 'ministerio-bg-blur absolute inset-0 z-0 pointer-events-none';
                heroEl.prepend(bgImg);
            }
            bgImg.style.backgroundImage = `url('${this.baseUrl}/${ministerio.foto}')`;
            bgImg.style.backgroundSize = 'cover';
            bgImg.style.backgroundPosition = 'center';
            bgImg.style.backgroundRepeat = 'no-repeat';
            bgImg.style.filter = 'blur(32px) brightness(0.5)'; // Aumenta o blur e escurece mais
            bgImg.style.opacity = '1';
            bgImg.style.transition = 'background-image 0.5s';
            bgImg.style.width = '120%'; // Aumenta o tamanho
            bgImg.style.height = '120%';
            bgImg.style.left = '-10%';
            bgImg.style.top = '-10%';
            bgImg.style.position = 'absolute';
        }

        // Mantém o gradiente por cima para efeito de overlay
        if (heroEl && ministerio.cor) {
            heroEl.style.background = `linear-gradient(to right, ${this.adjustColor(ministerio.cor, -30)}, ${ministerio.cor})`;
        }
    }

    updateElementImage(elementId, ministerio) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = `
                <img src="${this.baseUrl}/${ministerio.foto}" 
                     alt="${ministerio.nome}" 
                     class="w-full h-full object-cover"
                     onerror="this.src='${this.baseUrl}/assets/img/placeholder.jpg'">
            `;
        }
    }

    updateElementText(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
        }
    }

    animateCounter(elementId, target) {
        const element = document.getElementById(elementId);
        if (!element) return;

        // Converte para número e usa 0 como fallback
        target = parseInt(target) || 0;
        let current = 0;
        
        const duration = 2000; // 2 segundos
        const steps = 50;
        const increment = target / steps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                clearInterval(timer);
                element.textContent = target;
            } else {
                element.textContent = Math.floor(current);
            }
        }, duration / steps);
    }

    adjustColor(color, amount) {
        return '#' + color.replace(/^#/, '').replace(/../g, color => 
            ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).slice(-2));
    }
}
