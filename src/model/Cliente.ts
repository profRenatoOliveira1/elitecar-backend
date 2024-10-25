import { query } from "express";
import { DatabaseModel } from "./DatabaseModel";
import { inspect } from "util";

const database = new DatabaseModel().pool;

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
        this.nome = nome;
        this.cpf = cpf;
        this.telefone = telefone;
    }

    /**
     * Retorna o identificador único do cliente.
     *
     * @returns O identificador único do cliente.
     */
    public getIdCliente(): number {
        return this.idCliente;
    }

    /**
     * Define o identificador do cliente.
     *
     * @param idCliente - O novo identificador do cliente.
     */
    public setIdCliente(idCliente: number): void {
        this.idCliente = idCliente;
    }

    /**
     * Obtém o nome do cliente.
     *
     * @returns O nome do cliente.
     */
    public getNome(): string {
        return this.nome;
    }

    /**
     * Define o nome do cliente.
     * 
     * @param nome - O nome a ser definido para o cliente.
     */
    public setNome(nome: string): void {
        this.nome = nome;
    }

    /**
     * Obtém o CPF do cliente.
     *
     * @returns {string} O CPF do cliente.
     */
    public getCpf(): string {
        return this.cpf;
    }

    /**
     * Define o CPF do cliente.
     * 
     * @param cpf - O CPF a ser definido para o cliente.
     */
    public setCpf(cpf: string): void {
        this.cpf = cpf;
    }

    /**
     * Retorna o número de telefone do cliente.
     *
     * @returns {string} O número de telefone do cliente.
     */
    public getTelefone(): string {
        return this.telefone;
    }

    /**
     * Define o número de telefone do cliente.
     *
     * @param telefone - O número de telefone a ser definido.
     */
    public setTelefone(telefone: string): void {
        this.telefone = telefone;
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
        const listaDeClientes: Array<Cliente> = [];

        try {
            const querySelectCliente = `SELECT * FROM cliente`;
            const respostaBD = await database.query(querySelectCliente);

            respostaBD.rows.forEach((linha) => {
                const novoCliente = new Cliente(
                    linha.nome,
                    linha.cpf,
                    linha.telefone
                );

                novoCliente.setIdCliente(linha.id_cliente);

                listaDeClientes.push(novoCliente);
            });
            
            return listaDeClientes;
        } catch (error) {
            console.log('Erro ao buscar lista de carros. Consulte os logs para mais detalhes.');
            console.log(error);
            return null;
        }
    }

    static async cadastroCliente(cliente: Cliente): Promise<boolean> {
        try {
            const queryInsertCliente = `INSERT INTO cliente (nome, cpf, telefone)
                                        VALUES
                                        ('${cliente.getNome()}', '${cliente.getCpf()}', '${cliente.getTelefone()}')
                                        RETURNING id_cliente`;

            const respostaBD = await database.query(queryInsertCliente);

            if(respostaBD.rowCount != 0) {
                console.log(`Cliente cadastrado com sucesso. ID do cliente: ${respostaBD.rows[0].id_cliente}`);
                return true;
            }

            return false;
        } catch (error) {
            console.log('Erro ao cadastrar o cliente. Consulte os logs para mais detalhes.');
            console.log(error);
            return false;
        }
    }
}