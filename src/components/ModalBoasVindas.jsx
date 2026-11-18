import React from 'react';
import { Icon } from './UiIcon';

const recursos = [
  { icon: 'archive', titulo: 'Acervo digital', descricao: 'Consulte insumos, quantidades e localizações.' },
  { icon: 'arrow-up-right', titulo: 'Movimentações', descricao: 'Acompanhe entradas, saídas e registros.' },
  { icon: 'clipboard-check', titulo: 'Cultura 5S', descricao: 'Promova organização, segurança e qualidade.' },
  { icon: 'info', titulo: 'Sustentabilidade', descricao: 'Reduza desperdícios e use melhor os recursos.' },
];

export default function ModalBoasVindas({ usuario, fechar, aberto }) {
  if (!aberto) return null;

  return (
    <div className="welcome-modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) fechar(); }}>
      <section className="welcome-modal" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
        <button type="button" className="modal-close" onClick={fechar} aria-label="Fechar boas-vindas">×</button>
        <div className="modal-mascot"><img src="/axi-mascote.png" alt="Axi, mascote do Lab5S" /></div>
        <div className="modal-content">
          <span className="eyebrow">SEMPRE COM VOCÊ!</span>
          <h2 id="welcome-title">Bem-vindo(a) ao <span>Lab5S</span>, {usuario?.nome?.split(' ')[0]}!</h2>
          <p>Eu sou o Axi, seu assistente do laboratório. Vamos tornar a gestão mais simples, segura e eficiente.</p>
          <div className="modal-feature-grid">
            {recursos.map(recurso => (
              <div className="modal-feature" key={recurso.titulo}>
                <b><Icon name={recurso.icon} size={18} />{recurso.titulo}</b>
                <small>{recurso.descricao}</small>
              </div>
            ))}
          </div>
          <button type="button" className="btn-primary" onClick={fechar}>Vamos começar</button>
        </div>
      </section>
    </div>
  );
}
