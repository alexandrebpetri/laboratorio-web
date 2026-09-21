// Leo — dados do enigma da Sala 3, separados da interface React.
export const enigmaSala3 = {
  salaId: 3,
  proximaSalaId: 4,
  titulo: 'Sala 3 — Sistema de refrigeração',
  falaRobo: 'O sistema de emergência precisa transferir energia térmica para resfriar o laboratório.',
  pergunta: 'Em qual direção ocorre espontaneamente a transferência de calor?',
  opcoes: [
    { id: 'A', texto: 'Do corpo frio para o corpo quente.' },
    { id: 'B', texto: 'Do corpo quente para o corpo frio.' },
    { id: 'C', texto: 'O calor não pode ser transferido.' },
    { id: 'D', texto: 'O calor sempre se divide igualmente entre os dois corpos.' },
  ],
  respostaCorreta: 'B',
  dica: 'Resposta incorreta. Pense em uma xícara quente: ela cede calor ao ambiente mais frio.',
  explicacao: 'O calor flui espontaneamente do corpo quente para o corpo frio.',
};
