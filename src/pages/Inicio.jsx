import React from 'react';

export default function TelaInicio({ usuarioLogado }) {
  return (
    <section className="welcome-page">
      <div className="welcome-copy">
        <span className="eyebrow">LABORATÓRIO • GESTÃO 5S</span>
        <h2>Organização hoje,<br/><span>segurança sempre.</span></h2>
        <p>Olá, <strong>{usuarioLogado.nome}</strong>! Este é o ambiente de gestão do Lab5S. Consulte materiais, acompanhe o estoque e contribua para um laboratório mais organizado.</p>
        <div className="welcome-tags"><span>Segurança</span><span>Organização</span><span>Rastreabilidade</span><span>Sustentabilidade</span></div>
      </div>
      <div className="welcome-mascot-wrap"><img className="welcome-mascot" src="/axi-mascote.png" alt="Axi, mascote do Lab5S"/></div>
      <div className="welcome-footer">UFRPE • Unidade Acadêmica de Belo Jardim</div>
    </section>
  );
}
