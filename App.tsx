import React, { useState } from 'react';
import Layout from './components/Layout';
import LiveReplay from './views/SocialMonitor'; 
import EcommerceAnalysis from './views/EcommerceAnalysis';
import AudienceDashboard from './views/AudienceDashboard';
import CustomDashboard from './views/CustomDashboard';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('custom'); // Set default to new dashboard

  const renderContent = () => {
    switch (activeTab) {
      case 'custom':
        return <CustomDashboard />;
      case 'replay':
        return <LiveReplay />;
      case 'ecommerce':
        return <EcommerceAnalysis />;
      case 'audience':
        return <AudienceDashboard />;
      default:
        return <CustomDashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;