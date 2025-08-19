const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Criar Animal
router.post('/CreateCow', async (req, res) => {
  const { brinco, nome, lote, data_nascimento, raca } = req.body;
  const { data, error } = await supabase
    .from('Animal')
    .insert([{ brinco, nome, lote, data_nascimento, raca }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Listar Animais
router.get('/ListAllCows', async (req, res) => {
  const { data, error } = await supabase.from('Animal').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Atualizar Animal
router.put('/UpdateCow/:id', async (req, res) => {
  const { id } = req.params;
  const { brinco, nome, lote, data_nascimento, raca } = req.body;
  const { data, error } = await supabase
    .from('Animal')
    .update({ brinco, nome, lote, data_nascimento, raca })
    .eq('id', id)
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Deletar Animal
router.delete('/DeleteCow/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('Animal').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Animal deletado com sucesso' });
});

module.exports = router;
