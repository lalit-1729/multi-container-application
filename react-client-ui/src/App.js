import './App.css';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import OtherPage from './components/OtherPage/OtherPage';
import Fib from './components/FibonacciHome/FibonacciPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <Link className="App-link" to="/">Home</Link>
            <Link className="App-link" to="/otherpage">Other Page</Link>
          </header>
          <div>
            <Routes>
              <Route exact path="/" element={<Fib />} />
              <Route path="/otherpage" element={<OtherPage />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
