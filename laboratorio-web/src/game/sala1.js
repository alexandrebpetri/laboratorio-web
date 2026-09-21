import { buscarEnigmaSala1 } from '../data/sala1.js';

export async function carregarEnigmaSala1() {
  return buscarEnigmaSala1();
}

export function avaliarResposta(enigma, resposta) {
  if (!enigma?.opcoes?.some((opcao) => opcao.id === resposta)) return null;
  return resposta === enigma.respostaCorreta;
}

export function podeInteragir({ salaLiberada, partidaAtiva, resolvida, tempoRestante }) {
  return salaLiberada && partidaAtiva && !resolvida &&
    (tempoRestante == null || (Number.isFinite(tempoRestante) && tempoRestante > 0));
}