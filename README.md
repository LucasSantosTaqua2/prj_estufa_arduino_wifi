# Projeto Estufa Inteligente com Arduino e Node.js

## 📝 Descrição

Este projeto consiste em um sistema de monitoramento de estufa em tempo real. Um microcontrolador (presumivelmente um Arduino ou ESP) envia dados de temperatura e umidade para um servidor backend Node.js. O servidor armazena esses dados em um banco de dados PostgreSQL e os exibe em um dashboard web moderno e responsivo. A comunicação em tempo real entre o servidor e o dashboard é realizada utilizando WebSockets.

## ✨ Funcionalidades Principais

* **Dashboard em Tempo Real**: Uma interface web amigável que exibe os dados da estufa sem a necessidade de recarregar a página.
* **Visualização de Dados**:
    * Temperatura atual, mínima e máxima.
    * Umidade atual, mínima e máxima.
    * Contagem total de leituras recebidas.
* **Log de Atividades**: Um registro que exibe cada nova leitura de dados recebida pelo servidor, bem como o status da conexão.
* **Backend Robusto**:
    * Servidor construído com **Express.js** para gerenciar as rotas HTTP.
    * Uso de **WebSockets** para comunicação instantânea com o frontend, garantindo que o dashboard seja atualizado assim que novos dados chegam.
* **Persistência de Dados**:
    * As leituras de temperatura e umidade são armazenadas em um banco de dados **PostgreSQL**.
    * O sistema cria automaticamente a tabela necessária na primeira vez que é executado.

## 🛠️ Tecnologias Utilizadas

### Frontend

* HTML5
* CSS3 (com um tema escuro e animações modernas)
* JavaScript (vanilla) para interagir com o backend e atualizar a UI

### Backend

* **Node.js**
* **Express.js**: Para a criação do servidor e das rotas da API.
* **ws**: Biblioteca para a implementação do servidor WebSocket.
* **pg**: Cliente PostgreSQL para Node.js, utilizado para a comunicação com o banco de dados.

### Banco de Dados

* **PostgreSQL**
