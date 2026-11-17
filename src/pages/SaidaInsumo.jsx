import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { API_URL } from '../services.js';
const TelaSaidaInsumo = ({ usuarioLogado, mostrarNotificacao }) => {
  const [listaInsumos, setListaInsumos] = useState([]);
  const [listaUsuarios, setListaUsuarios] = useState([]);
  
  const [form, setForm] = useState({ usuario: usuarioLogado.nome, insumo: '', finalidade: '', quantidade: '' });

  useEffect(() => {
    axios.get(`${API_URL}/insumos`).then(res => {
      const insumosOrdenados = res.data.sort((a, b) => a.nome.localeCompare(b.nome));
      setListaInsumos(insumosOrdenados);
      if (insumosOrdenados.length > 0) setForm(f => ({...f, insumo: insumosOrdenados[0].nome}));
    }).catch(err => console.error("Erro ao carregar insumos:", err));
    
    axios.get(`${API_URL}/usuarios`).then(res => {
      const usuariosOrdenados = res.data.sort((a, b) => a.nome.localeCompare(b.nome));
      setListaUsuarios(usuariosOrdenados);
    }).catch(err => console.error("Erro ao carregar usuários:", err));
  }, []);

  const registrarSaida = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/registrar-saida`, { ...form, quantidade: parseInt(form.quantidade, 10), usuario_responsavel: usuarioLogado.nome });
      mostrarNotificacao('Saída registrada com abatimento no estoque!', 'success');
      setForm({ usuario: usuarioLogado.nome, insumo: listaInsumos[0]?.nome || '', finalidade: '', quantidade: '' });
    } catch (error) {
      mostrarNotificacao(error.response?.data?.error || 'Erro ao registrar saída.', 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2>Registrar Saída de Insumo</h2>
        <form onSubmit={registrarSaida}>
          <div className="form-group">
            <label>Quem está retirando o insumo?</label>
            <select value={form.usuario} onChange={(e) => setForm({...form, usuario: e.target.value})} required>
              {listaUsuarios.map(u => (
                <option key={u.id} value={u.nome}>{u.nome} ({u.cargo})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Insumo:</label>
            <select value={form.insumo} onChange={(e) => setForm({...form, insumo: e.target.value})} required>
              {listaInsumos.map(item => <option key={item.id} value={item.nome}>{item.nome} ({item.quantidade_estoque} {item.unidade_medida} em {item.localizacao})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Finalidade:</label>
            <input type="text" value={form.finalidade} onChange={(e) => setForm({...form, finalidade: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Quantidade de Saída:</label>
            <input type="number" value={form.quantidade} onChange={(e) => setForm({...form, quantidade: e.target.value})} required />
          </div>
          <button type="submit" className="btn-submit">Registrar Saída</button>
        </form>
      </div>
    </div>
  );
};

export default TelaSaidaInsumo;
