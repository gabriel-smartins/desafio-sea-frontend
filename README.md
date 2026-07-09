# Frontend do desafio técnico

Este projeto é o frontend complementar de um desafio técnico. O foco principal do desafio é o backend, mas esta interface foi criada para demonstrar uma integração completa com a API e oferecer uma experiência de uso simples para gestão de clientes.

O backend base utilizado neste projeto está no repositório:

- https://github.com/gabriel-smartins/desafio-sea

A ideia é que o frontend consuma uma API REST, mas também seja flexível o suficiente para funcionar com outros servidores, desde que as credenciais e a URL base sejam ajustadas corretamente.

## O que este frontend faz

- Tela de login com autenticação baseada em token
- Dashboard para listar clientes
- Cadastro e edição de clientes
- Validação de formulário no frontend com React Hook Form + Zod
- Integração com API para clientes e autenticação
- Proteção de rotas por perfil de usuário

## Stack utilizada

- React 19
- TypeScript
- Vite
- React Router
- React Hook Form
- Zod
- Axios
- Tailwind CSS
- Lucide Icons

## Escolhas arquiteturais

### 1. Estrutura modular

O projeto foi organizado em pastas por responsabilidade, como:

- pages: telas principais
- components: componentes reutilizáveis
- services: integração com a API
- config: configuração centralizada de ambiente
- types: modelos compartilhados

Isso facilita manutenção, evolução e isolamento das regras de cada camada.

### 2. Camada de serviços centralizada

As chamadas HTTP foram concentradas em serviços específicos, o que evita espalhar lógica de API por toda a aplicação.

### 3. Validação forte no formulário

O formulário de cliente usa React Hook Form com Zod para garantir dados válidos antes do envio.

### 4. Configuração via variáveis de ambiente

Valores sensíveis e variáveis de ambiente, como URL da API e prefixo de storage, foram centralizados em um módulo de configuração para facilitar a troca entre ambientes.

### 5. Extra, mas preparado para integração real

Mesmo sendo um frontend extra, a aplicação foi pensada para parecer um produto real, com navegação protegida, tratamento básico de erro e layout consistente.

## Pré-requisitos

- Node.js instalado
- npm instalado

## Passo a passo para rodar

### 1. Clone o repositório

```bash
git clone https://github.com/gabriel-smartins/frontend-desafio.git
cd frontend-desafio
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo chamado `.env.local` com base no `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_VIA_CEP_BASE_URL=https://viacep.com.br/ws
VITE_STORAGE_PREFIX=@DesafioBackend
```

> Se o backend estiver em outra porta, em outro host ou em outro repositório, basta trocar `VITE_API_BASE_URL` para o endereço correto.

### 4. Suba o backend

O frontend espera que um backend esteja disponível. O backend base para este desafio está em:

- https://github.com/gabriel-smartins/desafio-sea

Se você estiver usando outro servidor, ajuste a URL no `.env.local`.

### 5. Rode o frontend

```bash
npm run dev
```

A aplicação ficará disponível em:

- http://localhost:5173

## Credenciais de login disponíveis

No ambiente de demonstração, os usuários abaixo podem ser usados:

- Usuário: `admin`
  Senha: `123qwe!@#`

- Usuário: `user`
  Senha: `123qwe123`

## Build para produção

```bash
npm run build
```

## Observações

- Este frontend é um complemento do desafio técnico e não substitui o backend.
- Se quiser usar outro backend, basta ajustar a variável `VITE_API_BASE_URL`.
- O projeto foi pensado para ser simples, limpo e fácil de evoluir.
