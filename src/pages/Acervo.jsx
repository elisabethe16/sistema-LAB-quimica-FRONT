import React, {useState,useEffect} from 'react';
import axios from 'axios';
import CadastroInsumo from './CadastroInsumo';
import {API_URL} from '../services.js';
import {Icon} from '../components/UiIcon';
const validade = item => {
 if(item.sem_data_validade || !item.data_validade) return {label:'Sem validade',tipo:'neutral'};
 const data=new Date(`${item.data_validade}T00:00:00`), hoje=new Date(); hoje.setHours(0,0,0,0);
 const dias=Math.round((data-hoje)/86400000), dataBR=data.toLocaleDateString('pt-BR');
 if(dias<0) return {label:`Vencido · ${dataBR}`,tipo:'danger'};
 if(dias<=30) return {label:`A vencer · ${dataBR}`,tipo:'warning'};
 return {label:dataBR,tipo:'ok'};
};
const estoqueBaixo=item=>Number(item.quantidade_estoque)<=Number(item.quantidade_minima_alerta??0);
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function exportarPDF(itens){
 const janela=window.open('','_blank','width=1050,height=760');
 if(!janela){alert('Permita janelas pop-up para salvar o relatório.');return;}
 const linhas=itens.map(i=>`<tr><td>${escapeHtml(i.nome)}</td><td>${escapeHtml(i.categoria)}</td><td>${escapeHtml(i.localizacao)}</td><td>${escapeHtml(i.quantidade_estoque)} ${escapeHtml(i.unidade_medida)}</td><td>${escapeHtml(i.quantidade_minima_alerta??0)}</td><td>${escapeHtml(validade(i).label)}</td><td>${estoqueBaixo(i)?'Estoque baixo':'Regular'}</td></tr>`).join('');
 janela.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Lab5S - Relatório do Acervo</title><style>@page{size:A4 landscape;margin:14mm}body{font:12px Arial;color:#0B1F3B}header{border-bottom:3px solid #B388FF;padding-bottom:12px}h1{margin:0;font-size:26px}p{color:#53647c}table{border-collapse:collapse;width:100%;margin-top:20px}th{background:#0B1F3B;color:white;text-align:left;padding:10px}td{padding:9px;border-bottom:1px solid #d9e0eb}tr:nth-child(even){background:#f5f2fa}button{background:#0B1F3B;color:white;border:0;padding:12px;border-radius:7px}@media print{button{display:none}thead{display:table-header-group}tr{break-inside:avoid}}</style></head><body><header><h1>Lab5S · Relatório do Acervo</h1><p>Gerado em ${new Date().toLocaleString('pt-BR')} · ${itens.length} registros</p></header><button onclick="window.print()">Salvar como PDF / Imprimir</button><table><thead><tr><th>Insumo</th><th>Categoria</th><th>Localização</th><th>Quantidade</th><th>Mínimo</th><th>Validade</th><th>Situação</th></tr></thead><tbody>${linhas||'<tr><td colspan="7">Sem resultados</td></tr>'}</tbody></table><p>Organização hoje, segurança sempre.</p></body></html>`);
 janela.document.close();janela.focus();
}
export default function Acervo({usuarioLogado,mostrarNotificacao}){
 const [insumos,setInsumos]=useState([]),[editando,setEditando]=useState(null),[excluir,setExcluir]=useState(null);
 const [busca,setBusca]=useState(''),[categoria,setCategoria]=useState('Todas'),[filtro,setFiltro]=useState('Todos');
 const [erro,setErro]=useState(''),[ocupado,setOcupado]=useState(false);
 async function carregar(){try{const {data}=await axios.get(`${API_URL}/insumos`);setInsumos(data||[]);setErro('');}catch(e){setErro(e.response?.data?.error||'Falha ao carregar o acervo.');}}
 useEffect(()=>{carregar();},[]);
 const categorias=['Todas',...new Set(insumos.map(i=>i.categoria).filter(Boolean))];
 const filtrados=insumos.filter(i=>[i.nome,i.categoria,i.localizacao].join(' ').toLocaleLowerCase('pt-BR').includes(busca.toLocaleLowerCase('pt-BR'))&&(categoria==='Todas'||i.categoria===categoria)&&(filtro==='Todos'||(filtro==='Estoque baixo'&&estoqueBaixo(i))||(filtro==='Vencidos'&&validade(i).tipo==='danger')||(filtro==='A vencer'&&validade(i).tipo==='warning')));
 const admin=['Admin','Coordenador'].includes(usuarioLogado.cargo);
 async function confirmarExclusao(){if(!excluir)return;setOcupado(true);try{await axios.delete(`${API_URL}/insumos/${excluir.id}`,{params:{usuario_responsavel:usuarioLogado.nome}});mostrarNotificacao('Insumo excluído com sucesso!','success');setExcluir(null);await carregar();}catch(e){mostrarNotificacao(e.response?.data?.error||'Erro ao excluir insumo.','error');}finally{setOcupado(false);}}
 if(editando)return <CadastroInsumo insumoParaEditar={editando} fecharEdicao={()=>{setEditando(null);carregar();}} usuarioLogado={usuarioLogado} mostrarNotificacao={mostrarNotificacao}/>;
 return <div className="page-container acervo-page"><div className="acervo-wrap"><div className="acervo-heading"><div><span className="eyebrow">MATERIAIS · CONTROLE</span><h1>Acervo</h1><p>Consulte os materiais e acompanhe os níveis de estoque e validade.</p></div><button className="btn-primary export-button" onClick={()=>exportarPDF(filtrados)}><Icon name="download"/> Exportar PDF</button></div>
 <div className="acervo-stats">{[['Insumos cadastrados',insumos.length,'Materiais no acervo'],['Estoque em alerta',insumos.filter(estoqueBaixo).length,'Igual ou abaixo do mínimo'],['Insumos vencidos',insumos.filter(i=>validade(i).tipo==='danger').length,'Validade expirada'],['Próximos do vencimento',insumos.filter(i=>validade(i).tipo==='warning').length,'Até 30 dias para vencer']].map(([titulo,numero,sub])=><article key={titulo}><span>{titulo}</span><strong>{numero}</strong><small>{sub}</small></article>)}</div>
 <section className="acervo-panel"><div className="acervo-filters"><input aria-label="Pesquisar insumos" placeholder="Pesquisar nome, categoria ou localização..." value={busca} onChange={e=>setBusca(e.target.value)}/><select aria-label="Filtrar categoria" value={categoria} onChange={e=>setCategoria(e.target.value)}>{categorias.map(c=><option key={c} value={c}>{c==='Todas'?'Todas as categorias':c}</option>)}</select><select aria-label="Filtrar situação" value={filtro} onChange={e=>setFiltro(e.target.value)}>{['Todos','Estoque baixo','Vencidos','A vencer'].map(f=><option key={f}>{f}</option>)}</select><span className="acervo-count">{filtrados.length} resultado(s)</span></div>
 {erro&&<div className="acervo-error" role="alert">{erro} <button onClick={carregar}>Tentar novamente</button></div>}
 <div className="table-responsive"><table className="acervo-table"><thead><tr><th>Material</th><th>Categoria</th><th>Quantidade</th><th>Mínimo</th><th>Localização</th><th>Validade</th><th>Estoque</th>{admin&&<th>Ações</th>}</tr></thead><tbody>{filtrados.map(i=><tr key={i.id}><td><div className="material-cell">{i.imagem_url?<img src={i.imagem_url} alt={i.nome}/>:<span className="material-placeholder"><Icon name="archive"/></span>}<strong>{i.nome}</strong></div></td><td>{i.categoria}</td><td>{i.quantidade_estoque} {i.unidade_medida}</td><td>{i.quantidade_minima_alerta??0}</td><td>{i.localizacao}</td><td><span className={'status-pill '+validade(i).tipo}>{validade(i).label}</span></td><td><span className={'status-pill '+(estoqueBaixo(i)?'danger':'ok')}>{estoqueBaixo(i)?'Estoque baixo':'Regular'}</span></td>{admin&&<td><div className="table-actions"><button aria-label={`Editar ${i.nome}`} title="Editar" onClick={()=>setEditando(i)}><Icon name="edit"/></button><button className="delete-action" aria-label={`Excluir ${i.nome}`} title="Excluir" onClick={()=>setExcluir(i)}><Icon name="trash"/></button></div></td>}</tr>)}{!filtrados.length&&<tr><td colSpan={admin?8:7} className="empty-acervo">Nenhum insumo encontrado.</td></tr>}</tbody></table></div></section>
 {excluir&&<div className="confirm-backdrop"><div className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="excluir-titulo"><h2 id="excluir-titulo">Excluir insumo?</h2><p>Deseja excluir <strong>{excluir.nome}</strong>? Esta ação não pode ser desfeita.</p><div className="confirm-actions"><button className="btn-cancel" disabled={ocupado} onClick={()=>setExcluir(null)}>Cancelar</button><button className="btn-danger" disabled={ocupado} onClick={confirmarExclusao}>{ocupado?'Excluindo...':'Confirmar exclusão'}</button></div></div></div>}
 </div></div>;
}
