const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// ROTA: POST /api/ccs-tanque
router.post('/', async (req, res) => {
    const { data_coleta, volume_litros, resultado, laboratorio, observacoes } = req.body;
    const { data, error } = await supabase
        .from('ccstanque')
        .insert([{ data_coleta, volume_litros, resultado, laboratorio, observacoes }])
        .select()
        .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
});

// ROTA: GET /api/ccs-tanque
router.get('/', async (req, res) => {
    const { data, error } = await supabase.from('ccstanque').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

module.exports = router;