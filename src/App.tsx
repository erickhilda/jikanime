import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AnimeListPage from './pages/anime-list';
import AnimeDetailsPage from './pages/anime-details';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AnimeListPage />} />
        <Route path='/anime/:id' element={<AnimeDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
