import { Request, Response } from "express"; // Importando os tipos do Express para utilização nas funções
import { Cliente } from "../model/Cliente"; // Importando a classe Cliente para utilização dos métodos de acesso ao banco de dados

interface ClienteDTO { // Interface para representar os dados de um cliente
    nome: string, // O nome do cliente é obrigatório
    cpf: string, // O CPF do cliente é obrigatório
    telefone: string // O telefone do cliente é obrigatório
}

/**
* A classe `ClienteController` estende a classe `Cliente` e é responsável por controlar as requisições relacionadas aos clientes.
* 
* - Como um controlador em uma API REST, esta classe gerencia as operações relacionadas ao recurso "cliente".
* - Herdando de `Cliente`, ela pode acessar os métodos e propriedades da classe base.
*/
export class ClienteController extends Cliente {

    /**
     * Lista todos os clientes.
     * @param req Objeto de requisição HTTP.
     * @param res Objeto de resposta HTTP.
     * @returns Lista de clientes em formato JSON com status 200 em caso de sucesso.
     * @throws Retorna um status 400 com uma mensagem de erro caso ocorra uma falha ao acessar a listagem de clientes.
     */
    static async todos(req: Request, res: Response): Promise<Response> {
        try {   // Tenta acessar a listagem de clientes
            const listaDeClientes = await Cliente.listagemClientes(); // Chama o método de listagem de clientes da classe Cliente
            return res.status(200).json(listaDeClientes); // Retorna a lista de clientes em formato JSON
        } catch (error) { // Se ocorrer um erro, retorna uma mensagem de erro
            console.log('Erro ao acessar listagem de carros'); // Registra o erro no console
            return res.status(400).json({ mensagem: "Não foi possível acessar a listagem de carros" }); // Retorna uma mensagem de erro
        }
    }

    /**
     * Processa a requisição para cadastro de um novo cliente.
     * 
     * Esta função extrai os dados do cliente enviados no corpo da requisição e cria um objeto `Cliente` com essas informações.
     * Em seguida, chama o método `cadastroCliente` para inserir o cliente no banco de dados. A função retorna uma resposta JSON 
     * indicando sucesso ou falha no cadastro, conforme o resultado da operação.
     * 
     * @param {Request} req - Objeto de requisição do Express, que contém os dados do cliente no corpo (`body`).
     * @param {Response} res - Objeto de resposta do Express, usado para enviar a resposta HTTP de volta ao cliente.
     * 
     * @returns {Promise<Response>} - Resposta HTTP JSON com uma mensagem de sucesso ou erro.
     * 
     * @throws {Error} - Em caso de erro, registra a mensagem no console e retorna um status 400 com uma mensagem JSON.
     */
    static async novo(req: Request, res: Response): Promise<Response> {
        try { // Tenta cadastrar um novo cliente
            const clienteRecebido: ClienteDTO = req.body; // recuperando informações do corpo da requisição e colocando em um objeto da interface CarroDTO   
            const novoCliente = new Cliente(clienteRecebido.nome, clienteRecebido.cpf, clienteRecebido.telefone); // instanciando um objeto do tipo carro com as informações recebidas
            const repostaClasse = await Cliente.cadastroCliente(novoCliente); // Chama a função de cadastro passando o objeto como parâmetro

            if(repostaClasse) { // verifica se a resposta da função é verdadeira
                return res.status(200).json({ mensagem: "Cliente cadastrado com sucesso!" }); // retornar uma mensagem de sucesso
            } else { // se a resposta for falsa
                return res.status(400).json({ mensagem: "Erro ao cadastra o cliente. Entre em contato com o administrador do sistema."}); // retorno uma mensagem de erro
            } 
        } catch (error) { // tratamento de erro
            console.log(`Erro ao cadastrar o cliente. ${error}`); // lança uma mensagem de erro no console
            return res.status(400).json({ mensagem: "Não foi possível cadastrar o cliente. Entre em contato com o administrador do sistema." }); // retorna uma mensagem de erro há quem chamou a mensagem
        }
    }

    /**
     * Remove um cliente com base no ID fornecido na solicitação.
     * 
     * @param req - O objeto de solicitação do Express, contendo os parâmetros da solicitação.
     * @param res - O objeto de resposta do Express, usado para enviar a resposta ao cliente.
     * @returns Uma promessa que resolve com um objeto de resposta do Express.
     * 
     * @throws Retorna uma resposta de erro com status 400 se ocorrer um erro durante a remoção do cliente.
     */
    static async remover(req: Request, res: Response): Promise<Response> {
        try { // Tenta remover o cliente
            const idCliente = parseInt(req.params.idCliente as string); // Recupera o ID do cliente a ser removido
            const respostaModelo = await Cliente.removerCliente(idCliente); // Chama o método de remoção de cliente da classe Cliente

            if(respostaModelo) { // Se a resposta do método for verdadeira
                return res.status(200).json({ mensagem: "Cliente removido com sucesso!"}); // Retorna uma mensagem de sucesso
            } else { // Se a resposta do método for falsa
                return res.status(400).json({ mensagem: "Não foi possível remover o cliente. Entre em contato com o administrador do sistema."}); // Retorna uma mensagem de erro
            }
        } catch (error) { // Em caso de erro
            console.log(`Erro ao remover o cliente. ${error}`); // Registra o erro no console
            return res.status(400).json({ mensagem: "Não foi possível remover o cliente. Entre em contato com o administrador do sistema." }); // Retorna uma mensagem de erro
        }
    }

    /**
     * Atualiza as informações de um cliente existente.
     *
     * @param req - Objeto de solicitação HTTP, contendo os dados do cliente no corpo da solicitação e o ID do cliente nos parâmetros.
     * @param res - Objeto de resposta HTTP.
     * @returns Uma promessa que resolve com uma resposta HTTP indicando o sucesso ou falha da operação.
     *
     * @throws Retorna uma resposta HTTP com status 400 e uma mensagem de erro se ocorrer um problema durante a atualização do cliente.
     */
    static async atualizar(req: Request, res: Response): Promise<Response> {
        try { // Tenta atualizar o cliente
            const clienteRecebido: ClienteDTO = req.body; // Recebe os dados do cliente do corpo da requisição
            const idClienteRecebido = parseInt(req.params.idCliente); // Recebe o ID do cliente a ser atualizado

            // Cria um novo objeto Cliente com as informações recebidas
            const clienteAtualizado = new Cliente(
                clienteRecebido.nome,
                clienteRecebido.cpf,
                clienteRecebido.telefone
            );

            clienteAtualizado.setIdCliente(idClienteRecebido); // Define o ID do cliente a ser atualizado

            const respostaModelo = await Cliente.atualizarCliente(clienteAtualizado); // Chama o método de atualização de cliente da classe Cliente

            if(respostaModelo) { // Se a resposta do método for verdadeira
                return res.status(200).json({ mensagem: "Cliente atualizado com sucesso!" }); // Retorna uma mensagem de sucesso
            } else { // Se a resposta do método for falsa
                return res.status(400).json({ mensagem: "Não foi possível remover o cliente. Entre em contato com o administrador do sistema." }); // Retorna uma mensagem de erro
            }
        } catch (error) { // Em caso de erro
            console.log(`Erro ao remover o cliente. ${error}`); // Registra o erro no console
            return res.status(400).json({ mensagem: "Não foi possível remover o cliente. Entre em contato com o administrador do sistema." }); // Retorna uma mensagem de erro
        }
    }
}