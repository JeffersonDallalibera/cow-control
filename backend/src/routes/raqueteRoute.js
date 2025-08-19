const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Criar Raquete
router.post('/', async (req, res) => {
  const { animal_id, data_teste, anterior_esquerdo, anterior_direito, posterior_esquerdo, posterior_direito, observacoes } = req.body;
  const { data, error } = await supabase
    .from('Raquete')
    .insert([{ animal_id, data_teste, anterior_esquerdo, anterior_direito, posterior_esquerdo, posterior_direito, observacoes }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Listar Raquetes
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('Raquete').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;
