# React + TypeScript + Vite

Este template fornece uma configuração mínima para rodar o React com Vite, com HMR e algumas regras de ESLint.

Atualmente, dois plugins oficiais estão disponíveis:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) usa [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) usa [SWC](https://swc.rs/)

## React Compiler

O React Compiler não está habilitado neste template por causa do seu impacto no desempenho de desenvolvimento e build. Para adicioná-lo, consulte [esta documentação](https://react.dev/learn/react-compiler/installation).

## Expandindo a configuração do ESLint

Se você estiver desenvolvendo uma aplicação para produção, recomendamos atualizar a configuração para habilitar regras de lint com reconhecimento de tipos:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Outras configs...

      // Remova tseslint.configs.recommended e substitua por isto
      tseslint.configs.recommendedTypeChecked,
      // Alternativamente, use isto para regras mais rígidas
      tseslint.configs.strictTypeChecked,
      // Opcionalmente, adicione isto para regras estilísticas
      tseslint.configs.stylisticTypeChecked,

      // Outras configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // outras opções...
    },
  },
])
```

Você também pode instalar [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) e [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) para regras de lint específicas do React:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Outras configs...
      // Habilitar regras de lint para React
      reactX.configs['recommended-typescript'],
      // Habilitar regras de lint para React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // outras opções...
    },
  },
])
```
