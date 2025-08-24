// routes/animais.routes.js

const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// --- ROTA ANTERIOR: POST /animal/CreateCow ---
// ROTA ATUALIZADA: POST /api/animais
router.post('/', async (req, res) => {
  const { brinco, nome, lote, data_nascimento, raca } = req.body;
  const { data, error } = await supabase
    .from('animal')
    .insert([{ brinco, nome, lote, data_nascimento, raca }])
    .select()
    .single(); // .single() retorna o objeto em vez de um array com um objeto

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data); // 201 Created é o status correto para criação
});

// --- ROTA ANTERIOR: GET /animal/ListAllCows ---
// ROTA ATUALIZADA: GET /api/animais
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('animal').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// --- NOVA ROTA ---
// ROTA PARA BUSCAR UM ÚNICO ANIMAL PELO ID: GET /api/animais/:id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('animal')
        .select('*')
        .eq('id', id)
        .single(); // .single() para buscar apenas um

    if (error) return res.status(400).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Animal não encontrado' }); // Retorna 404 se não achar

    // ANEXANDO OS HISTÓRICOS AO ANIMAL
    // Buscando o histórico de CCS individual para este animal
    const { data: ccsData, error: ccsError } = await supabase.from('ccsindividual').select('*').eq('animal_id', id);
    if (ccsError) return res.status(400).json({ error: ccsError.message });
    
    // Buscando o histórico de testes de raquete para este animal
    const { data: raqueteData, error: raqueteError } = await supabase.from('raquete').select('*').eq('animal_id', id);
    if (raqueteError) return res.status(400).json({ error: raqueteError.message });

    // Adiciona os históricos ao objeto do animal antes de enviar
    const animalComHistorico = {
        ...data,
        historicoCCS: ccsData || [],
        historicoRaquete: raqueteData || [],
        // Adicionar histórico de vacinas aqui quando tiver a tabela
        historicoVacinas: [] 
    };

    res.json(animalComHistorico);
});

// --- ROTA ANTERIOR: PUT /animal/UpdateCow/:id ---
// ROTA ATUALIZADA: PUT /api/animais/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { brinco, nome, lote, data_nascimento, raca } = req.body;
  const { data, error } = await supabase
    .from('animal')
    .update({ brinco, nome, lote, data_nascimento, raca })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// --- ROTA ANTERIOR: DELETE /animal/DeleteCow/:id ---
// ROTA ATUALIZADA: DELETE /api/animais/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  // CORREÇÃO: Usar 'animal' em minúsculo, como o nome da tabela
  const { error } = await supabase.from('animal').delete().eq('id', id); 
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send(); // 204 No Content é o status ideal para delete com sucesso
});

router.get('/count/all', async (req, res) => {
  const { data, error } = await supabase.from('animal').select('id', { count: 'exact' });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ total: data.length });
});


module.exports = router;