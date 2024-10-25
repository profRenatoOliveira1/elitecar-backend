import { Request, Response } from "express";
import { PedidoVenda } from "../model/PedidoVenda";

interface PedidoVendaDTO {
    idCliente: number,
    idCarro: number,
    dataPedido: Date,
    valorPedido: number
}

/**
 * A classe `PedidoVendaController` estende a classe `PedidoVenda` e é responsável por controlar as requisições relacionadas aos pedidos de venda.
 * 
 * - Como um controlador dentro de uma API REST, esta classe gerencia as operações relacionadas ao recurso "pedido de venda".
 * - Herdando de `PedidoVenda`, ela pode acessar os métodos e propriedades da classe base.
 */
export class PedidoVendaController extends PedidoVenda {

    /**
     * Lista todos os pedidos de venda.
     * @param req Objeto de requisição HTTP.
     * @param res Objeto de resposta HTTP.
     * @returns Lista de pedidos de venda em formato JSON com status 200 em caso de sucesso.
     * @throws Retorna um status 400 com uma mensagem de erro caso ocorra uma falha ao acessar a listagem de pedidos de venda.
     */
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            const listaPedidos = await PedidoVenda.listagemPedidos();

            return res.status(200).json(listaPedidos);
        } catch (error) {
            console.log('Erro ao acessar listagem de carros');
            return res.status(400).json({ mensagem: "Não foi possível acessar a listagem de carros" });
        }
    }

    /**
     * Cadastra um novo pedido de venda.
     * 
     * Esta função recebe os dados de um pedido de venda (objeto `PedidoVendaDTO`) da requisição HTTP e os 
     * utiliza para cadastrar um novo pedido no sistema, chamando a função `cadastroPedido` da classe `PedidoVenda`.
     * Retorna uma resposta JSON indicando o sucesso ou falha do cadastro, juntamente com uma mensagem apropriada.
     * 
     * @param {Request} req - Objeto da requisição HTTP contendo o corpo com os dados do pedido de venda (`PedidoVendaDTO`).
     * @param {Response} res - Objeto de resposta HTTP utilizado para enviar o status e mensagem ao cliente.
     * 
     * @returns {Promise<Response>} - Retorna uma resposta HTTP com status 200 e uma mensagem de sucesso se o cadastro for realizado com sucesso.
     *                                Em caso de erro, retorna uma resposta com status 400 e uma mensagem de erro.
     * 
     * @throws {Error} - Caso ocorra um erro durante o processo de cadastro, o erro é registrado no console e uma resposta de erro é enviada.
     */
    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            const pedidoRecebido: PedidoVendaDTO = req.body;

            const repostaClasse = await PedidoVenda.cadastroPedido(pedidoRecebido.idCliente,
                                                                    pedidoRecebido.idCarro,
                                                                    pedidoRecebido.dataPedido,
                                                                    pedidoRecebido.valorPedido);

            if (repostaClasse) {
                // retornar uma mensagem de sucesso
                return res.status(200).json({ mensagem: "Pedido cadastrado com sucesso!" });
            } else {
                // retorno uma mensagem de erro
                return res.status(400).json({ mensagem: "Erro ao cadastra o pedido. Entre em contato com o administrador do sistema." })
            }
        } catch (error) {
            console.log(`Erro ao cadastrar o pedido. ${error}`);
            return res.status(400).json({ mensagem: "Não foi possível cadastrar o pedido. Entre em contato com o administrador do sistema." });
        }
    }
}