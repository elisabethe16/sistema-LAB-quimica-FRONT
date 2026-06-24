import React, { useState } from 'react';
import './App.css';

function App() {
  // Estados Globais
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [telaAtual, setTelaAtual] = useState('inicio');

  // Estados do Login
  const [loginUser, setLoginUser] = useState('');
  const [loginSenha, setLoginSenha] = useState('');

  // Função de Login (Simulação inicial do Admin)
  const fazerLogin = (e) => {
    e.preventDefault();
    if (loginUser === 'admin' && loginSenha === '1234') {
      setUsuarioLogado({ nome: 'Administrador Geral', cargo: 'Admin' });
      setTelaAtual('inicio');
    } else {
      alert('Usuário ou senha incorretos!');
    }
  };

  const fazerLogout = () => {
    setUsuarioLogado(null);
    setLoginUser('');
    setLoginSenha('');
  };

  // Se não estiver logado, mostra apenas a tela de Login
  if (!usuarioLogado) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <img src="/logo-eng-quimica.png" alt="Logo Engenharia" />
          <h2>Acesso ao Sistema</h2>
          <form onSubmit={fazerLogin}>
            <div className="form-group">
              <input type="text" placeholder="Usuário" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} required />
            </div>
            <div className="form-group">
              <input type="password" placeholder="Senha" value={loginSenha} onChange={(e) => setLoginSenha(e.target.value)} required />
            </div>
            <button type="submit" className="btn-submit">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  // --- COMPONENTES DAS TELAS INTERNAS ---
  
  const TelaInicio = () => (
    <div className="page-container" style={{flexDirection: 'column', alignItems: 'center', marginTop: '50px'}}>
      <div style={{display: 'flex', gap: '30px', marginBottom: '30px'}}>
        <img src="/logo-eng-quimica.png" alt="Engenharia Química" style={{height: '120px'}} />
        <img src="/logo-uabj.png" alt="UABJ" style={{height: '120px'}} />
      </div>
      <h2 style={{fontSize: '32px', color: '#000080'}}>Bem-vindo(a) ao Controle de Insumos</h2>
      <p>Usuário logado: <strong>{usuarioLogado.nome}</strong> ({usuarioLogado.cargo})</p>
    </div>
  );

  const TelaSaidaInsumo = () => (
    <div className="page-container">
      <div className="card">
        <h2>Registrar Saída de Insumo</h2>
        {/* Aqui entra o seu formulário de saída antigo */}
        <div className="form-group">
          <label>Insumo:</label>
          <select><option>Ácido Aminoacético</option></select>
        </div>
        <div className="form-group">
          <label>Quantidade:</label>
          <input type="number" />
        </div>
        <button className="btn-submit">Registrar Saída</button>
      </div>
    </div>
  );

  const TelaCadastroInsumo = () => (
    <div className="page-container">
      <div className="card">
        <h2>Cadastrar Novo Insumo</h2>
        <div className="form-group"><label>Nome do Insumo:</label><input type="text" /></div>
        <div className="form-group">
          <label>Categoria:</label>
          <select><option>Ácidos</option><option>Sais</option><option>Vidrarias</option></select>
        </div>
        <div className="form-group"><label>Quantidade Inicial:</label><input type="number" /></div>
        <button className="btn-submit">Salvar Insumo</button>
      </div>
    </div>
  );

  const TelaCadastroUsuario = () => (
    <div className="page-container">
      <div className="card">
        <h2>Cadastrar Usuário</h2>
        <div className="form-group"><label>Nome Completo:</label><input type="text" /></div>
        <div className="form-group"><label>Login:</label><input type="text" /></div>
        <div className="form-group"><label>Senha:</label><input type="password" /></div>
        <div className="form-group">
          <label>Cargo:</label>
          <select><option>Aluno</option><option>Professor</option><option>Admin</option></select>
        </div>
        <button className="btn-submit">Salvar Usuário</button>
      </div>
    </div>
  );

  // Renderiza a tela baseada no menu clicado
  const renderizarTela = () => {
    switch(telaAtual) {
      case 'inicio': return <TelaInicio />;
      case 'saida': return <TelaSaidaInsumo />;
      case 'cadInsumo': return <TelaCadastroInsumo />;
      case 'cadUsuario': return <TelaCadastroUsuario />;
      case 'acervo': return <div className="page-container"><div className="card"><h2>Acervo (Em breve)</h2></div></div>;
      case 'historico': return <div className="page-container"><div className="card"><h2>Histórico (Em breve)</h2></div></div>;
      default: return <TelaInicio />;
    }
  };

  // DASHBOARD PRINCIPAL (Só aparece se logado)
  return (
    <div className="app-container">
      {/* BARRA LATERAL */}
      <div className="sidebar">
        <h3>Menu do Sistema</h3>
        <button className={telaAtual === 'inicio' ? 'active' : ''} onClick={() => setTelaAtual('inicio')}>🏠 Início</button>
        <button className={telaAtual === 'saida' ? 'active' : ''} onClick={() => setTelaAtual('saida')}>🧪 Saída de Insumo</button>
        <button className={telaAtual === 'acervo' ? 'active' : ''} onClick={() => setTelaAtual('acervo')}>📦 Acervo</button>
        <button className={telaAtual === 'cadInsumo' ? 'active' : ''} onClick={() => setTelaAtual('cadInsumo')}>➕ Cadastrar Insumo</button>
        <button className={telaAtual === 'cadUsuario' ? 'active' : ''} onClick={() => setTelaAtual('cadUsuario')}>👥 Cadastrar Usuário</button>
        <button className={telaAtual === 'historico' ? 'active' : ''} onClick={() => setTelaAtual('historico')}>📜 Histórico Geral</button>
        <button className="btn-sair" onClick={fazerLogout}>Sair do Sistema</button>
      </div>

      {/* CONTEÚDO À DIREITA */}
      <div className="main-content">
        {/* CABEÇALHO FIXO */}
        <header className="header">
          <img src="/logo-eng-quimica.png" alt="Logo 1" />
          <h1>Controle Insumos</h1>
          <img src="/logo-uabj.png" alt="Logo 2" />
        </header>

        {/* TELAS DINÂMICAS */}
        {renderizarTela()}
      </div>
    </div>
  );
}

export default App;
