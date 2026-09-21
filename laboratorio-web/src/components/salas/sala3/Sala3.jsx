// Leo — frontend da Sala 3. Cronômetro, som e rotas vêm do integrador.
import { useEffect, useRef, useState } from 'react';
import cenarioOriginal from './cenario-original.jpeg';
import { OPCOES, avaliarResposta, podeInteragir } from './enigma';
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
      onConcluir?.({ salaId: 3, proximaSalaId: 4, resposta: 'B' });
      onSom?.('acerto');
    } else {
      setFeedback('Resposta incorreta. Pense em uma xícara quente: ela cede calor ao ambiente mais frio.');
      setSelecionada(null);
      // [LOCAL PARA INTEGRAÇÃO] Pablo aplica a penalidade no cronômetro único.
      onPenalidade?.({ salaId: 3, segundos: penalidade, motivo: 'resposta-incorreta' });
      onSom?.('erro');
    }
  }

  return (
    <section className="sala3" aria-label="Sala 3 — Sistema de refrigeração">
      <img
        className="sala3__cenario"
        src={cenarioOriginal}
        width="1280"
        height="720"
        alt="Desenho original da Sala 3: máquina de refrigeração à esquerda, cilindros vermelho e azul, alarmes e porta à direita."
      />

      <div className="sala3__painel">
        <h1>Sala 3 — Sistema de refrigeração</h1>
        <p><strong>Robô:</strong> “O sistema de emergência precisa transferir energia térmica para resfriar o laboratório.”</p>
        <p>Temperatura do laboratório: <strong>{temperatura}°C</strong></p>

        <form onSubmit={responder}>
          <fieldset disabled={!disponivel}>
            <legend>Em qual direção ocorre espontaneamente a transferência de calor?</legend>
            {OPCOES.map((opcao) => (
              <label className="sala3__opcao" key={opcao.id}>
                <input
                  type="radio"
                  name="sala3-resposta"
                  value={opcao.id}
                  checked={resolvida ? opcao.id === 'B' : selecionada === opcao.id}
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
              <p>O calor flui espontaneamente do corpo quente para o corpo frio.</p>
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
              onAvancar?.({ salaId: 3, destino: 4 });
            }}
          >
            Entrar na porta secreta
          </button>
        )}
      </div>
    </section>
  );
}
