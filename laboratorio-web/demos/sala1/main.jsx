import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Sala1 from '../../src/components/salas/sala1/Sala1';
import { carregarEnigmaSala1 } from '../../src/game/sala1.js';
import '../../src/styles/variables.css';
import '../../src/styles/global.css';

function DemoSala1() {
  const [enigma, setEnigma] = useState(null);
  const [erro, setErro] = useState(null);
  const [partida, setPartida] = useState(1);
  const [tempo, setTempo] = useState(180);
  const [concluida, setConcluida] = useState(false);
  const [evento, setEvento] = useState('Carregando enigma da Sala 1...');

  useEffect(() => {
    carregarEnigmaSala1()
      .then((dados) => {
        setEnigma(dados);
        setEvento('Pronto para testar.');
      })
      .catch((error) => {
        setErro(error.message);
        setEvento('Não foi possível carregar os dados da Sala 1.');
      });
  }, []);

  function reiniciar() {
    setPartida((valor) => valor + 1);
    setTempo(180);
    setConcluida(false);
    setEvento('Demonstração reiniciada.');
  }

  return <>
    {erro ? <p role="alert" style={{ padding: 16 }}>{erro} Verifique se a API está rodando em http://localhost:3000.</p> : (
      <Sala1 key={partida} enigma={enigma} salaLiberada partidaAtiva={tempo > 0} tempoRestante={tempo} concluida={concluida}
        onPenalidade={({ segundos }) => { setTempo((valor) => Math.max(0, valor - segundos)); setEvento(`Cronômetro: solicitação de -${segundos}s recebida.`); }}
        onConcluir={() => { setConcluida(true); setEvento('Sala 1 concluída; próxima sala liberada.'); }}
        onAvancar={() => setEvento('Navegação solicitada para a próxima sala.')}
      />
    )}
    <aside aria-label="Controles da demonstração" style={{ padding: 16 }}>
      <strong>DEMONSTRAÇÃO ISOLADA · SALA 1</strong>
      <p>Tempo simulado: {tempo}s.</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={reiniciar}>Reiniciar teste</button>
        <button onClick={() => setTempo(0)}>Simular tempo esgotado</button>
      </div>
      <p role="status">{evento}</p>
    </aside>
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><DemoSala1 /></React.StrictMode>);