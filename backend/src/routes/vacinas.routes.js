// routes/vacinas.routes.js
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// ROTA: POST /api/vacinas - Criar um novo registro de vacina
router.post('/', async (req, res) => {
    const { animal_id, data_aplicacao, nome_vacina, dose, dias_revacina } = req.body;

    if (!animal_id) {
        return res.status(400).json({ error: 'O ID do animal é obrigatório.' });
    }

    const { data, error } = await supabase
        .from('vacinas')
        .insert([{ animal_id, data_aplicacao, nome_vacina, dose, dias_revacina }])
        .select()
        .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
});

// ROTA: GET /api/vacinas - Listar todos os registros de vacinas
router.get('/', async (req, res) => {
    // Trazendo dados do animal junto (join)
    const { data, error } = await supabase
        .from('vacinas')
        .select(`
            *,
            animal ( id, brinco, nome )
        `);
        
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

module.exports = router;