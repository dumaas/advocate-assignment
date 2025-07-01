install:
	npm install --registry=https://registry.npmjs.org/ --prefer-online

dev:
	npm run dev

up:
	docker compose up -d

migrate:
	npx drizzle-kit push

seed:
	curl -X POST http://localhost:3000/api/seed
