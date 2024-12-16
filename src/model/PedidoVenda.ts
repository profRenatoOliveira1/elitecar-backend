import { DatabaseModel } from "./DatabaseModel"; // Importa a classe de conexão com o banco de dados

const database = new DatabaseModel().pool; // Instancia a classe de conexão com o banco de dados e obtém o pool de conexões

/**
 * Classe que representa um Pedido de Venda.
 */
export class PedidoVenda {
    /**
     * Identificador único do pedido de venda.
     */
    private idPedido: number = 0;
    /**
     * Identificador do carro associado ao pedido de venda.
     */
    private idCarro: number;
    /**
     * Identificador do cliente associado ao pedido de venda.
     */
    private idCliente: number;
    /**
     * Data do pedido de venda.
     */
    private dataPedido: Date;
    /**
     * Valor total do pedido.
     */
    private valorPedido: number;

    /**
     * Construtor da classe PedidoVenda.
     * @param idCarro - Identificador do carro.
     * @param idCliente - Identificador do cliente.
     * @param dataPedido - Data do pedido.
     * @param valorPedido - Valor do pedido.
     */
    constructor(idCarro: number, idCliente: number, dataPedido: Date, valorPedido: number) {
        this.idCarro = idCarro; // Atribui o valor do parâmetro ao atributo da classe
        this.idCliente = idCliente; // Atribui o valor do parâmetro ao atributo da classe
        this.dataPedido = dataPedido; // Atribui o valor do parâmetro ao atributo da classe
        this.valorPedido = valorPedido; // Atribui o valor do parâmetro ao atributo da classe
    }

    /**
     * Obtém o identificador do pedido.
     * @returns O identificador do pedido.
     */
    public getIdPedido(): number {
        return this.idPedido; // Retorna o valor do atributo
    }

    /**
     * Define o identificador do pedido.
     * @param idPedido - Novo identificador do pedido.
     */
    public setIdPedido(idPedido: number): void {
        this.idPedido = idPedido; // Atribui o valor do parâmetro ao atributo da classe
    }

    /**
     * Obtém o identificador do carro.
     * @returns O identificador do carro.
     */
    public getIdCarro(): number {
        return this.idCarro; // Retorna o valor do atributo
    }

    /**
     * Define o identificador do carro.
     * @param idCarro - Novo identificador do carro.
     */
    public setIdCarro(idCarro: number): void {
        this.idCarro = idCarro; // Atribui o valor do parâmetro ao atributo da classe
    }

    /**
     * Obtém o identificador do cliente.
     * @returns O identificador do cliente.
     */
    public getIdCliente(): number {
        return this.idCliente; // Retorna o valor do atributo
    }

    /**
     * Define o identificador do cliente.
     * @param idCliente - Novo identificador do cliente.
     */
    public setIdCliente(idCliente: number): void {
        this.idCliente = idCliente; // Atribui o valor do parâmetro ao atributo da classe
    }

    /**
     * Obtém a data do pedido.
     * @returns A data do pedido.
     */
    public getDataPedido(): Date {
        return this.dataPedido; // Retorna o valor do atributo
    }

    /**
     * Define a data do pedido.
     * @param dataPedido - Nova data do pedido.
     */
    public setDataPedido(dataPedido: Date): void {
        this.dataPedido = dataPedido; // Atribui o valor do parâmetro ao atributo da classe
    }

    /**
     * Obtém o valor do pedido.
     * @returns O valor do pedido.
     */
    public getValorPedido(): number {
        return this.valorPedido; // Retorna o valor do atributo
    }

    /**
     * Define o valor do pedido.
     * @param valorPedido - Novo valor do pedido.
     */
    public setValorPedido(valorPedido: number): void {
        this.valorPedido = valorPedido; // Atribui o valor do parâmetro ao atributo da classe
    }

