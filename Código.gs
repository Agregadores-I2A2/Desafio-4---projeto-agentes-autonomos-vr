// =================================================================================
// AGENTE AUTÔNOMO PARA CÁLCULO E ANÁLISE DE VR/VA
// =================================================================================

// --- CONSTANTES DAS PLANILHAS ---
const ID_PLANILHA_ATIVOS = '14hNY0As5NmpPt0MkX5_yIjOB3YY8HZSagHwAb6_3_gk';
const NOME_ABA_ATIVOS = 'ATIVOS'; 
const ID_PLANILHA_DESLIGADOS = '11cGGPOGsHlGGOUfUCzZIGZlk6-0192qSRdkr31D05HQ';
const NOME_ABA_DESLIGADOS = 'DESLIGADOS'; 
const ID_PLANILHA_FERIAS = '17Wa25euAowCQEKE4Znh-5O13hAINUBJGicD_0RR9U-Y';
const NOME_ABA_FERIAS = 'FÉRIAS'; 
const ID_PLANILHA_AFASTAMENTOS = '15N0x6BHnVQv6unaMPMN4FREGJE5fBNsStaxtFQQz5To';
const NOME_ABA_AFASTAMENTOS = 'AFASTAMENTOS'; 
const ID_PLANILHA_SINDICATOS = '1qvJz79JxomGPq9A10f2RQm2CKjXYvM013ceqI6gHIBU';
const NOME_ABA_SINDICATOS = 'Base Sindicato x Valor'; 
const ID_PLANILHA_APRENDIZ = '1JIaTKTwZ4Ncb2PYHh2KD6XSpJ8Y2tHNe2QAHswTks78'; 
const NOME_ABA_APRENDIZ = 'APRENDIZ';
const ID_PLANILHA_EXTERIOR = '1a0XE6LUW4jjdGQXn5b2dM6SsDZStYIgLEZIYZlV9ong'; 
const NOME_ABA_EXTERIOR = 'EXTERIOR';
const ID_PLANILHA_ESTAGIO = '1BQHhkTr6iQdOsW1tAPWcT85uf3qhbult9cotdOzV7ew'; 
const NOME_ABA_ESTAGIO = 'ESTÁGIO';
const ID_PLANILHA_DIAS_UTEIS = '16Z1HwR1wMs1jypGx-iEEa1mmTfyqHR-PwNPMWeZX7aw'; 
const NOME_ABA_DIAS_UTEIS = 'BASE DIAS UTEIS';
// Planilha de destino
const ID_PLANILHA_DESTINO = '1W6DEfPmAEGHMShUoFrG-BTt_WDkE509257HGXvhjlFk';
const NOME_ABA_DESTINO = 'VR MENSAL 05.2025';


// =================================================================================
// PARTE 1: AGENTE ANALÍTICO (WEB APP COM GEMINI)
// =================================================================================

/**
 * Função especial que serve o arquivo HTML como uma página web quando a URL é acessada.
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('InterfaceWeb.html')
      .setTitle('Agente Analítico de RH');
}

/**
 * Função chamada pelo frontend (HTML) para processar a pergunta do usuário.
 * @param {string} pergunta A pergunta enviada pelo usuário da página web.
 * @return {string} A resposta gerada pelo Gemini.
 */
function perguntarAoAgenteWebApp(pergunta) {
  try {
    const spreadsheet = SpreadsheetApp.openById(ID_PLANILHA_DESTINO);
    const abaResultados = spreadsheet.getSheetByName(NOME_ABA_DESTINO); 

    if (!abaResultados) {
      throw new Error("Não foi possível encontrar a aba de destino com os resultados.");
    }

    // Lê as primeiras 200 linhas para análise, a fim de não exceder o limite de tokens da API.
    const dados = abaResultados.getRange(1, 1, Math.min(abaResultados.getLastRow(), 200), 5).getValues();
    const dadosComoTexto = dados.map(linha => linha.join(',')).join('\n');

    const prompt = `
      Você é um assistente especialista em análise de dados de Recursos Humanos.
      Seu objetivo é responder perguntas com base nos dados fornecidos sobre o cálculo de Vale Refeição (VR).
      Seja conciso e direto em suas respostas.

      Aqui estão os dados (no formato: Matrícula,Nome,Valor a Creditar,Custo Empresa (80%),Desconto Colaborador (20%)):
      ---
      ${dadosComoTexto}
      ---
      
      Com base EXCLUSIVamente nos dados acima, responda a seguinte pergunta:
      Pergunta: "${pergunta}"
    `;

    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error("A chave da API do Gemini não foi encontrada. Configure-a nas propriedades do script.");
    }

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + apiKey;
    
    const payload = {
      "contents": [{ "parts": [{ "text": prompt }] }]
    };

    const options = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify(payload)
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const responseData = JSON.parse(response.getContentText());
    
    // Retorna a resposta para ser exibida na página web.
    return responseData.candidates[0].content.parts[0].text;

  } catch (e) {
    // Retorna o erro para ser exibido na página web.
    return "Erro ao processar a solicitação: " + e.message;
  }
}

