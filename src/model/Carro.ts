import { DatabaseModel } from "./DatabaseModel"; // Importa a classe DatabaseModel para realizar a conexão com o banco de dados

const database = new DatabaseModel().pool; // Inicializa o pool de conexões com o banco de dados

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
        this.marca = marca; // atribui a marca do carro
        this.modelo = modelo; // atribui o modelo do carro
        this.ano = ano; // atribui o ano de fabricação do carro
        this.cor = cor; // atribui a cor do carro
    }

    /* Métodos get e set */
    /**
     * Recupera o identificador do carro
     * @returns o identificador do carro
     */
    public getIdCarro(): number {
        return this.idCarro; // retorna o identificador do carro
    }

    /**
     * Atribui um valor ao identificador do carro
     * @param idCarro novo identificado do carro
     */
    public setIdCarro(idCarro: number): void {
        this.idCarro = idCarro; // atribui o identificador do carro
    }

    /**
     * Retorna a marca do carro.
     *
     * @returns {string} A marca do carro.
     */
    public getMarca(): string {
        return this.marca; // retorna a marca do carro
    }

    /**
     * Define a marca do carro.
     * 
     * @param marca - A marca do carro a ser definida.
     */
    public setMarca(marca: string): void {
        this.marca = marca; // atribui a marca do carro
    }

    /**
     * Retorna o modelo do carro.
     *
     * @returns {string} O modelo do carro.
     */
    public getModelo(): string {
        return this.modelo; // retorna o modelo do carro
    }

    /**
     * Define o modelo do carro.
     *
     * @param modelo - O nome do modelo do carro.
     */
    public setModelo(modelo: string): void {
        this.modelo = modelo; // atribui o modelo do carro
    }

    /**
     * Retorna o ano do carro.
     *
     * @returns O ano do carro.
     */
    public getAno(): number {
        return this.ano; // retorna o ano do carro
    }

    /**
     * Define o ano do carro.
     * 
     * @param ano - O ano a ser definido para o carro.
     */
    public setAno(ano: number): void {
        this.ano = ano; // atribui o ano do carro
    }

    /**
     * Retorna a cor do carro.
     *
     * @returns {string} A cor do carro.
     */
    public getCor(): string {
        return this.cor; // retorna a cor do carro
    }

    /**
     * Define a cor do carro.
     * 
     * @param cor - A nova cor do carro.
     */
    public setCor(cor: string): void {
        this.cor = cor; // atribui a cor do carro
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
        const listaDeCarros: Array<Carro> = []; // cria uma lista de carros vazia

        try { // tenta executar o código
            const querySelectCarro = `SELECT * FROM carro;`; // cria uma query para selecionar todos os carros do banco de dados

            const respostaBD = await database.query(querySelectCarro); // executa a query no banco de dados

            respostaBD.rows.forEach((linha) => { // para cada linha retornada
                const novoCarro = new Carro( // cria um novo objeto do tipo Carro
                    linha.marca, // atribui a marca do carro
                    linha.modelo, // atribui o modelo do carro
                    linha.ano, // atribui o ano de fabricação do carro
                    linha.cor // atribui a cor do carro
                );

                novoCarro.setIdCarro(linha.id_carro); // atribui o ID do carro

                listaDeCarros.push(novoCarro); // adiciona o carro na lista
            });

            return listaDeCarros; // retorna a lista de carros
        } catch (error) { // em caso de erro
            console.log('Erro ao buscar lista de carros. Verifique os logs para mais detalhes.'); // exibe uma mensagem de erro
            console.log(error); // exibe o erro
            return null; // retorna nulo
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
        try { // tenta executar o código
            // cria uma query para inserir um novo carro no banco de dados
            const queryInsertCarro = `INSERT INTO carro (marca, modelo, ano, cor)
                                        VALUES
                                        ('${carro.getMarca()}', 
                                        '${carro.getModelo()}', 
                                        ${carro.getAno()}, 
                                        '${carro.getCor()}')
                                        RETURNING id_carro;`;

            const respostaBD = await database.query(queryInsertCarro); // executa a query no banco de dados

            if (respostaBD.rowCount != 0) { // se a quantidade de linhas modificadas for diferente de 0
                console.log(`Carro cadastrado com sucesso! ID do carro: ${respostaBD.rows[0].id_carro}`); // exibe uma mensagem de sucesso
                return true; // retorna true, indicando que o cadastro foi feito
            }

            return false; // retorna false, indicando que o cadastro não foi feito

        } catch (error) { // em caso de erro
            console.log('Erro ao cadastrar o carro. Verifique os logs para mais detalhes.'); // exibe uma mensagem de erro
            console.log(error); // exibe o erro
            return false; // retorna false, indicando que o cadastro não foi feito
        }
    }

    /**
     * Remove um carro do banco de dados com base no ID fornecido.
     *
     * @param {number} idCarro - O ID do carro a ser removido.
     * @returns {Promise<boolean>} - Retorna uma promessa que resolve para true se o carro foi removido com sucesso, ou false caso contrário.
     *
     * @throws {Error} - Lança um erro se ocorrer um problema durante a remoção do carro.
     */
    static async removerCarro(idCarro: number): Promise<boolean> {
        try { // tenta executar o código
            const queryDeleteCarro = `DELETE FROM carro WHERE id_carro = ${idCarro}`; // cria uma query para remover um carro do banco de dados
        
            const respostaBD = await database.query(queryDeleteCarro); // executa a query no banco de dados

            if(respostaBD.rowCount != 0) { // se a quantidade de linhas modificadas for diferente de 0
                console.log(`Carro removido com sucesso. ID removido: ${idCarro}`); // exibe uma mensagem de sucesso
                return true; // retorna true, indicando que a remoção foi feita
            }

            return false; // retorna false, indicando que a remoção não foi feita
        } catch (error) { // em caso de erro
            console.log(`Erro ao remover carro. Verifique os logs para mais detalhes.`); // exibe uma mensagem de erro
            console.log(error); // exibe o erro
            return false; // retorna false, indicando que a remoção não foi feita
        }
    }

    /**
     * Atualiza as informações de um carro no banco de dados.
     *
     * @param {Carro} carro - O objeto Carro contendo as informações atualizadas.
     * @returns {Promise<boolean>} - Retorna uma Promise que resolve para true se a atualização foi bem-sucedida, ou false caso contrário.
     *
     * @throws {Error} - Lança um erro se ocorrer algum problema durante a execução da query.
     */
    static async atualizarCarro(carro: Carro): Promise<boolean> {
        try { // tenta executar o código
            // cria a query de update a ser executada no banco de dados
            const queryUpdateCarro = `UPDATE carro SET
                                        marca = '${carro.getMarca()}',
                                        modelo = '${carro.getModelo()}',
                                        ano = ${carro.getAno()},
                                        cor = '${carro.getCor()}'
                                        WHERE id_carro = ${carro.getIdCarro()};`;

            const respostaBD = await database.query(queryUpdateCarro);  // executa a query no banco de dados

            if(respostaBD.rowCount != 0) { // se a quantidade de linhas modificadas for diferente de 0
                console.log(`Carro atualizado com sucesso! ID: ${carro.getIdCarro()}`); // exibe uma mensagem de sucesso
                return true; // retorna true, indicando que a query foi executada com sucesso
            }

            return false; // retorna false, indicando que a query não foi executada com sucesso
            
        } catch (error) { // em caso de erro
            console.log(`Erro ao atualizar o carro. Verifique os logs para mais detalhes.`);    // exibe uma mensagem de erro
            console.log(error); // exibe o erro
            return false; // retorna false, indicando que a query não foi executada com sucesso
        }
    }
}