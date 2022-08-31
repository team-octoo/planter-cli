import React from 'react';
import { Outlet } from 'react-router-dom';
import { Icon } from './components/basics';
import { Header, SideMenu } from './components/elements';

function App() {
  return (
    <div className="flex flex-col h-full bg-stone-50">
      <Header />
      <div className="flex-1 container mx-auto flex">
        <SideMenu />
        <main className="py-8 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
