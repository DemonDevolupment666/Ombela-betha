# Sistema MVC - Ombela Market

## 📋 Documentação Completa

Este documento descreve a arquitetura MVC (Model-View-Controller) implementada para o e-commerce Ombela Market.

---

## 🏗️ Arquitetura do Sistema

### **Estrutura de Pastas**
```
/
├── models/
│   ├── Produto.js              # Modelo de dados do produto
│   ├── Carrinho.js             # Modelo de dados do carrinho
│   └── ProdutoRepository.js    # Repositório de produtos
├── controllers/
│   ├── AppController.js        # Controller principal da aplicação
│   └── AdminController.js      # Controller de administração
├── styles/
│   └── global.css              # Estilos CSS
├── index.html                  # Página inicial
├── produtos.html               # Página de produtos
└── admin.html                  # Painel administrativo
```

---

## 📦 Models (Modelos)

### **1. Produto.js**

**Responsabilidade:** Representa um produto individual no sistema.

**Propriedades:**
- `id` - Identificador único
- `nome` - Nome do produto
- `descricao` - Descrição detalhada
- `preco` - Preço em Kwanzas
- `categoria` - Categoria do produto (eletrónicos, moda, alimentação)
- `imagem` - URL da imagem
- `estrelas` - Avaliação (1-5)

**Métodos principais:**
```javascript
getPrecoFormatado()     // Retorna preço formatado: "AO 74.000,00"
getEstrelasHTML()       // Retorna HTML das estrelas: "★★★★☆"
toJSON()                // Converte para objeto simples
fromJSON(obj)           // Cria produto a partir de objeto
```

**Exemplo de uso:**
```javascript
const produto = new Produto(
    1,
    'iPhone 17 Pro Max',
    'Smartphone Apple última geração',
    2400000,
    'eletronicos',
    'images/product-8.png',
    5
);

console.log(produto.getPrecoFormatado()); // "AO 2.400.000,00"
```

---

### **2. Carrinho.js**

**Responsabilidade:** Gerencia o carrinho de compras do usuário.

**Estrutura interna:**
```javascript
{
    itens: [
        {
            produto: Produto,
            quantidade: Number
        }
    ]
}
```

**Métodos principais:**
```javascript
adicionarProduto(produto, quantidade)    // Adiciona produto ao carrinho
removerProduto(produtoId)                // Remove produto do carrinho
atualizarQuantidade(produtoId, qtd)      // Atualiza quantidade
limpar()                                 // Limpa todos os itens
getTotalItens()                          // Total de itens no carrinho
getSubtotal()                            // Subtotal dos produtos
getTaxaEntrega()                         // Taxa de entrega (5%)
getTotal()                               // Total final (subtotal + taxa)
salvarNoLocalStorage()                   // Persiste no navegador
carregarDoLocalStorage()                 // Carrega do navegador
```

**Exemplo de uso:**
```javascript
const carrinho = new Carrinho();
carrinho.adicionarProduto(produto, 2);
console.log(carrinho.getTotal()); // Calcula total com taxa de entrega
```

---

### **3. ProdutoRepository.js**

**Responsabilidade:** Gerencia a coleção de produtos (CRUD).

**Métodos principais:**
```javascript
adicionar(produto)                    // Adiciona novo produto
obterTodos()                          // Retorna todos os produtos
obterPorId(id)                        // Busca produto por ID
buscar(termo)                         // Busca por nome/descrição
filtrarPorCategoria(categoria)        // Filtra por categoria
ordenarPorPreco(ordem)                // Ordena por preço (asc/desc)
atualizar(id, dadosAtualizados)       // Atualiza produto
remover(id)                           // Remove produto
salvar()                              // Persiste no localStorage
```

**Produtos iniciais:**
O repositório é inicializado automaticamente com 8 produtos padrão:
- Ventiladores CPU (AO 74.000)
- Essenciais Game (AO 299.000)
- Playstation (AO 456.000)
- iPhone 17 Pro Max (AO 2.400.000)
- Cadeira Ergonômica Gamer (AO 185.000)
- Teclado Mecânico RGB (AO 95.000)
- Mouse Gamer Pro (AO 68.000)
- Headset Premium (AO 125.000)

---

## 🎮 Controllers (Controladores)

