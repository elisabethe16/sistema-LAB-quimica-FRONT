import React from 'react';
import { Icon } from './UiIcon';
export default function Sidebar({usuarioLogado,telaAtual,setTelaAtual,fazerLogout,menuAberto,fecharMenu}) {
 const cargo=usuarioLogado.cargo; const admin=['Admin','Coordenador'].includes(cargo); const restrito=['Aluno','Monitor 5S'].includes(cargo);
 const item=(id,label,icone)=><button key={id} className={telaAtual===id?'active':''} onClick={()=>{setTelaAtual(id);fecharMenu?.()}}><Icon name={icone}/><span>{label}</span></button>;
 return <><div className={'sidebar-overlay '+(menuAberto?'show':'')} onClick={fecharMenu} aria-hidden="true"/><aside id="lab5s-sidebar" className={'sidebar '+(menuAberto?'open':'')}><img className="sidebar-logo" src="/lab5s-logo.png" alt="Lab5S"/><p className="sidebar-caption">PAINEL DO LABORATÓRIO</p><nav>
 {item('acervo','Acervo de insumos','archive')}{!restrito&&item('saida','Saída de insumo','arrow-up-right')}{admin&&item('cadInsumo','Cadastrar insumo','plus')}{!restrito&&item('cadUsuario','Cadastrar usuário','user-plus')}{admin&&item('gerenUsuarios','Gerenciar usuários','users')}{admin&&item('historico','Histórico geral','clock')}{item('denuncia','Denúncia','alert-triangle')}{cargo!=='Aluno'&&item('checklist','Checklist 5S','clipboard-check')}{item('inicio','Sobre o Lab5S','info')}
 </nav><div className="sidebar-bottom"><button className={'sidebar-password '+(telaAtual==='senha'?'active':'')} onClick={()=>{setTelaAtual('senha');fecharMenu?.()}}><Icon name="lock"/>Alterar senha</button><div className="sidebar-user"><strong>{usuarioLogado.nome}</strong><span>{cargo}</span></div><button className="btn-sair" onClick={fazerLogout}><Icon name="log-out"/>Sair da conta</button></div></aside></>;
}
