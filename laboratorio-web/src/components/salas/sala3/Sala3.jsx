// Leo — frontend da Sala 3. Cronômetro, som e rotas vêm do integrador.
import { useEffect, useRef, useState } from 'react';
const cenarioOriginal = import.meta.env.BASE_URL + 'assets/backgrounds/sala3-original.jpeg';
import { enigmaSala3 } from '../../../data/sala3';
import { avaliarResposta, podeInteragir } from '../../../game/sala3.js';
import './Sala3.css';

export default function Sala3({
  salaLiberada = false,
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
  const [temperatura, setTemperatura] = useState(concluida ? 90 : 120);
  const enviada = useRef(concluida);
  const resolvida = concluida || resolvidaLocal;
  const disponivel = podeInteragir({ salaLiberada, partidaAtiva, resolvida, tempoRestante });
  const tempoValido = tempoRestante == null || (Number.isFinite(tempoRestante) && tempoRestante > 0);
  const ativa = partidaAtiva && tempoValido;
  const penalidade = Number.isFinite(penalidadeSegundos) ? Math.max(0, penalidadeSegundos) : 5;

  // Anima apenas a temperatura ilustrativa; não é o cronômetro do jogo.
  useEffect(() => {
    if (!resolvida || !ativa || temperatura <= 90) return;
    const animacao = window.setTimeout(() => setTemperatura((valor) => Math.max(90, valor - 10)), 750);
    return () => window.clearTimeout(animacao);
  }, [resolvida, ativa, temperatura]);

  function responder(event) {
    event.preventDefault();
    if (!disponivel || enviada.current || !selecionada) return;

    if (avaliarResposta(selecionada)) {
      enviada.current = true;
      setResolvidaLocal(true);
      setFeedback(null);
      // [LOCAL PARA INTEGRAÇÃO] Registrar conclusão e liberar a porta 4.
      onConcluir?.({ salaId: enigmaSala3.salaId, proximaSalaId: enigmaSala3.proximaSalaId, resposta: enigmaSala3.respostaCorreta });
      onSom?.('acerto');
    } else {
      setFeedback(enigmaSala3.dica);
      setSelecionada(null);
      // [LOCAL PARA INTEGRAÇÃO] Pablo aplica a penalidade no cronômetro único.
      onPenalidade?.({ salaId: enigmaSala3.salaId, segundos: penalidade, motivo: 'resposta-incorreta' });
      onSom?.('erro');
    }
  }

  return (
    <section className="sala3" aria-label={enigmaSala3.titulo}>
      <img
        className="sala3__cenario"
        src={cenarioOriginal}
        width="1280"
        height="720"
        alt="Desenho original da Sala 3: máquina de refrigeração à esquerda, cilindros vermelho e azul, alarmes e porta à direita."
      />

      <div className="sala3__painel">
        <h1>{enigmaSala3.titulo}</h1>
        <p><strong>Robô:</strong> “{enigmaSala3.falaRobo}”</p>
        <p>Temperatura do laboratório: <strong>{temperatura}°C</strong></p>

        <form onSubmit={responder}>
          <fieldset disabled={!disponivel}>
            <legend>{enigmaSala3.pergunta}</legend>
            {enigmaSala3.opcoes.map((opcao) => (
              <label className="sala3__opcao" key={opcao.id}>
                <input
                  type="radio"
                  name="sala3-resposta"
                  value={opcao.id}
                  checked={resolvida ? opcao.id === enigmaSala3.respostaCorreta : selecionada === opcao.id}
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

        <div className="sala3__feedback" role="status" aria-live="polite" aria-atomic="true">
          {!salaLiberada ? (
            <p>Resolva a Sala 2 para acessar este painel.</p>
          ) : !ativa ? (
            <p>{tempoValido ? 'Partida inativa. Aguarde o controle principal.' : 'Tempo esgotado. Painel bloqueado.'}</p>
          ) : resolvida ? (
            <>
              <p><strong>Sistema de refrigeração ativado!</strong></p>
              <p>{enigmaSala3.explicacao}</p>
              <p><strong>Porta secreta desbloqueada.</strong></p>
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
              onAvancar?.({ salaId: enigmaSala3.salaId, destino: enigmaSala3.proximaSalaId });
            }}
          >
            Entrar na porta secreta
          </button>
        )}
      </div>
    </section>
  );
}

