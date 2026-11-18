import React from 'react';
import { Icon } from '../components/UiIcon';

export default function TelaDenuncia() {
  return <div className="page-container"><section className="card lab-form-page">
    <div className="lab-form-heading"><span className="lab-form-icon"><Icon name="alert-triangle" size={24}/></span><div><span className="eyebrow">SEGURANÇA · COMUNICAÇÃO</span><h2>Reportar ocorrência</h2></div></div>
    <p>Encontrou o laboratório desorganizado, materiais fora do lugar ou alguma situação irregular? Utilize o formulário abaixo para registrar sua ocorrência.</p>
    <div className="lab-qr-panel"><img src="/denuncia.jpeg" alt="QR Code para acessar o formulário de ocorrência"/></div>
    <a href="https://forms.gle/kFNbrvHsak82pAKfA" target="_blank" rel="noopener noreferrer" className="btn-primary lab-form-link">Abrir formulário de ocorrência <Icon name="arrow-up-right" size={18}/></a>
  </section></div>;
}
