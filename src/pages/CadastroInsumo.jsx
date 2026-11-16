import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://sistema-lab-quimica-back.onrender.com';
const TelaCadastroInsumo = ({ insumoParaEditar, fecharEdicao, usuarioLogado, mostrarNotificacao }) => {
  const [form, setForm] = useState({ nome: '', categoria: 'Ácidos', localizacao: 'Armário 1', quantidade_estoque: '', unidade_medida: 'und' });
  
  const [categoriasExistentes, setCategoriasExistentes] = useState(['Ácidos', 'Indicadores', 'Hidróxidos e Bases', 'Sais', 'Orgânicos'].sort((a,b) => a.localeCompare(b)));
  const [localizacoesExistentes, setLocalizacoesExistentes] = useState(['Armário 1', 'Armário 2', 'Bancada', 'Geladeira'].sort((a,b) => a.localeCompare(b)));
  const [nomesExistentes, setNomesExistentes] = useState([]); 
  
  const [isNovaCategoria, setIsNovaCategoria] = useState(false);
  const [isNovaLocalizacao, setIsNovaLocalizacao] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/insumos`).then(res => {
      const cats = [...new Set([...categoriasExistentes, ...res.data.map(i => i.categoria)])].sort((a, b) => a.localeCompare(b));
      const locs = [...new Set([...localizacoesExistentes, ...res.data.map(i => i.localizacao).filter(Boolean)])].sort((a, b) => a.localeCompare(b));
      
      setCategoriasExistentes(cats);
      setLocalizacoesExistentes(locs);
      
      setNomesExistentes(res.data.map(i => i.nome.trim().toLowerCase()));
    });

    if (insumoParaEditar) {
      setForm({ nome: insumoParaEditar.nome, categoria: insumoParaEditar.categoria, localizacao: insumoParaEditar.localizacao || '', quantidade_estoque: insumoParaEditar.quantidade_estoque, unidade_medida: insumoParaEditar.unidade_medida || 'und' });
      setIsNovaCategoria(false);
      setIsNovaLocalizacao(false);
    }
  }, [insumoParaEditar]);

  const salvarInsumo = async (e) => {
    e.preventDefault();

    if (!insumoParaEditar && nomesExistentes.includes(form.nome.trim().toLowerCase())) {
      mostrarNotificacao('Este insumo já está cadastrado! Acesse o Acervo para editar a quantidade.', 'error');
      return;
    }

    const dadosInsumo = { ...form, quantidade_estoque: parseInt(form.quantidade_estoque, 10), usuario_responsavel: usuarioLogado.nome };
    try {
      if (insumoParaEditar) {
        await axios.put(`${API_URL}/insumos/${insumoParaEditar.id}`, dadosInsumo);
        mostrarNotificacao('Insumo atualizado com sucesso!', 'success');
        fecharEdicao();
      } else {
        await axios.post(`${API_URL}/insumos`, dadosInsumo);
        mostrarNotificacao('Novo insumo adicionado ao acervo!', 'success');
        setForm({ nome: '', categoria: categoriasExistentes[0], localizacao: localizacoesExistentes[0], quantidade_estoque: '', unidade_medida: 'und' });
        setIsNovaCategoria(false);
        setIsNovaLocalizacao(false);
      }
    } catch (error) { 
      mostrarNotificacao('Erro ao salvar insumo.', 'error'); 
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

          <div className="form-row">
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

          <div className="form-row">
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

export default TelaCadastroInsumo;