    /**
     * Busca e retorna uma lista de pedidos de venda do banco de dados.
     * @returns Um array de objetos do tipo `PedidoVenda` em caso de sucesso ou `null` se ocorrer um erro durante a consulta.
     * 
     * - A função realiza uma consulta SQL para obter todos os registros da tabela "pedido_venda".
     * - Os dados retornados são utilizados para instanciar objetos da classe `PedidoVenda`.
     * - Cada pedido de venda instanciado é adicionado a uma lista que será retornada ao final da execução.
     * - Caso ocorra uma falha na consulta ao banco, a função captura o erro, exibe uma mensagem no console e retorna `null`.
     */
    static async listagemPedidos(): Promise<Array<PedidoVenda> | null> {
        const listaDePedidos: Array<any> = []; // Cria uma lista vazia para armazenar os pedidos de venda

        try { // Tenta executar o bloco de código a seguir
            // Consulta SQL para buscar todos os pedidos de venda
            const querySelectPedidos = `SELECT 
                                            pv.id_pedido,
                                            c.id_cliente,
                                            c.nome AS nome_cliente,
                                            ca.id_carro,
                                            ca.modelo AS nome_carro,
                                            ca.marca,
                                            pv.data_pedido,
                                            pv.valor_pedido
                                        FROM 
                                            pedido_venda pv
                                        JOIN 
                                            cliente c ON pv.id_cliente = c.id_cliente
                                        JOIN 
                                            carro ca ON pv.id_carro = ca.id_carro
                                        WHERE
                                            pv.situacao = TRUE
                                            AND c.situacao = TRUE
                                            AND ca.situacao = TRUE;
                                        `;

            const respostaBD = await database.query(querySelectPedidos); // Executa a consulta no banco de dados

            respostaBD.rows.forEach((linha) => { // Para cada linha retornada da consulta
                const pedidoVenda = { // Cria um objeto com os dados do pedido de venda
                    idPedido: linha.id_pedido, // Atribui o ID do pedido
                    idCliente: linha.id_cliente, // Atribui o ID do cliente
                    nomeCliente: linha.nome_cliente, // Atribui o nome do cliente
                    idCarro: linha.id_carro, // Atribui o ID do carro
                    modeloCarro: linha.nome_carro, // Atribui o modelo do carro
                    marcaCarro: linha.marca, // Atribui a marca do carro
                    dataPedido: linha.data_pedido, // Atribui a data do pedido
                    valorPedido: linha.valor_pedido // Atribui o valor do pedido
                }

                listaDePedidos.push(pedidoVenda); // Adiciona o objeto à lista de pedidos
            });

            return listaDePedidos; // Retorna a lista de pedidos
        } catch (error) { // Captura e trata erros
            console.log('Erro ao buscar lista de pedidos'); // Exibe uma mensagem de erro no console
            return null; // Retorna null
        }
    }

    /**
     * Cadastra um novo pedido de venda no banco de dados.
     * 
     * Esta função executa uma consulta SQL `INSERT` para registrar um novo pedido de venda com os dados fornecidos
     * como parâmetros. Caso o cadastro seja bem-sucedido, a função retorna `true` e exibe uma mensagem de confirmação 
     * com o ID do pedido. Se o cadastro falhar, retorna `false` e registra o erro no console.
     * 
     * @param {number} idCliente - O ID do cliente associado ao pedido.
     * @param {number} idCarro - O ID do carro associado ao pedido.
     * @param {Date} dataPedido - A data em que o pedido foi feito.
     * @param {number} valorPedido - O valor total do pedido.
     * 
     * @returns {Promise<boolean>} - Retorna `true` se o pedido for cadastrado com sucesso; caso contrário, retorna `false`.
     * 
     * @throws {Error} - Caso ocorra um erro durante a execução da consulta SQL, o erro é registrado no console.
     */
    static async cadastroPedido(idCliente: number, idCarro: number, dataPedido: Date, valorPedido: number): Promise<boolean> {
        try { // Tenta executar o bloco de código a seguir
            // Consulta SQL para inserir um novo pedido de venda
            const queryInsertPedido = `INSERT INTO pedido_venda (id_cliente, id_carro, data_pedido, valor_pedido)
                                        VALUES
                                        (${idCliente}, ${idCarro}, '${dataPedido}', ${valorPedido})
                                        RETURNING id_pedido;`;

            const respostaBD = await database.query(queryInsertPedido); // Executa a consulta no banco de dados
            if(respostaBD.rowCount != 0) { // verifica se a consulta retorna pelo menos uma linha
                console.log(`Pedido de venda cadastrado com sucesso. ID pedido: ${respostaBD.rows[0].id_pedido}`); // Exibe uma mensagem de confirmação se o pedido for cadastrado com sucesso
                return true; // Retorna true
            }

            return false; // Retorna false se a consulta não retornar nenhuma linha
        } catch (error) { // Captura e trata erros
            console.log('Erro ao cadastrar o pedido. Consulte os logs para mais detalhes.'); // Exibe uma mensagem de erro no console
            console.log(error); // Exibe o erro no console
            return false; // Retorna false
        }
    }

