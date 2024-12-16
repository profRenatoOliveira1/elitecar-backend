import { Request, Response } from "express"; // Importando os tipos do Express para utilização nas funções
import { Carro } from "../model/Carro"; // Importando a classe Carro para utilização dos métodos de acesso ao banco de dados

interface CarroDTO { // Interface para representar os dados de um carro
    marca: string, // A marca do carro é obrigatória
    modelo: string, // O modelo do carro é obrigatório
    ano: number, // O ano do carro é obrigatório
    cor: string // A cor do carro é obrigatória
}

/**
 * A classe `CarroController` estende a classe `Carro` e é responsável por controlar as requisições relacionadas aos carros.
 * 
 * - Esta classe atua como um controlador dentro de uma API REST, gerenciando as operações relacionadas ao recurso "carro".
 * - Herdando de `Carro`, ela pode acessar métodos e propriedades da classe base.
 */
export class CarroController extends Carro {

    /**
    * Lista todos os carros.
    * @param req Objeto de requisição HTTP.
    * @param res Objeto de resposta HTTP.
    * @returns Lista de carros em formato JSON com status 200 em caso de sucesso.
    * @throws Retorna um status 400 com uma mensagem de erro caso ocorra uma falha ao acessar a listagem de carros.
    */
    static async todos(req: Request, res: Response): Promise<Response> {
        try { // Tenta acessar a listagem de carros
            const listaDeCarros = await Carro.listagemCarros(); // Chama o método de listagem de carros da classe Carro
            return res.status(200).json(listaDeCarros); // Retorna a lista de carros em formato JSON
        } catch (error) { // Se ocorrer um erro, retorna uma mensagem de erro
            console.log('Erro ao acessar listagem de carros'); // Registra o erro no console
            return res.status(400).json({ mensagem: "Não foi possível acessar a listagem de carros" }); // Retorna uma mensagem de erro
        }
    }

    /**
    * Método controller para cadastrar um novo carro.
    * 
    * Esta função recebe uma requisição HTTP contendo os dados de um carro no corpo da requisição
    * e tenta cadastrar este carro no banco de dados utilizando a função `cadastroCarro`. Caso o cadastro 
    * seja bem-sucedido, retorna uma resposta HTTP 200 com uma mensagem de sucesso. Caso contrário, retorna
    * uma resposta HTTP 400 com uma mensagem de erro.
    * 
    * @param {Request} req - Objeto de requisição HTTP, contendo o corpo com os dados do carro no formato `CarroDTO`.
    * @param {Response} res - Objeto de resposta HTTP usado para retornar o status e a mensagem ao cliente.
    * @returns {Promise<Response>} - Retorna uma resposta HTTP com o status 200 em caso de sucesso, ou 400 em caso de erro.
    * 
    * @throws {Error} - Se ocorrer um erro durante o processo de cadastro, uma mensagem é exibida no console e uma 
    *                   resposta HTTP 400 com uma mensagem de erro é enviada ao cliente.
    */
    static async novo(req: Request, res: Response): Promise<Response> {
        try { // Tenta cadastrar um novo carro
            const carroRecebido: CarroDTO = req.body; // recuperando informações do corpo da requisição e colocando em um objeto da interface CarroDTO

            // instanciando um objeto do tipo carro com as informações recebidas
            const novoCarro = new Carro(carroRecebido.marca,
                carroRecebido.modelo,
                carroRecebido.ano,
                carroRecebido.cor);

            const repostaClasse = await Carro.cadastroCarro(novoCarro); // Chama a função de cadastro passando o objeto como parâmetro

            if (repostaClasse) { // verifica se a resposta da função é verdadeira
                return res.status(200).json({ mensagem: "Carro cadastrado com sucesso!" }); // retornar uma mensagem de sucesso
            } else { // se a resposta for falsa
                return res.status(400).json({ mensagem: "Erro ao cadastra o carro. Entre em contato com o administrador do sistema." }); // retorno uma mensagem de erro
            }
        } catch (error) { // tratamento de erro
            console.log(`Erro ao cadastrar um carro. ${error}`); // lança uma mensagem de erro no console
            return res.status(400).json({ mensagem: "Não foi possível cadastrar o carro. Entre em contato com o administrador do sistema." }); // retorna uma mensagem de erro há quem chamou a mensagem
        }
    }

