import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://sistema-lab-quimica-back.onrender.com';
const TelaHistorico = () => {
  const [historico, setHistorico] = useState([]);
  useEffect(() => { axios.get(`${API_URL}/historico`).then(res => setHistorico(res.data)); }, []);

  return (
    <div className="page-container">
      <div className="card" style={{ maxWidth: '950px' }}>
        <h2>Histórico de Ações</h2>
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', fontSize: '14px', minWidth: '600px' }}>
            <thead>
              <tr style={{ backgroundColor: '#000080', color: 'white', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Data/Hora</th>
                <th style={{ padding: '10px' }}>Ação</th>
                <th style={{ padding: '10px' }}>Detalhes</th>
                <th style={{ padding: '10px' }}>Responsável</th>
              </tr>
            </thead>
            <tbody>
              {historico.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>{new Date(item.data_registro).toLocaleString('pt-BR')}</td>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{item.acao}</td>
                  <td style={{ padding: '10px' }}>{item.detalhes}</td>
                  <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>{item.usuario_responsavel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TelaHistorico;
