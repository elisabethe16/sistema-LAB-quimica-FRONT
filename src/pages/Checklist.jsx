import React from 'react';
import { Icon } from '../components/UiIcon';

export default function TelaChecklist() {
  return <div className="page-container"><section className="card lab-form-page">
    <div className="lab-form-heading"><span className="lab-form-icon"><Icon name="clipboard-check" size={24}/></span><div><span className="eyebrow">ORGANIZAÇÃO · QUALIDADE</span><h2>Checklist de Vistoria 5S</h2></div></div>
    <p>Área destinada à equipe responsável pelo preenchimento do relatório de manutenção e organização do laboratório, conforme os princípios 5S.</p>
    <div className="lab-qr-panel"><img src="/checklist.jpeg" alt="QR Code para acessar o checklist de vistoria"/></div>
    <a href="https://forms.gle/GF1pPYNk5V3wSYoG9" target="_blank" rel="noopener noreferrer" className="btn-primary lab-form-link">Abrir formulário de vistoria <Icon name="arrow-up-right" size={18}/></a>
  </section></div>;
}
