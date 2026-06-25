import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'https://sistema-lab-quimica-back.onrender.com';

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [telaAtual, setTelaAtual] = useState('inicio');
  const [notificacoes, setNotificacoes] = useState([]);
  const [loginUser, setLoginUser] = useState('');
  const [loginSenha, setLoginSenha] = useState('');

  const mostrarNotificacao = (mensagem, tipo) => {
    const id = Date.now();
    setNotificacoes(prev => [...prev, { id, mensagem, tipo }]);
    setTimeout(() => setNotificacoes(prev => prev.filter(n => n.id !== id)), 3000);
  };

  const fazerLogin = async (e) => {
    e.preventDefault();
    try {
      const resposta = await axios.post(`${API_URL}/login`, { login: loginUser, senha: loginSenha });
      setUsuarioLogado(resposta.data);
      setTelaAtual('inicio');
      mostrarNotificacao('Login realizado com sucesso!', 'success');
    } catch (error) {
      mostrarNotificacao('Usuário ou senha incorretos!', 'error');
    }
  };

  const fazerLogout = () => {
    setUsuarioLogado(null);
    setLoginUser('');
    setLoginSenha('');
    mostrarNotificacao('Sessão encerrada.', 'success');
  };

  // --- COMPONENTES DE TELA ---

  const TelaInicio = () => (
    <div className="page-container" style={{flexDirection: 'column', alignItems: 'center'}}>
      <h2 style={{fontSize: '32px', color: '#000080'}}>Bem-vindo ao Controle de Insumos</h2>
      <p>Usuário: <strong>{usuarioLogado?.nome}</strong></p>
    </div>
  );

  const TelaSaidaInsumo = () => {
    return (
      <div className="page-container">
        <div className="card"><h2>Registrar Saída</h2><p>Formulário em construção.</p></div>
      </div>
    );
  };

  const TelaAcervo = () => (
    <div className="page-container">
      <div className="card"><h2>Acervo</h2><p>Página de visualização do acervo.</p></div>
    </div>
  );

  const TelaCadastroInsumo = () => (
    <div className="page-container">
      <div className="card"><h2>Cadastrar Insumo</h2><p>Formulário em construção.</p></div>
    </div>
  );

  const renderizarTela = () => {
    switch(telaAtual) {
      case 'inicio': return <TelaInicio />;
      case 'saida': return <TelaSaidaInsumo />;
      case 'cadInsumo': return <TelaCadastroInsumo />;
      case 'acervo': return <TelaAcervo />;
      default: return <TelaInicio />;
    }
  };

  return (
    <div className="app-container">
      <div className="notification-container">
        {notificacoes.map(n => <div key={n.id} className={`notification ${n.tipo}`}>{n.mensagem}</div>)}
      </div>

      {!usuarioLogado ? (
        <div className="login-screen">
          <div className="login-card">
            <h2>Acesso ao Sistema</h2>
            <form onSubmit={fazerLogin}>
              <input type="text" placeholder="Login" value={loginUser} onChange={e => setLoginUser(e.target.value)} required />
              <input type="password" placeholder="Senha" value={loginSenha} onChange={e => setLoginSenha(e.target.value)} required />
              <button type="submit" className="btn-submit">Entrar</button>
            </form>
          </div>
        </div>
      ) : (
        <>
          <div className="sidebar">
            <h3>Menu</h3>
            <button onClick={() => setTelaAtual('inicio')}>🏠 Início</button>
            <button onClick={() => setTelaAtual('saida')}>🧪 Saída</button>
            <button onClick={() => setTelaAtual('acervo')}>📦 Acervo</button>
            <button onClick={() => setTelaAtual('cadInsumo')}>➕ Insumo</button>
            <button className="btn-sair" onClick={fazerLogout}>Sair</button>
          </div>
          <div className="main-content">
            <header className="header"><h1>Controle Insumos</h1></header>
            {renderizarTela()}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
