# Engenharia de Software Frontend
Repositório do Projeto Frontend desenvolvido na disciplina de Engenharia de Software do curso de Ciência da Computação (UTFPR-CM)

## Requisitos
- npm
- Docker e Docker Compose

## Passo a passo inicial
1) Instale as dependencias
```
npm install
```

2) Configure as variaveis de ambiente
- Copie o arquivo base:
```
cp .env.example .env
```
3) Inicie o projeto
- Modo desenvolvimento (watch):
```
npm run dev
```
- Modo normal:
```
npm start
```
- Modo container:
```
npm run start:prod
```
