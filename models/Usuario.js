// Model: Usuario
class Usuario {
    constructor(id, nome, email, senha, nomeLoja = null, tipoUsuario = 'cliente') {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha; // Em produção, usar hash
        this.nomeLoja = nomeLoja;
        this.tipoUsuario = tipoUsuario; // 'cliente' ou 'vendedor'
        this.dataCriacao = new Date().toISOString();
    }

    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            email: this.email,
            senha: this.senha,
            nomeLoja: this.nomeLoja,
            tipoUsuario: this.tipoUsuario,
            dataCriacao: this.dataCriacao
        };
    }

    static fromJSON(obj) {
        const usuario = new Usuario(
            obj.id,
            obj.nome,
            obj.email,
            obj.senha,
            obj.nomeLoja,
            obj.tipoUsuario
        );
        usuario.dataCriacao = obj.dataCriacao;
        return usuario;
    }
}

// Repository: Gerenciamento de Usuários
class UsuarioRepository {
    constructor() {
        this.usuarios = [];
        this.proximoId = 1;
        this.carregarDoLocalStorage();
    }

    adicionar(usuario) {
        if (!usuario.id) {
            usuario.id = this.proximoId++;
        }
        this.usuarios.push(usuario);
        this.salvar();
        return usuario;
    }

    obterPorEmail(email) {
        return this.usuarios.find(u => u.email === email);
    }

    obterPorId(id) {
        return this.usuarios.find(u => u.id === id);
    }

    autenticar(email, senha) {
        const usuario = this.obterPorEmail(email);
        if (usuario && usuario.senha === senha) {
            return usuario;
        }
        return null;
    }

    salvar() {
        const dados = this.usuarios.map(u => u.toJSON());
        localStorage.setItem('ombelamarket_usuarios', JSON.stringify(dados));
    }

    carregarDoLocalStorage() {
        const dados = localStorage.getItem('ombelamarket_usuarios');
        if (dados) {
            try {
                const parsed = JSON.parse(dados);
                if (Array.isArray(parsed)) {
                    this.usuarios = parsed.map(u => Usuario.fromJSON(u));
                    if (this.usuarios.length > 0) {
                        this.proximoId = Math.max(...this.usuarios.map(u => u.id)) + 1;
                    }
                }
            } catch (e) {
                console.error('Erro ao carregar usuários:', e);
                this.usuarios = [];
            }
        }
    }
}

// Gerenciador de Sessão
class SessaoManager {
    constructor() {
        this.usuarioLogado = null;
        this.carregarSessao();
    }

    login(usuario) {
        this.usuarioLogado = usuario;
        localStorage.setItem('ombelamarket_sessao', JSON.stringify(usuario.toJSON()));
    }

    logout() {
        this.usuarioLogado = null;
        localStorage.removeItem('ombelamarket_sessao');
    }

    isLogado() {
        return this.usuarioLogado !== null;
    }

    getUsuario() {
        return this.usuarioLogado;
    }

    carregarSessao() {
        const dados = localStorage.getItem('ombelamarket_sessao');
        if (dados) {
            try {
                const parsed = JSON.parse(dados);
                this.usuarioLogado = Usuario.fromJSON(parsed);
            } catch (e) {
                console.error('Erro ao carregar sessão:', e);
                this.usuarioLogado = null;
            }
        }
    }
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Usuario, UsuarioRepository, SessaoManager };
}
