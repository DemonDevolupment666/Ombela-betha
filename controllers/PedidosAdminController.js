// Controller: Gerenciamento de Pedidos (Admin)
class PedidosAdminController {
    constructor(pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    // Renderizar painel de pedidos
    renderizarPainelPedidos() {
        const pedidos = this.pedidoRepository.obterTodos();
        const stats = this.pedidoRepository.getEstatisticas();
        
        let html = `
            <div class="pedidos-panel">
                <h2>Gestão de Pedidos</h2>
                
                <!-- Estatísticas -->
                <div class="pedidos-stats">
                    <div class="stat-card pendente">
                        <h3>${stats.pendentes}</h3>
                        <p>Pedidos Pendentes</p>
                    </div>
                    <div class="stat-card aprovado">
                        <h3>${stats.aprovados}</h3>
                        <p>Pedidos Aprovados</p>
                    </div>
                    <div class="stat-card rejeitado">
                        <h3>${stats.rejeitados}</h3>
                        <p>Pedidos Rejeitados</p>
                    </div>
                    <div class="stat-card total">
                        <h3>AO ${Math.round(stats.valorTotal).toLocaleString('pt-AO')}</h3>
                        <p>Valor Total Aprovado</p>
                    </div>
                </div>

                <!-- Filtros -->
                <div class="pedidos-filters">
                    <button onclick="pedidosAdmin.filtrarPorStatus('todos')" class="filter-btn active" data-status="todos">
                        Todos (${stats.total})
                    </button>
                    <button onclick="pedidosAdmin.filtrarPorStatus('pendente')" class="filter-btn" data-status="pendente">
                        Pendentes (${stats.pendentes})
                    </button>
                    <button onclick="pedidosAdmin.filtrarPorStatus('aprovado')" class="filter-btn" data-status="aprovado">
                        Aprovados (${stats.aprovados})
                    </button>
                    <button onclick="pedidosAdmin.filtrarPorStatus('rejeitado')" class="filter-btn" data-status="rejeitado">
                        Rejeitados (${stats.rejeitados})
                    </button>
                </div>

                <!-- Lista de Pedidos -->
                <div class="pedidos-lista" id="pedidos-lista">
        `;

        // Ordenar por data (mais recente primeiro)
        const pedidosOrdenados = [...pedidos].sort((a, b) => 
            new Date(b.dataHora) - new Date(a.dataHora)
        );

        pedidosOrdenados.forEach(pedido => {
            html += this.renderizarCardPedido(pedido);
        });

        if (pedidos.length === 0) {
            html += `
                <div class="empty-state">
                    <p>Nenhum pedido encontrado.</p>
                </div>
            `;
        }

        html += `
                </div>
            </div>
        `;

        return html;
    }

    // Renderizar card de pedido individual
    renderizarCardPedido(pedido) {
        const statusClass = pedido.status;
        const statusLabel = {
            'pendente': '⏳ Pendente',
            'aprovado': '✓ Aprovado',
            'rejeitado': '✗ Rejeitado'
        };

        let html = `
            <div class="pedido-card status-${statusClass}" data-status="${pedido.status}">
                <div class="pedido-header">
                    <div>
                        <h3>Pedido #${pedido.id}</h3>
                        <p class="pedido-data">${pedido.getDataFormatada()}</p>
                    </div>
                    <div class="pedido-status status-${statusClass}">
                        ${statusLabel[pedido.status]}
                    </div>
                </div>

                <div class="pedido-body">
                    <h4>Itens do Pedido:</h4>
                    <ul class="pedido-itens">
        `;

        pedido.itens.forEach(item => {
            html += `
                <li>
                    <img src="${item.produto.imagem}" alt="${item.produto.nome}">
                    <div class="item-info">
                        <strong>${item.produto.nome}</strong>
                        <span>Quantidade: ${item.quantidade}</span>
                        <span>Preço unitário: ${item.produto.getPrecoFormatado()}</span>
                    </div>
                    <div class="item-total">
                        AO ${(item.produto.preco * item.quantidade).toLocaleString('pt-AO')},00
                    </div>
                </li>
            `;
        });

        html += `
                    </ul>

                    <div class="pedido-totais">
                        <div class="total-linha">
                            <span>Subtotal:</span>
                            <strong>AO ${pedido.subtotal.toLocaleString('pt-AO')},00</strong>
                        </div>
                        <div class="total-linha">
                            <span>Taxa de Entrega (5%):</span>
                            <strong>AO ${pedido.taxaEntrega.toLocaleString('pt-AO')},00</strong>
                        </div>
                        <div class="total-linha total-final">
                            <span>Total:</span>
                            <strong>AO ${pedido.total.toLocaleString('pt-AO')},00</strong>
                        </div>
                    </div>
                </div>

                <div class="pedido-actions">
        `;

        if (pedido.status === 'pendente') {
            html += `
                <button onclick="pedidosAdmin.aprovarPedido(${pedido.id})" class="btn-aprovar">
                    ✓ Aprovar Pedido
                </button>
                <button onclick="pedidosAdmin.rejeitarPedido(${pedido.id})" class="btn-rejeitar">
                    ✗ Rejeitar Pedido
                </button>
            `;
        } else if (pedido.status === 'aprovado') {
            html += `
                <div class="status-info aprovado">
                    ✓ Pedido aprovado e processado
                </div>
            `;
        } else if (pedido.status === 'rejeitado') {
            html += `
                <div class="status-info rejeitado">
                    ✗ Pedido rejeitado
                </div>
            `;
        }

        html += `
                </div>
            </div>
        `;

        return html;
    }

    // Aprovar pedido
    aprovarPedido(id) {
        if (confirm(`Tem certeza que deseja APROVAR o pedido #${id}?`)) {
            this.pedidoRepository.aprovar(id);
            this.atualizarListaPedidos();
            this.mostrarNotificacao(`Pedido #${id} aprovado com sucesso!`, 'sucesso');
        }
    }

    // Rejeitar pedido
    rejeitarPedido(id) {
        const motivo = prompt(`Deseja adicionar um motivo para rejeição do pedido #${id}?`);
        if (motivo !== null) { // null significa que cancelou
            this.pedidoRepository.rejeitar(id);
            this.atualizarListaPedidos();
            this.mostrarNotificacao(`Pedido #${id} rejeitado.`, 'erro');
        }
    }

    // Filtrar pedidos por status
    filtrarPorStatus(status) {
        const cards = document.querySelectorAll('.pedido-card');
        const buttons = document.querySelectorAll('.filter-btn');

        // Atualizar botões ativos
        buttons.forEach(btn => {
            if (btn.dataset.status === status) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Filtrar cards
        cards.forEach(card => {
            if (status === 'todos' || card.dataset.status === status) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Atualizar lista de pedidos
    atualizarListaPedidos() {
        const pedidosPanel = document.querySelector('.pedidos-panel');
        if (pedidosPanel) {
            const novoHTML = this.renderizarPainelPedidos();
            pedidosPanel.outerHTML = novoHTML;
        }
    }

    // Mostrar notificação
    mostrarNotificacao(mensagem, tipo = 'sucesso') {
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
        
        setTimeout(() => {
            notificacao.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notificacao.remove(), 300);
        }, 3000);
    }
}

// Exportar para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PedidosAdminController;
}
