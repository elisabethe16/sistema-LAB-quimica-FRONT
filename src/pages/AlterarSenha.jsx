import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../services.js';

export default function AlterarSenha({ usuarioLogado, mostrarNotificacao }) {
 const [atual,setAtual]=useState('');
 const [nova,setNova]=useState('');
 const [confirmacao,setConfirmacao]=useState('');
 const [salvando,setSalvando]=useState(false);
 async function enviar(e) {
   e.preventDefault();
   if (nova.length < 8) return mostrarNotificacao('A nova senha deve ter pelo menos 8 caracteres.','error');
   if (nova !== confirmacao) return mostrarNotificacao('A confirmação não corresponde à nova senha.','error');
   setSalvando(true);
   try {
     await axios.post(`${API_URL}/alterar-senha`, {
       usuario_id: usuarioLogado.id,
       login: usuarioLogado.login,
       senha_atual: atual,
       nova_senha: nova
     });
     setAtual(''); setNova(''); setConfirmacao('');
     mostrarNotificacao('Senha alterada com sucesso!','success');
   } catch(err) {
     mostrarNotificacao(err.response?.data?.error || 'Não foi possível alterar a senha.','error');
   } finally { setSalvando(false); }
 }
 return <div className="page-container"><section className="card password-card">
   <span className="eyebrow">SEGURANÇA DA CONTA</span>
   <h2>Alterar senha</h2>
   <p className="muted-copy">Escolha uma senha forte e não a compartilhe com outras pessoas.</p>
   <form onSubmit={enviar}>
    <div className="form-group"><label>Senha atual</label><input type="password" autoComplete="current-password" value={atual} onChange={e=>setAtual(e.target.value)} required/></div>
    <div className="form-group"><label>Nova senha</label><input type="password" autoComplete="new-password" minLength={8} value={nova} onChange={e=>setNova(e.target.value)} required/><small>Mínimo de 8 caracteres.</small></div>
    <div className="form-group"><label>Confirmar nova senha</label><input type="password" autoComplete="new-password" value={confirmacao} onChange={e=>setConfirmacao(e.target.value)} required/></div>
    <button className="btn-submit" disabled={salvando}>{salvando?'Salvando...':'Salvar nova senha'}</button>
   </form>
 </section></div>;
}
