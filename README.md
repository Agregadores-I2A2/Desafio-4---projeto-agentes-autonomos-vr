# Projeto: Agente Autônomo para Automação e Análise de Compra de VR/VA
**Curso:** Agentes Autônomos com Redes Generativas

Este repositório contém o código-fonte do projeto final, que consiste em uma solução de dois agentes para automatizar e analisar o processo de compra de Vale Refeição.

## Arquitetura da Solução
O projeto é composto por dois agentes principais que operam no ecossistema Google Workspace:

1.  **Agente Operacional (`executarCalculoVR`)**: Um script em Google Apps Script que realiza o processo de ETL, consolidando múltiplas planilhas, aplicando regras de negócio complexas e gerando a planilha de cálculo final.
2.  **Agente Analítico (`perguntarAoAgenteWebApp`)**: Uma aplicação web interativa, servida pelo Apps Script, que fornece uma interface de conversação. Utiliza a API do Google Gemini para responder perguntas sobre os dados em linguagem natural.

## Conteúdo do Repositório
* `Código.gs`: Contém todo o código backend dos dois agentes, escrito em Google Apps Script.
* `InterfaceWeb.html`: Contém o código frontend da aplicação web do Agente Analítico.

## Como Configurar e Executar o Projeto
Para replicar e executar este projeto, siga os passos abaixo:

### 1. Crie o Projeto no Google Apps Script
* Acesse o Google Drive, crie uma nova Planilha Google que servirá como orquestradora.
* No menu, vá em `Extensões > Apps Script`.
* Apague o conteúdo padrão e copie o conteúdo do arquivo `Código.gs` deste repositório para o editor.
* Crie um novo arquivo HTML (`Arquivo > Novo > Arquivo HTML`) com o nome `InterfaceWeb.html` e copie o conteúdo correspondente deste repositório.

### 2. Configure a Chave de API (Segredo)
O projeto foi desenhado para **não expor chaves de API no código**. A chave deve ser configurada como uma Propriedade do Script.

* Obtenha uma chave de API do Google Gemini no [Google AI Studio](https://aistudio.google.com/).
* No editor do Apps Script, vá em **"Configurações do projeto"** (ícone de engrenagem à esquerda).
* Role para baixo até **"Propriedades do script"** e clique em **"Adicionar propriedade do script"**.
* Preencha os campos:
    * **Propriedade:** `GEMINI_API_KEY`
    * **Valor:** `COLE_AQUI_SUA_CHAVE_DE_API_DO_GEMINI`
* Clique em "Salvar propriedades do script".

### 3. Execute os Agentes
* **Para executar o Agente Operacional:**
    * Certifique-se de que os IDs de todas as planilhas de origem no topo do `Código.gs` estão corretos.
    * No editor, selecione a função `executarCalculoVR` e clique em "Executar".
* **Para executar o Agente Analítico:**
    * No editor, clique em `Implantar > Nova implantação`.
    * Selecione o tipo "Aplicativo da Web", configure o acesso e clique em "Implantar".
    * Acesse a URL gerada para interagir com a aplicação.
