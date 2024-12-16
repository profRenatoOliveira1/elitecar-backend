import { DatabaseModel } from "./DatabaseModel"; // Importa a classe DatabaseModel

const database = new DatabaseModel().pool; // Inicializa o pool de conexões com o banco de dados

/**
 * Representa um cliente com identificador único, nome, CPF e telefone.
 */
export class Cliente {

    /**
     * Identificador único do cliente.
     */
    private idCliente: number = 0;
    /**
     * Nome do cliente.
     */
    private nome: string;
    /**
     * CPF do cliente.
     */
    private cpf: string;
    /**
     * Telefone do cliente.
     */
    private telefone: string;

    /**
     * Cria uma instância da classe Cliente.
     * 
     * @param nome - O nome do cliente.
     * @param cpf - O CPF do cliente.
     * @param telefone - O telefone do cliente.
     */
    constructor(nome: string, cpf: string, telefone: string) {
        this.nome = nome; // Define o nome do cliente
        this.cpf = cpf; // Define o CPF do cliente
        this.telefone = telefone; // Define o telefone do cliente
    }

    /**
     * Retorna o identificador único do cliente.
     *
     * @returns O identificador único do cliente.
     */
    public getIdCliente(): number {
        return this.idCliente; // Retorna o identificador do cliente
    }

    /**
     * Define o identificador do cliente.
     *
     * @param idCliente - O novo identificador do cliente.
     */
    public setIdCliente(idCliente: number): void {
        this.idCliente = idCliente; // Define o identificador do cliente
    }

    /**
     * Obtém o nome do cliente.
     *
     * @returns O nome do cliente.
     */
    public getNome(): string {
        return this.nome; // Retorna o nome do cliente
    }

    /**
     * Define o nome do cliente.
     * 
     * @param nome - O nome a ser definido para o cliente.
     */
    public setNome(nome: string): void {
        this.nome = nome; // Define o nome do cliente
    }

    /**
     * Obtém o CPF do cliente.
     *
     * @returns {string} O CPF do cliente.
     */
    public getCpf(): string {
        return this.cpf; // Retorna o CPF do cliente
    }

    /**
     * Define o CPF do cliente.
     * 
     * @param cpf - O CPF a ser definido para o cliente.
     */
    public setCpf(cpf: string): void {
        this.cpf = cpf; // Define o CPF do cliente
    }

    /**
     * Retorna o número de telefone do cliente.
     *
     * @returns {string} O número de telefone do cliente.
     */
    public getTelefone(): string {
        return this.telefone; // Retorna o telefone do cliente
    }

    /**
     * Define o número de telefone do cliente.
     *
     * @param telefone - O número de telefone a ser definido.
     */
    public setTelefone(telefone: string): void {
        this.telefone = telefone; // Define o telefone do cliente
    }

    /**
     * Busca e retorna uma lista de clientes do banco de dados.
     * @returns Um array de objetos do tipo `Cliente` em caso de sucesso ou `null` se ocorrer um erro durante a consulta.
     * 
     * - A função realiza uma consulta SQL para obter todos os registros da tabela "cliente".
     * - Os dados retornados são utilizados para instanciar objetos da classe `Cliente`.
     * - Cada cliente instanciado é adicionado a uma lista que será retornada ao final da execução.
     * - Se houver uma falha na consulta ao banco, a função captura o erro, exibe uma mensagem no console e retorna `null`.
     */
    static async listagemClientes(): Promise<Array<Cliente> | null> {
        const listaDeClientes: Array<Cliente> = []; // Inicializa uma lista de clientes vazia

        try { // Tenta buscar a lista de clientes
            const querySelectCliente = `SELECT * FROM cliente`; // Consulta SQL para buscar todos os clientes
            const respostaBD = await database.query(querySelectCliente); // Executa a consulta no banco de dados

            respostaBD.rows.forEach((linha) => { // Para cada linha retornada
                const novoCliente = new Cliente( // Cria um novo objeto Cliente
                    linha.nome, // Define o nome do cliente
                    linha.cpf, // Define o CPF do cliente
                    linha.telefone // Define o telefone do cliente
                );

                novoCliente.setIdCliente(linha.id_cliente); // Define o ID do cliente

                listaDeClientes.push(novoCliente); // Adiciona o cliente à lista de clientes
            });
            
            return listaDeClientes; // Retorna a lista de clientes
        } catch (error) { // Em caso de erro
            console.log('Erro ao buscar lista de carros. Consulte os logs para mais detalhes.'); // Exibe uma mensagem de erro
            console.log(error); // Exibe o erro
            return null; // Retorna nulo
        }
    }

