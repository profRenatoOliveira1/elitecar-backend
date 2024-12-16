import { Request, Response, Router } from "express"; // Importa o express
import { CarroController } from "./controller/CarroController"; // Importa o controller de carros
import { ClienteController } from "./controller/ClienteController"; // Importa o controller de clientes
import { PedidoVendaController } from "./controller/PedidoVendaController"; // Importa o controller de pedidos

const router = Router(); // Cria um roteador para disponibilizar as rotas

// Criando uma rota principal para a aplicação
router.get("/", (req: Request, res: Response) => { // Rota principal
    res.json({ mensagem: "Olá, mundo!" }); // Retorna uma mensagem
});

/* 
* ROTAS PARA CARROS
*/ 
router.get("/lista/carros", CarroController.todos); // Rota para listar os carros, acessa a função `todos` do controller
router.post("/novo/carro", CarroController.novo); // Rota para cadastrar um novo carro, acessa a função `novo` do controller
router.delete("/delete/carro/:idCarro", CarroController.remover); // Rota para remover um carro, acessa a função `remover` do controller
router.put("/atualizar/carro/:idCarro", CarroController.atualizar); // Rota para atualizar um carro, acessa a função `atualizar` do controller

/* 
* ROTAS PARA CLIENTES
*/ 
router.get("/lista/clientes", ClienteController.todos); // Rota para listar os clientes, acessa a função `todos` do controller
router.post("/novo/cliente", ClienteController.novo); // Rota para cadastrar um novo cliente, acessa a função `novo` do controller
router.delete("/delete/cliente/:idCliente", ClienteController.remover); // Rota para remover um cliente, acessa a função `remover` do controller
router.put("/atualizar/cliente/:idCliente", ClienteController.atualizar); // Rota para atualizar um cliente, acessa a função `atualizar` do controller

/* 
* ROTAS PARA PEDIDOS
*/ 
router.get("/lista/pedidos", PedidoVendaController.todos); // Rota para listar os pedidos, acessa a função `todos` do controller
router.post("/novo/pedido", PedidoVendaController.novo); // Rota para cadastrar um novo pedido, acessa a função `novo` do controller
router.delete("/delete/pedido/:idPedido", PedidoVendaController.remover); // Rota para remover um pedido, acessa a função `remover` do controller
router.put("/atualizar/pedido/:idPedido", PedidoVendaController.atualizar); // Rota para atualizar um pedido, acessa a função `atualizar` do controller

export { router }; // exportando as rotas