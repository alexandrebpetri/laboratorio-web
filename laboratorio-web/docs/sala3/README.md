# Leo — Sala 3: Sistema de refrigeração

## Escopo e responsabilidade

Frontend React funcional e independente da Sala 3. O texto de programação pede interface, interações, pontos de integração, documentação e casos de uso. Portanto, a entrega inclui a validação local da alternativa, dica, solicitação de penalidade e evento de conclusão; não é apenas um desenho estático.

O cenário é o JPEG original enviado por Leo, copiado sem alterações para `cenario-original.jpeg`. É exibido inteiro, mantendo a proporção, sem recortes, filtros ou elementos sobrepostos. A imagem permanece estática; o desbloqueio da porta é informado no painel e habilita o botão de avanço. Não foram criadas novas artes.

Leo: componente, visual, enigma e documentação da Sala 3.
Pablo: cronômetro contínuo e aplicação real de penalidades.
Responsável pela Sala Principal/Routes: acesso sequencial, estado global, navegação e término da partida.
David: sons, conectados por `onSom`.
Gabriel Ortiz e Lucas: banco compartilhado e ranking; esta sala não acessa banco diretamente.
João: organização e incorporação dos arquivos ao projeto geral.

## Executar a demonstração

Abra o terminal na pasta que contém `package.json` (`laboratorio-web/laboratorio-web`):

```powershell
npm install
npm run dev -- --config demos/sala3/vite.config.js
```

Abra `http://127.0.0.1:5173/demos/sala3/index.html`. Se a porta estiver ocupada, use a porta indicada pelo Vite. A raiz `/` não é a demonstração; a entrada é `/demos/sala3/index.html`.

O rodapé de demonstração tem controles de reinício, bloqueio de acesso e tempo esgotado. O tempo inicial de 180 segundos é simulado, sem contagem contínua; diminui apenas com penalidades. Esses controles não fazem parte do componente entregue ao jogo.

```powershell
npm run build -- --config demos/sala3/vite.config.js
npm run preview -- --config demos/sala3/vite.config.js
```

A compilação independente vai para `dist-sala3`. Abra `/demos/sala3/index.html` no endereço informado pelo preview. Esta entrada separada preserva o `App.jsx` da integração principal, que atualmente é um placeholder.

## Funcionamento

1. O integrador libera a Sala 3 após a Sala 2 e informa que a partida está ativa.
2. O jogador seleciona uma alternativa e confirma em “Confirmar resposta”. Selecionar sozinho não aplica penalidade.
3. A, C ou D: apresenta dica, limpa a seleção e solicita penalidade. Padrão provisório: 5 segundos, configurável; a duração não foi definida no roteiro.
4. B: explica que calor flui espontaneamente do quente para o frio, emite a conclusão uma vez, anima 120 → 110 → 100 → 90°C e libera o botão da porta 4 sem modificar o desenho.
5. “Entrar na porta secreta” solicita navegação; não implementa o enigma 4 nem declara vitória.
6. Tempo zero ou partida inativa bloqueia respostas e avanço. O controlador principal decide a tela de Game Over (UC13).

A redução de temperatura é ilustrativa e seu temporizador controla somente a animação; não mede o tempo da partida. O enigma trata da transferência espontânea de calor. Uma máquina refrigeradora real pode transferir calor no sentido contrário consumindo trabalho externo; essa situação não é a pergunta apresentada.

## Entradas e saídas

| Propriedade | Tipo / padrão | Contrato |
|---|---|---|
| `salaLiberada` | boolean / false | Integrador confirma conclusão da Sala 2. |
| `partidaAtiva` | boolean / false | Controlador informa se pode jogar. |
| `tempoRestante` | número de segundos / null | Valor do cronômetro externo para bloqueio. Zero bloqueia; null permite depender de partidaAtiva. Não desenha um segundo cronômetro. |
| `concluida` | boolean / false | Estado persistido pelo controlador para remontagens e troca de rotas. |
| `penalidadeSegundos` | número / 5 | Configuração compartilhada com o cronômetro. |
| `onPenalidade` | função opcional | Recebe `{ salaId: 3, segundos, motivo: 'resposta-incorreta' }`. |
| `onConcluir` | função opcional | Recebe `{ salaId: 3, proximaSalaId: 4, resposta: 'B' }`, uma vez por resolução na montagem. |
| `onAvancar` | função opcional | Recebe `{ salaId: 3, destino: 4 }`. Sem callback o botão fica desabilitado. |
| `onSom` | função opcional | Recebe `acerto`, `erro` ou `porta`. Não reproduz áudio sozinho. |

Callbacks são notificações síncronas: o integrador deve capturar falhas de serviços assíncronos fora da sala e não lançar exceções para a interface. O controlador deve validar o estado atual ao receber eventos, para resolver possíveis coincidências entre uma resposta e o fim do tempo. A conclusão deve ser idempotente no estado global.

## Exemplo para a pessoa responsável pela integração

Trecho ilustrativo: as variáveis e funções abaixo pertencem ao controlador da equipe, não são APIs já implementadas.

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

