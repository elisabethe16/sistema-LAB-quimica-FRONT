import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// URL do seu Back-end no Render (Verifique se é exatamente esta)
const API_URL = 'https://sistema-lab-quimica-back.onrender.com';

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [telaAtual, setTelaAtual] = useState('inicio');

  const [loginUser, setLoginUser] = useState('');
  const [loginSenha, setLoginSenha] = useState('');

  // ==================== LÓGICA DE LOGIN REAL ====================
  const fazerLogin = async (e) => {
    e.preventDefault();
    try {
      const resposta = await axios.post(`${API_URL}/login`, {
        login: loginUser,
        senha: loginSenha
      });
      setUsuarioLogado(resposta.data); // Guarda os dados do usuário vindo do banco
      setTelaAtual('inicio');
    } catch (error) {
      alert('Usuário ou senha incorretos! (Lembre-se: use admin / 1234 na primeira vez)');
    }
  };

  const fazerLogout = () => {
    setUsuarioLogado(null);
    setLoginUser('');
    setLoginSenha('');
  };

  // Se não estiver logado, exibe a tela de login
  if (!usuarioLogado) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <img src="/logo-eng-quimica.png" alt="Logo Engenharia" />
          <h2>Acesso ao Sistema</h2>
          <form onSubmit={fazerLogin}>
            <div className="form-group">
              <input type="text" placeholder="Login" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} required />
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

  // ==================== TELAS DO SISTEMA ====================

  const TelaInicio = () => (
    <div className="page-container" style={{flexDirection: 'column', alignItems: 'center', marginTop: '50px'}}>
      <div style={{display: 'flex', gap: '30px', marginBottom: '30px'}}>
        <img src="/logo-eng-quimica.png" alt="Engenharia Química" style={{height: '120px'}} />
        <img src="/logo-uabj.png" alt="UABJ" style={{height: '120px'}} />
      </div>
      <h2 style={{fontSize: '32px', color: '#000080'}}>Bem-vindo(a) ao Controle de Insumos</h2>
      <p style={{fontSize: '18px'}}>Usuário logado: <strong>{usuarioLogado.nome}</strong> ({usuarioLogado.cargo})</p>
    </div>
  );

  const TelaSaidaInsumo = () => {
    const [listaInsumos, setListaInsumos] = useState([]);
    const [form, setForm] = useState({ usuario: '', insumo: '', finalidade: '', quantidade: '' });

    useEffect(() => {
      // Busca os insumos reais do banco para preencher o select
      axios.get(`${API_URL}/insumos`).then(res => {
        setListaInsumos(res.data);
        if (res.data.length > 0) setForm({...form, insumo: res.data[0].nome});
      });
    }, []);

    const registrarSaida = async (e) => {
      e.preventDefault();
      try {
        await axios.post(`${API_URL}/registrar-saida`, {
          ...form,
          usuario_responsavel: usuarioLogado.nome
        });
        alert('Saída registrada com sucesso!');
        setForm({ usuario: '', insumo: listaInsumos[0]?.nome || '', finalidade: '', quantidade: '' });
      } catch (error) {
        alert('Erro ao registrar saída.');
      }
    };

    return (
      <div className="page-container">
        <div className="card">
          <h2>Registrar Saída de Insumo</h2>
          <form onSubmit={registrarSaida}>
            <div className="form-group">
              <label>Aluno/Professor (Quem vai usar?):</label>
              <input type="text" value={form.usuario} onChange={(e) => setForm({...form, usuario: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Insumo:</label>
              <select value={form.insumo} onChange={(e) => setForm({...form, insumo: e.target.value})} required>
                {listaInsumos.length === 0 ? <option value="">Nenhum insumo no acervo</option> : null}
                {listaInsumos.map(item => (
                  <option key={item.id} value={item.nome}>{item.nome}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Finalidade (Aula/Experimento):</label>
              <input type="text" value={form.finalidade} onChange={(e) => setForm({...form, finalidade: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Quantidade:</label>
              <input type="number" value={form.quantidade} onChange={(e) => setForm({...form, quantidade: e.target.value})} required />
            </div>
            <button type="submit" className="btn-submit">Registrar Saída</button>
          </form>
        </div>
      </div>
    );
  };

  const TelaCadastroInsumo = () => {
    const [form, setForm] = useState({ nome: '', categoria: 'Ácidos', quantidade_estoque: '' });

    const salvarInsumo = async (e) => {
      e.preventDefault();
      try {
        await axios.post(`${API_URL}/insumos`, {
          ...form,
          usuario_responsavel: usuarioLogado.nome
        });
        alert('Insumo cadastrado com sucesso!');
        setForm({ nome: '', categoria: 'Ácidos', quantidade_estoque: '' });
      } catch (error) {
        alert('Erro ao cadastrar insumo.');
      }
    };

    return (
      <div className="page-container">
        <div className="card">
          <h2>Cadastrar Novo Insumo</h2>
          <form onSubmit={salvarInsumo}>
            <div className="form-group">
              <label>Nome do Insumo:</label>
              <input type="text" value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Categoria:</label>
              <select value={form.categoria} onChange={(e) => setForm({...form, categoria: e.target.value})}>
                <option>Ácidos</option>
                <option>Indicadores</option>
                <option>Hidróxidos e Bases</option>
                <option>Sais</option>
                <option>Orgânicos</option>
              </select>
            </div>
            <div className="form-group">
              <label>Quantidade Inicial (Estoque):</label>
              <input type="number" value={form.quantidade_estoque} onChange={(e) => setForm({...form, quantidade_estoque: e.target.value})} required />
            </div>
            <button type="submit" className="btn-submit">Salvar Insumo</button>
          </form>
        </div>
      </div>
    );
  };

  const TelaCadastroUsuario = () => {
    const [form, setForm] = useState({ nome: '', login: '', senha: '', cargo: 'Aluno' });

    const salvarUsuario = async (e) => {
      e.preventDefault();
      try {
        await axios.post(`${API_URL}/usuarios`, {
          ...form,
          usuario_responsavel: usuarioLogado.nome
        });
        alert('Usuário cadastrado com sucesso!');
        setForm({ nome: '', login: '', senha: '', cargo: 'Aluno' });
      } catch (error) {
        alert('Erro. Esse login já pode estar em uso.');
      }
    };

    // Proteção: Apenas Admin pode cadastrar novos usuários
    if (usuarioLogado.cargo !== 'Admin') {
      return <div className="page-container"><h2>Acesso Negado. Apenas Administradores podem cadastrar usuários.</h2></div>;
    }

    return (
      <div className="page-container">
        <div className="card">
          <h2>Cadastrar Novo Usuário</h2>
          <form onSubmit={salvarUsuario}>
            <div className="form-group">
              <label>Nome Completo:</label>
              <input type="text" value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Login de Acesso:</label>
              <input type="text" value={form.login} onChange={(e) => setForm({...form, login: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Senha:</label>
              <input type="password" value={form.senha} onChange={(e) => setForm({...form, senha: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Cargo:</label>
              <select value={form.cargo} onChange={(e) => setForm({...form, cargo: e.target.value})}>
                <option>Aluno</option>
                <option>Professor</option>
                <option>Admin</option>
              </select>
            </div>
            <button type="submit" className="btn-submit">Salvar Usuário</button>
          </form>
        </div>
      </div>
    );
  };

  const TelaAcervo = () => {
    const [insumos, setInsumos] = useState([]);

    useEffect(() => {
      axios.get(`${API_URL}/insumos`).then(res => setInsumos(res.data));
    }, []);

    return (
      <div className="page-container">
        <div className="card" style={{ maxWidth: '800px' }}>
          <h2>Acervo do Laboratório</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#000080', color: 'white', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Insumo</th>
                <th style={{ padding: '10px' }}>Categoria</th>
                <th style={{ padding: '10px' }}>Estoque Base</th>
              </tr>
            </thead>
            <tbody>
              {insumos.length === 0 ? <tr><td colSpan="3" style={{ padding: '15px', textAlign: 'center' }}>Nenhum insumo cadastrado.</td></tr> : null}
              {insumos.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>{item.nome}</td>
                  <td style={{ padding: '10px' }}>{item.categoria}</td>
                  <td style={{ padding: '10px' }}>{item.quantidade_estoque}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const TelaHistorico = () => {
    const [historico, setHistorico] = useState([]);

    useEffect(() => {
      axios.get(`${API_URL}/historico`).then(res => setHistorico(res.data));
    }, []);

    return (
      <div className="page-container">
        <div className="card" style={{ maxWidth: '900px' }}>
          <h2>Histórico de Ações</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#000080', color: 'white', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Data/Hora</th>
                <th style={{ padding: '10px' }}>Ação</th>
                <th style={{ padding: '10px' }}>Detalhes</th>
                <th style={{ padding: '10px' }}>Responsável</th>
              </tr>
            </thead>
            <tbody>
              {historico.length === 0 ? <tr><td colSpan="4" style={{ padding: '15px', textAlign: 'center' }}>Nenhum registro encontrado.</td></tr> : null}
              {historico.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>{new Date(item.data_registro).toLocaleString('pt-BR')}</td>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{item.acao}</td>
                  <td style={{ padding: '10px' }}>{item.detalhes}</td>
                  <td style={{ padding: '10px' }}>{item.usuario_responsavel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderizarTela = () => {
    switch(telaAtual) {
      case 'inicio': return <TelaInicio />;
      case 'saida': return <TelaSaidaInsumo />;
      case 'cadInsumo': return <TelaCadastroInsumo />;
      case 'cadUsuario': return <TelaCadastroUsuario />;
      case 'acervo': return <TelaAcervo />;
      case 'historico': return <TelaHistorico />;
      default: return <TelaInicio />;
    }
  };

  return (
    <div className="app-container">
      {/* BARRA LATERAL */}
      <div className="sidebar">
        <h3>Menu do Sistema</h3>
        <button className={telaAtual === 'inicio' ? 'active' : ''} onClick={() => setTelaAtual('inicio')}>🏠 Início</button>
        <button className={telaAtual === 'saida' ? 'active' : ''} onClick={() => setTelaAtual('saida')}>🧪 Saída de Insumo</button>
        <button className={telaAtual === 'acervo' ? 'active' : ''} onClick={() => setTelaAtual('acervo')}>📦 Acervo</button>
        
        {/* Telas restritas a Administradores */}
        {usuarioLogado.cargo === 'Admin' && (
          <>
            <button className={telaAtual === 'cadInsumo' ? 'active' : ''} onClick={() => setTelaAtual('cadInsumo')}>➕ Cadastrar Insumo</button>
            <button className={telaAtual === 'cadUsuario' ? 'active' : ''} onClick={() => setTelaAtual('cadUsuario')}>👥 Cadastrar Usuário</button>
            <button className={telaAtual === 'historico' ? 'active' : ''} onClick={() => setTelaAtual('historico')}>📜 Histórico Geral</button>
          </>
        )}
        
        <button className="btn-sair" onClick={fazerLogout}>Sair do Sistema</button>
      </div>

      {/* CONTEÚDO À DIREITA */}
      <div className="main-content">
        <header className="header">
          <img src="/logo-eng-quimica.png" alt="Logo Engenharia" />
          <h1>Controle Insumos</h1>
          <img src="/logo-uabj.png" alt="Logo UABJ" />
        </header>

        {renderizarTela()}
      </div>
    </div>
  );
}

export default App;
