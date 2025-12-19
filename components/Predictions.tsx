
import React, { useState, useEffect } from 'react';
import { useFinance } from '../store';
import { getFinancialPredictions, runSimulation } from '../services/geminiService';
import { PredictionData, SimulationResult } from '../types';
import { BrainCircuit, Loader2, TrendingUp, AlertTriangle, Lightbulb, PlayCircle, Sparkles } from 'lucide-react';

const Predictions: React.FC = () => {
  const { transactions } = useFinance();
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [simScenario, setSimScenario] = useState('');
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [simLoading, setSimLoading] = useState(false);

  const fetchPrediction = async () => {
    if (transactions.length === 0) return;
    setLoading(true);
    try {
      const data = await getFinancialPredictions(transactions);
      setPrediction(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = async () => {
    if (!simScenario) return;
    setSimLoading(true);
    try {
      const result = await runSimulation(transactions, simScenario);
      setSimulation(result);
    } catch (e) {
      console.error(e);
    } finally {
      setSimLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, []);

  const formatBRL = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          Preditor IA
          <div className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full border border-purple-500/30 font-bold tracking-tighter uppercase">Inteligência Gemini</div>
        </h1>
        <p className="text-zinc-500">Previsões poderosas e simulações baseadas no seu histórico real.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">Projeção de Patrimônio</h3>
              <button onClick={fetchPrediction} disabled={loading} className="text-sm text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                Atualizar Análise
              </button>
            </div>

            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-purple-600" size={48} />
                <p className="text-zinc-400 animate-pulse">Analisando padrões e gerando projeções...</p>
              </div>
            ) : prediction ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl">
                    <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Em 3 Meses</p>
                    <p className="text-2xl font-bold">{formatBRL(prediction.forecast3Months)}</p>
                  </div>
                  <div className="p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl">
                    <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Em 6 Meses</p>
                    <p className="text-2xl font-bold">{formatBRL(prediction.forecast6Months)}</p>
                  </div>
                  <div className="p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl">
                    <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Em 12 Meses</p>
                    <p className="text-2xl font-bold">{formatBRL(prediction.forecast12Months)}</p>
                  </div>
                </div>

                <div className="bg-purple-900/10 border border-purple-500/20 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-3 text-purple-400">
                    <Lightbulb size={20} />
                    <span className="font-bold">Dica Estratégica da IA</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed italic italic">"{prediction.insight}"</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-zinc-500 uppercase flex items-center gap-2">
                    <AlertTriangle size={14} />
                    Análise de Riscos
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {prediction.risks.map((risk, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl text-sm text-zinc-300">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                        {risk}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
                <p className="text-zinc-500">Sem predições no momento. Adicione transações para desbloquear.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">Simulador "E Se..."</h3>
            <textarea 
              placeholder="Ex: E se eu reduzir meus gastos com iFood em 50%? Ou se eu ganhar um aumento de R$ 1000?"
              className="w-full h-32 bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none mb-4"
              value={simScenario}
              onChange={e => setSimScenario(e.target.value)}
            />
            <button onClick={handleSimulate} disabled={simLoading || !simScenario} className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {simLoading ? <Loader2 className="animate-spin" size={20} /> : <PlayCircle size={20} />}
              Executar Simulação
            </button>

            {simulation && !simLoading && (
              <div className="mt-6 p-4 bg-zinc-800/30 rounded-xl text-sm border border-zinc-800">
                <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Impacto em 6 meses</p>
                <p className={`text-2xl font-bold mb-3 ${simulation.newForecast >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {simulation.newForecast >= 0 ? '+' : ''}{formatBRL(simulation.newForecast)}
                </p>
                <p className="text-zinc-400">{simulation.impactDescription}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predictions;