Mantenha o cronômetro e as salas concluídas acima das rotas. Ao voltar para uma sala concluída, repasse `concluida={true}`: isso evita novo enigma/novo evento. Uma nova partida deve trocar `key` e redefinir o estado global. Alterar apenas `concluida` para false na mesma montagem não reinicia o estado local. Recarregar a demonstração inicia um teste novo; persistência entre recargas é responsabilidade do jogo principal.

## Arquivos e dependências

- `src/components/salas/sala3/Sala3.jsx`: interface e eventos.
- `src/components/salas/sala3/Sala3.css`: layout isolado e responsivo, com as variáveis comuns de cores.
- `src/components/salas/sala3/cenario-original.jpeg`: desenho original, obrigatório na entrega.
- `src/components/salas/sala3/enigma.js`: alternativas e condições de interação.
- `demos/sala3/main.jsx`: adaptador de demonstração, não copiar para o jogo final.
- `demos/sala3/index.html` e `demos/sala3/vite.config.js`: execução/compilação isolada.
- `docs/sala3/README.md`, `casos-de-uso.md` e `validacao.md`: documentação.
- `docs/sala3/integracao.md`: contrato reservado para integração.

Utiliza React 18, React DOM e Vite já declarados no projeto. Nenhuma biblioteca visual adicional. Para integrar, copie a pasta `src/components/salas/sala3` (a demonstração está separada em `demos/sala3`) e a documentação. Não substitua o App ou o package.json dos colegas. Todos os seletores de estilo são limitados a `.sala3`.

## Locais reservados

- **[LOCAL PARA FRONTEND]**: importar `Sala3.jsx` na rota definida pela equipe.
- **[LOCAL PARA ROTA]**: ligar `onAvancar` à porta 4 e validar o acesso à Sala 3 no roteador principal.
- **[LOCAL PARA SERVIÇO]**: ligar `onSom` ao módulo de David e `onPenalidade` ao módulo de Pablo.
- **[LOCAL PARA BACKEND]**: ver `docs/sala3/integracao.md`; nenhuma API inventada ou chamada HTTP nesta entrega.
- **[LOCAL PARA SUPABASE]**: se o jogo persistir progresso, o serviço central da equipe salva a conclusão no banco compartilhado. A Sala 3 não requer cliente, tabela, credencial ou banco próprio.
- **[LOCAL PARA INTEGRAÇÃO]**: estado global, término da partida e callbacks acima.
- **[LOCAL PARA DOCUMENTAÇÃO]**: incorporar os casos de uso desta pasta à documentação geral.

## CSS comum e entrega mínima

A base existente da equipe é `src/styles/global.css` (fonte e regras gerais) e `src/styles/variables.css` (cores). O componente herda a fonte e consome `--color-background`, `--color-surface`, `--color-text` e `--color-accent`, com valores de reserva iguais aos existentes. Nenhum desses arquivos compartilhados foi alterado.

O integrador deve importar os dois estilos comuns uma vez no ponto de entrada do jogo. A demonstração já faz isso. As outras salas precisam usar a mesma base para que o conjunto tenha aparência consistente; isso não ocorre automaticamente. O CSS local é limitado a `.sala3`, sem regras em `:root` ou `body`, e não desenha cabeçalho, navegação geral ou cronômetro.

Para incorporar a parte do Leo, copiar somente estes quatro arquivos, mantendo-os juntos:

- `Sala3.jsx`
- `Sala3.css`
- `enigma.js`
- `cenario-original.jpeg`

Depois, importar o componente e conectar as propriedades e callbacks do exemplo acima. `demos/sala3/main.jsx`, `demos/sala3/index.html` e `demos/sala3/vite.config.js` servem apenas para testar a entrega separadamente. No ZIP, os arquivos em `src/styles` são cópias da base atual para executar a demonstração: não sobrescrever a base dos colegas caso ela tenha sido atualizada.

O contrato foi testado com um adaptador local. A integração definitiva só pode ser confirmada quando o cronômetro, as rotas e os sons reais forem conectados.


## Organização no repositório compartilhado

A estrutura original do projeto foi preservada. A contribuição de Leo está separada assim:

```text
laboratorio-web/                  # pasta que já contém package.json
├── src/components/salas/sala3/   # componente, CSS, enigma e imagem original
├── demos/sala3/                  # teste independente: index.html, main.jsx, vite.config.js
├── docs/sala3/                   # README, casos de uso, integração e validação
├── .gitignore                   # ignora dependências e saída da demonstração
└── package-lock.json            # fixa as versões instaladas para a equipe
```

Os arquivos comuns preexistentes (App.jsx, main.jsx, package.json, vite.config.js e src/styles) não foram modificados. Nenhuma pasta de backend foi acrescentada ao frontend: os pontos de integração estão em `docs/sala3/integracao.md`.

No mesmo repositório, os colegas não precisam copiar a sala: após receberem o commit, basta importá-la pelo caminho documentado e conectar os callbacks. As pastas `demos` e `docs` podem receber módulos dos colegas em subpastas próprias, sem editar os arquivos de Leo.

Para o commit da Sala 3, incluir apenas as três pastas acima, `.gitignore` e `package-lock.json`. Não incluir node_modules, dist-sala3 nem o ZIP externo. Conferir `git status` e as diferenças antes de fazer commit/push. Nenhum commit ou push foi realizado por esta organização.
