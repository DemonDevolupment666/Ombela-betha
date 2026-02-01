// Model: Produto
class Produto {
    constructor(id, nome, descricao, preco, categoria, imagem, estrelas = 4) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.categoria = categoria;
        this.imagem = imagem;
        this.estrelas = estrelas;
    }

    // Formatar preço em Kwanzas
    getPrecoFormatado() {
        return `AO ${this.preco.toLocaleString('pt-AO', { minimumFractionDigits: 2 })},00`;
    }

    // Gerar HTML das estrelas
    getEstrelasHTML() {
        const estrelasCompletas = '★'.repeat(this.estrelas);
        const estrelasVazias = '☆'.repeat(5 - this.estrelas);
        return estrelasCompletas + estrelasVazias;
    }

    // Converter para objeto simples
    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            descricao: this.descricao,
            preco: this.preco,
            categoria: this.categoria,
            imagem: this.imagem,
            estrelas: this.estrelas
        };
    }

    // Criar produto a partir de objeto
    static fromJSON(obj) {
        return new Produto(
            obj.id,
            obj.nome,
            obj.descricao,
            obj.preco,
            obj.categoria,
            obj.imagem,
            obj.estrelas
        );
    }
}

// Exportar para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Produto;
}
