import React from 'react';
export default function Notificacoes({ notificacoes }) {
  return <div className="notification-container">{notificacoes.map(n => <div key={n.id} className={`notification ${n.tipo}`}>{n.mensagem}</div>)}</div>;
}
