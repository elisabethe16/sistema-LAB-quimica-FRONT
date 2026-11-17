import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { API_URL } from '../services.js';
const TelaCadastroUsuario = ({ usuarioParaEditar, fecharEdicao, usuarioLogado, mostrarNotificacao }) => {
  const [form, setForm] = useState({ nome: '', login: '', senha: '', cargo: 'Aluno', matricula: '' });

  useEffect(() => {
    if (usuarioParaEditar) setForm({ nome: usuarioParaEditar.nome, login: usuarioParaEditar.login, senha: '', cargo: usuarioParaEditar.cargo, matricula: usuarioParaEditar.matricula || '' });
  }, [usuarioParaEditar]);

  const salvarUsuario = async (e) => {
    e.preventDefault();
    try {
      if (usuarioParaEditar) {
        await axios.put(`${API_URL}/usuarios/${usuarioParaEditar.id}`, { ...form, usuario_responsavel: usuarioLogado.nome });
        mostrarNotificacao('Usuário atualizado com sucesso!', 'success');
        fecharEdicao();
      } else {
        await axios.post(`${API_URL}/usuarios`, { ...form, usuario_responsavel: usuarioLogado.nome, cargo_responsavel: usuarioLogado.cargo });
        mostrarNotificacao('Usuário cadastrado com sucesso!', 'success');
        setForm({ nome: '', login: '', senha: '', cargo: 'Aluno', matricula: '' });
      }
    } catch (error) { 
      mostrarNotificacao(error.response?.data?.error || 'Erro ao salvar usuário.', 'error'); 
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2>{usuarioParaEditar ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}</h2>
        <form onSubmit={salvarUsuario}>
          <div className="form-group"><label>Nome Completo:</label><input type="text" value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} required /></div>
          <div className="form-group"><label>Matrícula / ID:</label><input type="text" value={form.matricula} onChange={(e) => setForm({...form, matricula: e.target.value})} required /></div>
          <div className="form-group"><label>Login de Acesso:</label><input type="text" value={form.login} onChange={(e) => setForm({...form, login: e.target.value})} required /></div>
          <div className="form-group"><label>Senha:</label><input type="password" value={form.senha} onChange={(e) => setForm({...form, senha: e.target.value})} placeholder={usuarioParaEditar ? 'Deixe em branco para manter a senha atual' : 'Mínimo de 8 caracteres'} minLength={8} required={!usuarioParaEditar} /></div>
          <div className="form-group">
            <label>Cargo:</label>
            <select value={form.cargo} onChange={(e) => setForm({...form, cargo: e.target.value})}>
              {usuarioLogado.cargo === 'Professor' ? (
                <>
                  <option value="Aluno">Aluno</option>
                  <option value="Professor">Professor</option>
                  <option value="Monitor 5S">Monitor 5S</option>
                </>
              ) : (
                <>
                  <option value="Aluno">Aluno</option>
                  <option value="Monitor 5S">Monitor 5S</option>
                  <option value="Professor">Professor</option>
                  <option value="Coordenador">Coordenador</option>
                  <option value="Admin">Admin</option>
                </>
              )}
            </select>
          </div>
          <button type="submit" className="btn-submit">{usuarioParaEditar ? 'Salvar Alterações' : 'Salvar Usuário'}</button>
          {usuarioParaEditar && <button type="button" className="btn-submit" style={{ backgroundColor: '#666', marginTop: '10px' }} onClick={fecharEdicao}>Cancelar</button>}
        </form>
      </div>
    </div>
  );
};

export default TelaCadastroUsuario;
