import './App.css';
import AddJobSheet from './components/AddJobSheet';
import HomePage from './pages/HomePage';
import { BrowserRouter,Routes, Route, Link } from 'react-router-dom';


function App() {
  return (
    <div className="App">

      <BrowserRouter>
     <Routes>

       <Route path="/" element={<HomePage />} />
        <Route path="Add_jb/" element={<AddJobSheet />} />

     </Routes>
</BrowserRouter>
    </div>
  );
}

export default App;
