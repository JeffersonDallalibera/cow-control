// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.split("/").pop();

    if (path === 'rebanho.html') {
        iniciarPaginaRebanho();
    }
    
    
    if (path === 'index.html' || path === '') {
        carregarDashboard(); // Nova função para a página inicial
    }

    if (path === 'animal.html') {
        iniciarPaginaAnimal();
    }
    
    configurarModalNovoAnimal();
});
// =================================================================
// INICIALIZADORES DE PÁGINA
// =================================================================

async function carregarDashboard() {
    try {
        const response = await fetch(`${API_URL}/dashboard`);
        if (!response.ok) throw new Error('Não foi possível carregar os dados do painel.');

        const data = await response.json();

        // Atualiza os cards com os dados recebidos
        document.getElementById('total-animais').textContent = data.totalAnimais;
        document.getElementById('vacinas-pendentes').textContent = data.vacinasPendentes;
        document.getElementById('alertas-ccs').textContent = data.alertasCCS;

    } catch (error) {
        console.error("Erro no dashboard:", error);
        // Exibe uma mensagem de erro nos cards
        document.getElementById('total-animais').textContent = 'X';
        document.getElementById('vacinas-pendentes').textContent = 'X';
        document.getElementById('alertas-ccs').textContent = 'X';
    }
}


async function iniciarPaginaRebanho() {
    try {
        const response = await fetch(`${API_URL}/animais`);
        if (!response.ok) throw new Error('Falha ao buscar dados do rebanho.');
        
        const animais = await response.json();
        carregarTabelaRebanho(animais);

        document.getElementById('busca-animal')?.addEventListener('input', (e) => {
            const termo = e.target.value.toLowerCase();
            const animaisFiltrados = animais.filter(animal => 
                animal.brinco.toLowerCase().includes(termo) || 
                (animal.nome && animal.nome.toLowerCase().includes(termo))
            );
            carregarTabelaRebanho(animaisFiltrados);
        });
    } catch (error) {
        console.error("Erro:", error);
        document.getElementById('tabela-rebanho').innerHTML = `<tr><td colspan="4" class="text-danger">${error.message}</td></tr>`;
    }
}

async function iniciarPaginaAnimal() {
    try {
        const params = new URLSearchParams(window.location.search);
        const animalId = params.get('id');
        if (!animalId) throw new Error('ID do animal não fornecido na URL.');

        const response = await fetch(`${API_URL}/animais/${animalId}`);
        if (!response.ok) throw new Error('Animal não encontrado.');

        const animal = await response.json();
        carregarDetalhesAnimal(animal);
        configurarModaisDeRegistro(animal.id);
    } catch (error) {
        console.error("Erro:", error);
        document.getElementById('nome-animal').textContent = error.message;
    }
}

// =================================================================
// FUNÇÕES DE RENDERIZAÇÃO (PREENCHER HTML)
// =================================================================

