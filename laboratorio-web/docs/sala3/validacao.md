# Leo — Validação da versão com desenho original

Revisão local de 21/09/2026. Este registro substitui a validação do cenário redesenhado.

## Verificado

- O JPEG usado no componente é idêntico ao original dos Downloads. Ambos têm SHA-256 `9ABFC913E22784B9909D488BEF5A41B01E098BD75FC6AD6E39EC7A75F6771A99`.
- Imagem carregada no navegador com dimensões naturais 1280 × 720; exibição proporcional, sem recorte ou alteração.
- Compilação `npm run build -- --config demos/sala3/vite.config.js`: 35 módulos, sem erros, incluindo o JPEG original no resultado.
- CSS compartilhado existente carregado pela demonstração; componente usa suas variáveis de cores e herda a fonte.
- Estado inicial: quatro alternativas e confirmação bloqueada sem seleção.
- Erro em A: dica visível e solicitação de penalidade de 5 segundos recebida pelo adaptador (180 → 175 segundos).
- Acerto em B: conclusão recebida, explicação correta, resfriamento até 90°C e botão da porta secreta liberado.
- Botão da porta: solicitação de navegação recebida pelo adaptador.
- Tempo esgotado depois do acerto: avanço bloqueado.
- Sala 2 pendente: respostas bloqueadas.
- Reinício da demonstração restaura estado inicial.
- Inspeção em desktop e viewport móvel de 390 × 844: imagem original íntegra e ausência de rolagem horizontal.
- Nenhum aviso ou erro no console durante a verificação.

## Limites

Cronômetro real, som, roteador, persistência e módulos dos colegas ainda não foram conectados. A validação cobre a Sala 3 e o contrato exercitado pela demonstração; não garante a integração final antes de ela ser realizada.

A porta é desbloqueada por mensagem e botão, preservando o desenho estático. Não há animação que redesenhe ou modifique a imagem. Os controles de teste ficam somente em `demos/sala3/main.jsx` e não fazem parte do componente a integrar.


## Conferência após organização

A demonstração foi movida para `demos/sala3`, os imports foram ajustados e a compilação passou novamente (35 módulos). O navegador abriu a nova URL, carregou o JPEG original e não registrou erro de console. A lógica da sala não foi alterada nesta organização.
