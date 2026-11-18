import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../services.js';

export default function Historico() {
  const [historico, setHistorico] = useState([]);
  const [erro, setErro] = useState('');
  useEffect(() => {
    let ativo = true;
    axios.get(`${API_URL}/historico`)
      .then(({data}) => { if (ativo) setHistorico(Array.isArray(data) ? data : []); })
      .catch(() => { if (ativo) setErro('Não foi possível carregar o histórico.'); });
    return () => { ativo = false; };
  }, []);
  return (
    <div className="page-container historico-page">
      <section className="card historico-card">
        <h2>Histórico de Ações</h2>
        {erro && <p role="alert">{erro}</p>}
        <div className="table-responsive historico-table-wrap">
          <table className="historico-table">
            <thead><tr><th>Data/Hora</th><th>Ação</th><th>Detalhes</th><th>Responsável</th></tr></thead>
            <tbody>
              {historico.map(item => (
                <tr key={item.id}>
                  <td data-label="Data/Hora">{item.data_registro ? new Date(item.data_registro).toLocaleString('pt-BR') : '—'}</td>
                  <td data-label="Ação">{item.acao}</td>
                  <td data-label="Detalhes">{item.detalhes || '—'}</td>
                  <td data-label="Responsável">{item.usuario_responsavel || '—'}</td>
                </tr>
              ))}
              {!historico.length && !erro && <tr><td colSpan="4" className="historico-empty">Nenhum registro encontrado.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
