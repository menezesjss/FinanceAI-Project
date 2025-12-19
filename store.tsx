
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Transaction, Goal } from './types';

interface FinanceContextType {
  transactions: Transaction[];
  goals: Goal[];
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (t: Transaction) => void;
  addGoal: (g: Omit<Goal, 'id'>) => void;
  deleteGoal: (id: string) => void;
  updateGoal: (g: Goal) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  // Load from LocalStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem('fa_transactions');
    const savedGoals = localStorage.getItem('fa_goals');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('fa_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fa_goals', JSON.stringify(goals));
  }, [goals]);

  const addTransaction = useCallback((t: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...t, id: Math.random().toString(36).substr(2, 9) };
    setTransactions(prev => [newTransaction, ...prev]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateTransaction = useCallback((updated: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
  }, []);

  const addGoal = useCallback((g: Omit<Goal, 'id'>) => {
    const newGoal = { ...g, id: Math.random().toString(36).substr(2, 9) };
    setGoals(prev => [...prev, newGoal]);
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  }, []);

  const updateGoal = useCallback((updated: Goal) => {
    setGoals(prev => prev.map(g => g.id === updated.id ? updated : g));
  }, []);

  return (
    <FinanceContext.Provider value={{ 
      transactions, goals, 
      addTransaction, deleteTransaction, updateTransaction,
      addGoal, deleteGoal, updateGoal 
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within a FinanceProvider');
  return context;
};