    /**
     * Remove um pedido de venda do banco de dados com base no ID fornecido.
     *
     * @param idPedido - O ID do pedido de venda a ser removido.
     * @returns Uma promessa que resolve para `true` se o pedido foi removido com sucesso, ou `false` caso contrário.
     *
     * @throws Lança um erro se ocorrer um problema durante a execução da consulta no banco de dados.
     */
    static async removerPedido(idPedido: number): Promise<boolean> {
        try { // Tenta executar o bloco de código a seguir
            const queryDeletePedidoVenda = `DELETE FROM pedido_venda WHERE id_pedido=${idPedido};`; // Consulta SQL para remover um pedido de venda

            const respostaBD = await database.query(queryDeletePedidoVenda); // Executa a consulta no banco de dados

            if(respostaBD.rowCount != 0) { // Verifica se a consulta retornou pelo menos uma linha
                console.log(`Pedido de venda removido com sucesso! ID: ${idPedido}.`); // Exibe uma mensagem de confirmação no console se o pedido for removido com sucesso
                return true; // Retorna true
            }

            return false; // Retorna false se a consulta não retornar nenhuma linha
        } catch (error) { // Captura e trata erros
            console.log('Erro ao remover o pedido. Consulte os logs para mais detalhes.'); // Exibe uma mensagem de erro no console
            console.log(error); // Exibe o erro no console
            return false; // Retorna false
        }
    }

    /**
     * Atualiza um pedido de venda no banco de dados.
     *
     * @param idPedidoVenda - O ID do pedido de venda a ser atualizado.
     * @param idCliente - O ID do cliente associado ao pedido.
     * @param idCarro - O ID do carro associado ao pedido.
     * @param dataPedido - A data do pedido.
     * @param valorPedido - O valor do pedido.
     * @returns Uma Promise que resolve para `true` se o pedido foi atualizado com sucesso, ou `false` caso contrário.
     * @throws Lança um erro se ocorrer um problema durante a atualização do pedido.
     */
    static async atualizarPedido(idPedidoVenda: number, idCliente: number, idCarro: number, dataPedido: Date, valorPedido: number): Promise<boolean> {
        try { // Tenta executar o bloco de código a seguir
            // Consulta SQL para atualizar um pedido de venda
            const queryUpdatePedidoVenda = `UPDATE pedido_venda SET
                                            id_cliente = ${idCliente},
                                            id_carro = ${idCarro},
                                            data_pedido = '${dataPedido}',
                                            valor_pedido = ${valorPedido}
                                            WHERE id_pedido = ${idPedidoVenda};`;

            const respostaBD = await database.query(queryUpdatePedidoVenda); // Executa a consulta no banco de dados

            if(respostaBD.rowCount != 0) { // Verifica se a consulta retornou pelo menos uma linha
                console.log(`Pedido atualizado com sucesso: ID: ${idPedidoVenda}`); // Exibe uma mensagem de confirmação no console se o pedido for atualizado com sucesso
                return true; // Retorna true
            }

            return false; // Retorna false se a consulta não retornar nenhuma linha
        } catch (error) { // Captura e trata erros
            console.log('Erro ao atualizar o pedido. Consulte os logs para mais detalhes.'); // Exibe uma mensagem de erro no console
            console.log(error); // Exibe o erro no console
            return false; // Retorna false
        }
    }
}