    /**
     * Remove um carro do sistema.
     *
     * @param {Request} req - O objeto de solicitação HTTP.
     * @param {Response} res - O objeto de resposta HTTP.
     * @returns {Promise<Response>} - A resposta HTTP com o status da operação.
     *
     * @throws {Error} - Lança um erro se ocorrer algum problema durante a remoção do carro.
     */
    static async remover(req: Request, res: Response): Promise<Response> {
        try { // Tenta remover um carro
            const idCarro = parseInt(req.params.idCarro as string); // Recupera o ID do carro a ser removido
            const repostaModelo = await Carro.removerCarro(idCarro); // Chama o método de remoção de carro da classe Carro

            if(repostaModelo) { //  Se a resposta do método for verdadeira
                return res.status(200).json({ mensagem: "O carro foi removido com sucesso!"}); // Retorna uma mensagem de sucesso
            } else { // Se a resposta do método for falsa
                return res.status(400).json({ mensagem: "Erro ao remover o carro. Entre em contato com o administrador do sistema." }); // Retorna uma mensagem de erro
            }
        } catch (error) { // tratamento de erro
            console.log(`Erro ao remover um carro. ${error}`); // lança uma mensagem de erro no console
            return res.status(400).json({ mensagem: "Não foi possível remover o carro. Entre em contato com o administrador do sistema." }); // retorna uma mensagem de erro há quem chamou a mensagem
        }
    }

    /**
     * Atualiza as informações de um carro existente.
     * 
     * @param req - O objeto de solicitação HTTP, contendo o corpo da requisição com os dados do carro a serem atualizados e o ID do carro nos parâmetros da URL.
     * @param res - O objeto de resposta HTTP.
     * @returns Uma promessa que resolve para um objeto de resposta HTTP com uma mensagem de sucesso ou erro.
     * 
     * @throws Retorna um status 400 com uma mensagem de erro se ocorrer uma exceção durante o processo de atualização.
     */
    static async atualizar(req: Request, res: Response): Promise<Response> {
        try { // Tenta atualizar um carro
            const carroRecebido: CarroDTO = req.body; // Recebe os dados do carro do corpo da requisição
            const idCarroRecebido = parseInt(req.params.idCarro as string); // Recebe o ID do carro a ser atualizado

            // instanciando um objeto do tipo carro
            const carroAtualizado = new Carro(
                carroRecebido.marca,
                carroRecebido.modelo,
                carroRecebido.ano,
                carroRecebido.cor
            );

            carroAtualizado.setIdCarro(idCarroRecebido); // Atribui o ID do carro ao objeto
            const respostaModelo = await Carro.atualizarCarro(carroAtualizado); // Chama o método de atualização de carro da classe Carro

            if(respostaModelo) { // Se a resposta do método for verdadeira
                return res.status(200).json({ mensagem: "Carro atualizado com sucesso!"}); // Retorna uma mensagem de sucesso
            } else { // Se a resposta do método for falsa
                return res.status(400).json({ mensagem: "Não foi possível atualizar o carro. Entre em contato com o administrador do sistema." }); // Retorna uma mensagem de erro
            }
        } catch (error) { // tratamento de erro
            console.log(`Erro ao atualizar um carro. ${error}`); // lança uma mensagem de erro no console
            return res.status(400).json({ mensagem: "Não foi possível atualizar o carro. Entre em contato com o administrador do sistema." }); // retorna uma mensagem de erro há quem chamou a mensagem
        }
    }
}