# 🚀 Task Manager — Gerenciador de Tarefas Full-Stack

Um gerenciador de tarefas moderno, responsivo e de alta performance desenvolvido para otimizar a produtividade diária. O ecossistema conta com uma API REST robusta construída em Java com Spring Boot e uma interface Single Page Application (SPA) fluida construída em React e Tailwind CSS.

---

## 📱 Funcionalidades Principais

- **Visão Geral & Métricas Reais:**  
  Painel de indicadores dinâmicos que exibe o total de tarefas, itens concluídos, pendentes e atrasados em tempo real, acompanhado de uma barra de progresso visual.

- **Jornada do Dia (Focus Mode):**  
  Aba exclusiva para monitorar e liquidar as obrigações agendadas estritamente para a data atual.

- **Calendário Interativo:**  
  Painel visual com marcadores inteligentes. Dias passados que ainda possuem pendências ativas ganham uma bolinha de alerta em vermelho ultra nítido com efeito neon intermitente.

- **Design Híbrido & Responsivo:**  
  Exibição robusta em tabelas estruturadas para telas grandes (Desktop) que se transforma automaticamente em uma grade de cartões anatômicos e fluídos no Mobile.

- **Paginação Server-Side:**  
  Controle de paginação de dados direto no banco de dados através do Spring Data JPA, evitando sobrecarga de memória no cliente e garantindo performance mesmo com milhares de registros.

---

## 🛠️ Tecnologias Utilizadas

### Backend (API REST)

- **Java 21 & Spring Boot 3**
- **Spring Data JPA** (Persistência e paginação eficiente no banco)
- **Spring Validation** (Regras de negócio e validação estrita de payloads)
- **PostgreSQL** (Banco de dados relacional oficial)
- **CORS Configuration** (Segurança integrada para comunicação entre origens)

### Frontend (SPA)

- **React (Vite)** com Componentes Funcionais e Hooks
- **Tailwind CSS** (Estilização utilitária moderna e modo escuro Slate integrado)
- **React Router DOM** (Gerenciamento de rotas e layouts aninhados via Context/Outlet)
- **React Helmet Async** (Injeção e manipulação dinâmica de metadados e títulos por rota)
- **Lucide React** (Pacote de ícones vetoriais de alta definição)

---


## 🚀 Como Executar o Projeto

### 📋 Pré-requisitos

Antes de começar, você precisará ter instalado:

- Java 17 ou superior  
  *(Desenvolvido utilizando Java 21)*
- Node.js v18 ou superior
- PostgreSQL ou Docker

---

## 🗄️ Configuração do Banco de Dados (PostgreSQL)

O projeto utiliza variáveis de ambiente para injetar dinamicamente as credenciais de acesso ao banco de dados, evitando expor senhas diretamente no código fonte (`application.properties`).

---

### ✅ Opção 1: Usando Docker (Recomendado - Mais Rápido)

Se você possui Docker instalado, execute o comando abaixo no terminal para subir um container PostgreSQL pré-configurado:

```bash
docker run --name todolist-db \
  -e POSTGRES_DB=todolist \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=suasenha \
  -p 5432:5432 \
  -d postgres
```

---

### 🛠️ Opção 2: Configuração Manual (Sem Docker)

Caso utilize PostgreSQL instalado localmente:

Abra seu cliente SQL (pgAdmin / DBeaver / Terminal) e execute:

```sql
CREATE DATABASE todolist;
```

---

## ☕ 1. Inicializando o Backend

Para evitar erros de inicialização de driver JDBC ou problemas relacionados ao pool de conexões do HikariCP (`HikariPool`), carregue as variáveis de ambiente antes de executar o Maven.

Abra o terminal e navegue até a pasta raiz do backend (onde o `pom.xml` está localizado):

```bash
cd BackEnd/todolist/todolist
```

---

### 🪟 Windows (CMD)

Defina as variáveis de ambiente linha por linha:

```cmd
set DB_URL=jdbc:postgresql://localhost:5432/todolist
set DB_USERNAME=postgres
set DB_PASSWORD=suasenha
```

---

### 🐧 Linux / macOS (Bash/Zsh)

```bash
export DB_URL=jdbc:postgresql://localhost:5432/todolist
export DB_USERNAME=postgres
export DB_PASSWORD=suasenha
```

---

### ▶️ Executando o Spring Boot

Inicie a aplicação:

```bash
mvnw spring-boot:run
```

> O Hibernate está configurado com `ddl-auto=update`, portanto todas as tabelas e relacionamentos serão criados automaticamente na primeira execução bem-sucedida.

A API ficará disponível em:

```txt
http://localhost:8080
```

---

## ⚛️ 2. Inicializando o Frontend

Abra um novo terminal e navegue até a pasta do frontend:

```bash
cd FrontEnd/todolist
```

---

### 📦 Instalando Dependências

```bash
npm install
```

---

### ▶️ Executando o Frontend

```bash
npm run dev
```

O frontend ficará disponível normalmente em:

```txt
http://localhost:5173
```

---

## 📱 Executando em Dispositivos Móveis

Para acessar o projeto em celulares conectados na mesma rede Wi-Fi:

```bash
npm run dev -- --host
```

O Vite exibirá um IP semelhante a:

```txt
http://192.168.0.10:5173
```

Basta abrir esse endereço no navegador do celular.

---

## 🎯 Objetivo do Projeto

O Task Manager foi desenvolvido com foco em:

- Performance escalável
- Experiência responsiva real
- Paginação eficiente
- Segurança no gerenciamento de estados assíncronos
- Integração REST robusta
- Compatibilidade entre Desktop e Mobile
