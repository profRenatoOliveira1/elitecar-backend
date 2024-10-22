import { DatabaseModel } from "./DatabaseModel";

// armazenei o pool de conexões
const database = new DatabaseModel().pool;

/**
 * Classe que representa um carro.
 */
export class Carro {

    /* Atributos */
    /* Identificador do carro */
    private idCarro: number = 0;
    /* marca do carro */
    private marca: string;
    /* modelo do carro */
    private modelo: string;
    /* ano de fabrição do carro */
    private ano: number;
    /* cor do carro */
    private cor: string;

    /**
     * Construtor da classe Carro
     * 
     * @param marca Marca do carro
     * @param modelo Modelo do carro
     * @param ano Ano de fabricação do carro
     * @param cor Cor do carro
     */
    constructor(
        marca: string,
        modelo: string,
        ano: number,
        cor: string
    ) {
        this.marca = marca;
        this.modelo = modelo;
        this.ano = ano;
        this.cor = cor;
    }

    /* Métodos get e set */
    /**
     * Recupera o identificador do carro
     * @returns o identificador do carro
     */
    public getIdCarro(): number {
        return this.idCarro;
    }

    /**
     * Atribui um valor ao identificador do carro
     * @param idCarro novo identificado do carro
     */
    public setIdCarro(idCarro: number): void {
        this.idCarro = idCarro;
    }

    /**
     * Retorna a marca do carro.
     *
     * @returns {string} A marca do carro.
     */
    public getMarca(): string {
        return this.marca;
    }

    /**
     * Define a marca do carro.
     * 
     * @param marca - A marca do carro a ser definida.
     */
    public setMarca(marca: string): void {
        this.marca = marca;
    }

    /**
     * Retorna o modelo do carro.
     *
     * @returns {string} O modelo do carro.
     */
    public getModelo(): string {
        return this.modelo;
    }

    /**
     * Define o modelo do carro.
     *
     * @param modelo - O nome do modelo do carro.
     */
    public setModelo(modelo: string): void {
        this.modelo = modelo;
    }

    /**
     * Retorna o ano do carro.
     *
     * @returns O ano do carro.
     */
    public getAno(): number {
        return this.ano;
    }

    /**
     * Define o ano do carro.
     * 
     * @param ano - O ano a ser definido para o carro.
     */
    public setAno(ano: number): void {
        this.ano = ano;
    }

    /**
     * Retorna a cor do carro.
     *
     * @returns {string} A cor do carro.
     */
    public getCor(): string {
        return this.cor;
    }

    /**
     * Define a cor do carro.
     * 
     * @param cor - A nova cor do carro.
     */
    public setCor(cor: string): void {
        this.cor = cor;
    }

    /**
     * Busca e retorna uma lista de carros do banco de dados.
     * @returns Um array de objetos do tipo `Carro` em caso de sucesso ou `null` se ocorrer um erro durante a consulta.
     * 
     * - A função realiza uma consulta SQL para obter todas as informações da tabela "carro".
     * - Os dados retornados do banco de dados são usados para instanciar objetos da classe `Carro`.
     * - Cada carro é adicionado a uma lista que será retornada ao final da execução.
     * - Se houver falha na consulta ao banco, a função captura o erro, exibe uma mensagem no console e retorna `null`.
     */
    static async listagemCarros(): Promise<Array<Carro> | null> {
        // objeto para armazenar a lista de carros
        const listaDeCarros: Array<Carro> = [];

        try {
            // query de consulta ao banco de dados
            const querySelectCarro = `SELECT * FROM carro;`;

            // fazendo a consulta e guardando a resposta
            const respostaBD = await database.query(querySelectCarro);

            // usando a resposta para instanciar um objeto do tipo carro
            respostaBD.rows.forEach((linha) => {
                // instancia (cria) objeto carro
                const novoCarro = new Carro(
                    linha.marca,
                    linha.modelo,
                    linha.ano,
                    linha.cor
                );

                // atribui o ID objeto
                novoCarro.setIdCarro(linha.id_carro);

                // adiciona o objeto na lista
                listaDeCarros.push(novoCarro);
            });

            // retorna a lista de carros
            return listaDeCarros;
        } catch (error) {
            console.log('Erro ao buscar lista de carros');
            return null;
        }
    }

    /**
     * Realiza o cadastro de um carro no banco de dados.
     * 
     * Esta função recebe um objeto do tipo `Carro` e insere seus dados (marca, modelo, ano e cor)
     * na tabela `carro` do banco de dados. O método retorna um valor booleano indicando se o cadastro 
     * foi realizado com sucesso.
     * 
     * @param {Carro} carro - Objeto contendo os dados do carro que será cadastrado. O objeto `Carro`
     *                        deve conter os métodos `getMarca()`, `getModelo()`, `getAno()` e `getCor()`
     *                        que retornam os respectivos valores do carro.
     * @returns {Promise<boolean>} - Retorna `true` se o carro foi cadastrado com sucesso e `false` caso contrário.
     *                               Em caso de erro durante o processo, a função trata o erro e retorna `false`.
     * 
     * @throws {Error} - Se ocorrer algum erro durante a execução do cadastro, uma mensagem de erro é exibida
     *                   no console junto com os detalhes do erro.
     */
    static async cadastroCarro(carro: Carro): Promise<boolean> {
        try {
            // query para fazer insert de um carro no banco de dados
            const queryInsertCarro = `INSERT INTO carro (marca, modelo, ano, cor)
                                        VALUES
                                        ('${carro.getMarca()}', 
                                        '${carro.getModelo()}', 
                                        ${carro.getAno()}, 
                                        '${carro.getCor()}')
                                        RETURNING id_carro;`;

            // executa a query no banco e armazena a resposta
            const respostaBD = await database.query(queryInsertCarro);

            // verifica se a quantidade de linhas modificadas é diferente de 0
            if (respostaBD.rowCount != 0) {
                console.log(`Carro cadastrado com sucesso! ID do carro: ${respostaBD.rows[0].id_carro}`);
                // true significa que o cadastro foi feito
                return true;
            }
            // false significa que o cadastro NÃO foi feito.
            return false;

            // tratando o erro
        } catch (error) {
            // imprime outra mensagem junto com o erro
            console.log('Erro ao cadastrar o carro. Verifique os logs para mais detalhes.');
            // imprime o erro no console
            console.log(error);
            // retorno um valor falso
            return false;
        }
    }
}