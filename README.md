# Engenharia de Software Frontend

Repositório do Projeto Frontend desenvolvido na disciplina de Engenharia de Software do curso de Ciência da Computação (UTFPR-CM)

## Requisitos

- npm
- Docker e Docker Compose

## Passo a passo inicial

1. Instale as dependencias

```
npm install
```

2. Configure as variaveis de ambiente

- Copie o arquivo base:

```
cp .env.example .env
```

3. Inicie o projeto

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

## 🌐 Cliente HTTP (Axios) – Singleton

A comunicação com a API é centralizada em uma única instância do Axios, localizada em `src/services/api.ts`. Essa instância se comporta como um **singleton**, graças ao sistema de módulos do ES (ECMAScript Modules).

### Por que Singleton?

- **Ponto único de configuração**: base URL, headers, interceptors e tratamento de erros ficam definidos uma única vez, garantindo consistência em toda a aplicação.
- **Estado compartilhado**: qualquer alteração é imediatamente refletida em todas as chamadas HTTP, sem a necessidade de propagar manualmente a instância.
- **Evita múltiplas instâncias**: o cache de módulos do JavaScript assegura que todos os arquivos que importarem `api` recebam exatamente a mesma referência, eliminando duplicação e possíveis divergências de configuração.

### Diferenças para o padrão Singleton tradicional

O comportamento de singleton neste módulo difere da implementação clássica do padrão em alguns pontos importantes:

- **Mecanismo de garantia**:
  O padrão tradicional utiliza uma classe com construtor privado e um método estático (ex.: `getInstance()`) para controlar a criação da instância. Aqui, a unicidade é garantida pelo **cache de módulos do ES**, onde o arquivo é executado apenas na primeira importação e a referência exportada é compartilhada em toda a aplicação. Não há uma classe encapsulando a lógica de criação.

- **Inicialização**:
  No singleton clássico, a instância pode ser criada sob demanda. Neste módulo, a instância do Axios é criada **no momento em que o módulo é carregado**. Ainda é possível tornar a criação preguiçosa exportando uma função, mas a abordagem atual prioriza a simplicidade e a disponibilidade imediata.

- **Proteção contra múltiplas instâncias**:
  O padrão com classe impede ativamente a construção de novas instâncias (construtor privado). Nosso *singleton* **não bloqueia** a criação de outras instâncias do Axios em outros arquivos, a unicidade depende de uma convenção, toda a aplicação consome o `api` exportado, em vez de criar novas instâncias manualmente. É uma prática reforçada por arquitetura, não por restrição da linguagem.

Essas características fazem com que a solução adotada seja mais idiomática no ecossistema JavaScript/TypeScript, alinhando-se à forma como o próprio Node.js e os bundlers tratam módulos, sem a necessidade de escrever uma classe *single-purpose* apenas para garantir a instância única.
