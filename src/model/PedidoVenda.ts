import { DatabaseModel } from "./DatabaseModel";

const database = new DatabaseModel().pool;

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
        this.idCarro = idCarro;
        this.idCliente = idCliente;
        this.dataPedido = dataPedido;
        this.valorPedido = valorPedido;
    }

    /**
     * Obtém o identificador do pedido.
     * @returns O identificador do pedido.
     */
    public getIdPedido(): number {
        return this.idPedido;
    }

    /**
     * Define o identificador do pedido.
     * @param idPedido - Novo identificador do pedido.
     */
    public setIdPedido(idPedido: number): void {
        this.idPedido = idPedido;
    }

    /**
     * Obtém o identificador do carro.
     * @returns O identificador do carro.
     */
    public getIdCarro(): number {
        return this.idCarro;
    }

    /**
     * Define o identificador do carro.
     * @param idCarro - Novo identificador do carro.
     */
    public setIdCarro(idCarro: number): void {
        this.idCarro = idCarro;
    }

    /**
     * Obtém o identificador do cliente.
     * @returns O identificador do cliente.
     */
    public getIdCliente(): number {
        return this.idCliente;
    }

    /**
     * Define o identificador do cliente.
     * @param idCliente - Novo identificador do cliente.
     */
    public setIdCliente(idCliente: number): void {
        this.idCliente = idCliente;
    }

    /**
     * Obtém a data do pedido.
     * @returns A data do pedido.
     */
    public getDataPedido(): Date {
        return this.dataPedido;
    }

    /**
     * Define a data do pedido.
     * @param dataPedido - Nova data do pedido.
     */
    public setDataPedido(dataPedido: Date): void {
        this.dataPedido = dataPedido;
    }

    /**
     * Obtém o valor do pedido.
     * @returns O valor do pedido.
     */
    public getValorPedido(): number {
        return this.valorPedido;
    }

    /**
     * Define o valor do pedido.
     * @param valorPedido - Novo valor do pedido.
     */
    public setValorPedido(valorPedido: number): void {
        this.valorPedido = valorPedido;
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
        const listaDePedidos: Array<PedidoVenda> = [];

        try {
            const querySelectPedidos = `SELECT * FROM pedido_venda;`;
            const respostaBD = await database.query(querySelectPedidos);

            respostaBD.rows.forEach((linha) => {
                const novoPedidoVenda = new PedidoVenda(
                    linha.id_carro,
                    linha.id_cliente,
                    linha.data_pedido,
                    parseFloat(linha.valor_pedido)
                );

                novoPedidoVenda.setIdPedido(linha.id_pedido);

                listaDePedidos.push(novoPedidoVenda);
            });

            return listaDePedidos;
        } catch (error) {
            console.log('Erro ao buscar lista de pedidos');
            return null;
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
        try {
            const queryInsertPedido = `INSERT INTO pedido_venda (id_cliente, id_carro, data_pedido, valor_pedido)
                                        VALUES
                                        (${idCliente}, ${idCarro}, '${dataPedido}', ${valorPedido})
                                        RETURNING id_pedido;`;

            const respostaBD = await database.query(queryInsertPedido);
            if(respostaBD.rowCount != 0) {
                console.log(`Pedido de venda cadastrado com sucesso. ID pedido: ${respostaBD.rows[0].id_pedido}`);
                return true;
            }

            return false;
        } catch (error) {
            console.log('Erro ao cadastrar o pedido. Consulte os logs para mais detalhes.');
            console.log(error);
            return false;
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
        try {
            const queryDeletePedidoVenda = `DELETE FROM pedido_venda WHERE id_pedido=${idPedido};`;

            const respostaBD = await database.query(queryDeletePedidoVenda);

            if(respostaBD.rowCount != 0) {
                console.log(`Pedido de venda removido com sucesso! ID: ${idPedido}.`);
                return true;
            }

            return false;
        } catch (error) {
            console.log('Erro ao remover o pedido. Consulte os logs para mais detalhes.');
            console.log(error);
            return false;
        }
    }
}