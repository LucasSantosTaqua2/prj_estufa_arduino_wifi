// database.js

const { Pool } = require('pg');

// Configura a conexão com o banco de dados PostgreSQL.
// O Pool gerencia múltiplas conexões, o que é mais eficiente para o servidor.
const pool = new Pool({
    user: 'postgres',                 // Usuário padrão do Postgres
    host: 'localhost',                // Onde o servidor do banco está rodando
    database: 'estufa_db',            // O nome do banco que criamos
    password: 'Lucas3322!',       // <<-- SUBSTITUA PELA SENHA QUE VOCÊ DEFINIU
    port: 5432,                       // Porta padrão do Postgres
});

// Esta função assíncrona cria a tabela 'leituras' se ela ainda não existir.
const createTable = async () => {
    // A query SQL para criar a tabela.
    // 'id SERIAL PRIMARY KEY' cria um ID numérico que se auto-incrementa.
    // 'timestamp' registra a data e hora exatas de cada leitura.
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS leituras (
            id SERIAL PRIMARY KEY,
            temperatura REAL NOT NULL,
            umidade REAL NOT NULL,
            timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        const client = await pool.connect();      // Pega uma conexão disponível do pool
        await client.query(createTableQuery);     // Executa o comando de criação da tabela
        client.release();                         // Devolve a conexão para o pool para que possa ser reutilizada
        console.log("Tabela 'leituras' pronta para uso no PostgreSQL.");
    } catch (err) {
        console.error("Erro ao criar tabela no PostgreSQL:", err);
    }
};

// Chamamos a função aqui para garantir que a tabela seja verificada/criada assim que a aplicação iniciar.
createTable();

// Exportamos o 'pool' para que outros arquivos (como o server.js) possam usá-lo para fazer queries no banco.
module.exports = pool;