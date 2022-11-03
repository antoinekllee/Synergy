import { React, useState, useMemo } from 'react'; 
import './App.css';

import Layout from './components/Layout';
import LoadingPanel from './components/LoadingPanel';

import OptionsPage from './pages/OptionsPage';
import PartitionPage from './pages/PartitionPage';

import LoadingContext from './store/LoadingContext';
import PageContext from './store/PageContext';
import PartitionContext from './store/PartitionContext';

function App() 
{
  const [onOptionsPage, setOnOptionsPage] = useState (true); // app currently on the options or groups page? 
  const pageContextValue = useMemo (() => ({ onOptionsPage, setOnOptionsPage }), [onOptionsPage, setOnOptionsPage]); 

  const [partition, setPartition] = useState ([]); 
  const partitionContextValue = useMemo (() => ({ partition, setPartition }), [partition, setPartition]); 

  const [isLoading, setIsLoading] = useState (false); 
  const isLoadingContextValue = useMemo (() => ({ isLoading, setIsLoading }), [isLoading, setIsLoading]); 

  const output = onOptionsPage ? <OptionsPage /> : <PartitionPage />

  return (
    <div>
      <Layout>
        <LoadingContext.Provider value={isLoadingContextValue}>
          <PageContext.Provider value={pageContextValue}>
            <PartitionContext.Provider value={partitionContextValue}>
              { output }
            </PartitionContext.Provider>
          </PageContext.Provider> 
        </LoadingContext.Provider>
      </Layout>

      { isLoading && <LoadingPanel />}
    </div>
  );
}

export default App; 