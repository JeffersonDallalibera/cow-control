const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Criar CCS Tanque
router.post('/', async (req, res) => {
  const { data_coleta, volume_litros, resultado, laboratorio, observacoes } = req.body;
  const { data, error } = await supabase
    .from('ccstanque')
    .insert([{ data_coleta, volume_litros, resultado, laboratorio, observacoes }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Listar CCS Tanque
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('ccstanque').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;
