import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import FlavoursPage from './components/pages/FlavoursPage/FlavoursPage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={ <App /> }>
          <Route path="flavours" element={ <Outlet /> }>
            <Route index element={ <FlavoursPage /> } />
            <Route path=":flavour" element={ <FlavoursPage /> } />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
