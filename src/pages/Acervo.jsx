import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TelaCadastroInsumo from './CadastroInsumo';

const API_URL = process.env.REACT_APP_API_URL || 'https://sistema-lab-quimica-back.onrender.com';
const TelaAcervo = ({ usuarioLogado, mostrarNotificacao }) => {
  const [insumos, setInsumos] = useState([]);
  const [insumoSelecionado, setInsumoSelecionado] = useState(null);
  
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');

  const carregarAcervo = () => {
    axios.get(`${API_URL}/insumos`).then(res => setInsumos(res.data.sort((a, b) => a.nome.localeCompare(b.nome))));
  };

  useEffect(() => { carregarAcervo(); }, []);

  const categoriasDisponiveis = ['Todas', ...new Set(insumos.map(i => i.categoria))].sort();

  const insumosFiltrados = insumos.filter(item => {
    const matchPesquisa = item.nome.toLowerCase().includes(termoPesquisa.toLowerCase());
    const matchCategoria = categoriaFiltro === 'Todas' || item.categoria === categoriaFiltro;
    return matchPesquisa && matchCategoria;
  });

  const baixarPDF = () => {
    const janelaImpressao = window.open('', '', 'width=900,height=650');
    
    let html = `
      <html>
        <head>
          <title>Relatório de Insumos</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { color: #000080; text-align: center; }
            .filtros { text-align: center; margin-bottom: 20px; font-style: italic; color: #555; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #000080; color: white; }
            tr:nth-child(even) { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h2>Relatório de Acervo - Laboratório de Química</h2>
          <div class="filtros">
            Filtro Categoria: ${categoriaFiltro} | Total de Itens: ${insumosFiltrados.length}
          </div>
          <table>
            <thead>
              <tr>
                <th>Insumo</th>
                <th>Categoria</th>
                <th>Localização</th>
                <th>Estoque Atual</th>
              </tr>
            </thead>
            <tbody>
    `;

    insumosFiltrados.forEach(item => {
      html += `
        <tr>
          <td>${item.nome}</td>
          <td>${item.categoria}</td>
          <td>${item.localizacao}</td>
          <td>${item.quantidade_estoque} ${item.unidade_medida}</td>
        </tr>
      `;
    });

    html += `
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `;

    janelaImpressao.document.write(html);
    janelaImpressao.document.close();
  };

  if (insumoSelecionado) {
    return <TelaCadastroInsumo insumoParaEditar={insumoSelecionado} fecharEdicao={() => { setInsumoSelecionado(null); carregarAcervo(); }} usuarioLogado={usuarioLogado} mostrarNotificacao={mostrarNotificacao} />;
  }

  return (
    <div className="page-container">
      <div className="card" style={{ maxWidth: '1000px' }}>
        <div className="form-row filtros-mobile" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Acervo do Laboratório</h2>
          <button onClick={baixarPDF} style={{ backgroundColor: '#28a745', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            📄 Baixar PDF
          </button>
        </div>

        <div className="form-row filtros-mobile" style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <div className="form-group" style={{ flex: 2, margin: 0 }}>
            <input 
              type="text" 
              placeholder="Pesquisar insumo pelo nome..." 
              value={termoPesquisa} 
              onChange={(e) => setTermoPesquisa(e.target.value)} 
            />
          </div>
          <div className="form-group" style={{ flex: 1, margin: 0 }}>
            <select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)}>
              {categoriasDisponiveis.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
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
              {insumosFiltrados.length > 0 ? (
                insumosFiltrados.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '10px' }}>{item.nome}</td>
                    <td style={{ padding: '10px' }}>{item.categoria}</td>
                    <td style={{ padding: '10px' }}>{item.localizacao}</td>
                    <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>{item.quantidade_estoque} {item.unidade_medida}</td>
                    {(usuarioLogado.cargo === 'Admin' || usuarioLogado.cargo === 'Coordenador') && (
                      <td style={{ padding: '10px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <button style={{ padding: '5px 10px', backgroundColor: '#ffc107', border: 'none', borderRadius: '4px', marginRight: '5px' }} onClick={() => setInsumoSelecionado(item)}>✏️</button>
                        <button style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }} onClick={async () => {
                          if (window.confirm('Excluir este insumo?')) {
                            try {
                              await axios.delete(`${API_URL}/insumos/${item.id}?usuario_responsavel=${usuarioLogado.nome}`);
                              mostrarNotificacao('Insumo excluído com sucesso!', 'success');
                              carregarAcervo();
                            } catch (error) {
                              mostrarNotificacao('Erro ao excluir insumo.', 'error');
                            }
                          }
                        }}>🗑️</button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Nenhum insumo encontrado com estes filtros.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TelaAcervo;
