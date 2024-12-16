import express from 'express'; // Importa o express
import cors from 'cors'; // Importa o cors
import { router } from './routes'; // Importa as rotas

const server = express(); // Cria o servidor express
server.use(cors()); // Configura o servidor para aceitar requisições de outros domínios
server.use(express.json()); // Configura o servidor para aceitar requisições no formato JSON
server.use(router); // Configurando as rotas no servidor

export { server }; // Exporta o servidor