import { Request, Response } from "express";    // Importando os tipos do Express para utilização nas funções
import { PedidoVenda } from "../model/PedidoVenda"; // Importando a classe PedidoVenda para utilização dos métodos de acesso ao banco de dados

interface PedidoVendaDTO { // Interface para representar os dados de um pedido de venda
    idPedido?: number, // O ID do pedido é opcional, pois não é necessário informá-lo ao cadastrar um novo pedido
    idCliente: number, // O ID do cliente é obrigatório
    idCarro: number, // O ID do carro é obrigatório
    dataPedido: Date, // A data do pedido é obrigatória
    valorPedido: number // O valor do pedido é obrigatório
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
        try { // Tenta acessar a listagem de pedidos de venda
            const listaPedidos = await PedidoVenda.listagemPedidos(); // Chama o método de listagem de pedidos da classe PedidoVenda
            return res.status(200).json(listaPedidos); // Retorna a lista de pedidos de venda em formato JSON
        } catch (error) { // Se ocorrer um erro, retorna uma mensagem de erro
            console.log('Erro ao acessar listagem de carros'); // Registra o erro no console
            return res.status(400).json({ mensagem: "Não foi possível acessar a listagem de carros" }); // Retorna uma mensagem de erro
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
        try { // Tenta cadastrar um novo pedido de venda
            const pedidoRecebido: PedidoVendaDTO = req.body; // Recebe os dados do pedido de venda do corpo da requisição

            // Chama o método de cadastro de pedido da classe PedidoVenda, passando os dados do pedido recebido
            const repostaClasse = await PedidoVenda.cadastroPedido(pedidoRecebido.idCliente,
                pedidoRecebido.idCarro,
                pedidoRecebido.dataPedido,
                pedidoRecebido.valorPedido);

            if (repostaClasse) {    // Se a resposta da classe for verdadeira
                return res.status(200).json({ mensagem: "Pedido cadastrado com sucesso!" }); // Retorna uma mensagem de sucesso
            } else { // Se a resposta da classe for falsa
                return res.status(400).json({ mensagem: "Erro ao cadastra o pedido. Entre em contato com o administrador do sistema." }); // Retorna uma mensagem de erro
            }
        } catch (error) { // Se ocorrer um erro durante o cadastro
            console.log(`Erro ao cadastrar o pedido. ${error}`); // Registra o erro no console
            return res.status(400).json({ mensagem: "Não foi possível cadastrar o pedido. Entre em contato com o administrador do sistema." }); // Retorna uma mensagem de erro
        }
    }

    /**
     * Remove um pedido de venda com base no ID fornecido na requisição.
     *
     * @param req - Objeto de requisição do Express contendo o ID do pedido nos parâmetros.
     * @param res - Objeto de resposta do Express para enviar a resposta ao cliente.
     * @returns Uma Promise que resolve para um objeto de resposta do Express.
     *
     * @throws Retorna uma resposta com status 400 e uma mensagem de erro se ocorrer algum problema durante a remoção do pedido.
     */
    static async remover(req: Request, res: Response): Promise<Response> {
        try { // Tenta remover o pedido
            const idPedido = parseInt(req.params.idPedido as string); // Recebe o ID do pedido da requisição, convertendo para número inteiro

            const repostaClasse = await PedidoVenda.removerPedido(idPedido); // Chama o método de remoção de pedido da classe PedidoVenda

            if (repostaClasse) { // Se a resposta da classe for verdadeira
                return res.status(200).json({ mensagem: "Pedido de venda removido com sucesso!" }); // Retorna uma mensagem de sucesso
            } else { // Se a resposta da classe for falsa
                return res.status(400).json({ mensagem: "Não foi possível remover o pedido. Entre em contato com o administrador do sistema." }); // Retorna uma mensagem de erro
            }
        } catch (error) { // Se ocorrer um erro durante a remoção do pedido
            console.log(`Erro ao remover o pedido. ${error}`); // Registra o erro no console
            return res.status(400).json({ mensagem: "Não foi possível remover o pedido. Entre em contato com o administrador do sistema." }); // Retorna uma mensagem de erro
        }
    }

    /**
     * Atualiza um pedido de venda existente com base nos dados fornecidos.
     *
     * @param req - O objeto de solicitação HTTP, contendo os dados do pedido no corpo da solicitação e o ID do pedido nos parâmetros da URL.
     * @param res - O objeto de resposta HTTP.
     * @returns Uma promessa que resolve com um objeto de resposta HTTP.
     *
     * @throws Retorna uma resposta HTTP com status 400 e uma mensagem de erro se ocorrer um problema durante a atualização do pedido.
     */
    static async atualizar(req: Request, res: Response): Promise<Response> {
        try { // Tenta atualizar o pedido
            const pedidoRecebido: PedidoVendaDTO = req.body; // Recebe os dados do pedido de venda do corpo da requisição
            const idPedidoRecebido = parseInt(req.params.idPedido as string); // Recebe o ID do pedido da requisição, convertendo para número inteiro

            // Chama o método de atualização de pedido da classe PedidoVenda, passando os dados do pedido recebido
            const respostaModelo = await PedidoVenda.atualizarPedido(idPedidoRecebido,
                pedidoRecebido.idCliente, 
                pedidoRecebido.idCarro, 
                pedidoRecebido.dataPedido, 
                pedidoRecebido.valorPedido);

            if (respostaModelo) { // Se a resposta da classe for verdadeira
                return res.status(200).json({ mensagem: "Pedido atualizado com sucesso!" }); // Retorna uma mensagem de sucesso
            } else { // Se a resposta da classe for falsa
                return res.status(400).json({ mensagem: "Não foi possível atualizar o pedido. Entre em contato com o administrador do sistema." }); // Retorna uma mensagem de erro
            }
        } catch (error) { // Se ocorrer um erro durante a atualização do pedido
            console.log(`Erro ao remover o pedido. ${error}`); // Registra o erro no console
            return res.status(400).json({ mensagem: "Não foi possível atualizar o pedido. Entre em contato com o administrador do sistema." }); // Retorna uma mensagem de erro
        }
    }
}