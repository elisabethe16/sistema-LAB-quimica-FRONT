import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TelaCadastroUsuario from './CadastroUsuario';
import { API_URL } from '../services.js';
import { Icon } from '../components/UiIcon';

export default function TelaGerenciarUsuarios({ usuarioLogado, mostrarNotificacao }) {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [excluir, setExcluir] = useState(null);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');

  async function carregarUsuarios() {
    try {
      const { data } = await axios.get(`${API_URL}/usuarios`);
      setUsuarios((data || []).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')));
      setErro('');
    } catch (err) {
      setErro(err.response?.data?.error || 'Não foi possível carregar os usuários.');
    }
  }
  useEffect(() => { carregarUsuarios(); }, []);

  async function confirmarExclusao() {
    if (!excluir || ocupado) return;
    setOcupado(true);
    try {
      await axios.delete(`${API_URL}/usuarios/${excluir.id}`, {
        params: { usuario_responsavel: usuarioLogado.nome }
      });
      mostrarNotificacao('Usuário removido com sucesso!', 'success');
      setExcluir(null);
      await carregarUsuarios();
    } catch (err) {
      mostrarNotificacao(err.response?.data?.error || 'Erro ao remover usuário.', 'error');
    } finally { setOcupado(false); }
  }

  if (usuarioSelecionado) {
    return <TelaCadastroUsuario usuarioParaEditar={usuarioSelecionado} fecharEdicao={() => {
      setUsuarioSelecionado(null); carregarUsuarios();
    }} usuarioLogado={usuarioLogado} mostrarNotificacao={mostrarNotificacao} />;
  }
  const filtrados = usuarios.filter(u => [u.nome, u.login, u.cargo, u.matricula]
    .some(v => String(v || '').toLocaleLowerCase('pt-BR').includes(busca.toLocaleLowerCase('pt-BR'))));

  return <div className="page-container usuarios-page"><section className="acervo-wrap">
    <header className="acervo-heading"><div><span className="eyebrow">EQUIPE · CONTROLE</span>
      <h1>Gerenciar usuários</h1><p>Consulte, edite e gerencie os acessos ao Lab5S.</p></div></header>
    <div className="acervo-panel">
      <div className="acervo-filters usuarios-filters"><input aria-label="Buscar usuários" placeholder="Buscar por nome, matrícula, login ou cargo..." value={busca} onChange={e => setBusca(e.target.value)}/><span className="acervo-count">{filtrados.length} usuário(s)</span></div>
      {erro && <div className="acervo-error" role="alert">{erro} <button onClick={carregarUsuarios}>Tentar novamente</button></div>}
      <div className="table-responsive"><table className="acervo-table usuarios-table"><thead><tr><th>Nome</th><th>Matrícula</th><th>Login</th><th>Cargo</th><th>Ações</th></tr></thead><tbody>
        {filtrados.map(user => <tr key={user.id}>
          <td data-label="Nome"><strong>{user.nome}</strong></td><td data-label="Matrícula">{user.matricula || '—'}</td><td data-label="Login">{user.login}</td><td data-label="Cargo">{user.cargo}</td>
          <td data-label="Ações"><div className="table-actions"><button type="button" className="edit-action" onClick={() => setUsuarioSelecionado(user)}><Icon name="edit"/><span>Editar</span></button><button type="button" className="delete-action" onClick={() => setExcluir(user)}><Icon name="trash"/><span>Excluir</span></button></div></td>
        </tr>)}
        {!filtrados.length && <tr><td className="empty-acervo" colSpan="5">Nenhum usuário encontrado.</td></tr>}
      </tbody></table></div>
    </div>
    {excluir && <div className="confirm-backdrop"><div className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="excluir-usuario-titulo"><h2 id="excluir-usuario-titulo">Excluir usuário?</h2><p>Deseja excluir <strong>{excluir.nome}</strong>? Essa ação não pode ser desfeita.</p><div className="confirm-actions"><button type="button" className="btn-cancel" disabled={ocupado} onClick={() => setExcluir(null)}>Cancelar</button><button type="button" className="btn-danger" disabled={ocupado} onClick={confirmarExclusao}>{ocupado ? 'Excluindo...' : 'Confirmar exclusão'}</button></div></div></div>}
  </section></div>;
}
