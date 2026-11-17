import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../services.js';

const vazio = { nome:'', categoria:'Ácidos', localizacao:'Armário 1', quantidade_estoque:'', unidade_medida:'und', data_validade:'', sem_data_validade:true, imagem_url:'' };
export default function TelaCadastroInsumo({ insumoParaEditar, fecharEdicao, usuarioLogado, mostrarNotificacao }) {
 const [form,setForm]=useState(vazio);
 const [arquivo,setArquivo]=useState(null);
 const [preview,setPreview]=useState('');
 const [categoriasExistentes,setCategoriasExistentes]=useState(['Ácidos','Indicadores','Hidróxidos e Bases','Sais','Orgânicos']);
 const [localizacoesExistentes,setLocalizacoesExistentes]=useState(['Armário 1','Armário 2','Bancada','Geladeira']);
 const [nomesExistentes,setNomesExistentes]=useState([]);
 const [isNovaCategoria,setIsNovaCategoria]=useState(false);
 const [isNovaLocalizacao,setIsNovaLocalizacao]=useState(false);
 const [salvando,setSalvando]=useState(false);

 useEffect(()=>{
   axios.get(`${API_URL}/insumos`).then(({data})=>{
     setCategoriasExistentes([...new Set([...categoriasExistentes,...data.map(i=>i.categoria).filter(Boolean)])].sort((a,b)=>a.localeCompare(b)));
     setLocalizacoesExistentes([...new Set([...localizacoesExistentes,...data.map(i=>i.localizacao).filter(Boolean)])].sort((a,b)=>a.localeCompare(b)));
     setNomesExistentes(data.filter(i=>!insumoParaEditar || i.id!==insumoParaEditar.id).map(i=>i.nome.trim().toLowerCase()));
   }).catch(()=>{});
   if(insumoParaEditar){
     setForm({...vazio,...insumoParaEditar,data_validade:insumoParaEditar.data_validade||'',sem_data_validade:insumoParaEditar.sem_data_validade ?? !insumoParaEditar.data_validade,quantidade_estoque:insumoParaEditar.quantidade_estoque});
     setPreview(insumoParaEditar.imagem_url||'');
   } else {setForm(vazio);setPreview('');}
   setArquivo(null);
 },[insumoParaEditar]);

 function escolherImagem(e){
   const file=e.target.files?.[0]; if(!file)return;
   if(!['image/jpeg','image/png','image/webp'].includes(file.type)){mostrarNotificacao('Use uma imagem JPG, PNG ou WEBP.','error');return;}
   if(file.size>5*1024*1024){mostrarNotificacao('A imagem deve ter no máximo 5 MB.','error');return;}
   setArquivo(file);setPreview(URL.createObjectURL(file));
 }
 async function salvarInsumo(e){
   e.preventDefault();
   if(!insumoParaEditar && nomesExistentes.includes(form.nome.trim().toLowerCase())) return mostrarNotificacao('Este insumo já está cadastrado! Acesse o Acervo para editar.','error');
   if(!form.sem_data_validade && !form.data_validade) return mostrarNotificacao('Informe a data de validade ou marque sem data de validade.','error');
   setSalvando(true);
   try{
     let imagem_url=form.imagem_url||'';
     if(arquivo){
       const fd=new FormData(); fd.append('imagem',arquivo);
       const upload=await axios.post(`${API_URL}/insumos/upload-imagem`,fd,{headers:{'Content-Type':'multipart/form-data'}});
       imagem_url=upload.data.imagem_url;
     }
     const dados={...form,imagem_url,data_validade:form.sem_data_validade?null:form.data_validade,quantidade_estoque:parseInt(form.quantidade_estoque,10),usuario_responsavel:usuarioLogado.nome};
     if(insumoParaEditar){
       await axios.put(`${API_URL}/insumos/${insumoParaEditar.id}`,dados);
       mostrarNotificacao('Insumo atualizado com sucesso!','success'); fecharEdicao();
     }else{
       await axios.post(`${API_URL}/insumos`,dados);
       mostrarNotificacao('Novo insumo adicionado ao acervo!','success');
       setForm({...vazio,categoria:categoriasExistentes[0],localizacao:localizacoesExistentes[0]});setPreview('');setArquivo(null);
     }
   }catch(err){mostrarNotificacao(err.response?.data?.error||'Erro ao salvar insumo.','error');}
   finally{setSalvando(false);}
 }
 const set=(key,value)=>setForm(prev=>({...prev,[key]:value}));
 return <div className="page-container"><div className="card">
  <h2>{insumoParaEditar?'Editar insumo':'Cadastrar novo insumo'}</h2>
  <form onSubmit={salvarInsumo}>
   <div className="form-group"><label>Nome do insumo</label><input value={form.nome} onChange={e=>set('nome',e.target.value)} required/></div>
   <div className="form-row">
    <div className="form-group" style={{flex:1}}><label>Categoria</label>{!isNovaCategoria?<select value={form.categoria} onChange={e=>e.target.value==='NOVA'?(setIsNovaCategoria(true),set('categoria','')):set('categoria',e.target.value)} required>{categoriasExistentes.map(c=><option key={c}>{c}</option>)}<option value="NOVA">➕ Criar nova...</option></select>:<input autoFocus placeholder="Nova categoria" value={form.categoria} onChange={e=>set('categoria',e.target.value)} required/>}</div>
    <div className="form-group" style={{flex:1}}><label>Localização</label>{!isNovaLocalizacao?<select value={form.localizacao} onChange={e=>e.target.value==='NOVA'?(setIsNovaLocalizacao(true),set('localizacao','')):set('localizacao',e.target.value)} required>{localizacoesExistentes.map(l=><option key={l}>{l}</option>)}<option value="NOVA">➕ Adicionar local...</option></select>:<input autoFocus placeholder="Ex.: Prateleira 3" value={form.localizacao} onChange={e=>set('localizacao',e.target.value)} required/>}</div>
   </div>
   <div className="form-row">
    <div className="form-group" style={{flex:2}}><label>Quantidade em estoque</label><input type="number" min="0" step="1" value={form.quantidade_estoque} onChange={e=>set('quantidade_estoque',e.target.value)} required/></div>
    <div className="form-group" style={{flex:1}}><label>Unidade</label><select value={form.unidade_medida} onChange={e=>set('unidade_medida',e.target.value)}>{['und','g','mg','kg','L','ml'].map(u=><option key={u}>{u}</option>)}</select></div>
   </div>
   <div className="form-group"><label>Imagem do insumo (opcional)</label><label className="image-upload-box">{preview?<img src={preview} alt="Prévia do insumo"/>:<span>＋ Adicionar foto do insumo</span>}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={escolherImagem}/></label><small>JPG, PNG ou WEBP · até 5 MB</small></div>
   <div className="form-group"><label>Validade</label><label className="checkbox-inline"><input type="checkbox" checked={form.sem_data_validade} onChange={e=>setForm(p=>({...p,sem_data_validade:e.target.checked,data_validade:e.target.checked?'':p.data_validade}))}/> Sem data de validade</label>{!form.sem_data_validade&&<input type="date" value={form.data_validade||''} onChange={e=>set('data_validade',e.target.value)} required/>}</div>
   <button type="submit" className="btn-submit" disabled={salvando}>{salvando?'Salvando...':insumoParaEditar?'Salvar alterações':'Salvar insumo'}</button>
   {insumoParaEditar&&<button type="button" className="btn-cancel" onClick={fecharEdicao}>Cancelar</button>}
  </form>
 </div></div>;
}
