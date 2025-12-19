
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, PredictionData, SimulationResult } from "../types";

const MODEL_NAME = 'gemini-3-flash-preview';

export async function getFinancialPredictions(transactions: Transaction[]): Promise<PredictionData> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const summary = transactions.slice(-50).map(t => ({
    data: t.date,
    tipo: t.type === 'income' ? 'Receita' : 'Despesa',
    valor: t.amount,
    categoria: t.category
  }));

  const prompt = `
    Com base nas últimas 50 transações financeiras, preveja o futuro financeiro do usuário.
    Responda em Português do Brasil.
    Retorne um objeto JSON com:
    - forecast3Months: Saldo estimado em 3 meses.
    - forecast6Months: Saldo estimado em 6 meses.
    - forecast12Months: Saldo estimado em 12 meses.
    - insight: Um conselho financeiro profissional curto e direto.
    - risks: Uma lista de riscos financeiros identificados (ex: gastos altos em lazer).

    Dados das Transações: ${JSON.stringify(summary)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            forecast3Months: { type: Type.NUMBER },
            forecast6Months: { type: Type.NUMBER },
            forecast12Months: { type: Type.NUMBER },
            insight: { type: Type.STRING },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["forecast3Months", "forecast6Months", "forecast12Months", "insight", "risks"]
        }
      }
    });

    const text = response.text || '{}';
    return JSON.parse(text);
  } catch (error) {
    console.error("Erro na Predição IA:", error);
    return {
      forecast3Months: 0, forecast6Months: 0, forecast12Months: 0,
      insight: "Não foi possível gerar insights no momento.",
      risks: ["Erro na API"]
    };
  }
}

export async function runSimulation(transactions: Transaction[], scenario: string): Promise<SimulationResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const summary = transactions.slice(-30).map(t => ({
    tipo: t.type,
    valor: t.amount,
    categoria: t.category
  }));

  const prompt = `
    Analise este cenário financeiro: "${scenario}"
    Dado o padrão de gastos atual: ${JSON.stringify(summary)}
    Calcule o resultado potencial em Português do Brasil.
    Retorne um objeto JSON com:
    - scenario: O cenário reescrito de forma clara.
    - newForecast: O impacto líquido estimado no saldo após 6 meses.
    - impactDescription: Explicação detalhada do porquê disso acontecer.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenario: { type: Type.STRING },
            newForecast: { type: Type.NUMBER },
            impactDescription: { type: Type.STRING },
          },
          required: ["scenario", "newForecast", "impactDescription"]
        }
      }
    });

    const text = response.text || '{}';
    return JSON.parse(text);
  } catch (error) {
    console.error("Erro na Simulação:", error);
    throw error;
  }
}
