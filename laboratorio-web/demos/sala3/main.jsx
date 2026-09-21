// Leo — demonstração isolada, sem iniciar um cronômetro próprio.
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Sala3 from '../../src/components/salas/sala3/Sala3';
import '../../src/styles/variables.css';
import '../../src/styles/global.css';

function DemoSala3() {
  const [partida, setPartida] = useState(1);
  const [tempo, setTempo] = useState(180);
  const [concluida, setConcluida] = useState(false);
  const [liberada, setLiberada] = useState(true);
  const [evento, setEvento] = useState('Pronto para testar.');
  function reiniciar() {
    setPartida((valor) => valor + 1);
    setTempo(180);
    setConcluida(false);
    setLiberada(true);
    setEvento('Demonstração reiniciada.');
  }
  return <>
    <Sala3 key={partida} salaLiberada={liberada} partidaAtiva={tempo > 0} tempoRestante={tempo} concluida={concluida}
      onPenalidade={({ segundos }) => { setTempo((valor) => Math.max(0, valor - segundos)); setEvento(`Cronômetro: solicitação de −${segundos}s recebida.`); }}
      onConcluir={() => { setConcluida(true); setEvento('Integração: Sala 3 concluída; porta 4 liberada.'); }}
      onAvancar={() => setEvento('Navegação solicitada para a Sala 4. Conectar à rota da equipe.')}
    />
    <aside aria-label="Controles da demonstração" style={{ padding: 16 }}>
      <strong>LEO · DEMONSTRAÇÃO ISOLADA</strong><p>Tempo simulado: {tempo}s. O cronômetro contínuo será conectado ao módulo de Pablo.</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><button onClick={reiniciar}>Reiniciar teste</button><button onClick={() => setTempo(0)}>Simular tempo esgotado</button><button onClick={() => setLiberada((valor) => !valor)}>{liberada ? 'Bloquear acesso à Sala 3' : 'Liberar acesso à Sala 3'}</button></div>
      <p role="status">{evento}</p>
    </aside>
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><DemoSala3 /></React.StrictMode>);

