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

// Sincronizar com o card (para compatibilidade)
if (!currentCard.subtasks) {
    currentCard.subtasks = subtopics;
} else {
    subtopics = currentCard.subtasks;
}

// Mostrar título do card
cardTitle.textContent = currentCard.title;

// Função para criar card de subtópico
function criarCardSubtopic(sub) {
    const card = document.createElement("div");
    card.classList.add("card", "subtopic-card");

    const h4 = document.createElement("h4");
    h4.textContent = sub.text;

    const p = document.createElement("p");
    p.textContent = sub.content || "Sem descrição";

    // Checkbox
    const checkboxContainer = document.createElement("div");
    checkboxContainer.classList.add("checkbox-container");
    
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = sub.done || false;
    
    const checkboxLabel = document.createElement("span");
    checkboxLabel.textContent = "Concluído";

    // Botão deletar
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.classList.add("delete-btn");

    if (sub.done) {
        h4.style.textDecoration = "line-through";
        p.style.textDecoration = "line-through";
        card.style.opacity = "0.7";
    }

    checkbox.addEventListener("change", () => {
        sub.done = checkbox.checked;
        
        if (sub.done) {
            h4.style.textDecoration = "line-through";
            p.style.textDecoration = "line-through";
            card.style.opacity = "0.7";
        } else {
            h4.style.textDecoration = "none";
            p.style.textDecoration = "none";
            card.style.opacity = "1";
        }
        
        atualizarProgresso();
        salvarDados();
    });

    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        
        currentCard.subtasks = currentCard.subtasks.filter(s => 
            (s.id || s.text) !== (sub.id || sub.text)
        );
        
        card.remove();
        atualizarProgresso();
        salvarDados();
    });

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(checkboxLabel);
    
    card.appendChild(deleteBtn);
    card.appendChild(h4);
    card.appendChild(p);
    card.appendChild(checkboxContainer);
    
    subtopicsContainer.appendChild(card);
}

// Função para salvar dados em ambos os lugares
function salvarDados() {
    // Salvar no card
    localStorage.setItem(userCardsKey, JSON.stringify(cards));
    
    // Salvar tópicos separadamente (opcional)
    localStorage.setItem(userTopicsKey, JSON.stringify(currentCard.subtasks));
}

function atualizarProgresso() {
    const total = currentCard.subtasks.length;
    const done = currentCard.subtasks.filter(s => s.done).length;
    const percent = total === 0 ? 0 : (done / total) * 100;
    
    progressBar.style.width = percent + "%";
    progressBar.textContent = Math.round(percent) + "%";
    
    currentCard.total = total;
    currentCard.done = done;
}

function carregarSubtopics() {
    subtopicsContainer.innerHTML = "";
    currentCard.subtasks.forEach(sub => {
        criarCardSubtopic(sub);
    });
    atualizarProgresso();
}

addSubBtn.addEventListener("click", () => {
    const titulo = prompt("Digite o título do subtópico:");
    if (!titulo) return;
    
    const descricao = prompt("Digite a descrição (opcional):");
    
    const novoSubtopic = {
        id: Date.now(),
        text: titulo,
        content: descricao || "Sem descrição",
        done: false
    };
    
    currentCard.subtasks.push(novoSubtopic);
    criarCardSubtopic(novoSubtopic);
    atualizarProgresso();
    salvarDados();
});

backBtn.addEventListener("click", () => {
    window.location.href = "main.html";
});

carregarSubtopics();

const elementos = document.querySelectorAll('*');
for(let el of elementos) {
    if(el.textContent.includes("' ' '")) {
        console.log("Elemento com problema:", el);
        console.log("HTML do elemento:", el.outerHTML);
    }
}