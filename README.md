# 🐾 VetCare — Sistema de Gestão Veterinária

Este é um ecossistema completo de gerenciamento clínico veterinário desenvolvido com arquitetura apartada, utilizando **Django Rest Framework** no ecossistema do backend e **React (Vite)** com **Tailwind CSS** no frontend. 

> ⚠️ **Aviso de Fins Acadêmicos:** Este projeto foi desenvolvido estritamente para fins didáticos e acadêmicos. Ele demonstra a integração entre serviços, tratamento de estados locais síncronos, estilizações dinâmicas reativas e gerenciamento de banco de dados unificado para clínicas veterinárias.

---

## 🚀 Como Rodar o Sistema Rapidamente (Recomendado)

Se você moveu o projeto por HD externo, mudou de computador ou está rodando o sistema pela primeira vez na máquina de avaliação, o projeto conta com um script de automação inteligente (`iniciar_sistema.bat`). 

Este script **valida a integridade do hardware**, checa se as dependências físicas existem e configura tudo de forma transparente.

### Passo a Passo:
1. Certifique-se de ter o **Python 3.x** e o **Node.js** instalados no seu computador.
2. Navegue até a **raiz do projeto** (onde a pasta `backend`, `frontend` e o arquivo `.bat` estão localizados).
3. Dê dois cliques no arquivo:
```bash
iniciar_sistema.bat
```

### O que o script `.bat` faz por trás dos panos:
* **Detecção Automática de Ambiente:** Ele checa se a pasta `venv` (Ambiente Virtual) existe no Backend. Se não existir, ele a gera do zero nativamente para o computador atual e instala as bibliotecas via `requirements.txt`.
* **Provedor de Módulos Frontend:** Ele verifica a existência da pasta `node_modules` no Frontend. Se estiver vazia ou ausente, ele executa o `npm install` automaticamente.
* **Orquestração de Servidores:** Ele abre o servidor do Django Rest Framework em segundo plano e levanta o servidor de desenvolvimento do Vite (React) na sua tela, abrindo o sistema no navegador padrão.

---

## 🛠️ Tecnologias Utilizadas

### Backend (`/backend`)
* **Python & Django Framework** — Engine principal e roteamento robusto.
* **Django Rest Framework (DRF)** — Construção de endpoints API estruturados e serialização de dados.
* **SQLite3** — Banco de dados relacional leve (embarcado nativamente no projeto com massa de dados de teste persistida).
* **Django CORS Headers** — Liberação de cabeçalhos de segurança para consumo isolado do frontend.

### Frontend (`/frontend`)
* **ReactJS & Vite** — Biblioteca de UI de alta performance com empacotamento ultra-rápido.
* **Tailwind CSS** — Framework utilitário focado em interfaces no estilo Dark Mode e acendimentos dinâmicos em Verde Teal/Neon.
* **Axios** — Cliente HTTP para comunicação e consumo assíncrono das rotas do backend.

---

## 📑 Recursos Implementados no Sistema

1. **Painel Clínico de Consultas:**
   * Triagem ativa por meio de uma **Fila de Chamada Ativa** e **Histórico de Consultas Concluídas**.
   * Formulário com calendário customizado em tela para seleção e travamento de horários clínicos sem choque de agenda.
   * Sistema de **Mensagens e Modais Customizados** integrados de forma transparente na interface escurecida (sem pop-ups ou alertas nativos feios de navegador).
   * Emissão e consolidação de prontuários clínicos contendo Anamnese, Diagnóstico e Prescrição.
   * Botão de exclusão integrada de registros de agenda diretamente acoplado ao banco de dados.

2. **Módulo de Pacientes & Tutores:**
   * Registro unificado de proprietários com **máscara automática e limitação de caracteres de CPF** em tempo real.
   * **Central do Tutor Ativa:** Painel lateral dinâmico acionado ao clicar em qualquer tutor da listagem.
   * Gerenciamento interno de animais (Vincular, Editar Peso/Raça ou Remover Pacientes).
   * Banco de dados embarcado contendo mais de **50 raças de cachorros pré-definidas**, além de gatos, aves e animais exóticos.
   * Input de raça inteligente com comportamento *clear-on-switch* (inicia limpo e sugere itens dinamicamente através de um dropdown com efeitos de brilho).

3. **Linha do Tempo (Timeline Unificada):**
   * Janela modal interna estilizada que puxa cronologicamente todo o trajeto médico daquele animal específico.
   * Exibição em cascata contendo datas, horários, veterinário responsável e o prontuário assinado.
   * Permite deletar registros históricos diretamente pela interface do modal com atualização em tempo real.

---

## 🗄️ Clonagem e Setup Manual (Caso não queira usar o `.bat`)

Se preferir rodar os comandos manualmente em terminais separados:

### Configurando o Backend:
```bash
cd backend
python -m venv venv
# Ative a venv:
# No Windows (PowerShell): .\venv\Scripts\Activate.ps1
# No Windows (CMD): .\venv\Scripts\activate.bat
pip install -r requirements.txt
python manage.py runserver
```

### Configurando o Frontend:
```bash
cd frontend
npm install
npm run dev
```

---
_Projeto desenvolvido para fins de avaliação e consolidação de conhecimento na disciplina de Códigos de alta performance