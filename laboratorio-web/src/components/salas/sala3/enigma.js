// Leo — regras locais do enigma; não controla o cronômetro da partida.
export const OPCOES = [
  { id: 'A', texto: 'Do corpo frio para o corpo quente.' },
  { id: 'B', texto: 'Do corpo quente para o corpo frio.' },
  { id: 'C', texto: 'O calor não pode ser transferido.' },
  { id: 'D', texto: 'O calor sempre se divide igualmente entre os dois corpos.' },
];

export function avaliarResposta(resposta) {
  if (!OPCOES.some((opcao) => opcao.id === resposta)) return null;
  return resposta === 'B';
}

export function podeInteragir({ salaLiberada, partidaAtiva, resolvida, tempoRestante }) {
  return salaLiberada && partidaAtiva && !resolvida &&
    (tempoRestante == null || (Number.isFinite(tempoRestante) && tempoRestante > 0));
}
