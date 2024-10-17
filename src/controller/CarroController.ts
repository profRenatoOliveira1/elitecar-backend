import { Request, Response } from "express";
import { Carro } from "../model/Carro";

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
}