// =================================================================================
// PARTE 2: AGENTE OPERACIONAL (CÁLCULO E GERAÇÃO DA PLANILHA)
// =================================================================================

/**
 * Função principal que orquestra todo o processo de cálculo de VR.
 * Este é o "agente autônomo operacional".
 */
function executarCalculoVR() {
  const ativos = lerDados(ID_PLANILHA_ATIVOS, NOME_ABA_ATIVOS);
  const desligados = lerDados(ID_PLANILHA_DESLIGADOS, NOME_ABA_DESLIGADOS);
  const ferias = lerDados(ID_PLANILHA_FERIAS, NOME_ABA_FERIAS);
  const afastamentos = lerDados(ID_PLANILHA_AFASTAMENTOS, NOME_ABA_AFASTAMENTOS);
  const sindicatos = lerDados(ID_PLANILHA_SINDICATOS, NOME_ABA_SINDICATOS);
  const estagiarios = lerDados(ID_PLANILHA_ESTAGIO, NOME_ABA_ESTAGIO);
  const exterior = lerDados(ID_PLANILHA_EXTERIOR, NOME_ABA_EXTERIOR);
  const diasUteisBase = lerDados(ID_PLANILHA_DIAS_UTEIS, NOME_ABA_DIAS_UTEIS);
  const aprendizes = lerDados(ID_PLANILHA_APRENDIZ, NOME_ABA_APRENDIZ);
  
  if (!ativos || !sindicatos || !diasUteisBase || !estagiarios || !exterior || !afastamentos || !aprendizes || !desligados || !ferias) {
    console.error('Falha na leitura de uma ou mais planilhas essenciais. Verifique os IDs e nomes das abas.');
    return;
  }
  
  const ativosLimpos = limparDados(ativos, 'Sindicato');
  const diasUteisLimpos = limparDados(diasUteisBase, 'Sindicato');
  const sindicatosLimpos = limparDados(sindicatos, 'Sindicato');
  
  const resultadoFinal = [['Matrícula', 'Nome', 'Valor a Creditar', 'Custo Empresa (80%)', 'Desconto Colaborador (20%)']];
  
  const listaEstagiarios = new Set(estagiarios.slice(1).map(row => row[0]));
  const listaExterior = new Set(exterior.slice(1).map(row => row[0]));
  const listaAfastados = new Set(afastamentos.slice(1).map(row => row[0]));
  const listaAprendizes = new Set(aprendizes.slice(1).map(row => row[0]));
  const mapaFerias = new Map(ferias.slice(1).map(row => [row[0], row[2]]));

  for (let i = 1; i < ativosLimpos.length; i++) {
    const funcionario = ativosLimpos[i];
    
    const matricula = funcionario[0];
    const nome = funcionario[2];
    const sindicatoNomeCompleto = funcionario[4];
    
    let estadoDoSindicato = traduzirSindicatoParaEstado(sindicatoNomeCompleto);
    
    let diasUteisNoMes = buscarValorEmBase(diasUteisLimpos, 'Sindicato', sindicatoNomeCompleto, 'Dias Uteis');
    let valorDiarioVR = buscarValorEmBase(sindicatosLimpos, 'Sindicato', estadoDoSindicato, 'Valor');
    
    if (mapaFerias.has(matricula)) {
      const diasDeFerias = mapaFerias.get(matricula);
      diasUteisNoMes -= diasDeFerias;
    }
    
    // =========================================================================
    // ## CORREÇÃO APLICADA AQUI ##
    // Garante que o número de dias úteis não seja negativo após subtrair as férias.
    diasUteisNoMes = Math.max(0, diasUteisNoMes);
    // =========================================================================

    // Lógica de Desligamento (simplificada)
    const infoDesligado = desligados.find(row => row[0] === matricula);
    if(infoDesligado) {
      const dataDemissao = new Date(infoDesligado[1]);
      if (dataDemissao.getDate() <= 15) {
        continue; // Pula para o próximo funcionário
      }
    }
    
    const valorTotalACreditar = diasUteisNoMes * valorDiarioVR;
    const custoEmpresa = valorTotalACreditar * 0.80;
    const descontoColaborador = valorTotalACreditar * 0.20;

    resultadoFinal.push([
      matricula,
      nome,
      valorTotalACreditar.toFixed(2),
      custoEmpresa.toFixed(2),
      descontoColaborador.toFixed(2)
    ]);
  }

  if (resultadoFinal.length > 1) {
    const planilhaDestino = SpreadsheetApp.openById(ID_PLANILHA_DESTINO);
    const abaDestino = planilhaDestino.getSheetByName(NOME_ABA_DESTINO);
    
    abaDestino.clearContents();
    abaDestino.getRange(1, 1, resultadoFinal.length, resultadoFinal[0].length).setValues(resultadoFinal);
  }
}

