import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AnimeListPage from './pages/anime-list';
import AnimeDetailsPage from './pages/anime-details';
import GenresPage from './pages/genres';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AnimeListPage />} />
        <Route path='/anime/:id' element={<AnimeDetailsPage />} />
        <Route path='/genres' element={<GenresPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
