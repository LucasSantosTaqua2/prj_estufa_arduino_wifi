// public/monitor.js - VERSÃO COM ANIMAÇÃO SUTIL E PROFISSIONAL

document.addEventListener('DOMContentLoaded', () => {

    const logBox = document.getElementById('log_box');
    let ultimoTotalLeituras = -1;

    function logMessage(message, type) {
        const timestamp = new Date().toLocaleTimeString('pt-BR');
        const icon = type === 'error' ? '🔥 ERRO:' : '✅ SUCESSO:';
        const novaLinha = document.createElement('div');
        novaLinha.innerHTML = `<span>[${timestamp}]</span> <span>${icon}</span> <span>${message}</span>`;
        logBox.prepend(novaLinha);
    }

    function triggerUpdateAnimation(element, newValue) {
        if (!element || element.textContent === newValue) return;

        // Adiciona a classe que inicia a animação
        element.classList.add('value-updated-subtle');

        // No meio da animação (quando o elemento está invisível), atualizamos o valor
        setTimeout(() => {
            element.textContent = newValue;
        }, 250); // Metade da duração da animação (500ms / 2)

        // Remove a classe após a animação terminar para que possa ser acionada novamente
        setTimeout(() => {
            element.classList.remove('value-updated-subtle');
        }, 500);
    }

    async function buscarEstatisticas(ultimaLeitura = null) {
        try {
            const response = await fetch('/estatisticas');
            if (!response.ok) throw new Error(`Falha ao buscar estatísticas (${response.status})`);
            const dadosGerais = await response.json();
            atualizarUI(dadosGerais, ultimaLeitura);
            document.getElementById('status_servidor').textContent = "Online";
            document.getElementById('status_servidor').className = "ok";
        } catch (error) {
            console.error("Falha ao buscar dados:", error);
            logMessage(error.message, 'error');
            document.getElementById('status_servidor').textContent = "Erro!";
            document.getElementById('status_servidor').className = "erro";
        }
    }

    function atualizarUI(dadosGerais, ultimaLeitura = null) {
        const format = (num) => num ? parseFloat(num).toFixed(2) : '--';

        // Atualiza os valores chamando a nova função de animação
        triggerUpdateAnimation(document.getElementById('media_temp'), format(dadosGerais.media_temperatura));
        triggerUpdateAnimation(document.getElementById('min_temp'), format(dadosGerais.min_temperatura));
        triggerUpdateAnimation(document.getElementById('max_temp'), format(dadosGerais.max_temperatura));
        triggerUpdateAnimation(document.getElementById('media_umid'), format(dadosGerais.media_umidade));
        triggerUpdateAnimation(document.getElementById('min_umid'), format(dadosGerais.min_umidade));
        triggerUpdateAnimation(document.getElementById('max_umid'), format(dadosGerais.max_umidade));
        
        const totalLeiturasAtual = dadosGerais.total_leituras || 0;
        triggerUpdateAnimation(document.getElementById('total_leituras'), totalLeiturasAtual);

        // Lógica do Log (permanece a mesma)
        if (totalLeiturasAtual > ultimoTotalLeituras) {
            if (ultimaLeitura) {
                const tempFormatada = parseFloat(ultimaLeitura.temperatura).toFixed(1);
                const umidFormatada = parseFloat(ultimaLeitura.umidade).toFixed(1);
                logMessage(`Dados recebidos: Temp ${tempFormatada}°C, Umid ${umidFormatada}%. (Total: ${totalLeiturasAtual})`, 'success');
            }
            ultimoTotalLeituras = totalLeiturasAtual;
        }
    }

    function connectWebSocket() {
        const socket = new WebSocket('ws://' + window.location.host);
        socket.onopen = () => { console.log('WebSocket conectado!'); logMessage('Conectado ao servidor em tempo real.', 'success'); };
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'NOVA_LEITURA') {
                buscarEstatisticas(message.payload);
            } else if (message.type === 'ERRO_SERVIDOR') {
                logMessage(`Erro no servidor: ${message.payload}`, 'error');
            }
        };
        socket.onclose = () => { console.log('WebSocket desconectado. Tentando reconectar em 3s...'); logMessage('Conexão perdida. Tentando reconectar...', 'error'); setTimeout(connectWebSocket, 3000); };
        socket.onerror = (error) => { console.error('Erro no WebSocket:', error); socket.close(); };
    }

    // --- INICIALIZAÇÃO ---
    buscarEstatisticas();
    connectWebSocket();
});
