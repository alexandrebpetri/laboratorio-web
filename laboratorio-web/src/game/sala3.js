// Leo — regras locais do enigma; não controla o cronômetro da partida.
import { enigmaSala3 } from '../data/sala3.js';

export function avaliarResposta(resposta) {
  if (!enigmaSala3.opcoes.some((opcao) => opcao.id === resposta)) return null;
  return resposta === enigmaSala3.respostaCorreta;
}

export function podeInteragir({ salaLiberada, partidaAtiva, resolvida, tempoRestante }) {
  return salaLiberada && partidaAtiva && !resolvida &&
    (tempoRestante == null || (Number.isFinite(tempoRestante) && tempoRestante > 0));
}

