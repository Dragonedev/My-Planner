// ============================================
// SISTEMA DE LOGIN COMPLETO - COM LOADER
// ============================================

// ============================================
// PARTE 1: INICIALIZAÇÃO DOS USUÁRIOS
// ============================================

// Garantir que os dois usuários SEMPRE existam
const usuariosPadrao = [
    { id: 1, nick: "Exayled", password: "Senha123" },
    { id: 2, nick: "Namorada", password: "Senha456" }
];

// Salva no localStorage (sobrescreve qualquer coisa)
localStorage.setItem("users", JSON.stringify(usuariosPadrao));
console.log("✅ Usuários padrão salvos:", usuariosPadrao);

// Carrega os usuários do localStorage
let users = JSON.parse(localStorage.getItem("users")) || [];

// ============================================
// PARTE 2: ELEMENTOS DA PÁGINA
// ============================================

const nickInput = document.getElementById("nickInput");
const passwordInput = document.getElementById("passwordInput");
const loginBtn = document.getElementById("loginBtn");

// Verifica se encontrou os elementos
if (!nickInput || !passwordInput || !loginBtn) {
    console.error("❌ Erro: Elementos não encontrados!");
} else {
    console.log("✅ Elementos encontrados!");
}

// ============================================
// PARTE 3: FUNÇÃO PRINCIPAL DE LOGIN COM LOADER
// ============================================

loginBtn.addEventListener("click", function(event) {
    // Previne comportamento padrão
    event.preventDefault();
    
    // Pega os valores
    const nick = nickInput.value.trim();
    const password = passwordInput.value.trim();

    console.log("📝 Tentando login:", { nick, password });
    console.log("📚 Usuários no sistema:", users);

    // Validação
    if (!nick || !password) {
        alert("❌ Preencha todos os campos!");
        return;
    }

    // MOSTRA O LOADER
    if (window.loader) {
        window.loader.showOverlay('Verificando credenciais...');
    }

    // Pequeno delay para mostrar o loader (mais profissional)
    setTimeout(() => {
        // Busca o usuário (case sensitive)
        const user = users.find(u => u.nick === nick && u.password === password);

        if (user) {
            console.log("✅ Usuário encontrado:", user);
            
            // Salva na sessão
            localStorage.setItem("currentUser", JSON.stringify({
                id: user.id,
                nick: user.nick
            }));
            
            console.log("🔐 Login realizado!");
            
            // ESCONDE O LOADER
            if (window.loader) {
                window.loader.hideOverlay();
            }
            
            // Redireciona
            window.location.href = "main.html";
        } else {
            console.log("❌ Usuário não encontrado!");
            
            // ESCONDE O LOADER
            if (window.loader) {
                window.loader.hideOverlay();
            }
            
            // Mostra os usuários disponíveis
            console.log("Usuários disponíveis:");
            users.forEach(u => {
                console.log(`   - ${u.nick} / ${u.password}`);
            });
            
            alert("❌ Usuário ou senha incorretos!\n\n" +
                  "Tente:\n" +
                  "👤 Exayled / Senha123\n" +
                  "👤 Namorada / Senha456");
        }
    }, 800); // Delay de 800ms para ver o loader
});

// ============================================
// PARTE 4: FUNÇÕES DE UTILIDADE (CONSOLE)
// ============================================

// 1. Ver todos os usuários
window.verUsuarios = function() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    console.log("📋 USUÁRIOS CADASTRADOS:");
    console.table(users);
    return users;
}

// 2. Ver usuário atual
window.usuarioAtual = function() {
    const current = JSON.parse(localStorage.getItem("currentUser"));
    if (current) {
        console.log("👤 Logado:", current);
    } else {
        console.log("👤 Ninguém logado");
    }
    return current;
}

// 3. Resetar usuários (volta ao padrão)
window.resetarUsuarios = function() {
    const padrao = [
        { id: 1, nick: "Exayled", password: "Senha123" },
        { id: 2, nick: "Namorada", password: "Senha456" }
    ];
    localStorage.setItem("users", JSON.stringify(padrao));
    localStorage.removeItem("currentUser");
    console.log("🔄 Usuários resetados:");
    console.table(padrao);
    alert("Usuários resetados! Faça login novamente.");
    location.reload();
}

// 4. Limpar tudo
window.limparTudo = function() {
    if (confirm("Tem certeza?")) {
        localStorage.clear();
        console.log("🗑️ Tudo apagado!");
        location.reload();
    }
}

// 5. Adicionar novo usuário (COM LOADER OPCIONAL)
window.adicionarUsuario = function(nick, password) {
    if (!nick || !password) {
        console.log("❌ Use: adicionarUsuario('nick', 'senha')");
        return;
    }
    
    if (window.loader) {
        window.loader.showOverlay('Adicionando usuário...');
    }
    
    setTimeout(() => {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        let newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        
        const novo = {
            id: newId,
            nick: nick,
            password: password
        };
        
        users.push(novo);
        localStorage.setItem("users", JSON.stringify(users));
        
        if (window.loader) {
            window.loader.hideOverlay();
        }
        
        console.log("✅ Adicionado:", novo);
        console.table(users);
    }, 500);
}

// 6. Logout
window.logout = function() {
    localStorage.removeItem("currentUser");
    console.log("👋 Logout!");
    window.location.href = "login.html";
}

// 7. Debug - ver o que tem no input
window.debugInput = function() {
    const nick = document.getElementById("nickInput")?.value;
    const pass = document.getElementById("passwordInput")?.value;
    console.log("Input atual:", { nick, pass });
}

// 8. Testar loader manualmente
window.testarLoader = function() {
    if (window.loader) {
        window.loader.showOverlay('Testando loader...');
        setTimeout(() => {
            window.loader.hideOverlay();
        }, 2000);
    } else {
        console.log("❌ Loader não encontrado!");
    }
}

// ============================================
// PARTE 5: VERIFICAÇÃO INICIAL
// ============================================

window.addEventListener("DOMContentLoaded", function() {
    console.log("🚀 Página carregada!");
    
    // Mostra usuários disponíveis
    console.log("📊 Usuários no sistema:");
    console.table(users);
    
    // Verifica se já está logado
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
        console.log("👤 Já logado como:", currentUser);
        console.log("⏳ Redirecionando...");
        window.location.href = "main.html";
    }
    
    // Verifica se o loader está disponível
    if (window.loader) {
        console.log("✅ Loader disponível!");
    } else {
        console.log("⚠️ Loader não encontrado. Verifique se o loader.js foi carregado.");
    }
});

// ============================================
// PARTE 6: SUPORTE A TECLA ENTER
// ============================================

if (passwordInput) {
    passwordInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            loginBtn.click();
        }
    });
}

if (nickInput) {
    nickInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            passwordInput.focus();
        }
    });
}

// ============================================
// PARTE 7: MOSTRA INSTRUÇÕES NO CONSOLE
// ============================================

console.log("✨ COMANDOS DISPONÍVEIS:");
console.log("   verUsuarios()      - Lista usuários");
console.log("   usuarioAtual()      - Quem está logado");
console.log("   resetarUsuarios()   - Volta ao padrão");
console.log("   adicionarUsuario()  - Adicionar novo");
console.log("   logout()            - Sair");
console.log("   testarLoader()      - Testar loader");
console.log("");
console.log("👤 USUÁRIOS:");
console.log("   Exayled / Senha123");
console.log("   Namorada / Senha456");