import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { API_URL } from './services';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Notificacoes from './components/Notificacoes';
import ModalBoasVindas from './components/ModalBoasVindas';
import Inicio from './pages/Inicio';
import Denuncia from './pages/Denuncia';
import Checklist from './pages/Checklist';
import Saida from './pages/SaidaInsumo';
import CadastroInsumo from './pages/CadastroInsumo';
import Acervo from './pages/Acervo';
import CadastroUsuario from './pages/CadastroUsuario';
import GerenciarUsuarios from './pages/GerenciarUsuarios';
import Historico from './pages/Historico';

export default function App() {
 const [usuarioLogado,setUsuarioLogado]=useState(null);
 const [telaAtual,setTelaAtual]=useState('acervo');
 const [loginUser,setLoginUser]=useState(''); const [loginSenha,setLoginSenha]=useState('');
 const [notificacoes,setNotificacoes]=useState([]); const [mostrarBoasVindas,setMostrarBoasVindas]=useState(false);
 const mostrarNotificacao=(mensagem,tipo='success')=>{const id=Date.now();setNotificacoes(p=>[...p,{id,mensagem,tipo}]);setTimeout(()=>setNotificacoes(p=>p.filter(n=>n.id!==id)),3500);};
 const fazerLogin=async(e)=>{e.preventDefault();try{const r=await axios.post(`${API_URL}/login`,{login:loginUser,senha:loginSenha});setUsuarioLogado(r.data);setTelaAtual('acervo');setMostrarBoasVindas(true);mostrarNotificacao(`Bem-vindo, ${r.data.nome}!`,'success');}catch(e){mostrarNotificacao('Usuário ou senha incorretos!','error');}};
 const fazerLogout=()=>{setUsuarioLogado(null);setLoginUser('');setLoginSenha('');setMostrarBoasVindas(false);};
 if(!usuarioLogado) return <main className="login-screen"><Notificacoes notificacoes={notificacoes}/><form className="login-card" onSubmit={fazerLogin}><img src="/lab5s-logo.png" alt="Logo Lab5S"/><span className="eyebrow">GESTÃO LABORATORIAL 5S</span><h1>Acesse sua conta</h1><p>Entre para continuar no ambiente Lab5S.</p><label>Login<input value={loginUser} onChange={e=>setLoginUser(e.target.value)} autoComplete="username" required/></label><label>Senha<input type="password" value={loginSenha} onChange={e=>setLoginSenha(e.target.value)} autoComplete="current-password" required/></label><button className="btn-primary" type="submit">Entrar no sistema</button><small>UFRPE • Unidade Acadêmica de Belo Jardim</small></form></main>;
 const cargo=usuarioLogado.cargo; const admin=['Admin','Coordenador'].includes(cargo); const bloqueado=['Aluno','Monitor 5S'].includes(cargo);
 const voltarInicio=<Inicio usuarioLogado={usuarioLogado}/>;
 let pagina;
 switch(telaAtual){
 case 'inicio': pagina=voltarInicio;break;
 case 'denuncia':pagina=<Denuncia/>;break;
 case 'checklist':pagina=cargo==='Aluno'?voltarInicio:<Checklist/>;break;
 case 'saida':pagina=bloqueado?voltarInicio:<Saida usuarioLogado={usuarioLogado} mostrarNotificacao={mostrarNotificacao}/>;break;
 case 'cadInsumo':pagina=admin?<CadastroInsumo usuarioLogado={usuarioLogado} mostrarNotificacao={mostrarNotificacao}/>:voltarInicio;break;
 case 'acervo':pagina=<Acervo usuarioLogado={usuarioLogado} mostrarNotificacao={mostrarNotificacao}/>;break;
 case 'cadUsuario':pagina=!bloqueado?<CadastroUsuario usuarioLogado={usuarioLogado} mostrarNotificacao={mostrarNotificacao}/>:voltarInicio;break;
 case 'gerenUsuarios':pagina=admin?<GerenciarUsuarios usuarioLogado={usuarioLogado} mostrarNotificacao={mostrarNotificacao}/>:voltarInicio;break;
 case 'historico':pagina=admin?<Historico/>:voltarInicio;break;
 default:pagina=<Acervo usuarioLogado={usuarioLogado} mostrarNotificacao={mostrarNotificacao}/>;
 }
 return <div className="app-shell"><Notificacoes notificacoes={notificacoes}/><Sidebar usuarioLogado={usuarioLogado} telaAtual={telaAtual} setTelaAtual={setTelaAtual} fazerLogout={fazerLogout}/><main className="main-content"><Header/>{pagina}</main><ModalBoasVindas aberto={mostrarBoasVindas} fechar={()=>setMostrarBoasVindas(false)} usuario={usuarioLogado}/></div>;
}
