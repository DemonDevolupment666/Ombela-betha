// Repository: Gerenciamento de Produtos
class ProdutoRepository {
    constructor() {
        this.produtos = [];
        this.proximoId = 1;
        this.inicializarProdutos();
    }

    // Inicializar com produtos padrão
    inicializarProdutos() {
        const produtosPadrao = [
            {
                nome: 'Ventiladores CPU',
                descricao: 'Ventiladores de alta performance para refrigeração de CPU',
                preco: 74000,
                categoria: 'eletronicos',
                imagem: 'images/product-5.png',
                estrelas: 4
            },
            {
                nome: 'Essenciais Game',
                descricao: 'Kit essencial para gamers profissionais',
                preco: 299000,
                categoria: 'eletronicos',
                imagem: 'images/product-4.png',
                estrelas: 5
            },
            {
                nome: 'Playstation',
                descricao: 'Console Playstation última geração',
                preco: 456000,
                categoria: 'eletronicos',
                imagem: 'images/product-14.png',
                estrelas: 4
            },
            {
                nome: 'iPhone 17 Pro Max',
                descricao: 'Smartphone Apple iPhone 17 Pro Max',
                preco: 2400000,
                categoria: 'eletronicos',
                imagem: 'images/product-8.png',
                estrelas: 4
            },
            {
                nome: 'Cadeira Ergonômica Gamer',
                descricao: 'Cadeira gamer com suporte ergonômico premium',
                preco: 185000,
                categoria: 'moda',
                imagem: 'images/product-7.png',
                estrelas: 5
            },
            {
                nome: 'Teclado Mecânico RGB',
                descricao: 'Teclado mecânico com iluminação RGB customizável',
                preco: 95000,
                categoria: 'eletronicos',
                imagem: 'images/product-1.png',
                estrelas: 4
            },
            {
                nome: 'Mouse Gamer Pro',
                descricao: 'Mouse gamer com sensor de alta precisão',
                preco: 68000,
                categoria: 'eletronicos',
                imagem: 'images/product-2.png',
                estrelas: 5
            },
            {
                nome: 'Headset Premium',
                descricao: 'Fones de ouvido com cancelamento de ruído',
                preco: 125000,
                categoria: 'eletronicos',
                imagem: 'images/product-3.png',
                estrelas: 4
            }
        ];

        // Carregar produtos do localStorage ou usar padrão
        const produtosSalvos = localStorage.getItem('ombelamarket_produtos');
        
        if (produtosSalvos) {
            try {
                const parsed = JSON.parse(produtosSalvos);
                this.produtos = parsed.map(p => Produto.fromJSON(p));
                this.proximoId = Math.max(...this.produtos.map(p => p.id)) + 1;
            } catch (e) {
                console.error('Erro ao carregar produtos:', e);
                this.carregarProdutosPadrao(produtosPadrao);
            }
        } else {
            this.carregarProdutosPadrao(produtosPadrao);
        }
    }

    // Carregar produtos padrão
    carregarProdutosPadrao(produtosPadrao) {
        produtosPadrao.forEach(p => {
            this.adicionar(new Produto(
                this.proximoId++,
                p.nome,
                p.descricao,
                p.preco,
                p.categoria,
                p.imagem,
                p.estrelas
            ));
        });
    }

    // Adicionar produto
    adicionar(produto) {
        if (!produto.id) {
            produto.id = this.proximoId++;
        }
        this.produtos.push(produto);
        this.salvar();
        return produto;
    }

    // Obter todos os produtos
    obterTodos() {
        return [...this.produtos];
    }

    // Obter produto por ID
    obterPorId(id) {
        return this.produtos.find(p => p.id === id);
    }

    // Buscar produtos
    buscar(termo) {
        const termoLower = termo.toLowerCase();
        return this.produtos.filter(p => 
            p.nome.toLowerCase().includes(termoLower) ||
            p.descricao.toLowerCase().includes(termoLower)
        );
    }

    // Filtrar por categoria
    filtrarPorCategoria(categoria) {
        if (!categoria || categoria === '') {
            return this.obterTodos();
        }
        return this.produtos.filter(p => p.categoria === categoria);
    }

    // Ordenar por preço
    ordenarPorPreco(ordem = 'asc') {
        const produtosOrdenados = [...this.produtos];
        produtosOrdenados.sort((a, b) => {
            return ordem === 'asc' ? a.preco - b.preco : b.preco - a.preco;
        });
        return produtosOrdenados;
    }

    // Atualizar produto
    atualizar(id, dadosAtualizados) {
        const index = this.produtos.findIndex(p => p.id === id);
        if (index !== -1) {
            this.produtos[index] = { ...this.produtos[index], ...dadosAtualizados };
            this.salvar();
            return this.produtos[index];
        }
        return null;
    }

    // Remover produto
    remover(id) {
        const index = this.produtos.findIndex(p => p.id === id);
        if (index !== -1) {
            const produtoRemovido = this.produtos.splice(index, 1)[0];
            this.salvar();
            return produtoRemovido;
        }
        return null;
    }

    // Salvar no localStorage
    salvar() {
        const dados = this.produtos.map(p => p.toJSON());
        localStorage.setItem('ombelamarket_produtos', JSON.stringify(dados));
    }
}

// Exportar para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProdutoRepository;
}
