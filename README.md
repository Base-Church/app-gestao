# Base Escalas

Sistema de gerenciamento de escalas.

## Requisitos

- PHP 7.4 ou superior
- Composer
- Node.js e NPM (para Tailwind CSS)

## Instalação

1. Clone o repositório
2. Instale as dependências PHP:
```bash
composer install
```

3. Instale o Tailwind CSS:
```bash
npm init -y
npm install tailwindcss
npx tailwindcss init
```

4. Configure o arquivo .env com suas variáveis de ambiente

5. Inicie o servidor PHP:
```bash
php -S localhost:8000
```

## Estrutura do Projeto

```
src/
├── pages/          # Páginas da aplicação
│   ├── login/
│   ├── cadastro/
│   ├── inicio/
│   └── atividades/
├── services/       # Serviços e integrações
│   └── api/
└── utils/          # Utilitários e helpers
```


#Comando para bildar
npx tailwindcss -i ./src/css/styles.css -o ./src/css/output.css --watch