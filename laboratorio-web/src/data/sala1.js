// Ale — dados do enigma da Sala 1, separados da interface React.


const API_URL = 'http://localhost:3000';

const opcoesSala1 = [
  { id: 'A', texto: 'A pressão diminuirá.' },
  { id: 'B', texto: 'A pressão aumentará.' },
  { id: 'C', texto: 'A pressão permanecerá constante.' },
  { id: 'D', texto: 'A pressão ficará igual a zero.' },
];

export async function buscarEnigmaSala1() {
  const resposta = await fetch(`${API_URL}/api/enigmas/1`);

  if (!resposta.ok) {
    throw new Error('Não foi possível carregar o enigma da Sala 1.');
  }

  const enigma = await resposta.json();

  return {
    salaId: enigma.ordem,
    proximaSalaId: enigma.ordem + 1,
    titulo: `Sala ${enigma.ordem} — ${enigma.titulo}`,
    falaRobo: 'O laboratório está aquecendo o cilindro.',
    pergunta: enigma.descricao,
    opcoes: enigma.opcoes?.length ? enigma.opcoes : opcoesSala1,
    respostaCorreta: enigma.resposta_correta,
    dica: enigma.dica,
    explicacao:
      'Com o volume constante, o aumento da temperatura provoca o aumento da pressão do gás.',
    penalidadeTempoSegundos: enigma.penalidade_tempo_segundos,
  };
}