import pg from 'pg'; // Importa o pacote pg para conexão com o banco de dados
import dotenv from 'dotenv'; // Importa o pacote dotenv para carregar as variáveis de ambiente

dotenv.config(); // Carrega as variáveis de ambiente

/**
 * Classe que representa o modelo de banco de dados.
 */
export class DatabaseModel {
    
    /**
     * Configuração para conexão com o banco de dados
     */
    private _config: object;

    /**
     * Pool de conexões com o banco de dados
     */
    private _pool: pg.Pool;

    /**
     * Cliente de conexão com o banco de dados
     */
    private _client: pg.Client;

    /**
     * Construtor da classe DatabaseModel.
     */
    constructor() {
        // Configuração padrão para conexão com o banco de dados
        this._config = { // Objeto para configuração para conexão com o banco de dados
            user: process.env.DB_USER, // Usuário do banco de dados, recuperado do arquivo .env
            host: process.env.DB_HOST, // Host do banco de dados, recuperado do arquivo .env
            database: process.env.DB_NAME, // Nome do banco de dados, recuperado do arquivo .env
            password: process.env.DB_PASSWORD, // Senha do banco de dados, recuperado do arquivo .env
            port: process.env.DB_PORT, // Porta do banco de dados, recuperado do arquivo .env
            max: 10, // Número máximo de conexões
            idleTimoutMillis: 10000 // Tempo máximo de inatividade da conexão
        }

        this._pool = new pg.Pool(this._config); // Inicializa o pool de conexões com a configuração

        this._client = new pg.Client(this._config); // Inicializa o cliente de conexão com a configuração
    }

    /**
     * Método para testar a conexão com o banco de dados.
     *
     * @returns **true** caso a conexão tenha sido feita, **false** caso negativo
     */
    public async testeConexao() {
        try { // Tenta conectar ao banco de dados
            await this._client.connect(); // Conecta ao banco de dados
            console.log('Database connected!'); // Exibe uma mensagem de sucesso
            this._client.end(); // Encerra a conexão
            return true; // Retorna verdadeiro
        } catch (error) { // Em caso de erro, exibe uma mensagem de erro
            console.log('Error to connect database X( '); // Exibe uma mensagem de erro
            console.log(error); // Exibe o erro
            this._client.end(); // Encerra a conexão
            return false; // Retorna falso
        }
    }

    /**
     * Getter para o pool de conexões.
     */
    public get pool() {
        return this._pool; // Retorna o pool de conexões
    }
}