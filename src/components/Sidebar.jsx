import React from 'react';
export default function Sidebar({ usuarioLogado, telaAtual, setTelaAtual, fazerLogout }) {
 const cargo=usuarioLogado.cargo;
 const admin=['Admin','Coordenador'].includes(cargo);
 const restrito=['Aluno','Monitor 5S'].includes(cargo);
 const item=(id,label)=> <button key={id} className={telaAtual===id?'active':''} onClick={()=>setTelaAtual(id)}>{label}</button>;
 return <aside className="sidebar">
   <img className="sidebar-logo" src="/lab5s-logo.png" alt="Lab5S"/>
   <p className="sidebar-caption">PAINEL DO LABORATÓRIO</p>
   <nav>
     {item('acervo','📦  Acervo de insumos')}
     {!restrito&&item('saida','🧪  Saída de insumo')}
     {admin&&item('cadInsumo','➕  Cadastrar insumo')}
     {!restrito&&item('cadUsuario','👤  Cadastrar usuário')}
     {admin&&item('gerenUsuarios','👥  Gerenciar usuários')}
     {admin&&item('historico','📜  Histórico geral')}
     {item('denuncia','⚠️  Denúncia')}
     {cargo!=='Aluno'&&item('checklist','✅  Checklist 5S')}
     {item('inicio','🏠  Sobre o Lab5S')}
   </nav>
   <div className="sidebar-bottom">
     <button className={`sidebar-password ${telaAtual==='senha'?'active':''}`} onClick={()=>setTelaAtual('senha')}>🔒 Alterar senha</button>
     <div className="sidebar-user"><strong>{usuarioLogado.nome}</strong><span>{cargo}</span></div>
     <button className="btn-sair" onClick={fazerLogout}>↪ Sair da conta</button>
   </div>
 </aside>;
}