### **1. AppController.js**

**Responsabilidade:** Controller principal que gerencia toda a aplicação frontend.

**Principais funcionalidades:**

#### **Inicialização**
```javascript
inicializar()           // Inicializa a aplicação
configurarEventos()     // Configura listeners de eventos
```

#### **Renderização**
```javascript
renderizarProdutos(produtos)              // Renderiza grid de produtos
criarCardProduto(produto)                 // Cria card individual
renderizarItensCarrinho()                 // Renderiza itens no modal
atualizarCarrinhoUI()                     // Atualiza contador do carrinho
```

#### **Filtragem e Busca**
```javascript
filtrarProdutos()       // Aplica filtros de busca, categoria e preço
```

#### **Carrinho**
```javascript
adicionarAoCarrinho(produtoId)           // Adiciona produto
removerDoCarrinho(produtoId)             // Remove produto
abrirCarrinho()                          // Abre modal
fecharCarrinho()                         // Fecha modal
processarPagamento()                     // Simula compra
```

#### **Notificações**
```javascript
mostrarNotificacao(mensagem, tipo)       // Mostra notificação toast
```

**Exemplo de uso:**
```javascript
const app = new AppController();
app.inicializar();
```

---

### **2. AdminController.js**

**Responsabilidade:** Gerencia o painel administrativo de produtos.

**Principais funcionalidades:**

#### **CRUD de Produtos**
```javascript
criarProduto(dados)                      // Cria novo produto
editarProduto(id, dados)                 // Edita produto existente
deletarProduto(id)                       // Remove produto
obterProduto(id)                         // Obtém para edição
listarProdutos()                         // Lista todos
```

#### **Interface Admin**
```javascript
renderizarPainelAdmin()                  // Renderiza painel completo
mostrarFormularioNovo()                  // Exibe form vazio
editarProdutoForm(id)                    // Exibe form preenchido
renderizarFormulario(produto)            // Renderiza formulário
salvarProduto(event, id)                 // Salva (criar/editar)
cancelarForm()                           // Fecha formulário
confirmarDelete(id)                      // Confirmação de exclusão
atualizarListaProdutos()                 // Atualiza tabela
```

#### **Importação/Exportação**
```javascript
exportarProdutos()                       // Baixa JSON
importarProdutos(jsonString)             // Carrega JSON
```

---

## 🎨 Views (Visualizações)

### **index.html**
- Página inicial com banner
- Grid de produtos mais vendidos
- Grid de produtos tecnológicos
- Banner promocional
- Testemunhos

### **produtos.html**
- Lista completa de produtos
- Sistema de busca e filtros
- Ordenação por preço

### **admin.html**
- Painel administrativo
- Estatísticas (total produtos, categorias, preço médio)
- Tabela de produtos com ações (editar/deletar)
- Formulário de criação/edição
- Importação/Exportação JSON

---

## 🔄 Fluxo de Dados

### **1. Adicionar Produto ao Carrinho**
```
Usuário clica em "Adicionar"
    ↓
AppController.adicionarAoCarrinho(id)
    ↓
Busca produto no ProdutoRepository
    ↓
Carrinho.adicionarProduto(produto)
    ↓
Salva no localStorage
    ↓
Atualiza UI (contador, modal)
    ↓
Mostra notificação
```

### **2. Processar Pagamento**
```
Usuário clica em "Pagar"
    ↓
AppController.processarPagamento()
    ↓
Valida carrinho não vazio
    ↓
Mostra confirmação
    ↓
Simula processamento (1.5s)
    ↓
Carrinho.limpar()
    ↓
Atualiza UI
    ↓
Mostra sucesso
```

### **3. Criar/Editar Produto (Admin)**
```
Admin preenche formulário
    ↓
AdminController.salvarProduto(event, id)
    ↓
Valida dados
    ↓
Se id existe: ProdutoRepository.atualizar()
Se id null: ProdutoRepository.adicionar()
    ↓
Salva no localStorage
    ↓
Atualiza tabela
    ↓
Mostra confirmação
```

---

## 💾 Persistência de Dados

### **localStorage Keys:**
- `ombelamarket_produtos` - Array de produtos
- `ombelamarket_carrinho` - Itens do carrinho

