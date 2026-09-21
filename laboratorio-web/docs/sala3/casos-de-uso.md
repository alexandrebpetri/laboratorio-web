# Leo — Casos de uso da Sala 3

Ator principal: jogador. Pré-condições gerais: partida em andamento, tempo maior que zero e Sala 2 concluída. A numeração abaixo referencia o texto de programação; não substitui o documento completo da equipe, que não foi fornecido.

| Caso | Ação e fluxo principal | Alternativa / pós-condição |
|---|---|---|
| UC02 — Visualizar enigma | Entrar na Sala 3; visualizar a fala do robô, pergunta e quatro alternativas. | Acesso não liberado: painel bloqueado e orientação para concluir a Sala 2. |
| UC03 — Responder enigma | Selecionar uma alternativa e confirmar. | Sem seleção, inativo, tempo zero ou já concluído: confirmação indisponível. |
| UC04 — Verificar resposta | Conferir se a alternativa selecionada é B. | B segue ao UC08 e UC07; demais seguem ao UC05 e UC06. |
| UC05 — Receber dica | Mostrar feedback de erro e exemplo da xícara quente que cede calor. | Permitir nova seleção enquanto houver tempo. |
| UC06 — Aplicar penalidade | Emitir `onPenalidade` com segundos e origem. | Pablo aplica no cronômetro global; ao retornar zero, a sala bloqueia. |
| UC07 — Desbloquear porta | Emitir `onConcluir`, informar desbloqueio da porta secreta e habilitar avanço se houver callback. | Integrador registra a conclusão e libera Sala 4. Reentrada concluída não repete evento. |
| UC08 — Ativar sistema de emergência | Mostrar acerto, fluxo quente → frio e resfriamento ilustrativo até 90°C. | Animar sem interferir no tempo da partida. |
| UC13 — Encerrar jogo (participação) | Receber zero ou `partidaAtiva=false`; bloquear resposta e avanço. | O sistema principal exibe Game Over, não este módulo. |
| UC14 — Exibir cronômetro (externo) | O componente de Pablo exibe o cronômetro no jogo principal. | A Sala 3 apenas recebe o tempo e solicita penalidades; não duplica o relógio. |

UC01 e UC09–UC12 pertencem às demais telas e módulos. Ranking e gravação de resultado não fazem parte da Sala 3.


