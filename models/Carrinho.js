// Model: Carrinho
class Carrinho {
    constructor() {
        this.itens = [];
        this.carregarDoLocalStorage();
    }

    // Adicionar produto ao carrinho
    adicionarProduto(produto, quantidade = 1) {
        const itemExistente = this.itens.find(item => item.produto.id === produto.id);
        
        if (itemExistente) {
            itemExistente.quantidade += quantidade;
        } else {
            this.itens.push({
                produto: produto,
                quantidade: quantidade
            });
        }
        
        this.salvarNoLocalStorage();
        return true;
    }

    // Remover produto do carrinho
    removerProduto(produtoId) {
        this.itens = this.itens.filter(item => item.produto.id !== produtoId);
        this.salvarNoLocalStorage();
    }

    // Atualizar quantidade de um produto
    atualizarQuantidade(produtoId, novaQuantidade) {
        const item = this.itens.find(item => item.produto.id === produtoId);
        
        if (item) {
            if (novaQuantidade <= 0) {
                this.removerProduto(produtoId);
            } else {
                item.quantidade = novaQuantidade;
                this.salvarNoLocalStorage();
            }
        }
    }

    // Limpar carrinho
    limpar() {
        this.itens = [];
        this.salvarNoLocalStorage();
    }

    // Obter total de itens
    getTotalItens() {
        return this.itens.reduce((total, item) => total + item.quantidade, 0);
    }

    // Calcular subtotal
    getSubtotal() {
        return this.itens.reduce((total, item) => {
            return total + (item.produto.preco * item.quantidade);
        }, 0);
    }

    // Calcular taxa de entrega (exemplo: 5% do subtotal)
    getTaxaEntrega() {
        const subtotal = this.getSubtotal();
        return subtotal > 0 ? subtotal * 0.05 : 0;
    }

    // Calcular total final
    getTotal() {
        return this.getSubtotal() + this.getTaxaEntrega();
    }

    // Salvar no localStorage
    salvarNoLocalStorage() {
        const dados = {
            itens: this.itens.map(item => ({
                produto: item.produto.toJSON(),
                quantidade: item.quantidade
            }))
        };
        localStorage.setItem('ombelamarket_carrinho', JSON.stringify(dados));
    }

    // Carregar do localStorage
    carregarDoLocalStorage() {
        const dados = localStorage.getItem('ombelamarket_carrinho');
        
        if (dados) {
            try {
                const parsed = JSON.parse(dados);
                // Verificar se a estrutura está correta
                if (parsed && parsed.itens && Array.isArray(parsed.itens)) {
                    this.itens = parsed.itens.map(item => ({
                        produto: Produto.fromJSON(item.produto),
                        quantidade: item.quantidade
                    }));
                } else {
                    this.itens = [];
                    this.salvarNoLocalStorage(); // Limpar dados corrompidos
                }
            } catch (e) {
                console.error('Erro ao carregar carrinho:', e);
                this.itens = [];
                localStorage.removeItem('ombelamarket_carrinho'); // Remover dados corrompidos
            }
        }
    }

    // Obter itens do carrinho
    getItens() {
        return this.itens;
    }
}

// Exportar para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Carrinho;
}