### **Estrutura JSON - Produtos:**
```json
[
    {
        "id": 1,
        "nome": "iPhone 17 Pro Max",
        "descricao": "Smartphone Apple",
        "preco": 2400000,
        "categoria": "eletronicos",
        "imagem": "images/product-8.png",
        "estrelas": 5
    }
]
```

### **Estrutura JSON - Carrinho:**
```json
{
    "itens": [
        {
            "produto": { /* objeto produto */ },
            "quantidade": 2
        }
    ]
}
```

---

## 🚀 Como Usar

### **1. Instalação**
```bash
# Copiar todos os arquivos para o servidor web
# Garantir estrutura de pastas correta
```

### **2. Uso no Frontend**

**Inicializar aplicação (index.html, produtos.html):**
```html
<script src="models/Produto.js"></script>
<script src="models/Carrinho.js"></script>
<script src="models/ProdutoRepository.js"></script>
<script src="controllers/AppController.js"></script>

<script>
    let app;
    document.addEventListener('DOMContentLoaded', function() {
        app = new AppController();
        app.inicializar();
    });
</script>
```

**Inicializar admin (admin.html):**
```html
<script src="models/Produto.js"></script>
<script src="models/ProdutoRepository.js"></script>
<script src="controllers/AdminController.js"></script>

<script>
    let adminController;
    let produtoRepository;
    
    document.addEventListener('DOMContentLoaded', function() {
        produtoRepository = new ProdutoRepository();
        adminController = new AdminController(produtoRepository);
        // Renderizar painel...
    });
</script>
```

### **3. Adicionar Novo Produto via Admin**
1. Acesse `admin.html`
2. Clique em "+ Adicionar Novo Produto"
3. Preencha o formulário
4. Clique em "Salvar"

### **4. Realizar Compra**
1. Navegue pelos produtos
2. Clique em "Adicionar" nos produtos desejados
3. Clique no ícone do carrinho (🛒)
4. Revise os itens
5. Clique em "Pagar"
6. Confirme a compra

---

## 🔧 Funcionalidades Implementadas

✅ **CRUD completo de produtos**
✅ **Carrinho de compras persistente**
✅ **Busca e filtros (nome, categoria, preço)**
✅ **Ordenação por preço**
✅ **Simulação de pagamento**
✅ **Painel administrativo**
✅ **Importação/Exportação JSON**
✅ **Notificações toast**
✅ **Persistência em localStorage**
✅ **Cálculo automático de taxa de entrega**
✅ **Responsivo (mobile-friendly)**

---

## 📊 Estatísticas do Admin

O painel administrativo exibe:
- **Total de Produtos**: Número total cadastrado
- **Categorias**: Número de categorias únicas
- **Preço Médio**: Média de preços dos produtos

---

## 🎯 Próximas Melhorias Sugeridas

1. **Autenticação de usuários**
2. **Backend real (Node.js/Express)**
3. **Banco de dados (MongoDB/PostgreSQL)**
4. **Sistema de pagamento real (Stripe/PayPal)**
5. **Upload de imagens**
6. **Sistema de avaliações**
7. **Histórico de pedidos**
8. **Notificações por email**
9. **Integração com API de envios**
10. **Dashboard de vendas**

---

## 📝 Notas Importantes

- Todos os dados são armazenados no `localStorage` do navegador
- Os dados persistem entre sessões
- Para resetar, limpe o localStorage do navegador
- Não há autenticação - qualquer um pode acessar o admin
- Os preços estão em Kwanzas Angolanos (AO)
- Taxa de entrega fixa de 5% do subtotal

---

## 🐛 Solução de Problemas

**Produtos não aparecem:**
- Verifique o console do navegador
- Confirme que os scripts estão carregando na ordem correta
- Limpe o cache do navegador

**Carrinho não salva:**
- Verifique se localStorage está habilitado
- Confirme que não está em modo anônimo/privado

**Admin não funciona:**
- Verifique se todos os scripts estão carregando
- Confirme a ordem dos scripts no HTML

---

## 👨‍💻 Desenvolvido para

**Ombela Market**
Marketplace e serviço de entregas - Angola

**Contato:**
- Email: contato@ombelamarket.com
- Telefone: +244 936 408 070

---

## 📄 Licença

© 2026 Ombela Market — Todos os direitos reservados
