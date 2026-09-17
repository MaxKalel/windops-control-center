⚡ WindOps Control Center

Interface web para monitoramento e operação de ativos de energia renovável, integrada à WindOps API.

Permite acompanhar aerogeradores, visualizar status, temperatura, telemetria e alertas através de um dashboard centralizado.

Como instalar e rodar

Pré-requisitos: Node.js ≥ 22 e npm.

# 1. instalar dependências
npm install

# 2. iniciar a aplicação
npm start

A aplicação estará disponível em:

http://localhost:4200

A WindOps API também precisa estar rodando para que os dados sejam carregados corretamente.

Funcionalidades
Monitoramento de turbinas
Visualização do status de cada ativo
Registro e acompanhamento de temperatura
Visualização de telemetria
Alertas de operação
Dashboard com indicadores dos ativos
Integração com a WindOps API
Tecnologias
Angular
TypeScript
SCSS
REST API
WindOps API (NestJS)
Integração com a API

O Control Center utiliza a WindOps API para consultar e registrar os dados dos ativos.

Principais recursos utilizados:

GET  /assets
GET  /assets/:id
POST /assets/:id/telemetry
GET  /assets/:id/telemetry
GET  /assets/:id/summary
GET  /alerts

API local:

http://localhost:3000

Documentação da API:

http://localhost:3000/docs