import './App.css';
import AddJobSheet from './components/AddJobSheet';
import HomePage from './pages/HomePage';
import { BrowserRouter,Routes, Route, Link } from 'react-router-dom';
import ViewJobSheets from './components/ViewJobSheets';
import CompletedJobs from './components/CompletedJobs';
import Header from './pages/Header';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <div className="App">

      <BrowserRouter>
     <Routes>
       <Route path="/" element={<Login />} />
       <Route path="/home" element={<HomePage />} />
        <Route path="Add_jb/" element={<AddJobSheet />} />
        <Route path="view_jb/" element={<ViewJobSheets />} />
        <Route path="view_com_jb/" element={<CompletedJobs />} />
        <Route path="header/" element={<Header />} />
        <Route path="register/" element={<Register />} />
        <Route path="login/" element={<Login />} />
     </Routes>
</BrowserRouter>
    </div>
  );
}

export default App;
