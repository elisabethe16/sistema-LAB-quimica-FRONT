import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'https://sistema-lab-quimica-back.onrender.com';

// ==================== TELA 1: INÍCIO ====================
const TelaInicio = ({ usuarioLogado }) => (
  <div className="page-container" style={{flexDirection: 'column', alignItems: 'center', minHeight: 'calc(100vh - 80px)', position: 'relative'}}>
    <div style={{display: 'flex', gap: '30px', marginBottom: '30px', marginTop: '50px'}}>
      <img src="/logo-eng-quimica.png" alt="Engenharia Química" style={{height: '120px'}} />
      <img src="/logo-uabj.png" alt="UABJ" style={{height: '120px'}} />
    </div>
    <h2 style={{fontSize: '32px', color: '#000080'}}>Bem-vindo(a) ao Controle de Insumos</h2>
    <p style={{fontSize: '18px'}}>Usuário logado: <strong>{usuarioLogado.nome}</strong> ({usuarioLogado.cargo})</p>
    
    <div style={{marginTop: 'auto', paddingBottom: '20px', color: '#666', fontSize: '14px', fontWeight: 'bold'}}>
      Desenvolvido por: Everson Andrade e Maria Elisabethe Almeida
    </div>
  </div>
);

// ==================== TELA 2: REGISTRAR SAÍDA ====================
const TelaSaidaInsumo = ({ usuarioLogado }) => {
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
      alert('Saída registrada com abatimento no estoque!');
      setForm({ usuario: usuarioLogado.nome, insumo: listaInsumos[0]?.nome || '', finalidade: '', quantidade: '' });
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

// ==================== TELA 3: CADASTRAR / EDITAR INSUMO ====================
const TelaCadastroInsumo = ({ insumoParaEditar, fecharEdicao, usuarioLogado }) => {
  const [form, setForm] = useState({ nome: '', categoria: 'Ácidos', localizacao: 'Armário 1', quantidade_estoque: '', unidade_medida: 'und' });
  
  const [categoriasExistentes, setCategoriasExistentes] = useState(['Ácidos', 'Indicadores', 'Hidróxidos e Bases', 'Sais', 'Orgânicos'].sort((a,b) => a.localeCompare(b)));
  const [localizacoesExistentes, setLocalizacoesExistentes] = useState(['Armário 1', 'Armário 2', 'Bancada', 'Geladeira'].sort((a,b) => a.localeCompare(b)));
  
  const [isNovaCategoria, setIsNovaCategoria] = useState(false);
  const [isNovaLocalizacao, setIsNovaLocalizacao] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/insumos`).then(res => {
      const cats = [...new Set([...categoriasExistentes, ...res.data.map(i => i.categoria)])].sort((a, b) => a.localeCompare(b));
      const locs = [...new Set([...localizacoesExistentes, ...res.data.map(i => i.localizacao).filter(Boolean)])].sort((a, b) => a.localeCompare(b));
      
      setCategoriasExistentes(cats);
      setLocalizacoesExistentes(locs);
    });

    if (insumoParaEditar) {
      setForm({ nome: insumoParaEditar.nome, categoria: insumoParaEditar.categoria, localizacao: insumoParaEditar.localizacao || '', quantidade_estoque: insumoParaEditar.quantidade_estoque, unidade_medida: insumoParaEditar.unidade_medida || 'und' });
      setIsNovaCategoria(false);
      setIsNovaLocalizacao(false);
    }
  }, [insumoParaEditar]);

  const salvarInsumo = async (e) => {
    e.preventDefault();
    const dadosInsumo = { ...form, quantidade_estoque: parseInt(form.quantidade_estoque, 10), usuario_responsavel: usuarioLogado.nome };
    try {
      if (insumoParaEditar) {
        await axios.put(`${API_URL}/insumos/${insumoParaEditar.id}`, dadosInsumo);
        alert('Insumo atualizado com sucesso!');
        fecharEdicao();
      } else {
        await axios.post(`${API_URL}/insumos`, dadosInsumo);
        alert('Novo insumo adicionado ao acervo!');
        setForm({ nome: '', categoria: categoriasExistentes[0], localizacao: localizacoesExistentes[0], quantidade_estoque: '', unidade_medida: 'und' });
        setIsNovaCategoria(false);
        setIsNovaLocalizacao(false);
      }
    } catch (error) { alert('Erro ao salvar insumo.'); }
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

          <div style={{ display: 'flex', gap: '20px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Categoria:</label>
              {!isNovaCategoria ? (
                <select value={form.categoria} onChange={(e) => {
                    if (e.target.value === 'NOVA') { setIsNovaCategoria(true); setForm({ ...form, categoria: '' }); }
                    else { setForm({ ...form, categoria: e.target.value }); }
                  }} required>
                  <option value="" disabled>Selecione...</option>
                  {categoriasExistentes.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  <option value="NOVA">➕ Criar Nova...</option>
                </select>
              ) : (
                <div style={{ display: 'flex', gap: '5px' }}>
                  <input type="text" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} placeholder="Nova categoria" required autoFocus />
                  <button type="button" style={{ padding: '0 10px', backgroundColor: '#666', color: 'white', border: 'none' }} onClick={() => { setIsNovaCategoria(false); setForm({ ...form, categoria: categoriasExistentes[0] }); }}>X</button>
                </div>
              )}
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Localização:</label>
              {!isNovaLocalizacao ? (
                <select value={form.localizacao} onChange={(e) => {
                    if (e.target.value === 'NOVA') { setIsNovaLocalizacao(true); setForm({ ...form, localizacao: '' }); }
                    else { setForm({ ...form, localizacao: e.target.value }); }
                  }} required>
                  {localizacoesExistentes.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  <option value="NOVA">➕ Adicionar Local...</option>
                </select>
              ) : (
                <div style={{ display: 'flex', gap: '5px' }}>
                  <input type="text" value={form.localizacao} onChange={(e) => setForm({ ...form, localizacao: e.target.value })} placeholder="Ex: Prateleira 3" required autoFocus />
                  <button type="button" style={{ padding: '0 10px', backgroundColor: '#666', color: 'white', border: 'none' }} onClick={() => { setIsNovaLocalizacao(false); setForm({ ...form, localizacao: localizacoesExistentes[0] }); }}>X</button>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div className="form-group" style={{ flex: 2 }}>
              <label>Quantidade em Estoque:</label>
              <input type="number" value={form.quantidade_estoque} onChange={(e) => setForm({...form, quantidade_estoque: e.target.value})} required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Unidade:</label>
              <select value={form.unidade_medida} onChange={(e) => setForm({...form, unidade_medida: e.target.value})}>
                <option value="und">und</option><option value="g">g</option><option value="mg">mg</option><option value="kg">kg</option><option value="L">L</option><option value="ml">ml</option>
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

// ==================== TELA 4: ACERVO ====================
const TelaAcervo = ({ usuarioLogado }) => {
  const [insumos, setInsumos] = useState([]);
  const [insumoSelecionado, setInsumoSelecionado] = useState(null);

  const carregarAcervo = () => {
    axios.get(`${API_URL}/insumos`).then(res => setInsumos(res.data.sort((a, b) => a.nome.localeCompare(b.nome))));
  };

  useEffect(() => { carregarAcervo(); }, []);

  if (insumoSelecionado) {
    return <TelaCadastroInsumo insumoParaEditar={insumoSelecionado} fecharEdicao={() => { setInsumoSelecionado(null); carregarAcervo(); }} usuarioLogado={usuarioLogado} />;
  }

  return (
    <div className="page-container">
      <div className="card" style={{ maxWidth: '1000px' }}>
        <h2>Acervo do Laboratório</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#000080', color: 'white', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>Insumo</th>
              <th style={{ padding: '10px' }}>Categoria</th>
              <th style={{ padding: '10px' }}>Localização</th>
              <th style={{ padding: '10px' }}>Estoque Atual</th>
              {(usuarioLogado.cargo === 'Admin' || usuarioLogado.cargo === 'Coordenador') && <th style={{ padding: '10px', textAlign: 'center' }}>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {insumos.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{item.nome}</td>
                <td style={{ padding: '10px' }}>{item.categoria}</td>
                <td style={{ padding: '10px' }}>{item.localizacao}</td>
                <td style={{ padding: '10px' }}>{item.quantidade_estoque} {item.unidade_medida}</td>
                {(usuarioLogado.cargo === 'Admin' || usuarioLogado.cargo === 'Coordenador') && (
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <button style={{ padding: '5px 10px', backgroundColor: '#ffc107', border: 'none', borderRadius: '4px', marginRight: '5px' }} onClick={() => setInsumoSelecionado(item)}>✏️</button>
                    <button style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }} onClick={async () => {
                      if (window.confirm('Excluir este insumo?')) {
                        await axios.delete(`${API_URL}/insumos/${item.id}?usuario_responsavel=${usuarioLogado.nome}`);
                        carregarAcervo();
                      }
                    }}>🗑️</button>
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
const TelaCadastroUsuario = ({ usuarioParaEditar, fecharEdicao, usuarioLogado }) => {
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
        await axios.post(`${API_URL}/usuarios`, { ...form, usuario_responsavel: usuarioLogado.nome, cargo_responsavel: usuarioLogado.cargo });
        alert('Usuário cadastrado com sucesso!');
        setForm({ nome: '', login: '', senha: '', cargo: 'Aluno', matricula: '' });
      }
    } catch (error) { alert(error.response?.data?.error || 'Erro ao salvar usuário.'); }
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
              {usuarioLogado.cargo === 'Professor' ? (
                <>
                  <option value="Aluno">Aluno</option>
                  <option value="Professor">Professor</option>
                </>
              ) : (
                <>
                  <option value="Aluno">Aluno</option>
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

// ==================== TELA 6: GERENCIAR USUÁRIOS ====================
const TelaGerenciarUsuarios = ({ usuarioLogado }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  const carregarUsuarios = () => {
    axios.get(`${API_URL}/usuarios`).then(res => setUsuarios(res.data.sort((a, b) => a.nome.localeCompare(b.nome))));
  };

  useEffect(() => { carregarUsuarios(); }, []);

  if (usuarioSelecionado) {
    return <TelaCadastroUsuario usuarioParaEditar={usuarioSelecionado} fecharEdicao={() => { setUsuarioSelecionado(null); carregarUsuarios(); }} usuarioLogado={usuarioLogado} />;
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
                  <button style={{ padding: '5px 10px', backgroundColor: '#ffc107', border: 'none', borderRadius: '4px', marginRight: '5px' }} onClick={() => setUsuarioSelecionado(user)}>✏️</button>
                  <button style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }} onClick={async () => {
                    if (window.confirm('Remover este usuário?')) {
                      await axios.delete(`${API_URL}/usuarios/${user.id}?usuario_responsavel=${usuarioLogado.nome}`);
                      carregarUsuarios();
                    }
                  }}>🗑️</button>
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

// ==================== APLICAÇÃO PRINCIPAL ====================
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

  const renderizarTela = () => {
    switch(telaAtual) {
      case 'inicio': return <TelaInicio usuarioLogado={usuarioLogado} />;
      case 'saida': 
        if (usuarioLogado.cargo === 'Aluno') return <TelaInicio usuarioLogado={usuarioLogado} />;
        return <TelaSaidaInsumo usuarioLogado={usuarioLogado} />;
      case 'cadInsumo': 
        if (usuarioLogado.cargo === 'Aluno' || usuarioLogado.cargo === 'Professor') return <TelaInicio usuarioLogado={usuarioLogado} />;
        return <TelaCadastroInsumo usuarioLogado={usuarioLogado} />;
      case 'acervo': return <TelaAcervo usuarioLogado={usuarioLogado} />;
      case 'cadUsuario': 
        if (usuarioLogado.cargo === 'Aluno') return <TelaInicio usuarioLogado={usuarioLogado} />;
        return <TelaCadastroUsuario usuarioLogado={usuarioLogado} />;
      case 'gerenUsuarios': 
        if (usuarioLogado.cargo === 'Aluno' || usuarioLogado.cargo === 'Professor') return <TelaInicio usuarioLogado={usuarioLogado} />;
        return <TelaGerenciarUsuarios usuarioLogado={usuarioLogado} />;
      case 'historico': 
        if (usuarioLogado.cargo === 'Aluno' || usuarioLogado.cargo === 'Professor') return <TelaInicio usuarioLogado={usuarioLogado} />;
        return <TelaHistorico />;
      default: return <TelaInicio usuarioLogado={usuarioLogado} />;
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <h3>Menu do Sistema</h3>
        <button className={telaAtual === 'inicio' ? 'active' : ''} onClick={() => setTelaAtual('inicio')}>🏠 Início</button>
        
        {usuarioLogado.cargo !== 'Aluno' && (
          <button className={telaAtual === 'saida' ? 'active' : ''} onClick={() => setTelaAtual('saida')}>🧪 Saída de Insumo</button>
        )}
        
        <button className={telaAtual === 'acervo' ? 'active' : ''} onClick={() => setTelaAtual('acervo')}>📦 Acervo</button>
        
        {(usuarioLogado.cargo === 'Admin' || usuarioLogado.cargo === 'Coordenador') && (
          <button className={telaAtual === 'cadInsumo' ? 'active' : ''} onClick={() => setTelaAtual('cadInsumo')}>➕ Cadastrar Insumo</button>
        )}

        {usuarioLogado.cargo !== 'Aluno' && (
          <button className={telaAtual === 'cadUsuario' ? 'active' : ''} onClick={() => setTelaAtual('cadUsuario')}>👤 Cadastrar Usuário</button>
        )}

        {(usuarioLogado.cargo === 'Admin' || usuarioLogado.cargo === 'Coordenador') && (
          <>
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
