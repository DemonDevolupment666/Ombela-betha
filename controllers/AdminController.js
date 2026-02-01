// Controller: Administração de Produtos
class AdminController {
    constructor(produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    // Criar novo produto
    criarProduto(dados) {
        const produto = new Produto(
            null, // ID será gerado automaticamente
            dados.nome,
            dados.descricao,
            parseFloat(dados.preco),
            dados.categoria,
            dados.imagem || 'images/product-default.png',
            parseInt(dados.estrelas) || 4
        );

        return this.produtoRepository.adicionar(produto);
    }

    // Editar produto existente
    editarProduto(id, dados) {
        const dadosAtualizados = {
            nome: dados.nome,
            descricao: dados.descricao,
            preco: parseFloat(dados.preco),
            categoria: dados.categoria,
            imagem: dados.imagem,
            estrelas: parseInt(dados.estrelas)
        };

        return this.produtoRepository.atualizar(id, dadosAtualizados);
    }

    // Deletar produto
    deletarProduto(id) {
        return this.produtoRepository.remover(id);
    }

    // Obter produto para edição
    obterProduto(id) {
        return this.produtoRepository.obterPorId(id);
    }

    // Listar todos os produtos
    listarProdutos() {
        return this.produtoRepository.obterTodos();
    }

    // Renderizar painel de administração
    renderizarPainelAdmin() {
        const produtos = this.listarProdutos();
        
        let html = `
            <div class="admin-panel">
                <h2>Painel de Administração - Produtos</h2>
                
                <div class="admin-actions">
                    <button onclick="adminController.mostrarFormularioNovo()" class="btn-primary">
                        + Adicionar Novo Produto
                    </button>
                </div>

                <div id="form-container"></div>

                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Imagem</th>
                            <th>Nome</th>
                            <th>Categoria</th>
                            <th>Preço</th>
                            <th>Estrelas</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        produtos.forEach(produto => {
            html += `
                <tr>
                    <td>${produto.id}</td>
                    <td><img src="${produto.imagem}" alt="${produto.nome}" style="width: 50px; height: 50px; object-fit: cover;"></td>
                    <td>${produto.nome}</td>
                    <td>${produto.categoria}</td>
                    <td>${produto.getPrecoFormatado()}</td>
                    <td>${produto.getEstrelasHTML()}</td>
                    <td>
                        <button onclick="adminController.editarProdutoForm(${produto.id})" class="btn-edit">Editar</button>
                        <button onclick="adminController.confirmarDelete(${produto.id})" class="btn-delete">Deletar</button>
                    </td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        return html;
    }

    // Mostrar formulário para novo produto
    mostrarFormularioNovo() {
        const formContainer = document.getElementById('form-container');
        formContainer.innerHTML = this.renderizarFormulario();
        formContainer.style.display = 'block';
    }

    // Editar produto (mostrar formulário)
    editarProdutoForm(id) {
        const produto = this.obterProduto(id);
        const formContainer = document.getElementById('form-container');
        formContainer.innerHTML = this.renderizarFormulario(produto);
        formContainer.style.display = 'block';
    }

    // Renderizar formulário
    renderizarFormulario(produto = null) {
        const isEdicao = produto !== null;
        
        return `
            <div class="produto-form">
                <h3>${isEdicao ? 'Editar Produto' : 'Novo Produto'}</h3>
                <form onsubmit="adminController.salvarProduto(event, ${isEdicao ? produto.id : 'null'})" id="produto-form">
                    <div class="form-group">
                        <label>Nome do Produto:</label>
                        <input type="text" name="nome" value="${produto ? produto.nome : ''}" required>
                    </div>

                    <div class="form-group">
                        <label>Descrição:</label>
                        <textarea name="descricao" required>${produto ? produto.descricao : ''}</textarea>
                    </div>

                    <div class="form-group">
                        <label>Preço (Kz):</label>
                        <input type="number" name="preco" value="${produto ? produto.preco : ''}" step="1000" required>
                    </div>

                    <div class="form-group">
                        <label>Categoria:</label>
                        <select name="categoria" required>
                            <option value="eletronicos" ${produto && produto.categoria === 'eletronicos' ? 'selected' : ''}>Eletrónicos</option>
                            <option value="moda" ${produto && produto.categoria === 'moda' ? 'selected' : ''}>Moda</option>
                            <option value="alimentacao" ${produto && produto.categoria === 'alimentacao' ? 'selected' : ''}>Alimentação</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Imagem do Produto:</label>
                        <div style="margin-bottom: 10px;">
                            <input type="file" id="imagem-upload" accept="image/*" onchange="adminController.handleImageUpload(event)">
                            <small style="display: block; margin-top: 5px; color: #6b7280;">
                                Escolha uma imagem do seu computador ou use URL abaixo
                            </small>
                        </div>
                        <input type="text" name="imagem" id="imagem-url" value="${produto ? produto.imagem : 'images/product-default.png'}" placeholder="ou cole URL da imagem">
                        ${produto && produto.imagem ? `
                            <div style="margin-top: 10px;">
                                <img src="${produto.imagem}" alt="Preview" style="max-width: 150px; max-height: 150px; object-fit: cover; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                        ` : ''}
                        <div id="image-preview" style="margin-top: 10px;"></div>
                    </div>

                    <div class="form-group">
                        <label>Estrelas (1-5):</label>
                        <input type="number" name="estrelas" value="${produto ? produto.estrelas : 4}" min="1" max="5" required>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Salvar</button>
                        <button type="button" onclick="adminController.cancelarForm()" class="btn-secondary">Cancelar</button>
                    </div>
                </form>
            </div>
        `;
    }

    // Salvar produto (criar ou editar)
    salvarProduto(event, id) {
        event.preventDefault();
        
        const form = event.target;
        const dados = {
            nome: form.nome.value,
            descricao: form.descricao.value,
            preco: form.preco.value,
            categoria: form.categoria.value,
            imagem: form.imagem.value,
            estrelas: form.estrelas.value
        };

        try {
            if (id) {
                this.editarProduto(id, dados);
                alert('Produto atualizado com sucesso!');
            } else {
                this.criarProduto(dados);
                alert('Produto criado com sucesso!');
            }

            this.cancelarForm();
            this.atualizarListaProdutos();
        } catch (error) {
            alert('Erro ao salvar produto: ' + error.message);
        }
    }

    // Cancelar formulário
    cancelarForm() {
        const formContainer = document.getElementById('form-container');
        formContainer.innerHTML = '';
        formContainer.style.display = 'none';
    }

    // Handle image upload
    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            // Verificar se é uma imagem
            if (!file.type.startsWith('image/')) {
                alert('Por favor, selecione apenas arquivos de imagem.');
                event.target.value = '';
                return;
            }

            // Verificar tamanho (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('A imagem deve ter no máximo 5MB.');
                event.target.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                const base64String = e.target.result;
                
                // Atualizar campo de URL com base64
                const imagemUrlInput = document.getElementById('imagem-url');
                if (imagemUrlInput) {
                    imagemUrlInput.value = base64String;
                }

                // Mostrar preview
                const previewDiv = document.getElementById('image-preview');
                if (previewDiv) {
                    previewDiv.innerHTML = `
                        <div style="position: relative; display: inline-block;">
                            <img src="${base64String}" alt="Preview" 
                                 style="max-width: 200px; max-height: 200px; object-fit: cover; border: 2px solid #0084ff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                            <div style="margin-top: 5px; font-size: 12px; color: #16a34a;">
                                ✓ Imagem carregada com sucesso
                            </div>
                        </div>
                    `;
                }
            };
            reader.readAsDataURL(file);
        }
    }

    // Confirmar exclusão
    confirmarDelete(id) {
        const produto = this.obterProduto(id);
        if (confirm(`Tem certeza que deseja deletar "${produto.nome}"?`)) {
            this.deletarProduto(id);
            alert('Produto deletado com sucesso!');
            this.atualizarListaProdutos();
        }
    }

    // Atualizar lista de produtos
    atualizarListaProdutos() {
        const adminPanel = document.querySelector('.admin-panel');
        if (adminPanel) {
            const novoHTML = this.renderizarPainelAdmin();
            adminPanel.outerHTML = novoHTML;
        }
    }

    // Exportar produtos para JSON
    exportarProdutos() {
        const produtos = this.listarProdutos();
        const json = JSON.stringify(produtos.map(p => p.toJSON()), null, 2);
        
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'produtos_ombelamarket.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    // Importar produtos de JSON
    importarProdutos(jsonString) {
        try {
            const dados = JSON.parse(jsonString);
            dados.forEach(produtoData => {
                const produto = new Produto(
                    null,
                    produtoData.nome,
                    produtoData.descricao,
                    produtoData.preco,
                    produtoData.categoria,
                    produtoData.imagem,
                    produtoData.estrelas
                );
                this.produtoRepository.adicionar(produto);
            });
            alert('Produtos importados com sucesso!');
            this.atualizarListaProdutos();
        } catch (error) {
            alert('Erro ao importar produtos: ' + error.message);
        }
    }
}

// Exportar para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminController;
}
