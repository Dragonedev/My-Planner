// ============================================
// HEADER DINÂMICO - Com Logout
// ============================================

function atualizarHeader() {
    const navRight = document.getElementById("navRight");
    if (!navRight) return;

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {
        // USUÁRIO LOGADO - mostra nome e botão de logout
        navRight.innerHTML = `
            <li style="display: flex; align-items: center; gap: 15px;">
                <a href="main.html" id="profileLink" class="user-name-link">
                    ${currentUser.nick}
                </a>
                <a href="#" id="logoutBtn" class="btn-logout" style="
                    background-color: #0004ff;
                    color: white;
                    padding: 13px 35px;
                    border-radius: 15px;
                    text-decoration: none;
                    font-size: 14px;
                    transition: background-color 0.3s;
                ">Logout</a>
            </li>
        `;

        // Evento do perfil
        document.getElementById("profileLink")?.addEventListener("click", function (e) {
            console.log("Clicou no usuário: " + currentUser.nick);
        });

        // Evento do logout
        document.getElementById("logoutBtn")?.addEventListener("click", function (e) {
            e.preventDefault();
            
            // Remove o usuário atual
            localStorage.removeItem("currentUser");
            
            // Mostra mensagem (opcional)
            console.log("👋 Logout realizado!");
            
            // Recarrega o header para mostrar botões de login
            atualizarHeader();
            
            // Redireciona para a página de login (opcional)
            // window.location.href = "login.html";
            
            // Ou redireciona para a página inicial
            window.location.href = "index.html";
        });

    } else {
        // USUÁRIO NÃO LOGADO - mostra botões de login/registro
        navRight.innerHTML = `
            <li><a href="login.html" class="btn">Sign in</a></li>
            <li><a href="#" class="btn-register">Register</a></li>
        `;
    }
}

// Executa quando a página carrega
document.addEventListener("DOMContentLoaded", atualizarHeader);

// Também executa se houver mudanças no localStorage
window.addEventListener("storage", function (e) {
    if (e.key === "currentUser") {
        atualizarHeader();
    }
});

// Função de logout manual (para usar no console)
window.fazerLogout = function() {
    localStorage.removeItem("currentUser");
    atualizarHeader();
    console.log("👋 Logout realizado!");
    window.location.href = "index.html";
};