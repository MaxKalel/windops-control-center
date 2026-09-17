# 🧾 MENTORIA_STATE — WindOps Fullstack

## Projeto

- Nome: WindOps Control Center
- Fase: 0 — Auditoria da base (concluída)
- Nível do aluno: A — iniciação (básico)
- Estrutura repo: um repositório com duas apps (`windops-api/` + futuro `web/`) — decisão tomada na Fase 1 (Opção A)
- Tutor: OpenCode / Antigravity

## Ambiente

### Backend
- diretório: `windops-api/`
- porta: 3000
- build: `npm run build` (pendente de rodar)
- Swagger: http://localhost:3000/docs (OK, 200)
- health: http://localhost:3000/health → `{"status":"ok"}` (OK)
- dados: em memória (zeram a cada restart)

### Frontend
- diretório: `web/`
- porta: 4200 (dev server)
- build: ✅ `npm run build` OK (Angular 21, standalone, SCSS, routing, sem SSR)

## Decisões

- Layout: ✅ Dashboard operacional (WIREFRAMES.md Opção A) — coleção de KPIs, lista de ativos + alertas recentes na mesma tela
- CORS vs proxy: ✅ proxy de desenvolvimento no Angular (solicitações via `/api`, navegador só fala com 4200; backend intocado)
- Base URL: ✅ `/api` (prefixo removido pelo proxy antes de chegar no backend)
- Reatividade: ✅ Signals para estado; HttpClient/RxJS somente para rede (recomendado p/ iniciante)
- Agregação KPIs: ✅ backend — endpoint `GET /dashboard/overview` criado (Fase 8); resposta conferida `{"totalAssets":3,"onlineAssets":2,"attentionAssets":0,"maintenanceAssets":1,"criticalAlerts":0,"totalAlerts":0}`; build + 16 testes OK
- Estratégia refresh após POST: ✅ recarregar dados do detalhe (backend como fonte da verdade), incluindo remontagem do alert-list filho
- Estrutura de tipos: ✅ tipagem mínima no service (`HealthResponse`); tipos por função nas próximas fases
- API service: ✅ `WindOpsApiService.health()` criado + `provideHttpClient()` (Fase 5); `providedIn: 'root'`, base `/api`
- Estrutura do repo: ✅ um workspace com `windops-api/` (pronto) + `web/` (a criar) — a pasta nova repetida foi descartada (confusão de nomes)

## ADRs

### ADR-001 — Integração (CORS vs proxy)
- Problema: aplicações em origens diferentes (`4200` e `3000`); navegador bloqueia respostas sem liberação.
- Opções: CORS explícito no backend (A); proxy de desenvolvimento no Angular (B).
- Recomendação: B.
- Escolha: ✅ B — proxy no Angular; backend permanece sem alterações de CORS.
- Motivo: dispensa modificar o backend já validado; caminho final limpo (`http://localhost:4200/api/...`); CORS será estudado na fase de erros fullstack.
- Trade-off: em produção (fora do proxy) seria necessário resolver CORS real; veremos depois do MVP.
- Reversibilidade: alta — é config de desenvolvimento, desligável.

## Evidências

### Backend
- health: OK — 200 `{"status":"ok"}` ✅
- assets: OK — 200, 3 ativos (WT-001, WT-002, PV-001), campos batem com o contrato ✅
- 404: OK — `GET /assets/NAO_EXISTE` → 404 ✅
- telemetry: OK — começa vazio; após POST 90°C → 1 leitura ✅
- alerts: OK — começa vazio; após POST 90°C → 1 alerta CRITICAL ✅
- summary: OK — atualiza após POST (samples 1, maxTemperatureC 90, criticalAlerts 1) ✅
- POST validação: OK — `{powerMw:-5}` → 400 ✅
- POST cenário 90°C: OK — 201, classificação CRITICAL, alerta AL-001 criado ✅

