// Pegar o ID do card da URL
const urlParams = new URLSearchParams(window.location.search);
const cardId = parseInt(urlParams.get("id"));

// Verifica usuário logado
let currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
    window.location.href = "login.html";
}

// Elementos da página
const cardTitle = document.getElementById("cardTitle");
const subtopicsContainer = document.querySelector(".subtopics-container");
const addSubBtn = document.getElementById("addSubBtn");
const backBtn = document.getElementById("backBtn");
const progressBar = document.getElementById("progressBar");

// Chaves específicas do usuário
const userCardsKey = `cards_${currentUser.id}`;
const userTopicsKey = `topics_${currentUser.id}_${cardId}`;

// Carregar cards do usuário
let cards = JSON.parse(localStorage.getItem(userCardsKey)) || [];
let currentCard = cards.find(c => c.id === cardId);

if (!currentCard) {
    alert("Card não encontrado!");
    window.location.href = "index.html";
}

// Carregar tópicos específicos deste card
let subtopics = JSON.parse(localStorage.getItem(userTopicsKey)) || [];

// Sincronizar com o card
if (!currentCard.subtasks) {
    currentCard.subtasks = subtopics;
} else {
    subtopics = currentCard.subtasks;
}

// Mostrar título do card
cardTitle.textContent = currentCard.title;

// Função para criar modal de adicionar categoria/subtópico
function criarModalCategoria() {
    const modalOverlay = document.createElement("div");
    modalOverlay.classList.add("modal-overlay");
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    const modalContent = document.createElement("div");
    modalContent.style.cssText = `
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        width: 400px;
        max-width: 90%;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;

    modalContent.innerHTML = `
        
        <label style="display: block; margin-bottom: 15px;">Category Name:</label>
        <input type="text" id="categoriaInput" placeholder="Subject" 
               style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #08007a; border-radius: 4px; box-sizing: border-box;">
        
        <div style="display: flex; gap: 10px;justify-content: flex-end;">
            <button id="cancelBtn" style="padding: 8px 16px; border: 1px solid #ff0000;color:red; border-radius: 6px; background-color: #faf8f8; cursor: pointer;">Cancel</button>
            <button id="saveBtn" style="padding: 8px 16px; border: none; border-radius: 4px; background-color: #0011ff; color: white; cursor: pointer;">Add</button>
        </div>
    `;

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    const categoriaInput = document.getElementById("categoriaInput");
    categoriaInput.focus();

    // Função para fechar modal
    function fecharModal() {
        document.body.removeChild(modalOverlay);
    }

    // Evento de cancelar
    document.getElementById("cancelBtn").addEventListener("click", fecharModal);

    // Evento de salvar
    document.getElementById("saveBtn").addEventListener("click", () => {
        const nomeCategoria = categoriaInput.value.trim();
        if (!nomeCategoria) {
            alert("Por favor, digite um nome para a categoria!");
            return;
        }

        const novaCategoria = {
            id: Date.now(),
            nome: nomeCategoria,
            itens: [] // Array para armazenar os itens de checklist
        };

        currentCard.subtasks.push(novaCategoria);
        criarCardCategoria(novaCategoria);
        atualizarProgresso();
        salvarDados();

        fecharModal();
    });

    // Enter para salvar
    categoriaInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            document.getElementById("saveBtn").click();
        }
    });

    // Fechar clicando fora
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
            fecharModal();
        }
    });
}

// Função para criar modal de adicionar item à checklist
function criarModalItem(categoriaId) {
    const modalOverlay = document.createElement("div");
    modalOverlay.classList.add("modal-overlay");
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    const modalContent = document.createElement("div");
    modalContent.style.cssText = `
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        width: 400px;
        max-width: 90%;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;

    modalContent.innerHTML = `
        <h3 style="margin-bottom: 15px;">Add Item to Checklist</h3>
        
        <label style="display: block; margin-bottom: 5px;">Item Name:</label>
        <input type="text" id="itemInput" placeholder="Ex: themes" 
               style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #0044ff; border-radius: 4px; box-sizing: border-box;">
        
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button id="cancelBtn" style="padding: 8px 16px; border: 1px solid #ff0000;color:red; border-radius: 4px; background-color: #f8f9fa; cursor: pointer;">Cancel</button>
            <button id="saveBtn" style="padding: 8px 16px; border: none; border-radius: 4px; background-color: #003cff; color: white; cursor: pointer;">Add</button>
        </div>
    `;

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    const itemInput = document.getElementById("itemInput");
    itemInput.focus();

    function fecharModal() {
        document.body.removeChild(modalOverlay);
    }

    document.getElementById("cancelBtn").addEventListener("click", fecharModal);

    document.getElementById("saveBtn").addEventListener("click", () => {
        const nomeItem = itemInput.value.trim();
        if (!nomeItem) {
            alert("Por favor, digite um nome para o item!");
            return;
        }

        // Encontrar a categoria
        const categoria = currentCard.subtasks.find(c => c.id === categoriaId);
        if (categoria) {
            const novoItem = {
                id: Date.now(),
                nome: nomeItem,
                done: false
            };

            categoria.itens.push(novoItem);

            // Recriar o card da categoria para atualizar a checklist
            const categoriaCard = document.querySelector(`[data-categoria-id="${categoriaId}"]`);
            if (categoriaCard) {
                const novoCard = criarCardCategoria(categoria, true);
                categoriaCard.replaceWith(novoCard);
            }

            atualizarProgresso();
            salvarDados();
        }

        fecharModal();
    });

    itemInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            document.getElementById("saveBtn").click();
        }
    });

    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
            fecharModal();
        }
    });
}

