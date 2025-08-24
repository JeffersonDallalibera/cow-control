// routes/dashboard.routes.js
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
    try {
        // 1. Contar o total de animais (continua igual)
        const { count: totalAnimais, error: animaisError } = await supabase
            .from('animal')
            .select('*', { count: 'exact', head: true });
        if (animaisError) throw animaisError;

        // 2. Contar alertas de CCS (continua igual)
        const { count: alertasCCS, error: ccsError } = await supabase
            .from('ccsindividual')
            .select('*', { count: 'exact', head: true })
            .gt('resultado', 400000);
        if (ccsError) throw ccsError;
        
        // 3. Lógica REAL para Próximas Vacinas
        const { data: todasVacinas, error: vacinasError } = await supabase
            .from('vacinas')
            .select('data_aplicacao, dias_revacina');
        if (vacinasError) throw vacinasError;

        let vacinasPendentes = 0;
        const hoje = new Date();
        const limiteDias = new Date();
        limiteDias.setDate(hoje.getDate() + 30); // Considera "próximas" as vacinas nos próximos 30 dias

        todasVacinas.forEach(vacina => {
            const dataAplicacao = new Date(vacina.data_aplicacao);
            const proximaDose = new Date(dataAplicacao.setDate(dataAplicacao.getDate() + vacina.dias_revacina));

            if (proximaDose >= hoje && proximaDose <= limiteDias) {
                vacinasPendentes++;
            }
        });

        const dashboardData = {
            totalAnimais: totalAnimais || 0,
            alertasCCS: alertasCCS || 0,
            vacinasPendentes: vacinasPendentes,
        };

        res.json(dashboardData);

    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar dados do dashboard: ' + error.message });
    }
});

module.exports = router;