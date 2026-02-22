// ============================================
// SISTEMA DE LOADERS - FUNCIONALIDADES COMPLETAS
// ============================================

class LoaderManager {
    constructor() {
        this.pageLoader = document.getElementById('pageLoader');
        this.overlayLoader = document.getElementById('loaderOverlay');
        this.loadingCount = 0;
        this.timeoutId = null;
    }

    // Mostrar loader de página
    showPageLoader() {
        if (this.pageLoader) {
            this.pageLoader.classList.remove('hidden');
        }
    }

    // Esconder loader de página
    hidePageLoader() {
        if (this.pageLoader) {
            // Garante que o loader fique visível por pelo menos 300ms
            if (this.timeoutId) clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(() => {
                this.pageLoader.classList.add('hidden');
                this.timeoutId = null;
            }, 300);
        }
    }

    // Mostrar overlay loader
    showOverlay(message = 'Carregando...') {
        this.loadingCount++;
        if (this.overlayLoader) {
            this.overlayLoader.style.display = 'flex';
            
            // Se quiser uma mensagem personalizada
            const messageEl = this.overlayLoader.querySelector('.loader-message');
            if (messageEl) {
                messageEl.textContent = message;
            }
        }
    }

    // Esconder overlay loader
    hideOverlay() {
        this.loadingCount--;
        if (this.loadingCount <= 0) {
            this.loadingCount = 0;
            if (this.overlayLoader) {
                this.overlayLoader.style.display = 'none';
            }
        }
    }

    // Loader para ações assíncronas (fetch, etc)
    async withLoader(asyncFunction, message = 'Carregando...') {
        this.showOverlay(message);
        try {
            const result = await asyncFunction();
            return result;
        } finally {
            this.hideOverlay();
        }
    }

    // Loader para cards (enquanto carrega)
    createCardLoader(count = 3) {
        const container = document.createElement('div');
        container.className = 'card-loader-container';
        
        for (let i = 0; i < count; i++) {
            const loader = document.createElement('div');
            loader.className = 'card-loader';
            container.appendChild(loader);
        }
        
        return container;
    }

    // Loader para botões
    createButtonLoader(button) {
        const originalText = button.textContent;
        const originalDisabled = button.disabled;
        
        button.disabled = true;
        button.innerHTML = '<span class="button-loader"></span> Carregando...';
        
        return {
            restore: () => {
                button.disabled = originalDisabled;
                button.textContent = originalText;
            }
        };
    }

    // Loader para listas
    showListLoader(container) {
        const loader = document.createElement('div');
        loader.className = 'wave-loader';
        for (let i = 0; i < 5; i++) {
            const div = document.createElement('div');
            loader.appendChild(div);
        }
        container.innerHTML = '';
        container.appendChild(loader);
        
        return {
            hide: () => {
                container.innerHTML = '';
            }
        };
    }

    // Loader de progresso personalizado
    showProgressLoader(container, progress = 0) {
        const loader = document.createElement('div');
        loader.className = 'progress-loader';
        container.innerHTML = '';
        container.appendChild(loader);
        
        const progressBar = loader;
        
        return {
            update: (newProgress) => {
                progressBar.style.width = newProgress + '%';
            },
            hide: () => {
                container.innerHTML = '';
            }
        };
    }

    // Loader com delay mínimo (evita flickering)
    async withMinDelay(asyncFunction, delay = 500) {
        const start = Date.now();
        const result = await asyncFunction();
        const elapsed = Date.now() - start;
        
        if (elapsed < delay) {
            await new Promise(resolve => setTimeout(resolve, delay - elapsed));
        }
        
        return result;
    }

    // Reset do loader
    reset() {
        this.loadingCount = 0;
        if (this.overlayLoader) {
            this.overlayLoader.style.display = 'none';
        }
        if (this.pageLoader) {
            this.pageLoader.classList.add('hidden');
        }
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }
}

// Instância global
const loader = new LoaderManager();

// ============================================
// EVENTOS DE CARREGAMENTO DA PÁGINA
// ============================================

// Mostra loader quando navega para outra página
window.addEventListener('beforeunload', function() {
    loader.showPageLoader();
});

// Esconde loader quando a página carrega
window.addEventListener('load', function() {
    loader.hidePageLoader();
});

// Para links internos
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href && !link.href.includes('#') && !link.target) {
        const currentDomain = window.location.origin;
        if (link.href.startsWith(currentDomain)) {
            loader.showPageLoader();
        }
    }
});

// Para formulários
document.addEventListener('submit', function(e) {
    if (e.target.tagName === 'FORM') {
        loader.showPageLoader();
    }
});

// Para botões de voltar
window.addEventListener('popstate', function() {
    loader.showPageLoader();
});

// Exporta para usar em outros arquivos
window.loader = loader;

// ============================================
// FUNÇÕES DE UTILIDADE (para usar no console)
// ============================================

// Testar loaders
window.testLoaders = function() {
    console.log('🎯 Testando loaders...');
    
    loader.showOverlay('Testando loader...');
    
    setTimeout(() => {
        loader.hideOverlay();
        console.log('✅ Loader testado!');
    }, 2000);
}

// Mostrar diferentes tipos de loader
window.showLoaders = function() {
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:white; padding:40px; border-radius:20px; box-shadow:0 10px 30px rgba(0,0,0,0.2); z-index:10001;';
    
    container.innerHTML = `
        <h3 style="margin-bottom:20px;">Loaders Disponíveis:</h3>
        <div style="display:flex; gap:30px; flex-wrap:wrap; justify-content:center;">
            <div><div class="loader"></div><p style="margin-top:10px;">Spinner</p></div>
            <div><div class="loader-dots"><div></div><div></div><div></div></div><p>Pontinhos</p></div>
            <div><div class="wave-loader"><div></div><div></div><div></div><div></div><div></div></div><p>Ondas</p></div>
            <div><div class="circular-loader"></div><p>Circular</p></div>
            <div><div class="text-loader">Carregando</div><p>Texto</p></div>
        </div>
        <button onclick="this.parentElement.remove()" style="margin-top:20px; padding:10px 20px; background:#4CAF50; color:white; border:none; border-radius:5px; cursor:pointer;">Fechar</button>
    `;
    
    document.body.appendChild(container);
}

console.log('🚀 Loader Manager carregado!');
console.log('📝 Comandos: testLoaders() | showLoaders()');