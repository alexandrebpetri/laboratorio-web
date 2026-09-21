# Leo — Sala 3: sistema de refrigeração

## Responsabilidade e objetivo

Frontend React da Sala 3: apresentar o desenho original e o enigma, conferir a resposta, mostrar dica, solicitar penalidade, animar a temperatura e informar o desbloqueio da porta secreta. A imagem é estática e idêntica ao JPEG enviado; o desbloqueio aparece por mensagem e botão, sem redesenhar o cenário.

Leo cuida desta sala. Pablo fornece o cronômetro; David fornece sons; o responsável pela Sala Principal conecta estado e rotas. Banco e ranking permanecem com seus responsáveis. Nenhuma API ou banco foi alterado.

## Organização conforme o README do projeto

| Pasta | Arquivos e responsabilidade |
|---|---|
| `src/components/salas/sala3/` | `Sala3.jsx` e `Sala3.css`: interface e estilo local. |
| `src/data/` | `sala3.js`: textos, alternativas e resposta; `puzzles.js`: catálogo que registra o enigma. |
| `src/game/` | `sala3.js`: verificação da resposta e condições para interagir. |
| `src/hooks/` | Nenhum hook adicional necessário. Os hooks gerais existentes pertencem à integração. |
| `src/styles/` | Base global existente; a sala herda a fonte e utiliza suas variáveis de cores. |
| `public/assets/backgrounds/` | `sala3-original.jpeg`: desenho original, sem modificações. |
| `demos/sala3/` | `index.html`, `main.jsx` e `vite.config.js`: teste isolado. |
| `docs/sala3/` | Este guia, casos de uso, integração e registro de validação. |

Não é necessário criar arquivos em todas as pastas. `rooms.js` e a lógica global são reservados para o fluxo completo. Os componentes genéricos atuais são placeholders, por isso a sala ainda usa elementos HTML nativos.

## Executar e compilar

Abra o terminal na pasta interna `laboratorio-web`, onde está `package.json`:

```powershell
npm install
npm run dev -- --config demos/sala3/vite.config.js
```

Abra `/demos/sala3/index.html` no endereço e porta indicados pelo Vite. Abrir somente `/` não abre a demonstração.

```powershell
npm run build -- --config demos/sala3/vite.config.js
npm run preview -- --config demos/sala3/vite.config.js
```

O resultado fica em `dist-sala3`. A imagem pública é copiada junto. Dependências: React 18, React DOM e Vite já declarados no projeto; nenhuma biblioteca adicional. A documentação original também indica Yarn: use o gerenciador que a equipe padronizar, sem manter lockfiles divergentes.

## Funcionamento

1. Receber liberação da Sala 2 e estado de partida ativa.
2. Selecionar alternativa e confirmar; selecionar sozinho não penaliza.
3. A, C ou D: mostrar dica e solicitar penalidade de tempo.
4. B: emitir conclusão uma vez, explicar calor do quente para o frio e reduzir a temperatura ilustrativa de 120 para 90°C.
5. Mostrar “Porta secreta desbloqueada” e permitir solicitar navegação para a Sala 4.
6. Bloquear respostas e avanço quando acabar o tempo ou a partida ficar inativa.

A penalidade padrão de 5 segundos é provisória e configurável, pois o texto de programação não definiu o valor. O temporizador interno anima somente a temperatura. O cronômetro contínuo deve existir no controlador principal. A demo usa 180 segundos simulados e controles de teste, que não pertencem ao componente final.

## Entradas, saídas e eventos

| Propriedade | Padrão | Uso |
|---|---|---|
| `salaLiberada` | false | Sala 2 já concluída. |
| `partidaAtiva` | false | Controlador autoriza jogar. |
| `tempoRestante` | null | Segundos externos; zero bloqueia. Sem número, depende de partidaAtiva. Não desenha cronômetro. |
| `concluida` | false | Conclusão mantida pelo estado global entre rotas. |
| `penalidadeSegundos` | 5 | Valor configurável da penalidade. |
| `onPenalidade` | opcional | `{ salaId: 3, segundos, motivo: 'resposta-incorreta' }`. |
| `onConcluir` | opcional | `{ salaId: 3, proximaSalaId: 4, resposta: 'B' }`. |
| `onAvancar` | opcional | `{ salaId: 3, destino: 4 }`; sem callback, botão desabilitado. |
| `onSom` | opcional | `acerto`, `erro` ou `porta`. |

## Integração no jogo completo

No mesmo repositório, importar o componente; não importar a demo. Exemplo ilustrativo: as funções abaixo serão fornecidas pelo controlador da equipe.

```jsx
import Sala3 from './components/salas/sala3/Sala3';

<Sala3
  key={idDaPartida}
  salaLiberada={salasConcluidas.includes(2)}
  partidaAtiva={statusDaPartida === 'jogando'}
  tempoRestante={tempoRestante}
  concluida={salasConcluidas.includes(3)}
  penalidadeSegundos={penalidadeConfigurada}
  onPenalidade={({ segundos }) => aplicarPenalidade(segundos)}
  onConcluir={({ salaId, proximaSalaId }) => concluirSala(salaId, proximaSalaId)}
  onAvancar={() => navegarParaSala(4)}
  onSom={(evento) => tocarSom(evento)}
/>
```

Manter estado e cronômetro acima das rotas. Ao retornar à sala, passar `concluida=true` para impedir repetição. Ao iniciar outra partida, trocar a key e redefinir o estado global. O controlador deve validar eventos quando coincidem com tempo esgotado e impedir conclusão duplicada. Callbacks não devem lançar exceções para a interface; tratar falhas de serviços no controlador.

Importar `src/styles/global.css` e `src/styles/variables.css` uma vez na entrada do jogo. A demo faz isso; a entrada principal existente ainda importa apenas global.css. A sala possui valores de reserva, mas todas as salas precisam seguir a mesma base para ter aparência consistente.

Para entregar fora do Git, incluir o componente e CSS, `src/data/sala3.js`, `src/game/sala3.js` e a imagem no caminho público acima. Registrar o enigma no catálogo `puzzles.js` sem sobrescrever os demais enigmas. Não basta copiar apenas a pasta do componente.

## Pontos reservados e limites

- **[LOCAL PARA FRONTEND / ROTA]**: importar a sala na rota geral e ligar onAvancar à Sala 4.
- **[LOCAL PARA SERVIÇO]**: conectar cronômetro e sons.
- **[LOCAL PARA BACKEND / SUPABASE]**: descrito em `integracao.md`; esta sala não exige API nem credenciais. Persistência, se adotada, usa o serviço compartilhado.
- **[LOCAL PARA INTEGRAÇÃO]**: estado global, validação de sequência e encerramento da partida.
- **[LOCAL PARA DOCUMENTAÇÃO]**: casos de uso em `casos-de-uso.md`, testes e limites em `validacao.md`.

A integração completa ainda depende dos módulos dos colegas. App.jsx, os hooks gerais e as regras gerais atuais são placeholders; isso não é funcionalidade pendente da Sala 3.

## Git

Incluir os arquivos da sala nas pastas da tabela e a documentação. As movimentações removem os antigos `enigma.js` e `cenario-original.jpeg` de dentro do componente; incluir também essas remoções no próximo commit. Conferir `git status` antes de enviar.

`node_modules` e `dist-sala3` estão ignorados. O ZIP fica fora do repositório. Esta revisão não fez commit ou push.
