// routes/ccs.routes.js

const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// --- ROTA ANTERIOR: POST /ccsIndividual/create ---
// ROTA ATUALIZADA: POST /api/ccs
// O ID do animal virá no corpo da requisição
router.post('/', async (req, res) => {
  const { animal_id, data_coleta, resultado, metodo, laboratorio } = req.body;

  // Validação básica
  if (!animal_id) {
    return res.status(400).json({ error: 'O ID do animal é obrigatório.' });
  }

  const { data, error } = await supabase
    .from('ccsindividual')
    .insert([{ animal_id, data_coleta, resultado, metodo, laboratorio }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// --- ROTA ANTERIOR: GET /ccsIndividual ---
// ROTA ATUALIZADA: GET /api/ccs
// Lista todos os registros de CCS de todos os animais.
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('ccsindividual').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;