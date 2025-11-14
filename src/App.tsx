import React from 'react';
import Revenue from './pages/Revenue/Revenue';
import { UserProvider } from './context/UserContext';
import { WalletProvider } from './context/WalletContext';
import { TransactionsProvider } from './context/TransactionsContext';

function App() {
  return (
    <UserProvider>
      <WalletProvider>
        <TransactionsProvider>
          <Revenue />
        </TransactionsProvider>
      </WalletProvider>
    </UserProvider>
  );
}

export default App;
