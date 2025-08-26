// server.js - VERSÃO CORRETA COM SUPORTE A WEBSOCKETS

const express = require('express');
const http = require('http');      // Módulo http nativo do Node.js
const WebSocket = require('ws');   // Biblioteca de WebSocket
const pool = require('./database.js');

const app = express();
const PORT = 3000;

// Criamos um servidor http a partir do nosso app Express
const server = http.createServer(app);

// Criamos o servidor WebSocket, anexando-o ao servidor http
const wss = new WebSocket.Server({ server });

// Função para enviar uma mensagem a todos os clientes conectados
function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

wss.on('connection', ws => {
    console.log('Cliente WebSocket conectado.');
    ws.on('close', () => {
        console.log('Cliente WebSocket desconectado.');
    });
});

app.use(express.json());
app.use(express.static('public'));

app.post('/dados-estufa', async (req, res) => {
    const { temperatura, umidade } = req.body;
    if (temperatura === undefined || umidade === undefined) {
        return res.status(400).json({ error: "Dados obrigatórios." });
    }

    const sql = 'INSERT INTO leituras (temperatura, umidade) VALUES ($1, $2) RETURNING id, temperatura, umidade, timestamp';
    const params = [temperatura, umidade];

    try {
        const result = await pool.query(sql, params);
        const novaLeitura = result.rows[0];
        
        // AVISO EM TEMPO REAL: Envia os novos dados para todos os dashboards conectados
        broadcast(JSON.stringify({ type: 'NOVA_LEITURA', payload: novaLeitura }));

        res.status(201).json({ message: 'Dados salvos!', id: novaLeitura.id });
    } catch (err) {
        console.error("Erro ao salvar no banco:", err.message);
        broadcast(JSON.stringify({ type: 'ERRO_SERVIDOR', payload: err.message }));
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

app.get('/estatisticas', async (req, res) => {
    const sql = `
        SELECT
            COUNT(*) AS total_leituras,
            ROUND(AVG(temperatura)::numeric, 2) AS media_temperatura,
            MAX(temperatura) AS max_temperatura,
            MIN(temperatura) AS min_temperatura,
            ROUND(AVG(umidade)::numeric, 2) AS media_umidade,
            MAX(umidade) AS max_umidade,
            MIN(umidade) AS min_umidade
        FROM leituras
    `;
    try {
        const result = await pool.query(sql);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Em vez de app.listen, usamos server.listen para iniciar ambos os servidores
server.listen(PORT, () => {
    console.log(`Servidor HTTP e WebSocket rodando em http://localhost:${PORT}`);
});