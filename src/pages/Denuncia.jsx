import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://sistema-lab-quimica-back.onrender.com';
const TelaDenuncia = () => (
  <div className="page-container">
    <div className="card" style={{ textAlign: 'center' }}>
      <h2 style={{ color: '#dc3545' }}>⚠️ Reportar Ocorrência</h2>
      <p style={{ marginBottom: '20px', fontSize: '16px' }}>
        Encontrou o laboratório desorganizado, materiais fora do lugar ou alguma situação irregular? Faça sua denúncia no formulário abaixo.
      </p>
      
      <img src="/denuncia.jpeg" alt="QR Code Denúncia" style={{ maxWidth: '200px', margin: '0 auto 20px', display: 'block', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }} />
      
      <a href="https://forms.gle/kFNbrvHsak82pAKfA" target="_blank" rel="noopener noreferrer" className="btn-submit" style={{ display: 'inline-block', textDecoration: 'none', backgroundColor: '#dc3545' }}>
        Abrir Formulário de Denúncia
      </a>
    </div>
  </div>
);

export default TelaDenuncia;
