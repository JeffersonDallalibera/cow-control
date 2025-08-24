// routes/dashboard.routes.js

const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
    try {
        // 1. Contar o total de animais
        const { count: totalAnimais, error: animaisError } = await supabase
            .from('animal')
            .select('*', { count: 'exact', head: true }); // 'head: true' otimiza a contagem

        if (animaisError) throw animaisError;

        // 2. Contar alertas de CCS (Ex: resultado > 400000)
        //    Ajuste o valor de 400000 conforme o critério veterinário.
        const { count: alertasCCS, error: ccsError } = await supabase
            .from('ccsindividual')
            .select('*', { count: 'exact', head: true })
            .gt('resultado', 400000); // .gt() significa "greater than" (maior que)

        if (ccsError) throw ccsError;
        
        // 3. Contar vacinas pendentes (LÓGICA DE EXEMPLO)
        //    Esta é uma lógica de exemplo. Você precisará de uma tabela 'vacinas' no Supabase
        //    com uma coluna 'data_proxima_dose' para isso funcionar de verdade.
        //    Aqui, estamos apenas retornando um número fixo como placeholder.
        const vacinasPendentes = 0; // Altere para a lógica real quando tiver a tabela de vacinas
        // Exemplo de como seria a lógica real:
        // const hoje = new Date().toISOString();
        // const { count, error } = await supabase.from('vacinas').select('*', { count: 'exact', head: true }).lte('data_proxima_dose', hoje);
        // vacinasPendentes = count;


        // Monta o objeto de resposta final
        const dashboardData = {
            totalAnimais: totalAnimais || 0,
            alertasCCS: alertasCCS || 0,
            vacinasPendentes: vacinasPendentes || 0,
        };

        res.json(dashboardData);

    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar dados do dashboard: ' + error.message });
    }
});

module.exports = router;