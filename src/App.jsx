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

  // SISTEMA DE NOTIFICAÇÃO (Substitui o Alert)
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
    <div className="page-container" style={{flexDirection: 'column', alignItems: 'center', minHeight: 'calc(100vh - 80px)', position: 'relative'}}>
      <div style={{display: 'flex', gap: '30px', marginBottom: '30px', marginTop: '50px'}}>
        <img src="/logo-eng-quimica.png" alt="Engenharia Química" style={{height: '120px'}} />
        <img src="/logo-uabj.png" alt="UABJ" style={{height: '120px'}} />
      </div>
      <h2 style={{fontSize: '32px', color: '#000080'}}>Bem-vindo ao Controle de Insumos</h2>
      <p style={{fontSize: '18px'}}>Usuário: <strong>{usuarioLogado?.nome}</strong> ({usuarioLogado?.cargo})</p>
      
      <div style={{marginTop: 'auto', paddingBottom: '20px', color: '#666', fontSize: '14px', fontWeight: 'bold'}}>
        Desenvolvido por: Everson Andrade e Maria Elisabethe Almeida
      </div>
    </div>
  );

  const TelaSaidaInsumo = () => {
    const [listaInsumos, setListaInsumos] = useState([]);
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const [form, setForm] = useState({ usuario: usuarioLogado.nome, insumo: '', finalidade: '', quantidade: '' });

    useEffect(() => {
      axios.get(`${API_URL}/insumos`).then(res => {
        const ord = res.data.sort((a,b) => a.nome.localeCompare(b.nome));
        setListaInsumos(ord);
        if(ord.length > 0) setForm(f => ({...f, insumo: ord[0].nome}));
      });
      axios.get(`${API_URL}/usuarios`).then(res => setListaUsuarios(res.data.sort((a,b) => a.nome.localeCompare(b.nome))));
    }, []);

    const registrarSaida = async (e) => {
      e.preventDefault();
      try {
        await axios.post(`${API_URL}/registrar-saida`, { ...form, quantidade: parseInt(form.quantidade), usuario_responsavel: usuarioLogado.nome });
        mostrarNotificacao('Saída registrada com sucesso!', 'success');
        setForm({ ...form, finalidade: '', quantidade: '' });
      } catch (err) { mostrarNotificacao(err.response?.data?.error || 'Erro ao registrar.', 'error'); }
    };

    return (
      <div className="page-container">
        <div className="card">
          <h2>Registrar Saída</h2>
          <form onSubmit={registrarSaida}>
            <div className="form-group"><label>Quem retira?</label><select value={form.usuario} onChange={e => setForm({...form, usuario: e.target.value})}>{listaUsuarios.map(u => <option key={u.id} value={u.nome}>{u.nome}</option>)}</select></div>
            <div className="form-group"><label>Insumo:</label><select value={form.insumo} onChange={e => setForm({...form, insumo: e.target.value})}>{listaInsumos.map(i => <option key={i.id} value={i.nome}>{i.nome}</option>)}</select></div>
            <div className="form-group"><label>Finalidade:</label><input value={form.finalidade} onChange={e => setForm({...form, finalidade: e.target.value})} required/></div>
            <div className="form-group"><label>Quantidade:</label><input type="number" value={form.quantidade} onChange={e => setForm({...form, quantidade: e.target.value})} required/></div>
            <button type="submit" className="btn-submit">Registrar</button>
          </form>
        </div>
      </div>
    );
  };

  const TelaCadastroInsumo = ({ insumoParaEditar, fecharEdicao }) => {
    const [form, setForm] = useState({ nome: '', categoria: 'Ácidos', localizacao: 'Armário 1', quantidade_estoque: '', unidade_medida: 'und' });
    const salvar = async (e) => {
        e.preventDefault();
        try {
            insumoParaEditar ? await axios.put(`${API_URL}/insumos/${insumoParaEditar.id}`, {...form, usuario_responsavel: usuarioLogado.nome}) : await axios.post(`${API_URL}/insumos`, {...form, usuario_responsavel: usuarioLogado.nome});
            mostrarNotificacao('Insumo salvo!', 'success');
            fecharEdicao ? fecharEdicao() : setForm({ nome: '', categoria: 'Ácidos', localizacao: 'Armário 1', quantidade_estoque: '', unidade_medida: 'und' });
        } catch { mostrarNotificacao('Erro ao salvar.', 'error'); }
    };
    return (
        <div className="page-container">
            <div className="card">
                <h2>{insumoParaEditar ? 'Editar' : 'Cadastrar'} Insumo</h2>
                <form onSubmit={salvar}>
                    <div className="form-group"><label>Nome:</label><input value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required/></div>
                    <div className="form-group"><label>Categoria:</label><input list="cats" value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} required/><datalist id="cats"><option value="Ácidos"/><option value="Sais"/></datalist></div>
                    <div className="form-group"><label>Localização:</label><input value={form.localizacao} onChange={e => setForm({...form, localizacao: e.target.value})} required/></div>
                    <button type="submit" className="btn-submit">Salvar</button>
                </form>
            </div>
        </div>
    );
  };

  // --- RENDERIZAÇÃO PRINCIPAL ---
  const renderizarTela = () => {
    switch(telaAtual) {
      case 'inicio': return <TelaInicio />;
      case 'saida': return <TelaSaidaInsumo />;
      case 'cadInsumo': return <TelaCadastroInsumo />;
      default: return <TelaInicio />;
    }
  };

  return (
    <div className="app-container">
      {/* Container fixo para as notificações */}
      <div className="notification-container">
        {notificacoes.map(n => <div key={n.id} className={`notification ${n.tipo}`}>{n.mensagem}</div>)}
      </div>

      {!usuarioLogado ? (
        <div className="login-screen">
            <div className="login-card">
              <h2>Acesso</h2>
              <form onSubmit={fazerLogin}>
                <input type="text" placeholder="Login" value={loginUser} onChange={e => setLoginUser(e.target.value)} required />
                <input type="password" placeholder="Senha" value={loginSenha} onChange={e => setLoginSenha(e.target.value)} required />
                <button type="submit">Entrar</button>
              </form>
            </div>
        </div>
      ) : (
        <>
            <div className="sidebar">
                <h3>Menu</h3>
                <button onClick={() => setTelaAtual('inicio')}>🏠 Início</button>
                {usuarioLogado.cargo !== 'Aluno' && <button onClick={() => setTelaAtual('saida')}>🧪 Saída</button>}
                <button onClick={() => setTelaAtual('acervo')}>📦 Acervo</button>
                {(usuarioLogado.cargo === 'Admin' || usuarioLogado.cargo === 'Coordenador') && <button onClick={() => setTelaAtual('cadInsumo')}>➕ Insumo</button>}
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