    /**
     * Cadastra um novo cliente no banco de dados.
     * 
     * Esta função recebe um objeto `Cliente`, extrai as informações de nome, CPF e telefone e
     * realiza uma operação de inserção (INSERT) na tabela `cliente` do banco de dados. Se o 
     * cadastro for bem-sucedido, a função retorna `true`, caso contrário, retorna `false`.
     * 
     * @param {Cliente} cliente - Objeto contendo os dados do cliente a ser cadastrado.
     * 
     * @returns {Promise<boolean>} - Retorna `true` se o cliente for cadastrado com sucesso, 
     *                               ou `false` se ocorrer um erro ou falha na inserção.
     * 
     * @throws {Error} - Em caso de erro na consulta ao banco de dados, o erro é registrado no log.
     */
    static async cadastroCliente(cliente: Cliente): Promise<boolean> {
        try { // Tenta cadastrar o cliente
            // Consulta SQL para inserir um novo cliente
            const queryInsertCliente = `INSERT INTO cliente (nome, cpf, telefone)
                                        VALUES
                                        ('${cliente.getNome()}', '${cliente.getCpf()}', '${cliente.getTelefone()}')
                                        RETURNING id_cliente`;

            const respostaBD = await database.query(queryInsertCliente); // Executa a consulta no banco de dados

            if(respostaBD.rowCount != 0) { // Se a consulta retornar algum resultado
                console.log(`Cliente cadastrado com sucesso. ID do cliente: ${respostaBD.rows[0].id_cliente}`); // Exibe uma mensagem de sucesso
                return true; // Retorna verdadeiro
            }

            return false; // Retorna falso
        } catch (error) { // Em caso de erro
            console.log('Erro ao cadastrar o cliente. Consulte os logs para mais detalhes.'); // Exibe uma mensagem de erro
            console.log(error); // Exibe o erro
            return false; // Retorna falso
        }
    }

    /**
     * Remove um cliente do banco de dados com base no ID fornecido.
     *
     * @param idCliente - O ID do cliente a ser removido.
     * @returns Uma Promise que resolve para `true` se o cliente foi removido com sucesso, ou `false` caso contrário.
     *
     * @throws Lança um erro se ocorrer um problema durante a execução da consulta.
     */
    static async removerCliente(idCliente: number): Promise<boolean> {
        try { // Tenta remover o cliente
            const queryDeleteCliente = `DELETE FROM cliente WHERE id_cliente=${idCliente}`; // Consulta SQL para remover um cliente

            const respostaBD = await database.query(queryDeleteCliente); // Executa a consulta no banco de dados

            if(respostaBD.rowCount != 0) { // Se a consulta retornar algum resultado
                console.log(`Carro removido com sucesso. ID removido: ${idCliente}`); // Exibe uma mensagem de sucesso
                return true; // Retorna verdadeiro  
            }

            return false; // Retorna falso
        } catch (error) { // Em caso de erro
            console.log('Erro ao remover o cliente. Consulte os logs para mais detalhes.'); // Exibe uma mensagem de erro
            console.log(error); // Exibe o erro
            return false; // Retorna falso
        }
    }

    /**
     * Atualiza as informações de um cliente no banco de dados.
     *
     * @param cliente - O objeto Cliente contendo as informações atualizadas.
     * @returns Uma Promise que resolve para `true` se o cliente foi atualizado com sucesso, ou `false` caso contrário.
     *
     * @throws Lança um erro se ocorrer um problema durante a atualização do cliente.
     */
    static async atualizarCliente(cliente: Cliente): Promise<boolean> {
        try { // Tenta atualizar o cliente
            // Consulta SQL para atualizar um cliente
            const queryUpdateCliente = `UPDATE cliente SET
                                        nome = '${cliente.getNome()}',
                                        cpf = '${cliente.getCpf()}',
                                        telefone = '${cliente.getTelefone()}'
                                        WHERE id_cliente = ${cliente.getIdCliente()};`;

            const respostaBD = await database.query(queryUpdateCliente); // Executa a consulta no banco de dados

            if(respostaBD.rowCount != 0) { // Se a consulta retornar algum resultado
                console.log(`Cliente atualizado com sucesso. ID: ${cliente.getIdCliente()}`); // Exibe uma mensagem de sucesso
                return true; // Retorna verdadeiro
            }

            return false; // Retorna falso
        } catch (error) { // Em caso de erro
            console.log('Erro ao remover o cliente. Consulte os logs para mais detalhes.'); // Exibe uma mensagem de erro
            console.log(error); // Exibe o erro
            return false; // Retorna falso
        }
    }
}