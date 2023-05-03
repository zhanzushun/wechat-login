import './App.css';
import { URLS } from './Consts'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedPage from './ProtectedPage';
import LoginCallback from './LoginCallback';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={URLS.PROTECTED} element={<ProtectedPage />} />
        <Route path={URLS.CALLBACK} element={<LoginCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
