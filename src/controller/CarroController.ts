import { Request, Response } from "express";
import { Carro } from "../model/Carro";

interface CarroDTO {
    marca: string,
    modelo: string,
    ano: number,
    cor: string
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
        try {
            // acessa a função de listar os carros e armazena o resultado
            const listaDeCarros = await Carro.listagemCarros();

            // retorna a lista de carros há quem fez a requisição web
            return res.status(200).json(listaDeCarros);
        } catch (error) {
            // lança uma mensagem de erro no console
            console.log('Erro ao acessar listagem de carros');

            // retorna uma mensagem de erro há quem chamou a mensagem
            return res.status(400).json({ mensagem: "Não foi possível acessar a listagem de carros" });
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
        try {
            // recuperando informações do corpo da requisição e colocando em um objeto da interface CarroDTO
            const carroRecebido: CarroDTO = req.body;

            // instanciando um objeto do tipo carro com as informações recebidas
            const novoCarro = new Carro(carroRecebido.marca,
                carroRecebido.modelo,
                carroRecebido.ano,
                carroRecebido.cor);

            // Chama a função de cadastro passando o objeto como parâmetro
            const repostaClasse = await Carro.cadastroCarro(novoCarro);

            // verifica a resposta da função
            if (repostaClasse) {
                // retornar uma mensagem de sucesso
                return res.status(200).json({ mensagem: "Carro cadastrado com sucesso!" });
            } else {
                // retorno uma mensagem de erro
                return res.status(400).json({ mensagem: "Erro ao cadastra o carro. Entre em contato com o administrador do sistema." })
            }
        } catch (error) {
            // lança uma mensagem de erro no console
            console.log(`Erro ao cadastrar um carro. ${error}`);

            // retorna uma mensagem de erro há quem chamou a mensagem
            return res.status(400).json({ mensagem: "Não foi possível cadastrar o carro. Entre em contato com o administrador do sistema." });
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
        try {
            // recuperar o ID do carro a ser removido
            const idCarro = parseInt(req.params.idCarro as string);

            // chamar a função do modelo e armazenar a resposta
            const repostaModelo = await Carro.removerCarro(idCarro);

            // verifica se a reposta do modelo foi verdadeiro (true)
            if(repostaModelo) {
                // retorma um status 200 com uma mensagem de sucesso
                return res.status(200).json({ mensagem: "O carro foi removido com sucesso!"});
            } else {
                // retorna um status 400 com uma mensagem de erro
                return res.status(400).json({ mensagem: "Erro ao remover o carro. Entre em contato com o administrador do sistema." });
            }

        // trata qualquer erro que aconteça durante o processo
        } catch (error) {
            // lança uma mensagem de erro no console
            console.log(`Erro ao remover um carro. ${error}`);

            // retorna uma mensagem de erro há quem chamou a mensagem
            return res.status(400).json({ mensagem: "Não foi possível remover o carro. Entre em contato com o administrador do sistema." });
        }
    }
}