### Frontend
- health: ✅ `GET http://localhost:4200/api/health` → `{"status":"ok"}` via proxy (Fase 4); ✅ componente `ApiStatus` com idle/loading/online/offline (Fase 5); ✅ confirmado visualmente pelo aluno
- assets: ✅ lista com loading/success/empty/error via `GET /api/assets` (Fase 6); confirmado visualmente; lição registrada: signals separados em vez de union type no estado
- detail: ✅ `/assets/:id` com `forkJoin` (asset + summary + telemetry paralelo); navegação via RouterLink; redireciona `/` → `/assets` (Fase 7); confirmado visualmente e Network
- dashboard: ✅ `/` com KPIs via `GET /dashboard/overview` (Fase 8); confirmado visualmente; 1 request (decisão backend)
- alerts: ✅ `AlertList` reutilizável com severidade textual + badge, filtro por ativo (`computed`), loading/error/empty; usado no dashboard ("Alertas recentes") e no detalhe ("Alertas do ativo"); refresh pós-POST via remontagem do filho; confirmado visualmente (Fase 10)
- telemetry form: ✅ formulário reativo (powerMw, windSpeedMs opcional, temperatureC) + POST + estados submitting/success/error com distinção 400/404; emit `saved` → recarrega dados (Fase 9); ✅ cenário 90°C validado de ponta a ponta
- estado: ✅ Fase 11 auditada — sem store; donos locais claros; KPIs vindos do backend (sem duplicação); pendências anotadas (alertas globais filtrados no cliente, reload excessivo do detalhe, dashboard não reativo entre rotas)
- erros: ✅ Fase 12 — auditado tratamento de erro de todos os componentes; matriz de teste validada (backend offline via DevTools → api-status offline + páginas em estado de erro, não vazio; asset inexistente → bloco de erro no detalhe; 400/404 distintos no form); decisão: manter forkJoin tudo-ou-nada no detalhe (resiliência parcial registrada como evolução futura); erro ≠ vazio em toda a UI
- a11y/responsive: ✅ Fase 13 — `<time datetime>` ISO em alertas/telemetria; `aria-invalid`+`aria-describedby` no form; grid do detalhe empilha ≤760px; `title` por rota ("Dashboard — WindOps Control Center"); validado: api-status/severity em texto+cor, labels `for`/`required`, `role="alert"`, grids auto-fit; build ok; aguarda validação visual do título por rota e viewport 375px
- loading:
- errors:
- responsive:

### Fullstack
- POST 90°C: ✅ registrado com sucesso (Fase 9)
- alert atualizado: ✅ alerta CRITICAL criado (suposto: summary Critical=1 na tela do aluno)
- summary atualizado: ✅ recarrega após `(saved)` (Fase 9)
- Network audit: ✅ Fase 15 — mapa por rota confirmado: `/` (overview+alerts=2), `/assets` (assets+health=2), `/assets/:id` (asset+summary+telemetry+alerts filho=4 em paralelo), health no header (+1 todo reload), reload pós-POST re-dispara 4 no detalhe. Conferido pelo aluno no DevTools. Decisão: custo aceitável para o tamanho do sistema (sem endpoint `/assets/:id/alerts`, sem cache de service; registrado como evolução futura)

### Builds/tests
- api build:
- web build:
- teste frontend: ✅ Fase 14 — 23 testes (Vitest/@angular/build:unit-test): service (8: URL+método+body de todos os endpoints), telemetry-form (5: inválido não envia, success emite saved, 400/404/rede distintos), alert-list (3: filtro por assetId, todos, erro), asset-detail (2: forkJoin sucesso renderiza + erro derruba tudo), app (2: título correto); corrigido app.spec obsoleto ("Hello, web"→"WindOps Control Center") e asset-detail.spec sem ActivatedRoute; lição: `fixture.detectChanges()` após flush + forkJoin cancela requests pendentes em erro; build ok
- api tests: ✅ 16 testes backend (temperatura-rule: limites 75/85; telemetry.service: média/máx/contagens, alertas WARNING/CRITICAL, sem alerta NORMAL)
- web tests:

## Bugs conhecidos

### Divergências contrato x backend real (auditoria Fase 0)
- POST /assets/:id/telemetry — contrato sugere `{ telemetry, classification, alertCreated }`; backend real retorna `{ telemetry, alert? }`. Backend é a verdade; contrato será ajustado na decisão de integração (não inventar classification no frontend).
- POST retorna 201 (correto p/ criação); API_CONTRACT.md não especificava o status.
- Dados em memória: telemetry/alerts começam vazios a cada restart (não é bug, é o comportamento documentado).
- 404 vindo vazio no terminal via PowerShell: verificar encoding/leitura do corpo quando útil (provavelmente artefato do cliente, não da API).
- `npm audit` apontou 5 vulnerabilities (2 low, 1 moderate, 2 high) — avaliar depois; não usar `--fix --force`.
- npm: ERESOLVE peer conflict tsconfck×typescript (não bloqueia build).

## Dívidas técnicas

- Rodar `npm run build` e `npm test` do backend para fechar evidências de build/testes (backend já testado na Fase 8; registrar como ainda pendente).
- Avaliar as 5 vulnerabilities do `npm audit`.
- Evolução futura (fora de escopo): endpoint `/assets/:id/alerts` e/ou cache no service se o volume crescer; resiliência parcial no detalhe (B da Fase 12); dashboard reativo entre rotas (Fase 11).

## Próximo passo

- ✅ ~~Fase 16~~ — DESAFIO CONCLUÍDO 🎉. Explicação final do aluno: fluxo 90°C entendido (form→service→proxy→controller/DTO→service→JSON→signals→tela); itens 3 e 7 revisados como mentor (proxy encaminha, não redireciona; regra de negócio no backend = fonte única de verdade); item 6 completado (JSON→signals→template). Pendências de qualidade ficam como dívidas técnicas/evoluções futuras.
