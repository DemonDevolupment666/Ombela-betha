# 🛒 Ombela Market - Sistema MVC

Sistema completo de e-commerce com arquitetura MVC (Model-View-Controller) para gerenciamento de produtos e simulação de compras.

## 🚀 Início Rápido

### 1. Estrutura de Arquivos

Certifique-se de ter a seguinte estrutura:

```
seu-projeto/
├── models/
│   ├── Produto.js
│   ├── Carrinho.js
│   └── ProdutoRepository.js
├── controllers/
│   ├── AppController.js
│   └── AdminController.js
├── styles/
│   └── global.css
├── images/
│   └── (suas imagens)
├── index.html
├── produtos.html
├── admin.html
├── DOCUMENTACAO.md
└── README.md
```

### 2. Abrir no Navegador

1. Abra `index.html` no navegador
2. O sistema iniciará automaticamente com produtos padrão

### 3. Funcionalidades Principais

#### 🏠 **Página Inicial (index.html)**
- Visualizar produtos em destaque
- Buscar produtos
- Adicionar ao carrinho
- Ver carrinho flutuante

#### 📦 **Página de Produtos (produtos.html)**
- Lista completa de produtos
- Filtros por categoria
- Ordenação por preço
- Busca por nome

#### ⚙️ **Painel Admin (admin.html)**
- Criar novos produtos
- Editar produtos existentes
- Deletar produtos
- Visualizar estatísticas
- Exportar/Importar produtos (JSON)

## 📖 Exemplos de Uso

### Adicionar Produto ao Carrinho

```javascript
// O botão já está configurado, basta clicar em "Adicionar"
// Ou programaticamente:
app.adicionarAoCarrinho(produtoId);
```

### Criar Novo Produto (Admin)

1. Acesse `admin.html`
2. Clique em "+ Adicionar Novo Produto"
3. Preencha:
   - Nome: "Notebook Gamer"
   - Descrição: "Laptop de alta performance"
   - Preço: 1500000
   - Categoria: eletronicos
   - Imagem: images/notebook.png
   - Estrelas: 5
4. Clique em "Salvar"

### Processar Compra

1. Adicione produtos ao carrinho
2. Clique no ícone 🛒
3. Revise os itens no modal
4. Clique em "Pagar"
5. Confirme a compra

## 🔑 Recursos Principais

| Recurso | Descrição |
|---------|-----------|
| **CRUD Produtos** | Criar, Ler, Atualizar, Deletar produtos |
| **Carrinho** | Adicionar, remover, atualizar quantidades |
| **Busca** | Pesquisar por nome ou descrição |
| **Filtros** | Filtrar por categoria e ordenar por preço |
| **Persistência** | Dados salvos no localStorage |
| **Admin** | Painel completo de administração |
| **Estatísticas** | Total produtos, categorias, preço médio |
| **Import/Export** | Backup e restauração via JSON |

## 💡 Dicas Úteis

### Resetar Dados
```javascript
// No console do navegador:
localStorage.clear();
location.reload();
```

### Verificar Produtos
```javascript
// No console do navegador:
const repo = new ProdutoRepository();
console.log(repo.obterTodos());
```

### Verificar Carrinho
```javascript
// No console do navegador:
const carrinho = new Carrinho();
console.log(carrinho.getItens());
```

## 🎯 Casos de Uso

### Usuário Comprando
1. Navega pela página inicial
2. Usa filtros para encontrar produtos
3. Adiciona produtos ao carrinho
4. Revisa no carrinho flutuante
5. Finaliza a compra

### Administrador Gerenciando
1. Acessa painel admin
2. Vê estatísticas gerais
3. Cria novos produtos
4. Edita informações de produtos
5. Remove produtos descontinuados
6. Exporta dados para backup

## 📊 Cálculos Automáticos

### Carrinho
- **Subtotal**: Soma de (preço × quantidade) de todos itens
- **Taxa de Entrega**: 5% do subtotal
- **Total**: Subtotal + Taxa de Entrega

Exemplo:
```
Produto A: AO 100.000 × 2 = AO 200.000
Produto B: AO 50.000 × 1  = AO 50.000
Subtotal:                    AO 250.000
Taxa Entrega (5%):           AO 12.500
Total:                       AO 262.500
```

## 🔧 Solução Rápida de Problemas

| Problema | Solução |
|----------|---------|
| Produtos não aparecem | Limpe cache e recarregue |
| Carrinho não salva | Verifique se localStorage está habilitado |
| Admin não abre | Confirme ordem dos scripts no HTML |
| Imagens não carregam | Verifique caminho das imagens |

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 💻 Desktop
- 📱 Mobile
- 📋 Tablet

## ⚡ Performance

- Renderização rápida de produtos
- Filtros instantâneos
- Busca em tempo real
- Persistência eficiente

## 🎨 Customização

### Alterar Taxa de Entrega
```javascript
// Em models/Carrinho.js
getTaxaEntrega() {
    const subtotal = this.getSubtotal();
    return subtotal > 0 ? subtotal * 0.05 : 0; // Altere 0.05 para sua taxa
}
```

### Adicionar Nova Categoria
```javascript
// Nos filtros HTML
<option value="nova-categoria">Nova Categoria</option>
```

### Personalizar Notificações
```javascript
// Em controllers/AppController.js, método mostrarNotificacao()
// Altere cores, duração, posição, etc.
```

## 📚 Documentação Completa

Para detalhes técnicos completos, consulte `DOCUMENTACAO.md`

## 🌟 Recursos Avançados

### Exportar Produtos
```javascript
adminController.exportarProdutos();
// Baixa arquivo JSON com todos os produtos
```

### Importar Produtos
1. Prepare arquivo JSON com estrutura correta
2. Clique em "Importar Produtos"
3. Selecione o arquivo
4. Produtos são adicionados automaticamente

### Buscar Produtos
```javascript
const repo = new ProdutoRepository();
const resultados = repo.buscar('iphone');
console.log(resultados);
```

## 🎓 Aprendizado

Este projeto demonstra:
- ✅ Arquitetura MVC
- ✅ Programação Orientada a Objetos
- ✅ Manipulação do DOM
- ✅ localStorage API
- ✅ Event Handling
- ✅ Modularização de código
- ✅ CRUD Operations
- ✅ Estado da aplicação

## 🤝 Contribuindo

Para melhorar o sistema:
1. Identifique a área (Model/View/Controller)
2. Faça as alterações necessárias
3. Teste todas as funcionalidades
4. Documente as mudanças

## 📞 Suporte

**Ombela Market**
- 📧 Email: canelea8@gmail.com
- 📱 Telefone: +244 942615308
- 🌍 Angola

---

**Desenvolvido com ❤️ para Ombela Market**

© 2026 Ombela Market — Todos os direitos reservados
