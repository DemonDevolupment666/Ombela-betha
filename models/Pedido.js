// Model: Pedido (Compra)
class Pedido {
    constructor(id, itens, subtotal, taxaEntrega, total, dataHora, status = 'pendente') {
        this.id = id;
        this.itens = itens; // Array de {produto, quantidade}
        this.subtotal = subtotal;
        this.taxaEntrega = taxaEntrega;
        this.total = total;
        this.dataHora = dataHora;
        this.status = status; // 'pendente', 'aprovado', 'rejeitado'
    }

    // Formatar data
    getDataFormatada() {
        const data = new Date(this.dataHora);
        return data.toLocaleString('pt-AO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Formatar total
    getTotalFormatado() {
        return `AO ${this.total.toLocaleString('pt-AO', { minimumFractionDigits: 2 })},00`;
    }

    // Converter para objeto simples
    toJSON() {
        return {
            id: this.id,
            itens: this.itens.map(item => ({
                produto: item.produto.toJSON(),
                quantidade: item.quantidade
            })),
            subtotal: this.subtotal,
            taxaEntrega: this.taxaEntrega,
            total: this.total,
            dataHora: this.dataHora,
            status: this.status
        };
    }

    // Criar pedido a partir de objeto
    static fromJSON(obj) {
        const itens = obj.itens.map(item => ({
            produto: Produto.fromJSON(item.produto),
            quantidade: item.quantidade
        }));
        
        return new Pedido(
            obj.id,
            itens,
            obj.subtotal,
            obj.taxaEntrega,
            obj.total,
            obj.dataHora,
            obj.status
        );
    }
}

// Repository: Gerenciamento de Pedidos
class PedidoRepository {
    constructor() {
        this.pedidos = [];
        this.proximoId = 1;
        this.carregarDoLocalStorage();
    }

    // Adicionar pedido
    adicionar(pedido) {
        if (!pedido.id) {
            pedido.id = this.proximoId++;
        } else {
            // Atualizar proximoId se necessário
            if (pedido.id >= this.proximoId) {
                this.proximoId = pedido.id + 1;
            }
        }
        this.pedidos.push(pedido);
        this.salvar();
        return pedido;
    }

    // Criar novo pedido a partir do carrinho
    criarDoPedido(carrinho) {
        const itens = carrinho.getItens().map(item => ({
            produto: item.produto,
            quantidade: item.quantidade
        }));

        const pedido = new Pedido(
            null, // ID será gerado
            itens,
            carrinho.getSubtotal(),
            carrinho.getTaxaEntrega(),
            carrinho.getTotal(),
            new Date().toISOString(),
            'pendente'
        );

        return this.adicionar(pedido);
    }

    // Obter todos os pedidos
    obterTodos() {
        return [...this.pedidos];
    }

    // Obter pedido por ID
    obterPorId(id) {
        return this.pedidos.find(p => p.id === id);
    }

    // Obter pedidos por status
    obterPorStatus(status) {
        return this.pedidos.filter(p => p.status === status);
    }

    // Aprovar pedido
    aprovar(id) {
        const pedido = this.obterPorId(id);
        if (pedido) {
            pedido.status = 'aprovado';
            this.salvar();
            return true;
        }
        return false;
    }

    // Rejeitar pedido
    rejeitar(id) {
        const pedido = this.obterPorId(id);
        if (pedido) {
            pedido.status = 'rejeitado';
            this.salvar();
            return true;
        }
        return false;
    }

    // Salvar no localStorage
    salvar() {
        const dados = this.pedidos.map(p => p.toJSON());
        localStorage.setItem('ombelamarket_pedidos', JSON.stringify(dados));
    }

    // Carregar do localStorage
    carregarDoLocalStorage() {
        const dados = localStorage.getItem('ombelamarket_pedidos');
        
        if (dados) {
            try {
                const parsed = JSON.parse(dados);
                if (Array.isArray(parsed)) {
                    this.pedidos = parsed.map(p => Pedido.fromJSON(p));
                    if (this.pedidos.length > 0) {
                        this.proximoId = Math.max(...this.pedidos.map(p => p.id)) + 1;
                    }
                }
            } catch (e) {
                console.error('Erro ao carregar pedidos:', e);
                this.pedidos = [];
            }
        }
    }

    // Obter estatísticas
    getEstatisticas() {
        return {
            total: this.pedidos.length,
            pendentes: this.pedidos.filter(p => p.status === 'pendente').length,
            aprovados: this.pedidos.filter(p => p.status === 'aprovado').length,
            rejeitados: this.pedidos.filter(p => p.status === 'rejeitado').length,
            valorTotal: this.pedidos
                .filter(p => p.status === 'aprovado')
                .reduce((sum, p) => sum + p.total, 0)
        };
    }
}

// Exportar para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Pedido, PedidoRepository };
}
