const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Criar CCS Individual
router.post('/ccsIndividual/create', async (req, res) => {
  const { animal_id, data_coleta, resultado, metodo, laboratorio } = req.body;
  const { data, error } = await supabase
    .from('CCSIndividual')
    .insert([{ animal_id, data_coleta, resultado, metodo, laboratorio }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Listar CCS
router.get('/ccsIndividual', async (req, res) => {
  const { data, error } = await supabase.from('CCSIndividual').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;