function carregarTabelaRebanho(animais) {
    const corpoTabela = document.getElementById('tabela-rebanho');
    if (!corpoTabela) return;
    corpoTabela.innerHTML = ''; 

    if (!animais || animais.length === 0) {
        corpoTabela.innerHTML = '<tr><td colspan="4">Nenhum animal cadastrado.</td></tr>';
        return;
    }

    animais.forEach(animal => {
        const dataNascFormatada = new Date(animal.data_nascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
        const linha = `
            <tr>
                <td>${animal.brinco}</td>
                <td>${animal.nome || 'Não informado'}</td>
                <td>${dataNascFormatada}</td>
                <td>
                    <a href="animal.html?id=${animal.id}" class="btn btn-sm btn-info" title="Ver Detalhes">
                        <i class="fa-solid fa-eye"></i>
                    </a>
                </td>
            </tr>
        `;
        corpoTabela.innerHTML += linha;
    });
}

function carregarDetalhesAnimal(animal) {
    const dataNasc = new Date(animal.data_nascimento);
    const idade = Math.floor((new Date() - dataNasc) / (365.25 * 24 * 60 * 60 * 1000));

    document.getElementById('nome-animal').textContent = `${animal.nome || 'Animal sem nome'} (Brinco: ${animal.brinco})`;
    document.getElementById('brinco-animal').textContent = animal.brinco;
    document.getElementById('nascimento-animal').textContent = dataNasc.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    document.getElementById('idade-animal').textContent = `${idade} anos`;

    atualizarTabelasHistorico(animal);
}

function atualizarTabelasHistorico(animal) {
    // Altere as colunas aqui para corresponder aos dados do backend
    preencherTabelaSimples('tabela-vacinas', animal.historicoVacinas, ['data', 'nome', 'dose']);
    preencherTabelaSimples('tabela-ccs', animal.historicoCCS, ['data_coleta', 'resultado', 'metodo']);
    preencherTabelaRaquete(animal.historicoRaquete);
}

function preencherTabelaSimples(idTabela, dados, colunas) {
    const tabela = document.getElementById(idTabela);
    tabela.innerHTML = '';
    if (!dados || dados.length === 0) {
        tabela.innerHTML = `<tr><td colspan="${colunas.length}">Nenhum registro encontrado.</td></tr>`;
        return;
    }
    dados.sort((a, b) => new Date(b.data || b.data_coleta) - new Date(a.data || a.data_coleta));
    dados.forEach(registro => {
        let linha = '<tr>';
        colunas.forEach(coluna => {
            let valor = registro[coluna] || '-';
            if (coluna.startsWith('data')) {
                valor = new Date(valor).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
            }
            linha += `<td>${valor}</td>`;
        });
        linha += '</tr>';
        tabela.innerHTML += linha;
    });
}

function preencherTabelaRaquete(dados) {
    const tabela = document.getElementById('tabela-raquete');
    tabela.innerHTML = '';
    if (!dados || dados.length === 0) {
        tabela.innerHTML = `<tr><td colspan="6">Nenhum registro encontrado.</td></tr>`;
        return;
    }
    dados.sort((a, b) => new Date(b.data_teste) - new Date(a.data_teste));
    dados.forEach(reg => {
        const linha = `
            <tr>
                <td>${new Date(reg.data_teste).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                <td>${reg.anterior_direito}</td>
                <td>${reg.anterior_esquerdo}</td>
                <td>${reg.posterior_direito}</td>
                <td>${reg.posterior_esquerdo}</td>
                <td>${reg.observacoes || '-'}</td>
            </tr>
        `;
        tabela.innerHTML += linha;
    });
}


// =================================================================
// LÓGICA DOS FORMULÁRIOS (MODAIS)
// =================================================================

function configurarModalNovoAnimal() {
    const formNovoAnimal = document.getElementById('form-novo-animal');
    if (formNovoAnimal) {
        formNovoAnimal.addEventListener('submit', async (e) => {
            e.preventDefault();
            const animalData = {
                brinco: document.getElementById('brinco').value,
                nome: document.getElementById('nome').value,
                data_nascimento: document.getElementById('dataNascimento').value,
                // Adicione outros campos se existirem no form, ex: lote, raca
            };
            try {
                const response = await fetch(`${API_URL}/animais`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(animalData)
                });
                if (!response.ok) {
                    const errorResult = await response.json();
                    throw new Error(errorResult.error || 'Falha ao cadastrar animal.');
                }
                alert("Animal cadastrado com sucesso!");
                window.location.href = 'rebanho.html';
            } catch (error) {
                console.error("Erro ao cadastrar animal:", error);
                alert(error.message);
            }
        });
    }
}

function configurarModaisDeRegistro(animal_id) {
    // ---- Configura o modal de Vacinas ----
    const formVacina = document.getElementById('form-nova-vacina');
    formVacina?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            animal_id, // Adiciona o ID do animal
            data: document.getElementById('vacina-data').value,
            nome: document.getElementById('vacina-nome').value,
            dose: document.getElementById('vacina-dose').value,
        };
        // CRIE A ROTA 'POST /api/vacinas' NO SEU BACKEND
        alert("Funcionalidade de Vacinas ainda não implementada no backend!");
        // await salvarRegistro('/vacinas', data, '#modalRegistrarVacina', formVacina);
    });

    // ---- Configura o modal de CCS ----
    const formCCS = document.getElementById('form-novo-ccs');
    formCCS?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            animal_id, // Adiciona o ID do animal
            data_coleta: document.getElementById('ccs-data_coleta').value,
            resultado: parseInt(document.getElementById('ccs-resultado').value),
            metodo: document.getElementById('ccs-metodo').value,
            laboratorio: document.getElementById('ccs-laboratorio').value,
        };
        await salvarRegistro('/ccs', data, '#modalRegistrarCCS', formCCS);
    });

    // ---- Configura o modal de Raquete ----
    const formRaquete = document.getElementById('form-nova-raquete');
    formRaquete?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            animal_id, // Adiciona o ID do animal
            data_teste: document.getElementById('raquete-data_teste').value,
            anterior_direito: document.getElementById('raquete-anterior_direito').value,
            anterior_esquerdo: document.getElementById('raquete-anterior_esquerdo').value,
            posterior_direito: document.getElementById('raquete-posterior_direito').value,
            posterior_esquerdo: document.getElementById('raquete-posterior_esquerdo').value,
            observacoes: document.getElementById('raquete-observacoes').value,
        };
        await salvarRegistro('/raquete', data, '#modalRegistrarRaquete', formRaquete);
    });
}

// Função genérica para salvar um novo registro de histórico
async function salvarRegistro(endpoint, data, modalId, form) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorResult = await response.json();
            throw new Error(errorResult.error || `Falha ao registrar.`);
        }
        alert(`Registro salvo com sucesso!`);
        
        const modalElement = document.querySelector(modalId);
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();
        form.reset();
        iniciarPaginaAnimal(); // Recarrega todos os dados da página
    } catch (error) {
        console.error(`Erro ao registrar:`, error);
        alert(error.message);
    }
}