// =================================================================================
// PARTE 3: FUNÇÕES AUXILIARES
// =================================================================================

function traduzirSindicatoParaEstado(nomeCompleto) {
  if (typeof nomeCompleto !== 'string') return '';
  if (nomeCompleto.includes('PR')) return 'Paraná';
  if (nomeCompleto.includes('RS')) return 'Rio Grande do Sul';
  if (nomeCompleto.includes('SP')) return 'São Paulo';
  if (nomeCompleto.includes('RJ')) return 'Rio de Janeiro';
  return '';
}

function limparDados(base, colunaNome) {
  if (!base || base.length === 0) return [];
  const cabecalho = base[0];
  const indiceColuna = cabecalho.indexOf(colunaNome);
  if (indiceColuna === -1) return base;

  for (let i = 1; i < base.length; i++) {
    const valor = base[i][indiceColuna];
    if (typeof valor === 'string') {
      base[i][indiceColuna] = valor.trim().toUpperCase();
    }
  }
  return base;
}

function lerDados(planilhaId, nomeAba) {
  try {
    const planilha = SpreadsheetApp.openById(planilhaId);
    const aba = planilha.getSheetByName(nomeAba);
    if (!aba) throw new Error(`Aba "${nomeAba}" não encontrada na planilha com ID "${planilhaId}".`);
    
    const dados = aba.getDataRange().getValues();
    
    let indicePrimeiraLinha = 0;
    while(indicePrimeiraLinha < dados.length && dados[indicePrimeiraLinha].every(cell => !cell)) {
        indicePrimeiraLinha++;
    }
    
    if (indicePrimeiraLinha === dados.length) return [];
    
    return dados.slice(indicePrimeiraLinha);

  } catch (e) {
    console.error(`Erro ao ler dados da planilha com ID "${planilhaId}", aba "${nomeAba}": ${e.message}`);
    return null;
  }
}

function buscarValorEmBase(base, colunaBuscaNome, valorBusca, colunaRetornoNome) {
  if (!base || base.length === 0) {
    return 0;
  }
  
  const cabecalho = base[0];
  let indiceBusca = -1;
  let indiceRetorno = -1;
  
  for (let i = 0; i < cabecalho.length; i++) {
    const headerLimpo = String(cabecalho[i]).trim().toUpperCase();
    if (headerLimpo === colunaBuscaNome.trim().toUpperCase()) indiceBusca = i;
    if (headerLimpo === colunaRetornoNome.trim().toUpperCase()) indiceRetorno = i;
  }

  if (indiceBusca === -1 || indiceRetorno === -1) {
    console.error(`Erro na função buscarValorEmBase: Uma das colunas "${colunaBuscaNome}" ou "${colunaRetornoNome}" não foi encontrada no cabeçalho.`);
    return 0;
  }
  
  const valorBuscaLimpo = typeof valorBusca === 'string' ? valorBusca.trim().toUpperCase() : valorBusca;

  for (let i = 1; i < base.length; i++) {
    const valorDaPlanilha = base[i][indiceBusca];
    const valorDaPlanilhaLimpo = typeof valorDaPlanilha === 'string' ? valorDaPlanilha.trim().toUpperCase() : valorDaPlanilha;

    if (valorDaPlanilhaLimpo === valorBuscaLimpo) {
      return base[i][indiceRetorno];
    }
  }
  return 0;
}