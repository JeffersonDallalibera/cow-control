const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// ROTA: POST /api/raquete
router.post('/', async (req, res) => {
    const { animal_id, data_teste, anterior_esquerdo, anterior_direito, posterior_esquerdo, posterior_direito, observacoes } = req.body;

    if (!animal_id) {
        return res.status(400).json({ error: 'O ID do animal é obrigatório.' });
    }

    const { data, error } = await supabase
        .from('raquete')
        .insert([{ animal_id, data_teste, anterior_esquerdo, anterior_direito, posterior_esquerdo, posterior_direito, observacoes }])
        .select()
        .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
});

// ROTA: GET /api/raquete
router.get('/', async (req, res) => {
    const { data, error } = await supabase.from('raquete').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

module.exports = router;