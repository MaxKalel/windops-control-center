# ⚡ WindOps API

Backend de operação e alertas para ativos de energia renovável (aerogeradores e painéis solares).

Stack: **NestJS 12 · TypeScript · REST · Swagger/OpenAPI** · dados em memória.

---

## Como instalar e rodar

Pré-requisitos: Node.js ≥ 22 e npm.

```bash
# 1. instalar dependências
npm install

# 2. subir o servidor (modo watch)
npm run start:dev

# 3. conferir se está no ar
curl http://localhost:3000/health
# → {"status":"ok"}
```

Após o passo 2, a API roda em **http://localhost:3000**.

## Como testar

```bash
# testes de unidade (regra, services, summary)
npm test

# build (verificação do TypeScript)
npm run build
```

## Swagger/OpenAPI

Documentação interativa (contrato da API):

> **http://localhost:3000/docs**

Também disponível como spec JSON: `http://localhost:3000/docs-json`

Uma pessoa da equipe consegue descobrir todos os endpoints, parâmetros e respostas sem ler o código.

---

## Endpoints do MVP

| Método | Rota | O que faz |
|---|---|---|
| GET | `/health` | verifica se a API está no ar |
| GET | `/assets` | lista todos os ativos |
| GET | `/assets/:id` | busca um ativo (404 se não existir) |
| POST | `/assets/:id/telemetry` | registra uma leitura e gera alerta se preciso |
| GET | `/assets/:id/telemetry` | consulta as leituras de um ativo |
| GET | `/alerts` | lista todos os alertas gerados |
| GET | `/assets/:id/summary` | resumo calculado do ativo |

## Exemplos de requests

### Listar ativos

```bash
curl http://localhost:3000/assets
```

### Buscar ativo

```bash
curl http://localhost:3000/assets/WT-001
# → 200 com o ativo
curl http://localhost:3000/assets/XYZ
# → 404 {"message":"Asset XYZ não encontrado",...}
```

### Registrar telemetria

```bash
curl -X POST http://localhost:3000/assets/WT-001/telemetry \
  -H "Content-Type: application/json" \
  -d '{"powerMw":2.7,"windSpeedMs":11.4,"temperatureC":80,"timestamp":"2026-09-13T12:00:00.000Z"}'
```

Resposta (80 °C → WARNING):

```json
{
  "telemetry": {
    "assetId": "WT-001",
    "powerMw": 2.7,
    "windSpeedMs": 11.4,
    "temperatureC": 80,
    "timestamp": "2026-09-13T12:00:00.000Z"
  },
  "alert": {
    "id": "AL-001",
    "assetId": "WT-001",
    "severity": "WARNING",
    "type": "HIGH_TEMPERATURE",
    "message": "Temperatura acima do limite de atenção.",
    "timestamp": "2026-09-13T12:00:00.000Z"
  }
}
```

### Payload inválido (validação)

```bash
curl -X POST http://localhost:3000/assets/WT-001/telemetry \
  -H "Content-Type: application/json" \
  -d '{"powerMw":"muito","temperatureC":"quente"}'
# → 400 Bad Request com mensagens por campo
```

### Consultar leituras e resumo

```bash
curl http://localhost:3000/assets/WT-001/telemetry
curl http://localhost:3000/assets/WT-001/summary
```

### Listar alertas

```bash
curl http://localhost:3000/alerts
```

---

## Regra de negócio (temperatura)

Valores fictícios, apenas para treinamento. A classificação fica na API (função pura), não no cliente:

| temperatureC | Severidade | Gera alerta? |
|---|---|---|
| `< 75` | NORMAL | não |
| `75 a < 85` | WARNING | sim |
| `>= 85` | CRITICAL | sim |

## Status HTTP usados

| Status | Quando |
|---|---|
| 200 | leitura/conulta OK |
| 201 | leitura criada (POST) |
| 400 | payload inválido (bloqueado pelo ValidationPipe) |
| 404 | ativo não existe |

---

## Estrutura

```text
src/
├── assets/
│   ├── dto/create-telemetry.dto.ts
│   ├── assets.controller.ts
│   ├── assets.service.ts
│   ├── telemetry.service.ts
│   └── assets.module.ts
├── alerts/
│   ├── alerts.controller.ts
│   └── alerts.module.ts
├── domain/
│   ├── asset.interface.ts
│   ├── telemetry.interface.ts
│   ├── alert.interface.ts
│   ├── asset-summary.interface.ts
│   └── temperature-rule.ts
├── app.module.ts
└── main.ts
```

## Observações

- Dados em memória (reiniciam a cada `npm run start`) — persistência (Prisma/PostgreSQL) é evolução futura.
- `postgres`/banco não é necessário para rodar.