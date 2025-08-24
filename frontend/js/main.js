// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // Roteador simples baseado no nome do arquivo na URL
    const path = window.location.pathname.split("/").pop();

    if (path === 'index.html' || path === '') {
        carregarDashboard();
    }
    if (path === 'rebanho.html') {
        iniciarPaginaRebanho();
    }
    if (path === 'animal.html') {
        iniciarPaginaAnimal();
    }
    if (path === 'vacinas.html') {
        iniciarPaginaVacinas();
    }
    if (path === 'alertas-ccs.html') {
        iniciarPaginaAlertasCCS();
    }
    
    configurarModalNovoAnimal();
});
// =================================================================
// INICIALIZADORES DE PÁGINA (Funções que buscam dados da API)
// =================================================================

async function carregarDashboard() {
    try {
        const response = await fetch(`${API_URL}/dashboard`);
        if (!response.ok) throw new Error('Não foi possível carregar os dados do painel.');
        const data = await response.json();
        document.getElementById('total-animais').textContent = data.totalAnimais;
        document.getElementById('vacinas-pendentes').textContent = data.vacinasPendentes;
        document.getElementById('alertas-ccs').textContent = data.alertasCCS;
    } catch (error) {
        console.error("Erro no dashboard:", error);
        document.getElementById('total-animais').textContent = 'Erro';
        document.getElementById('vacinas-pendentes').textContent = 'Erro';
        document.getElementById('alertas-ccs').textContent = 'Erro';
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
        
        // --- CORREÇÃO AQUI ---
        // Removemos o parseInt. O ID agora é tratado como texto (UUID).
        const animalId = params.get('id');
        
        if (!animalId) throw new Error('ID do animal não fornecido na URL.');

        const response = await fetch(`${API_URL}/animais/${animalId}`);
        if (!response.ok) throw new Error('Animal não encontrado.');
        const animal = await response.json();

        console.log("Dados do animal recebidos pela API:", animal);

        carregarDetalhesAnimal(animal);
        configurarModaisDeRegistro(animal.id); // Passa o ID (UUID) como texto
    } catch (error) {
        console.error("Erro:", error);
        document.getElementById('nome-animal').textContent = error.message;
    }
}

async function iniciarPaginaVacinas() {
    try {
        const responseVacinas = await fetch(`${API_URL}/vacinas`);
        if (!responseVacinas.ok) throw new Error('Falha ao buscar dados de vacinas.');
        const registros = await responseVacinas.json();
        
        const corpoTabela = document.getElementById('tabela-vacinas');
        corpoTabela.innerHTML = '';
        if (registros.length === 0) {
            corpoTabela.innerHTML = '<tr><td colspan="5">Nenhum registro de vacina encontrado.</td></tr>';
        } else {
            registros.sort((a, b) => new Date(b.data_aplicacao) - new Date(a.data_aplicacao));
            registros.forEach(reg => {
                const dataAplicacaoOriginal = new Date(reg.data_aplicacao);
                let proximaDose = new Date(dataAplicacaoOriginal);
                proximaDose.setDate(proximaDose.getDate() + reg.dias_revacina);
                const linha = `
                    <tr>
                        <td><a href="animal.html?id=${reg.animal.id}">${reg.animal.brinco}</a></td>
                        <td>${reg.animal.nome || '-'}</td>
                        <td>${reg.nome_vacina}</td>
                        <td>${new Date(reg.data_aplicacao).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                        <td>${proximaDose.toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                    </tr>
                `;
                corpoTabela.innerHTML += linha;
            });
        }

        const responseAnimais = await fetch(`${API_URL}/animais`);
        if (!responseAnimais.ok) throw new Error('Falha ao buscar lista de animais.');
        const animais = await responseAnimais.json();
        const selectAnimal = document.getElementById('vacina-animal-id-select');
        selectAnimal.innerHTML = '<option value="" selected disabled>Selecione um animal...</option>';
        animais.forEach(animal => {
            const option = `<option value="${animal.id}">${animal.brinco} - ${animal.nome || 'Sem nome'}</option>`;
            selectAnimal.innerHTML += option;
        });

        const formVacinaGeral = document.getElementById('form-nova-vacina-geral');
        if (!formVacinaGeral.dataset.listenerAdicionado) {
            formVacinaGeral.addEventListener('submit', async (e) => {
                e.preventDefault();
                const animalIdSelecionado = document.getElementById('vacina-animal-id-select').value;
                if (!animalIdSelecionado) {
                    alert("Erro: É obrigatório selecionar um animal da lista.");
                    return;
                }
                const data = {
                    // --- CORREÇÃO AQUI ---
                    // Removemos o parseInt. O ID do animal (UUID) é um texto.
                    animal_id: animalIdSelecionado,
                    data_aplicacao: document.getElementById('vacina-data_aplicacao').value,
                    nome_vacina: document.getElementById('vacina-nome_vacina').value,
                    dose: document.getElementById('vacina-dose').value,
                    dias_revacina: parseInt(document.getElementById('vacina-dias_revacina').value),
                };
                await salvarRegistro('/vacinas', data, '#modalRegistrarVacinaGeral', formVacinaGeral, iniciarPaginaVacinas);
            });
            formVacinaGeral.dataset.listenerAdicionado = 'true';
        }
    } catch (error) {
        console.error("Erro na página de vacinas:", error);
        document.getElementById('tabela-vacinas').innerHTML = `<tr><td colspan="5" class="text-danger">${error.message}</td></tr>`;
    }
}

