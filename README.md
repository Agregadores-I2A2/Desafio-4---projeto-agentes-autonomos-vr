# [cite_start]Projeto: Agente Autônomo para Automação e Análise de Compra de VR/VA [cite: 29]
[cite_start]**Curso:** Agentes Autônomos com Redes Generativas [cite: 30]

[cite_start]Este repositório contém o código-fonte do projeto final, que consiste em uma solução de dois agentes para automatizar e analisar o processo de compra de Vale Refeição. [cite: 31]

## [cite_start]Arquitetura da Solução [cite: 32]
[cite_start]O projeto é composto por dois agentes principais que operam no ecossistema Google Workspace: [cite: 33]

1.  [cite_start]**Agente Operacional (`executarCalculoVR`)**: Um script em Google Apps Script que realiza o processo de ETL, consolidando múltiplas planilhas, aplicando regras de negócio complexas e gerando a planilha de cálculo final. [cite: 34]
2.  [cite_start]**Agente Analítico (`perguntarAoAgenteWebApp`)**: Uma aplicação web interativa, servida pelo Apps Script, que fornece uma interface de conversação. [cite: 35] [cite_start]Utiliza a API do Google Gemini para responder perguntas sobre os dados em linguagem natural. [cite: 36]

## [cite_start]Conteúdo do Repositório [cite: 37]
* [cite_start]`Código.gs`: Contém todo o código backend dos dois agentes, escrito em Google Apps Script. [cite: 38]
* [cite_start]`InterfaceWeb.html`: Contém o código frontend da aplicação web do Agente Analítico. [cite: 39]

## [cite_start]Como Configurar e Executar o Projeto [cite: 40]
[cite_start]Para replicar e executar este projeto, siga os passos abaixo: [cite: 41]

### [cite_start]1. Crie o Projeto no Google Apps Script [cite: 42]
* [cite_start]Acesse o Google Drive, crie uma nova Planilha Google que servirá como orquestradora. [cite: 43]
* [cite_start]No menu, vá em `Extensões > Apps Script`. [cite: 44]
* [cite_start]Apague o conteúdo padrão e copie o conteúdo do arquivo `Código.gs` deste repositório para o editor. [cite: 45]
* [cite_start]Crie um novo arquivo HTML (`Arquivo > Novo > Arquivo HTML`) com o nome `InterfaceWeb.html` e copie o conteúdo correspondente deste repositório. [cite: 46]

### [cite_start]2. Configure a Chave de API (Segredo) [cite: 47]
[cite_start]O projeto foi desenhado para **não expor chaves de API no código**. [cite: 48] [cite_start]A chave deve ser configurada como uma Propriedade do Script. [cite: 49]

* [cite_start]Obtenha uma chave de API do Google Gemini no [Google AI Studio](https://aistudio.google.com/). [cite: 50]
* [cite_start]No editor do Apps Script, vá em **"Configurações do projeto"** (ícone de engrenagem à esquerda). [cite: 51]
* [cite_start]Role para baixo até **"Propriedades do script"** e clique em **"Adicionar propriedade do script"**. [cite: 52]
* [cite_start]Preencha os campos: [cite: 53]
    * [cite_start]**Propriedade:** `GEMINI_API_KEY` [cite: 54]
    * [cite_start]**Valor:** `COLE_AQUI_SUA_CHAVE_DE_API_DO_GEMINI` [cite: 55]
* [cite_start]Clique em "Salvar propriedades do script". [cite: 56]

### [cite_start]3. Execute os Agentes [cite: 57]
* [cite_start]**Para executar o Agente Operacional:** [cite: 58]
    * [cite_start]Certifique-se de que os IDs de todas as planilhas de origem no topo do `Código.gs` estão corretos. [cite: 59]
    * [cite_start]No editor, selecione a função `executarCalculoVR` e clique em "Executar". [cite: 60]
* [cite_start]**Para executar o Agente Analítico:** [cite: 61]
    * [cite_start]No editor, clique em `Implantar > Nova implantação`. [cite: 62]
    * [cite_start]Selecione o tipo "Aplicativo da Web", configure o acesso e clique em "Implantar". [cite: 63]
    * [cite_start]Acesse a URL gerada para interagir com a aplicação. [cite: 64]
