
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Goals from './components/Goals';
import Predictions from './components/Predictions';
import Investments from './components/Investments';
import { FinanceProvider } from './store';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'transactions': return <Transactions />;
      case 'goals': return <Goals />;
      case 'investments': return <Investments />;
      case 'ai': return <Predictions />;
      default: return <Dashboard />;
    }
  };

  return (
    <FinanceProvider>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </Layout>
    </FinanceProvider>
  );
};

export default App;