// Função para criar card de categoria com checklist
function criarCardCategoria(categoria, isUpdate = false) {
    const card = document.createElement("div");
    card.classList.add("card", "categoria-card");
    card.setAttribute("data-categoria-id", categoria.id);
    card.style.cssText = `
        margin-bottom: 20px;
        border: 1px solid #003cff;
        border-radius: 8px;
        overflow: hidden;
    `;

    // Cabeçalho da categoria
    const header = document.createElement("div");
    header.style.cssText = `
        background-color: #f8f9fa;
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #003cff;
    `;

    const tituloCategoria = document.createElement("h4");
    tituloCategoria.textContent = categoria.nome;
    tituloCategoria.style.margin = "0";

    const headerButtons = document.createElement("div");
    headerButtons.style.cssText = `
        display: flex;
        gap: 10px;
        padding: 8px;
    `;

    // Botão adicionar item
    const addItemBtn = document.createElement("button");
    addItemBtn.textContent = "Add";
    addItemBtn.style.cssText = `
        padding: 5px 10px;
        background-color: #28a745;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
    `;

    // Botão deletar categoria
    const deleteCategoriaBtn = document.createElement("button");
    deleteCategoriaBtn.textContent = "✕";
    deleteCategoriaBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #999;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
    `;

    // Container da checklist
    const checklistContainer = document.createElement("div");
    checklistContainer.style.cssText = `
        padding: 15px;
    `;

    // Adicionar itens existentes
    if (categoria.itens && categoria.itens.length > 0) {
        categoria.itens.forEach(item => {
            const itemElement = criarItemChecklist(item, categoria.id);
            checklistContainer.appendChild(itemElement);
        });
    } else {
        const msgVazia = document.createElement("p");
        msgVazia.textContent = "No items added yet. Click 'Add Item' to begin!";
        msgVazia.style.cssText = `
            color: #999;
            font-style: italic;
            text-align: center;
            margin: 10px 0;
        `;
        checklistContainer.appendChild(msgVazia);
    }

    // Eventos
    addItemBtn.addEventListener("click", () => {
        criarModalItem(categoria.id);
    });

    deleteCategoriaBtn.addEventListener("click", () => {
        if (confirm(`Tem certeza que deseja deletar a categoria "${categoria.nome}"?`)) {
            currentCard.subtasks = currentCard.subtasks.filter(c => c.id !== categoria.id);
            card.remove();
            atualizarProgresso();
            salvarDados();
        }
    });

    deleteCategoriaBtn.addEventListener("mouseover", () => {
        deleteCategoriaBtn.style.backgroundColor = "#ffebee";
        deleteCategoriaBtn.style.color = "#f44336";
    });

    deleteCategoriaBtn.addEventListener("mouseout", () => {
        deleteCategoriaBtn.style.backgroundColor = "transparent";
        deleteCategoriaBtn.style.color = "#999";
    });

    headerButtons.appendChild(addItemBtn);
    headerButtons.appendChild(deleteCategoriaBtn);

    header.appendChild(tituloCategoria);
    header.appendChild(headerButtons);

    card.appendChild(header);
    card.appendChild(checklistContainer);

    if (!isUpdate) {
        subtopicsContainer.appendChild(card);
    }

    return card;
}

// Função para criar item de checklist
function criarItemChecklist(item, categoriaId) {
    const itemDiv = document.createElement("div");
    itemDiv.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px;
        margin-bottom: 5px;
        background-color: white;
        border-radius: 4px;
        border: 1px solid #eee;
    `;

    const leftContainer = document.createElement("div");
    leftContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px;
        flex: 1;
    `;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.done || false;
    checkbox.style.cssText = `
        width: 18px;
        height: 18px;
        cursor: pointer;
    `;

    const itemNome = document.createElement("span");
    itemNome.textContent = item.nome;
    itemNome.style.cssText = `
        font-size: 14px;
        transition: all 0.3s ease;
    `;

    const deleteItemBtn = document.createElement("button");
    deleteItemBtn.textContent = "✕";
    deleteItemBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 14px;
        cursor: pointer;
        color: #999;
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
    `;

    if (item.done) {
        itemNome.style.textDecoration = "line-through";
        itemNome.style.color = "#999";
    }

    checkbox.addEventListener("change", () => {
        item.done = checkbox.checked;

        if (item.done) {
            itemNome.style.textDecoration = "line-through";
            itemNome.style.color = "#999";
        } else {
            itemNome.style.textDecoration = "none";
            itemNome.style.color = "#333";
        }

        atualizarProgresso();
        salvarDados();
    });

    deleteItemBtn.addEventListener("click", () => {
        const categoria = currentCard.subtasks.find(c => c.id === categoriaId);
        if (categoria) {
            categoria.itens = categoria.itens.filter(i => i.id !== item.id);
            itemDiv.remove();
            atualizarProgresso();
            salvarDados();
        }
    });

    deleteItemBtn.addEventListener("mouseover", () => {
        deleteItemBtn.style.backgroundColor = "#ffebee";
        deleteItemBtn.style.color = "#f44336";
    });

    deleteItemBtn.addEventListener("mouseout", () => {
        deleteItemBtn.style.backgroundColor = "transparent";
        deleteItemBtn.style.color = "#999";
    });

    leftContainer.appendChild(checkbox);
    leftContainer.appendChild(itemNome);

    itemDiv.appendChild(leftContainer);
    itemDiv.appendChild(deleteItemBtn);

    return itemDiv;
}

// Função para salvar dados
function salvarDados() {
    localStorage.setItem(userCardsKey, JSON.stringify(cards));
    localStorage.setItem(userTopicsKey, JSON.stringify(currentCard.subtasks));
}

// Função para atualizar progresso
function atualizarProgresso() {
    let totalItens = 0;
    let itensConcluidos = 0;

    currentCard.subtasks.forEach(categoria => {
        if (categoria.itens) {
            totalItens += categoria.itens.length;
            itensConcluidos += categoria.itens.filter(item => item.done).length;
        }
    });

    const percent = totalItens === 0 ? 0 : (itensConcluidos / totalItens) * 100;

    progressBar.style.width = percent + "%";
    progressBar.textContent = Math.round(percent) + "%";
}

// Função para carregar todas as categorias
function carregarCategorias() {
    subtopicsContainer.innerHTML = "";
    if (currentCard.subtasks && currentCard.subtasks.length > 0) {
        currentCard.subtasks.forEach(categoria => {
            criarCardCategoria(categoria);
        });
    }
    atualizarProgresso();
}

// Eventos
addSubBtn.addEventListener("click", criarModalCategoria);

backBtn.addEventListener("click", () => {
    window.location.href = "main.html";
});

// Inicializar
carregarCategorias();