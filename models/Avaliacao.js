// Model: Avaliacao
class Avaliacao {
    constructor(id, produtoId, usuarioId, nomeUsuario, estrelas, comentario, dataHora = null) {
        this.id = id;
        this.produtoId = produtoId;
        this.usuarioId = usuarioId;
        this.nomeUsuario = nomeUsuario;
        this.estrelas = estrelas; // 1-5
        this.comentario = comentario;
        this.dataHora = dataHora || new Date().toISOString();
    }

    getDataFormatada() {
        const data = new Date(this.dataHora);
        return data.toLocaleDateString('pt-AO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    getEstrelasHTML() {
        const estrelasCompletas = '★'.repeat(this.estrelas);
        const estrelasVazias = '☆'.repeat(5 - this.estrelas);
        return estrelasCompletas + estrelasVazias;
    }

    toJSON() {
        return {
            id: this.id,
            produtoId: this.produtoId,
            usuarioId: this.usuarioId,
            nomeUsuario: this.nomeUsuario,
            estrelas: this.estrelas,
            comentario: this.comentario,
            dataHora: this.dataHora
        };
    }

    static fromJSON(obj) {
        return new Avaliacao(
            obj.id,
            obj.produtoId,
            obj.usuarioId,
            obj.nomeUsuario,
            obj.estrelas,
            obj.comentario,
            obj.dataHora
        );
    }
}

// Repository: Gerenciamento de Avaliações
class AvaliacaoRepository {
    constructor() {
        this.avaliacoes = [];
        this.proximoId = 1;
        this.carregarDoLocalStorage();
    }

    adicionar(avaliacao) {
        if (!avaliacao.id) {
            avaliacao.id = this.proximoId++;
        }
        this.avaliacoes.push(avaliacao);
        this.salvar();
        return avaliacao;
    }

    obterPorProduto(produtoId) {
        return this.avaliacoes.filter(a => a.produtoId === produtoId);
    }

    calcularMediaProduto(produtoId) {
        const avaliacoesProduto = this.obterPorProduto(produtoId);
        if (avaliacoesProduto.length === 0) return 0;
        
        const soma = avaliacoesProduto.reduce((acc, av) => acc + av.estrelas, 0);
        return Math.round(soma / avaliacoesProduto.length);
    }

    usuarioJaAvaliou(produtoId, usuarioId) {
        return this.avaliacoes.some(a => 
            a.produtoId === produtoId && a.usuarioId === usuarioId
        );
    }

    salvar() {
        const dados = this.avaliacoes.map(a => a.toJSON());
        localStorage.setItem('ombelamarket_avaliacoes', JSON.stringify(dados));
    }

    carregarDoLocalStorage() {
        const dados = localStorage.getItem('ombelamarket_avaliacoes');
        if (dados) {
            try {
                const parsed = JSON.parse(dados);
                if (Array.isArray(parsed)) {
                    this.avaliacoes = parsed.map(a => Avaliacao.fromJSON(a));
                    if (this.avaliacoes.length > 0) {
                        this.proximoId = Math.max(...this.avaliacoes.map(a => a.id)) + 1;
                    }
                }
            } catch (e) {
                console.error('Erro ao carregar avaliações:', e);
                this.avaliacoes = [];
            }
        }
    }
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Avaliacao, AvaliacaoRepository };
}
