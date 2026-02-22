const addCardBtn = document.getElementById("addCardBtn");
const editBtn = document.getElementById("Edit");
const cardsContainer = document.querySelector(".cards-container");

let editMode = false;
let currentUser = JSON.parse(localStorage.getItem("currentUser"));
let cards = [];

// Verifica se está logado
if (!currentUser) {
    window.location.href = "login.html";
}

// Chave única para os cards do usuário
const userCardsKey = `cards_${currentUser.id}`;

// Carrega cards do usuário
cards = JSON.parse(localStorage.getItem(userCardsKey)) || [];

// Função que cria o card visual na tela
function criarCardNaTela(cardData) {
    const card = document.createElement("div");
    card.classList.add("card");

    const h3 = document.createElement("h3");
    h3.textContent = cardData.title;

    const p = document.createElement("p");
    p.textContent = cardData.content;

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.style.display = editMode ? "block" : "none";
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        cardsContainer.removeChild(card);

        // Remove do localStorage do usuário
        cards = cards.filter(c => c.id !== cardData.id);
        localStorage.setItem(userCardsKey, JSON.stringify(cards));
    });

    // Barra de progresso
    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    const progressInner = document.createElement("div");
    progressInner.classList.add("progress-bar-inner");
    progressBar.appendChild(progressInner);

    function updateProgress() {
        const percent = cardData.total === 0 ? 0 : (cardData.done / cardData.total) * 100;
        progressInner.style.width = percent + "%";
    }

    updateProgress();

    // Clique no card → redireciona para a página de tópicos
    card.addEventListener("click", () => {
        if (!editMode) {
            window.location.href = `topicos.html?id=${cardData.id}`;
        }
    });

    // Editar título
    h3.addEventListener("click", (e) => {
        e.stopPropagation();
        if (editMode) {
            const newTitle = prompt("Digite o novo título:", h3.textContent);
            if (newTitle) {
                h3.textContent = newTitle;
                cardData.title = newTitle;
                localStorage.setItem(userCardsKey, JSON.stringify(cards));
            }
        }
    });

    card.appendChild(deleteBtn);
    card.appendChild(h3);
    card.appendChild(p);
    card.appendChild(progressBar);
    cardsContainer.appendChild(card);
}

// Carrega cards salvos ao abrir a página
window.addEventListener("DOMContentLoaded", () => {
    cards.forEach(cardData => {
        criarCardNaTela(cardData);
    });
});

// Botão Edit
editBtn.addEventListener("click", () => {
    editMode = !editMode;
    document.querySelectorAll(".card").forEach(card => {
        const deleteBtn = card.querySelector(".delete-btn");
        if (deleteBtn) deleteBtn.style.display = editMode ? "block" : "none";
    });
});

// Botão Adicionar Card
addCardBtn.addEventListener("click", () => {
    const title = prompt("Digite o título do card:");
    const content = prompt("Digite o conteúdo do card:");

    if (title && content) {
        const newCard = {
            id: Date.now(),
            title: title,
            content: content,
            total: 0,
            done: 0
        };

        cards.push(newCard);
        localStorage.setItem(userCardsKey, JSON.stringify(cards));

        criarCardNaTela(newCard);
    } else {
        alert("Título e conteúdo obrigatórios!");
    }
});

// Botão de logout (adicione no seu HTML)
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    });
}

