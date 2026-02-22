// ============================================
// FUNÇÕES DE LOGOUT
// ============================================

// Mostrar nome do usuário no header
function mostrarNomeUsuario() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const userNameDisplay = document.getElementById("userNameDisplay");
    
    if (currentUser && userNameDisplay) {
        userNameDisplay.textContent = `👤 ${currentUser.nick}`;
    }
}

// Função de logout
function fazerLogout() {
    // Remove o usuário atual
    localStorage.removeItem("currentUser");
    
    // Opcional: manter os cards, mas deslogar
    // Se quiser limpar tudo, descomente a linha abaixo:
    // localStorage.removeItem(`cards_${currentUser.id}`);
    
    // Redireciona para o login
    window.location.href = "login.html";
}

// Adicionar evento ao botão de logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", function(e) {
        e.preventDefault();
        fazerLogout();
    });
}

// Chamar a função quando a página carregar
window.addEventListener("DOMContentLoaded", () => {
    mostrarNomeUsuario();
    cards.forEach(cardData => {
        criarCardNaTela(cardData);
    });
});