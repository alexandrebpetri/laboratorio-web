import { useState } from 'react';
import { avaliarResposta, podeInteragir } from '../../../game/sala1.js';
import './Sala1.css';

const cenario = import.meta.env.BASE_URL + 'assets/backgrounds/sala1.png';

export default function Sala1({
  enigma,
  salaLiberada = true,
  partidaAtiva = false,
  tempoRestante = null,
  concluida = false,
  penalidadeSegundos = 5,
  onPenalidade,
  onConcluir,
  onAvancar,
  onSom,
}) {
  const [resolvidaLocal, setResolvidaLocal] = useState(false);
  const [selecionada, setSelecionada] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const resolvida = concluida || resolvidaLocal;
  const disponivel = podeInteragir({ salaLiberada, partidaAtiva, resolvida, tempoRestante });
  const tempoValido = tempoRestante == null || (Number.isFinite(tempoRestante) && tempoRestante > 0);
  const ativa = partidaAtiva && tempoValido;
  const penalidade = Number.isFinite(penalidadeSegundos) ? Math.max(0, penalidadeSegundos) : 5;

  if (!enigma) {
    return <main className="sala1 sala1--carregando"><p>Carregando o enigma da Sala 1...</p></main>;
  }

  function responder(event) {
    event.preventDefault();
    if (!disponivel || resolvida || !selecionada) return;

    if (avaliarResposta(enigma, selecionada)) {
      setResolvidaLocal(true);
      setFeedback(null);
      onConcluir?.({ salaId: enigma.salaId, proximaSalaId: enigma.proximaSalaId, resposta: enigma.respostaCorreta });
      onSom?.('acerto');
    } else {
      setFeedback(enigma.dica);
      setSelecionada(null);
      onPenalidade?.({ salaId: enigma.salaId, segundos: penalidade, motivo: 'resposta-incorreta' });
      onSom?.('erro');
    }
  }

  return (
    <section className="sala1" aria-label={enigma.titulo}>
      <img
        className="sala1__cenario"
        src={cenario}
        width="1280"
        height="720"
        alt="Ilustração do laboratório da Sala 1."
      />

      <div className="sala1__painel">
        <h1>{enigma.titulo}</h1>
        <p><strong>Robô:</strong> “{enigma.falaRobo}”</p>

        <form onSubmit={responder}>
          <fieldset disabled={!disponivel}>
            <legend>{enigma.pergunta}</legend>
            {enigma.opcoes.map((opcao) => (
              <label className="sala1__opcao" key={opcao.id}>
                <input
                  type="radio"
                  name="sala1-resposta"
                  value={opcao.id}
                  checked={resolvida ? opcao.id === enigma.respostaCorreta : selecionada === opcao.id}
                  onChange={() => setSelecionada(opcao.id)}
                />
                <span><strong>{opcao.id})</strong> {opcao.texto}</span>
              </label>
            ))}
          </fieldset>
          {!resolvida && (
            <button type="submit" disabled={!disponivel || !selecionada}>
              Confirmar resposta
            </button>
          )}
        </form>

        <div className="sala1__feedback" role="status" aria-live="polite" aria-atomic="true">
          {!salaLiberada ? (
            <p>A Sala 1 ainda não está liberada.</p>
          ) : !ativa ? (
            <p>{tempoValido ? 'Partida inativa. Aguarde o controle principal.' : 'Tempo esgotado. Painel bloqueado.'}</p>
          ) : resolvida ? (
            <>
              <p><strong>Sala 1 concluída!</strong></p>
              <p>{enigma.explicacao}</p>
              <p><strong>Próxima sala desbloqueada.</strong></p>
            </>
          ) : feedback ? (
            <p>{feedback}</p>
          ) : null}
        </div>

        {resolvida && (
          <button
            type="button"
            disabled={!ativa || !salaLiberada || !onAvancar}
            onClick={() => {
              onSom?.('porta');
              onAvancar?.({ salaId: enigma.salaId, destino: enigma.proximaSalaId });
            }}
          >
            Ir para a próxima sala
          </button>
        )}
      </div>
    </section>
  );
}