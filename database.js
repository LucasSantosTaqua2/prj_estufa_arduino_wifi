// database.js

const { Pool } = require('pg');

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
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS leituras (
            id SERIAL PRIMARY KEY,
            temperatura REAL NOT NULL,
            umidade REAL NOT NULL,
            timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        const client = await pool.connect();      
        await client.query(createTableQuery);    
        client.release();                        
        console.log("Tabela 'leituras' pronta para uso no PostgreSQL.");
    } catch (err) {
        console.error("Erro ao criar tabela no PostgreSQL:", err);
    }
};

createTable();

module.exports = pool;
