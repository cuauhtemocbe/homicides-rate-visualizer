.DEFAULT_GOAL := help

COMPOSE := docker compose
EXEC := $(COMPOSE) exec app

.PHONY: help up up-d down dev test lint typecheck build validate coverage

help: ## Muestra esta ayuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-12s\033[0m %s\n", $$1, $$2}'

up: ## Levanta el container en primer plano
	$(COMPOSE) up

up-d: ## Levanta el container en background si no está corriendo
	$(COMPOSE) up -d

down: ## Detiene y elimina el container
	$(COMPOSE) down

dev: up-d ## Inicia el servidor de desarrollo (Vite)
	$(EXEC) pnpm dev

test: up-d ## Corre la suite de tests una vez
	$(EXEC) pnpm test:run

lint: up-d ## Corre el linter (Biome)
	$(EXEC) pnpm lint

typecheck: up-d ## Verifica tipos de TypeScript sin generar archivos
	$(EXEC) pnpm typecheck

build: up-d ## Compila TypeScript y construye para producción
	$(EXEC) pnpm build

validate: up-d ## Corre scripts/validate.sh (typecheck + lint + tests + build)
	$(EXEC) pnpm validate

coverage: up-d ## Corre tests con reporte de cobertura
	$(EXEC) pnpm test:coverage
