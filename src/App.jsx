import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'https://sistema-lab-quimica-back.onrender.com';

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [telaAtual, setTelaAtual] = useState('inicio');

  const [loginUser, setLoginUser] = useState('');
  const [loginSenha, setLoginSenha] = useState('');

  const fazerLogin = async (e) => {
    e.preventDefault();
    try {
      const resposta = await axios.post(`${API_URL}/login`, { login: loginUser, senha: loginSenha });
      setUsuarioLogado(resposta.data);
      setTelaAtual('inicio');
    } catch (error) {
      alert('Usuário ou senha incorretos!');
    }
  };

  const fazerLogout = () => {
    setUsuarioLogado(null);
    setLoginUser('');
    setLoginSenha('');
  };

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

  // ==================== TELA 1: INÍCIO ====================
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

  // ==================== TELA 2: REGISTRAR SAÍDA ====================
  const TelaSaidaInsumo = () => {
    const [listaInsumos, setListaInsumos] = useState([]);
    const [form, setForm] = useState({ usuario: '', insumo: '', finalidade: '', quantidade: '' });

    useEffect(() => {
      axios.get(`${API_URL}/insumos`).then(res => {
        setListaInsumos(res.data);
        if (res.data.length > 0) setForm(f => ({...f, insumo: res.data[0].nome}));
      });
    }, []);

    const registrarSaida = async (e) => {
      e.preventDefault();
      try {
        await axios.post(`${API_URL}/registrar-saida`, { ...form, quantidade: parseInt(form.quantidade, 10), usuario_responsavel: usuarioLogado.nome });
        alert('Saída registrada com abatimento no estoque!');
        setForm({ usuario: '', insumo: listaInsumos[0]?.nome || '', finalidade: '', quantidade: '' });
      } catch (error) {
        alert(error.response?.data?.error || 'Erro ao registrar saída.');
      }
    };

    return (
      <div className="page-container">
        <div className="card">
          <h2>Registrar Saída de Insumo</h2>
          <form onSubmit={registrarSaida}>
            <div className="form-group">
              <label>Aluno/Professor:</label>
              <input type="text" value={form.usuario} onChange={(e) => setForm({...form, usuario: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Insumo:</label>
              <select value={form.insumo} onChange={(e) => setForm({...form, insumo: e.target.value})} required>
                {listaInsumos.map(item => <option key={item.id} value={item.nome}>{item.nome} ({item.quantidade_estoque} {item.unidade_medida} disponíveis)</option>)}
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

  // ==================== TELA 3: CADASTRAR / EDITAR INSUMO ====================
  const TelaCadastroInsumo = ({ insumoParaEditar, fecharEdicao }) => {
    const [form, setForm] = useState({ nome: '', categoria: 'Ácidos', quantidade_estoque: '', unidade_medida: 'und' });
    const [categoriasExistentes, setCategoriasExistentes] = useState(['Ácidos', 'Indicadores', 'Hidróxidos e Bases', 'Sais', 'Orgânicos']);
    const [criarNovaCat, setCriarNovaCat] = useState(false);
    const [novaCategoriaText, setNovaCategoriaText] = useState('');

    useEffect(() => {
      axios.get(`${API_URL}/insumos`).then(res => {
        const cats = [...new Set([...categoriasExistentes, ...res.data.map(i => i.categoria)])];
        setCategoriasExistentes(cats);
      });

      if (insumoParaEditar) {
        setForm({
          nome: insumoParaEditar.nome,
          categoria: insumoParaEditar.categoria,
          quantidade_estoque: insumoParaEditar.quantidade_estoque,
          unidade_medida: insumoParaEditar.unidade_medida || 'und'
        });
      }
    }, [insumoParaEditar]);

    const salvarInsumo = async (e) => {
      e.preventDefault();
      const categoriaFinal = criarNovaCat ? novaCategoriaText : form.categoria;

      if (!categoriaFinal) return alert('Por favor, defina a categoria.');

      const dadosInsumo = { ...form, categoria: categoriaFinal, quantidade_estoque: parseInt(form.quantidade_estoque, 10), usuario_responsavel: usuarioLogado.nome };

      try {
        if (insumoParaEditar) {
          await axios.put(`${API_URL}/insumos/${insumoParaEditar.id}`, dadosInsumo);
          alert('Insumo atualizado com sucesso!');
          fecharEdicao();
        } else {
          await axios.post(`${API_URL}/insumos`, dadosInsumo);
          alert('Novo insumo adicionado ao acervo!');
          setForm({ nome: '', categoria: 'Ácidos', quantidade_estoque: '', unidade_medida: 'und' });
          setCriarNovaCat(false);
          setNovaCategoriaText('');
        }
      } catch (error) {
        alert('Erro ao salvar insumo.');
      }
    };

    return (
      <div className="page-container">
        <div className="card">
          <h2>{insumoParaEditar ? 'Editar Insumo' : 'Cadastrar Novo Insumo'}</h2>
          <form onSubmit={salvarInsumo}>
            <div className="form-group">
              <label>Nome do Insumo:</label>
              <input type="text" value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} required />
            </div>

            <div className="form-group">
              <label>Categoria:</label>
              {!criarNovaCat ? (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select value={form.categoria} onChange={(e) => setForm({...form, categoria: e.target.value})}>
                    {categoriasExistentes.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <button type="button" style={{ marginTop: '8px', padding: '0 10px', fontSize: '12px' }} onClick={() => setCriarNovaCat(true)}>➕ Criar Nova</button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" placeholder="Nome da nova categoria" value={novaCategoriaText} onChange={(e) => setNovaCategoriaText(e.target.value)} required />
                  <button type="button" style={{ marginTop: '8px', padding: '0 10px', fontSize: '12px', backgroundColor: '#555' }} onClick={() => setCriarNovaCat(false)}>Selecionar Existente</button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              <div className="form-group" style={{ flex: 2 }}>
                <label>Quantidade em Estoque:</label>
                <input type="number" value={form.quantidade_estoque} onChange={(e) => setForm({...form, quantidade_estoque: e.target.value})} required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Unidade:</label>
                <select value={form.unidade_medida} onChange={(e) => setForm({...form, unidade_medida: e.target.value})}>
                  <option value="und">und</option>
                  <option value="g">g</option>
                  <option value="mg">mg</option>
                  <option value="kg">kg</option>
                  <option value="L">L</option>
                  <option value="ml">ml</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-submit">{insumoParaEditar ? 'Salvar Alterações' : 'Salvar Insumo'}</button>
            {insumoParaEditar && <button type="button" className="btn-submit" style={{ backgroundColor: '#666', marginTop: '10px' }} onClick={fecharEdicao}>Cancelar</button>}
          </form>
        </div>
      </div>
    );
  };

  // ==================== TELA 4: ACERVO (LISTAR, EDITAR E EXCLUIR ITENS) ====================
  const TelaAcervo = () => {
    const [insumos, setInsumos] = useState([]);
    const [insumoSelecionado, setInsumoSelecionado] = useState(null);

    const carregarAcervo = () => {
      axios.get(`${API_URL}/insumos`).then(res => setInsumos(res.data));
    };

    useEffect(() => { carregarAcervo(); }, []);

    const excluirInsumo = async (id) => {
      if (window.confirm('Tem certeza que deseja deletar este insumo do acervo?')) {
        try {
          await axios.delete(`${API_URL}/insumos/${id}?usuario_responsavel=${usuarioLogado.nome}`);
          alert('Insumo removido com sucesso!');
          carregarAcervo();
        } catch (error) {
          alert('Erro ao excluir insumo.');
        }
      }
    };

    if (insumoSelecionado) {
      return <TelaCadastroInsumo insumoParaEditar={insumoSelecionado} fecharEdicao={() => { setInsumoSelecionado(null); carregarAcervo(); }} />;
    }

    return (
      <div className="page-container">
        <div className="card" style={{ maxWidth: '900px' }}>
          <h2>Acervo do Laboratório</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#000080', color: 'white', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Insumo</th>
                <th style={{ padding: '10px' }}>Categoria</th>
                <th style={{ padding: '10px' }}>Estoque Atual</th>
                {usuarioLogado.cargo === 'Admin' && <th style={{ padding: '10px', textAlign: 'center' }}>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {insumos.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>{item.nome}</td>
                  <td style={{ padding: '10px' }}>{item.categoria}</td>
                  <td style={{ padding: '10px' }}>{item.quantidade_estoque} {item.unidade_medida}</td>
                  {usuarioLogado.cargo === 'Admin' && (
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      <button style={{ padding: '5px 10px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', marginRight: '5px', cursor: 'pointer' }} onClick={() => setInsumoSelecionado(item)}>✏️ Editar</button>
                      <button style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => excluirInsumo(item.id)}>🗑️ Excluir</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ==================== TELA 5: CADASTRAR / EDITAR USUÁRIO ====================
  const TelaCadastroUsuario = ({ usuarioParaEditar, fecharEdicao }) => {
    const [form, setForm] = useState({ nome: '', login: '', senha: '', cargo: 'Aluno', matricula: '' });

    useEffect(() => {
      if (usuarioParaEditar) setForm({ nome: usuarioParaEditar.nome, login: usuarioParaEditar.login, senha: usuarioParaEditar.senha, cargo: usuarioParaEditar.cargo, matricula: usuarioParaEditar.matricula || '' });
    }, [usuarioParaEditar]);

    const salvarUsuario = async (e) => {
      e.preventDefault();
      try {
        if (usuarioParaEditar) {
          await axios.put(`${API_URL}/usuarios/${usuarioParaEditar.id}`, { ...form, usuario_responsavel: usuarioLogado.nome });
          alert('Usuário atualizado!');
          fecharEdicao();
        } else {
          await axios.post(`${API_URL}/usuarios`, { ...form, usuario_responsavel: usuarioLogado.nome });
          alert('Usuário cadastrado!');
          setForm({ nome: '', login: '', senha: '', cargo: 'Aluno', matricula: '' });
        }
      } catch (error) {
        alert(error.response?.data?.error || 'Erro ao salvar usuário.');
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
            <div className="form-group"><label>Senha:</label><input type="password" value={form.senha} onChange={(e) => setForm({...form, senha: e.target.value})} required /></div>
            <div className="form-group">
              <label>Cargo:</label>
              <select value={form.cargo} onChange={(e) => setForm({...form, cargo: e.target.value})}>
                <option>Aluno</option><option>Professor</option><option>Admin</option>
              </select>
            </div>
            <button type="submit" className="btn-submit">{usuarioParaEditar ? 'Salvar Alterações' : 'Salvar Usuário'}</button>
            {usuarioParaEditar && <button type="button" className="btn-submit" style={{ backgroundColor: '#666', marginTop: '10px' }} onClick={fecharEdicao}>Cancelar</button>}
          </form>
        </div>
      </div>
    );
  };

  // ==================== TELA 6: GERENCIAR USUÁRIOS (LISTAR, ATUALIZAR, EXCLUIR) ====================
  const TelaGerenciarUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

    const carregarUsuarios = () => {
      axios.get(`${API_URL}/usuarios`).then(res => setUsuarios(res.data));
    };

    useEffect(() => { carregarUsuarios(); }, []);

    const excluirUsuario = async (id) => {
      if (window.confirm('Excluir este usuário permanentemente?')) {
        try {
          await axios.delete(`${API_URL}/usuarios/${id}?usuario_responsavel=${usuarioLogado.nome}`);
          alert('Usuário removido!');
          carregarUsuarios();
        } catch (error) {
          alert('Erro ao remover usuário.');
        }
      }
    };

    if (usuarioSelecionado) {
      return <TelaCadastroUsuario usuarioParaEditar={usuarioSelecionado} fecharEdicao={() => { setUsuarioSelecionado(null); carregarUsuarios(); }} />;
    }

    return (
      <div className="page-container">
        <div className="card" style={{ maxWidth: '900px' }}>
          <h2>Usuários Cadastrados</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
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
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <button style={{ padding: '5px 10px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', marginRight: '5px', cursor: 'pointer' }} onClick={() => setUsuarioSelecionado(user)}>✏️ Editar</button>
                    <button style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => excluirUsuario(user.id)}>🗑️ Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ==================== TELA 7: HISTÓRICO GERAL ====================
  const TelaHistorico = () => {
    const [historico, setHistorico] = useState([]);
    useEffect(() => { axios.get(`${API_URL}/historico`).then(res => setHistorico(res.data)); }, []);

    return (
      <div className="page-container">
        <div className="card" style={{ maxWidth: '950px' }}>
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
      case 'acervo': return <TelaAcervo />;
      case 'cadUsuario': return <TelaCadastroUsuario />;
      case 'gerenUsuarios': return <TelaGerenciarUsuarios />;
      case 'historico': return <TelaHistorico />;
      default: return <TelaInicio />;
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <h3>Menu do Sistema</h3>
        <button className={telaAtual === 'inicio' ? 'active' : ''} onClick={() => setTelaAtual('inicio')}>🏠 Início</button>
        <button className={telaAtual === 'saida' ? 'active' : ''} onClick={() => setTelaAtual('saida')}>🧪 Saída de Insumo</button>
        <button className={telaAtual === 'acervo' ? 'active' : ''} onClick={() => setTelaAtual('acervo')}>📦 Acervo</button>
        
        {usuarioLogado.cargo === 'Admin' && (
          <>
            <button className={telaAtual === 'cadInsumo' ? 'active' : ''} onClick={() => setTelaAtual('cadInsumo')}>➕ Cadastrar Insumo</button>
            <button className={telaAtual === 'cadUsuario' ? 'active' : ''} onClick={() => setTelaAtual('cadUsuario')}>👤 Criar Usuário</button>
            <button className={telaAtual === 'gerenUsuarios' ? 'active' : ''} onClick={() => setTelaAtual('gerenUsuarios')}>👥 Gerenciar Usuários</button>
            <button className={telaAtual === 'historico' ? 'active' : ''} onClick={() => setTelaAtual('historico')}>📜 Histórico Geral</button>
          </>
        )}
        <button className="btn-sair" onClick={fazerLogout}>Sair do Sistema</button>
      </div>

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
