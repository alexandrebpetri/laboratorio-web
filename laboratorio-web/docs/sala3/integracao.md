# Leo — Local reservado para integração da Sala 3

**[LOCAL PARA BACKEND] [LOCAL PARA ROTA] [LOCAL PARA INTEGRAÇÃO]**

Esta pasta documenta o contrato; não implementa nem exige uma rota HTTP. O frontend usa callbacks descritos em `docs/sala3/README.md`.

A pessoa responsável pela integração conecta o evento de conclusão ao estado da partida e, se necessário, ao serviço central existente. Deve validar partida ativa, sequência Sala 2 → Sala 3 → Sala 4 e impedir conclusão duplicada. Erros solicitam penalidade ao cronômetro de Pablo; a sala nunca atualiza um relógio global diretamente.

**[LOCAL PARA SUPABASE]** Se houver persistência de progresso, Gabriel Ortiz define tabela, políticas e serviço no único banco compartilhado. Não criar banco próprio nem colocar chaves nesta pasta. Nenhuma alteração de banco é necessária para testar o frontend.

