// Controller: Gerenciamento da aplicação
class AppController {
    constructor() {
        this.produtoRepository = new ProdutoRepository();
        this.carrinho = new Carrinho();
        this.pedidoRepository = new PedidoRepository();
        this.filtroAtual = {
            termo: '',
            categoria: '',
            ordenacao: ''
        };
    }

    // Inicializar aplicação
    inicializar() {
        this.renderizarProdutos();
        this.atualizarCarrinhoUI();
        this.configurarEventos();
    }

    // Configurar eventos
    configurarEventos() {
        // Evento de busca
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const priceFilter = document.getElementById('priceFilter');
        const searchButton = document.querySelector('.search-filter button');

        if (searchButton) {
            searchButton.addEventListener('click', () => this.filtrarProdutos());
        }

        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.filtrarProdutos();
                }
            });
        }

        // Eventos dos botões de adicionar ao carrinho
        this.configurarBotoesAdicionarCarrinho();

        // Evento do carrinho flutuante
        const floatingCart = document.getElementById('floating-cart');
        if (floatingCart) {
            floatingCart.addEventListener('click', () => this.abrirCarrinho());
        }
    }

    // Configurar botões de adicionar ao carrinho
    configurarBotoesAdicionarCarrinho() {
        const botoes = document.querySelectorAll('.btn-add-cart');
        botoes.forEach((botao) => {
            // Remover listeners antigos
            const novoBotao = botao.cloneNode(true);
            botao.parentNode.replaceChild(novoBotao, botao);
            
            // Adicionar novo listener
            novoBotao.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const produtoId = parseInt(novoBotao.dataset.produtoId);
                if (produtoId) {
                    this.adicionarAoCarrinho(produtoId);
                }
            });
        });
    }

    // Renderizar produtos
    renderizarProdutos(produtos = null) {
        const produtosParaRenderizar = produtos || this.produtoRepository.obterTodos();
        const grids = document.querySelectorAll('.produtos-grid');

        grids.forEach(grid => {
            grid.innerHTML = '';
            
            produtosParaRenderizar.forEach(produto => {
                const card = this.criarCardProduto(produto);
                grid.appendChild(card);
            });
        });

        // Reconfigurar eventos dos botões
        this.configurarBotoesAdicionarCarrinho();
    }

    // Criar card de produto
    criarCardProduto(produto) {
        const card = document.createElement('div');
        card.className = 'produto-card';
        card.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <div class="stars">${produto.getEstrelasHTML()}</div>
            <p class="price">${produto.getPrecoFormatado()}</p>
            <button class="btn-add-cart" data-produto-id="${produto.id}">Adicionar</button>
        `;
        
        // Adicionar evento ao botão
        const botao = card.querySelector('.btn-add-cart');
        botao.addEventListener('click', () => this.adicionarAoCarrinho(produto.id));
        
        return card;
    }

    // Filtrar produtos
    filtrarProdutos() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const priceFilter = document.getElementById('priceFilter');

        this.filtroAtual.termo = searchInput ? searchInput.value : '';
        this.filtroAtual.categoria = categoryFilter ? categoryFilter.value : '';
        this.filtroAtual.ordenacao = priceFilter ? priceFilter.value : '';

        let produtos = this.produtoRepository.obterTodos();

        // Aplicar busca por termo
        if (this.filtroAtual.termo) {
            produtos = this.produtoRepository.buscar(this.filtroAtual.termo);
        }

        // Aplicar filtro de categoria
        if (this.filtroAtual.categoria) {
            produtos = produtos.filter(p => p.categoria === this.filtroAtual.categoria);
        }

        // Aplicar ordenação por preço
        if (this.filtroAtual.ordenacao) {
            const ordem = this.filtroAtual.ordenacao === 'low' ? 'asc' : 'desc';
            produtos.sort((a, b) => {
                return ordem === 'asc' ? a.preco - b.preco : b.preco - a.preco;
            });
        }

        this.renderizarProdutos(produtos);
    }

    // Adicionar produto ao carrinho
    adicionarAoCarrinho(produtoId) {
        const produto = this.produtoRepository.obterPorId(produtoId);
        
        if (produto) {
            this.carrinho.adicionarProduto(produto);
            this.atualizarCarrinhoUI();
            this.mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`);
        }
    }

    // Remover produto do carrinho
    removerDoCarrinho(produtoId) {
        this.carrinho.removerProduto(produtoId);
        this.atualizarCarrinhoUI();
        this.renderizarItensCarrinho();
    }

    // Atualizar UI do carrinho
    atualizarCarrinhoUI() {
        const cartCount = document.getElementById('cart-count');
        const floatingCart = document.getElementById('floating-cart');
        
        const totalItens = this.carrinho.getTotalItens();
        
        if (cartCount) {
            cartCount.textContent = totalItens;
        }
        
        if (floatingCart) {
            floatingCart.style.display = totalItens > 0 ? 'flex' : 'none';
        }
    }

    // Abrir modal do carrinho
    abrirCarrinho() {
        const modal = document.getElementById('cart-modal');
        if (modal) {
            modal.style.display = 'flex';
            this.renderizarItensCarrinho();
        }
    }

    // Fechar modal do carrinho
    fecharCarrinho() {
        const modal = document.getElementById('cart-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Renderizar itens do carrinho
    renderizarItensCarrinho() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (!cartItems) return;
        
        cartItems.innerHTML = '';
        const itens = this.carrinho.getItens();
        
        if (itens.length === 0) {
            cartItems.innerHTML = '<li style="text-align: center; color: #6b7280;">Carrinho vazio</li>';
        }
        
        itens.forEach((item) => {
            const li = document.createElement('li');
            li.style.cssText = 'display: flex; flex-direction: column; gap: 10px; padding: 15px; background: #f9fafb; border-radius: 8px; margin-bottom: 10px;';
            li.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <strong style="display: block; margin-bottom: 5px;">${item.produto.nome}</strong>
                        <small style="color: #6b7280;">Preço unitário: ${item.produto.getPrecoFormatado()}</small>
                    </div>
                    <button onclick="app.removerDoCarrinho(${item.produto.id})" 
                            style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 14px;">
                        🗑️ Remover
                    </button>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <button onclick="app.diminuirQuantidade(${item.produto.id})" 
                                style="background: #6b7280; color: white; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">
                            −
                        </button>
                        <span style="min-width: 30px; text-align: center; font-weight: bold;">${item.quantidade}</span>
                        <button onclick="app.aumentarQuantidade(${item.produto.id})" 
                                style="background: #10b981; color: white; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">
                            +
                        </button>
                    </div>
                    <strong style="color: #0a0f2c; font-size: 1.1rem;">
                        AO ${(item.produto.preco * item.quantidade).toLocaleString('pt-AO')},00
                    </strong>
                </div>
            `;
            cartItems.appendChild(li);
        });
        
        if (cartTotal) {
            const total = this.carrinho.getTotal();
            const subtotal = this.carrinho.getSubtotal();
            const taxaEntrega = this.carrinho.getTaxaEntrega();
            
            cartTotal.innerHTML = `
                <div style="margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; padding: 5px 0;">
                        <span>Subtotal:</span>
                        <strong>AO ${subtotal.toLocaleString('pt-AO')},00</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 5px 0;">
                        <span>Taxa de Entrega (5%):</span>
                        <strong>AO ${taxaEntrega.toLocaleString('pt-AO')},00</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 1.2em; margin-top: 10px; padding-top: 10px; border-top: 2px solid #ccc;">
                        <span>Total:</span>
                        <strong style="color: #0084ff;">AO ${total.toLocaleString('pt-AO')},00</strong>
                    </div>
                </div>
            `;
        }
    }

    // Aumentar quantidade
    aumentarQuantidade(produtoId) {
        const item = this.carrinho.getItens().find(i => i.produto.id === produtoId);
        if (item) {
            this.carrinho.atualizarQuantidade(produtoId, item.quantidade + 1);
            this.atualizarCarrinhoUI();
            this.renderizarItensCarrinho();
        }
    }

    // Diminuir quantidade
    diminuirQuantidade(produtoId) {
        const item = this.carrinho.getItens().find(i => i.produto.id === produtoId);
        if (item) {
            if (item.quantidade > 1) {
                this.carrinho.atualizarQuantidade(produtoId, item.quantidade - 1);
            } else {
                this.carrinho.removerProduto(produtoId);
            }
            this.atualizarCarrinhoUI();
            this.renderizarItensCarrinho();
        }
    }

    // Processar pagamento
    processarPagamento() {
        if (this.carrinho.getTotalItens() === 0) {
            this.mostrarNotificacao('Carrinho vazio!', 'erro');
            return;
        }

        const total = this.carrinho.getTotal();
        const confirmacao = confirm(`Confirmar pedido no valor de AO ${total.toLocaleString('pt-AO')},00?\n\nO pedido será enviado para aprovação do administrador.`);
        
        if (confirmacao) {
            // Criar pedido
            const pedido = this.pedidoRepository.criarDoPedido(this.carrinho);
            
            // Limpar carrinho
            this.carrinho.limpar();
            this.atualizarCarrinhoUI();
            this.fecharCarrinho();
            
            // Mostrar notificação de sucesso
            this.mostrarNotificacao(
                `Pedido #${pedido.id} criado com sucesso! Aguardando aprovação do administrador.`, 
                'sucesso'
            );
        }
    }

    // Mostrar notificação
    mostrarNotificacao(mensagem, tipo = 'sucesso') {
        // Criar elemento de notificação
        const notificacao = document.createElement('div');
        notificacao.className = 'notificacao';
        notificacao.textContent = mensagem;
        
        const cores = {
            sucesso: '#16a34a',
            erro: '#dc2626',
            info: '#2563eb'
        };
        
        notificacao.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${cores[tipo] || cores.sucesso};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notificacao);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notificacao.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notificacao.remove(), 300);
        }, 3000);
    }
}

// Funções globais para compatibilidade com HTML existente
function abrirCarrinho() {
    if (window.app) {
        window.app.abrirCarrinho();
    }
}

function fecharCarrinho() {
    if (window.app) {
        window.app.fecharCarrinho();
    }
}

function filtrarProdutos() {
    if (window.app) {
        window.app.filtrarProdutos();
    }
}

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    }
}

// Adicionar estilos para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Exportar para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppController;
}
