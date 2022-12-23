import { React, useState, useMemo } from 'react'; 
import './App.css';
import InfoPanel from './components/InfoPanel';

import Layout from './components/Layout';
import LoadingPanel from './components/LoadingPanel';
import PageBlocker from './components/PageBlocker';

import OptionsPage from './pages/OptionsPage';
import PartitionPage from './pages/PartitionPage';

import LoadingContext from './store/LoadingContext';
import PageContext from './store/PageContext';
import PartitionContext from './store/PartitionContext';
import InfoPanelContext from './store/InfoPanelContext';

function App() 
{
  const [onOptionsPage, setOnOptionsPage] = useState (true); // app currently on the options or groups page? 
  const pageContextValue = useMemo (() => ({ onOptionsPage, setOnOptionsPage }), [onOptionsPage, setOnOptionsPage]); 

  const [partition, setPartition] = useState ([]); 
  const partitionContextValue = useMemo (() => ({ partition, setPartition }), [partition, setPartition]); 

  const [isLoading, setIsLoading] = useState (false); 
  const isLoadingContextValue = useMemo (() => ({ isLoading, setIsLoading }), [isLoading, setIsLoading]); 

  const [infoPanelActive, setInfoPanelActive] = useState(false); 
  const infoPanelContextValue = useMemo (() => ({ infoPanelActive, setInfoPanelActive }), [infoPanelActive, setInfoPanelActive]); 

  // const toggleInfoPanel = () => 
  // {
  //   setInfoPanelActive(!infoPanelActive); 
  // }

  return (
    <div>
      <LoadingContext.Provider value={isLoadingContextValue}>
        <PageContext.Provider value={pageContextValue}>
          <PartitionContext.Provider value={partitionContextValue}>
            <InfoPanelContext.Provider value={infoPanelContextValue}>
              <Layout><OptionsPage /></Layout>
              { !onOptionsPage && <PageBlocker /> }
              { !onOptionsPage && <Layout><PartitionPage /></Layout> }
              { infoPanelActive && <InfoPanel /> }
            </InfoPanelContext.Provider>
          </PartitionContext.Provider>
        </PageContext.Provider> 
      </LoadingContext.Provider>

      { isLoading && <LoadingPanel />}
    </div>
  );
}

export default App; 