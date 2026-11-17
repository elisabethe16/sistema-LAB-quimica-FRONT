import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { API_URL } from '../services.js';
const TelaChecklist = () => (
  <div className="page-container">
    <div className="card" style={{ textAlign: 'center' }}>
      <h2 style={{ color: '#28a745' }}>✅ Checklist de Vistoria 5S</h2>
      <p style={{ marginBottom: '20px', fontSize: '16px' }}>
        Área destinada à equipe responsável para preenchimento do relatório de manutenção e organização do laboratório (Padrão 5S).
      </p>
      
      <img src="/checklist.jpeg" alt="QR Code Checklist" style={{ maxWidth: '200px', margin: '0 auto 20px', display: 'block', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }} />
      
      <a href="https://forms.gle/GF1pPYNk5V3wSYoG9" target="_blank" rel="noopener noreferrer" className="btn-submit" style={{ display: 'inline-block', textDecoration: 'none', backgroundColor: '#28a745' }}>
        Abrir Formulário de Vistoria
      </a>
    </div>
  </div>
);

export default TelaChecklist;