async function iniciarPaginaAlertasCCS() {
    try {
        const response = await fetch(`${API_URL}/ccs`);
        if (!response.ok) throw new Error('Falha ao buscar dados de CCS.');
        let registros = await response.json();
        registros = registros.filter(reg => reg.resultado > 400000);
        const corpoTabela = document.getElementById('tabela-alertas-ccs');
        corpoTabela.innerHTML = '';
        if (registros.length === 0) {
            corpoTabela.innerHTML = '<tr><td colspan="4">Nenhum alerta de CCS encontrado.</td></tr>';
            return;
        }
        const animaisResponse = await fetch(`${API_URL}/animais`);
        const animais = await animaisResponse.json();
        const mapaAnimais = new Map(animais.map(animal => [animal.id, animal]));
        registros.sort((a, b) => new Date(b.data_coleta) - new Date(a.data_coleta));
        registros.forEach(reg => {
            const animal = mapaAnimais.get(reg.animal_id);
            const linha = `
                <tr>
                    <td><a href="animal.html?id=${reg.animal_id}">${animal?.brinco || 'N/A'}</a></td>
                    <td>${animal?.nome || '-'}</td>
                    <td>${new Date(reg.data_coleta).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                    <td><strong>${reg.resultado.toLocaleString('pt-BR')}</strong></td>
                </tr>
            `;
            corpoTabela.innerHTML += linha;
        });
    } catch (error) {
        console.error("Erro:", error);
        document.getElementById('tabela-alertas-ccs').innerHTML = `<tr><td colspan="4" class="text-danger">${error.message}</td></tr>`;
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
    preencherTabelaSimples('tabela-vacinas', animal.historicoVacinas, ['data_aplicacao', 'nome_vacina', 'dose']);
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
    dados.sort((a, b) => new Date(b[colunas[0]]) - new Date(a[colunas[0]]));
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

function configurarModaisDeRegistro(animal_id) { // animal_id aqui já é o UUID em formato texto
    const formVacina = document.getElementById('form-nova-vacina');
    formVacina?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            animal_id, // Usa o ID (UUID) diretamente
            data_aplicacao: document.getElementById('vacina-data_aplicacao').value,
            nome_vacina: document.getElementById('vacina-nome_vacina').value,
            dose: document.getElementById('vacina-dose').value,
            dias_revacina: parseInt(document.getElementById('vacina-dias_revacina').value),
        };
        await salvarRegistro('/vacinas', data, '#modalRegistrarVacina', formVacina, iniciarPaginaAnimal);
    });

    const formCCS = document.getElementById('form-novo-ccs');
    formCCS?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            animal_id, // Usa o ID (UUID) diretamente
            data_coleta: document.getElementById('ccs-data_coleta').value,
            resultado: parseInt(document.getElementById('ccs-resultado').value),
            metodo: document.getElementById('ccs-metodo').value,
            laboratorio: document.getElementById('ccs-laboratorio').value,
        };
        await salvarRegistro('/ccs', data, '#modalRegistrarCCS', formCCS, iniciarPaginaAnimal);
    });

    const formRaquete = document.getElementById('form-nova-raquete');
    formRaquete?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            animal_id, // Usa o ID (UUID) diretamente
            data_teste: document.getElementById('raquete-data_teste').value,
            anterior_direito: document.getElementById('raquete-anterior_direito').value,
            anterior_esquerdo: document.getElementById('raquete-anterior_esquerdo').value,
            posterior_direito: document.getElementById('raquete-posterior_direito').value,
            posterior_esquerdo: document.getElementById('raquete-posterior_esquerdo').value,
            observacoes: document.getElementById('raquete-observacoes').value,
        };
        await salvarRegistro('/raquete', data, '#modalRegistrarRaquete', formRaquete, iniciarPaginaAnimal);
    });
}

