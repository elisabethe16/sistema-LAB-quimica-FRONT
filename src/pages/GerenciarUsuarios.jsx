import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TelaCadastroUsuario from './CadastroUsuario';

import { API_URL } from '../services.js';
const TelaGerenciarUsuarios = ({ usuarioLogado, mostrarNotificacao }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  const carregarUsuarios = () => {
    axios.get(`${API_URL}/usuarios`).then(res => setUsuarios(res.data.sort((a, b) => a.nome.localeCompare(b.nome))));
  };

  useEffect(() => { carregarUsuarios(); }, []);

  if (usuarioSelecionado) {
    return <TelaCadastroUsuario usuarioParaEditar={usuarioSelecionado} fecharEdicao={() => { setUsuarioSelecionado(null); carregarUsuarios(); }} usuarioLogado={usuarioLogado} mostrarNotificacao={mostrarNotificacao} />;
  }

  return (
    <div className="page-container">
      <div className="card" style={{ maxWidth: '900px' }}>
        <h2>Usuários Cadastrados</h2>
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', minWidth: '600px' }}>
            <thead>
              <tr style={{ backgroundColor: '#000080', color: 'white', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Nome</th>
                <th style={{ padding: '10px' }}>Matrícula</th>
                <th style={{ padding: '10px' }}>Login</th>
                <th style={{ padding: '10px' }}>Cargo</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>{user.nome}</td>
                  <td style={{ padding: '10px' }}>{user.matricula || '---'}</td>
                  <td style={{ padding: '10px' }}>{user.login}</td>
                  <td style={{ padding: '10px' }}>{user.cargo}</td>
                  <td style={{ padding: '10px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <button style={{ padding: '5px 10px', backgroundColor: '#ffc107', border: 'none', borderRadius: '4px', marginRight: '5px' }} onClick={() => setUsuarioSelecionado(user)}>✏️</button>
                    <button style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }} onClick={async () => {
                      if (window.confirm('Remover este usuário?')) {
                        try {
                          await axios.delete(`${API_URL}/usuarios/${user.id}?usuario_responsavel=${usuarioLogado.nome}`);
                          mostrarNotificacao('Usuário removido com sucesso!', 'success');
                          carregarUsuarios();
                        } catch (error) {
                          mostrarNotificacao('Erro ao remover usuário.', 'error');
                        }
                      }
                    }}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TelaGerenciarUsuarios;
