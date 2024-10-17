import { server } from './server';
import { DatabaseModel } from './model/DatabaseModel';

const port: number = 3333;

// só vou ligar SE o banco estiver funcionando
new DatabaseModel().testeConexao().then((resdb) => {
  if (resdb == true) {
    server.listen(port, () => {
      console.log(`Endereço do servidor: http://localhost:${port}`);
    });
  } else {
    console.log(`Erro ao conectar com o banco de dados.`);
  }
});