async function salvarRegistro(endpoint, data, modalId, form, callbackDeAtualizacao) {
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
        
        // Chama a função para atualizar os dados na página
        if (callbackDeAtualizacao) {
            callbackDeAtualizacao();
        }

    } catch (error) {
        console.error(`Erro ao registrar:`, error);
        alert(error.message);
    }
}
// js/main.js -> substitua esta função inteira

async function iniciarPaginaVacinas() {
    try {
        // 1. Buscar vacinas para a tabela (lógica existente)
        const responseVacinas = await fetch(`${API_URL}/vacinas`);
        if (!responseVacinas.ok) throw new Error('Falha ao buscar dados de vacinas.');
        const registros = await responseVacinas.json();
        
        // ... (o código que preenche a tabela continua exatamente o mesmo)
        const corpoTabela = document.getElementById('tabela-vacinas');
        corpoTabela.innerHTML = '';
        if (registros.length === 0) {
            corpoTabela.innerHTML = '<tr><td colspan="5">Nenhum registro de vacina encontrado.</td></tr>';
        } else {
            registros.sort((a, b) => new Date(b.data_aplicacao) - new Date(a.data_aplicacao));
            registros.forEach(reg => {
                const dataAplicacaoOriginal = new Date(reg.data_aplicacao);
                let proximaDose = new Date(dataAplicacaoOriginal);
                proximaDose.setDate(proximaDose.getDate() + reg.dias_revacina);

                const linha = `
                    <tr>
                        <td><a href="animal.html?id=${reg.animal.id}">${reg.animal.brinco}</a></td>
                        <td>${reg.animal.nome || '-'}</td>
                        <td>${reg.nome_vacina}</td>
                        <td>${new Date(reg.data_aplicacao).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                        <td>${proximaDose.toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                    </tr>
                `;
                corpoTabela.innerHTML += linha;
            });
        }
        // Fim da lógica de preencher a tabela

        // 2. Buscar animais para o dropdown (lógica existente)
        const responseAnimais = await fetch(`${API_URL}/animais`);
        if (!responseAnimais.ok) throw new Error('Falha ao buscar lista de animais.');
        const animais = await responseAnimais.json();

        const selectAnimal = document.getElementById('vacina-animal-id-select');
        selectAnimal.innerHTML = '<option value="" selected disabled>Selecione um animal...</option>';
        animais.forEach(animal => {
            const option = `<option value="${animal.id}">${animal.brinco} - ${animal.nome || 'Sem nome'}</option>`;
            selectAnimal.innerHTML += option;
        });

        // 3. Configurar o formulário com validação e depuração (LÓGICA ATUALIZADA)
        const formVacinaGeral = document.getElementById('form-nova-vacina-geral');
        
        // Verificamos se o listener já não foi adicionado para evitar duplicação
        if (!formVacinaGeral.dataset.listenerAdicionado) {
            formVacinaGeral.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const selectElement = document.getElementById('vacina-animal-id-select');
                const animalIdSelecionado = selectElement.value;

                // --- PONTO DE VERIFICAÇÃO E DEPURAÇÃO ---
                console.log("Tentando enviar. Valor pego do select:", animalIdSelecionado); 
                
                // Validação mais robusta no frontend
                if (!animalIdSelecionado || animalIdSelecionado === "") {
                    alert("Erro: É obrigatório selecionar um animal da lista.");
                    return; // Interrompe a execução aqui mesmo
                }

                const data = {
                    animal_id: parseInt(animalIdSelecionado),
                    data_aplicacao: document.getElementById('vacina-data_aplicacao').value,
                    nome_vacina: document.getElementById('vacina-nome_vacina').value,
                    dose: document.getElementById('vacina-dose').value,
                    dias_revacina: parseInt(document.getElementById('vacina-dias_revacina').value),
                };

                // Mostra no console exatamente o que será enviado
                console.log("Objeto de dados que será enviado para a API:", data);

                await salvarRegistro('/vacinas', data, '#modalRegistrarVacinaGeral', formVacinaGeral, iniciarPaginaVacinas);
            });
            formVacinaGeral.dataset.listenerAdicionado = 'true'; // Marca que o listener foi adicionado
        }

    } catch (error) {
        console.error("Erro na página de vacinas:", error);
        document.getElementById('tabela-vacinas').innerHTML = `<tr><td colspan="5" class="text-danger">${error.message}</td></tr>`;
    }
}