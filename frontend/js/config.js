// js/config.js

// URL da sua API rodando localmente (ajuste a porta se for diferente)
const LOCAL_API_URL = 'http://localhost:3000/api';

// URL da sua API quando estiver em produção na Vercel
// IMPORTANTE: Substitua 'seu-backend-url.vercel.app' pela URL real do seu deploy
const PRODUCTION_API_URL = 'https://seu-backend-url.vercel.app/api';

// O script detecta se você está no ambiente local e escolhe a URL correta.
const API_URL = (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost')
    ? LOCAL_API_URL
    : PRODUCTION_API_URL;