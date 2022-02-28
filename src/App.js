import { Routes, Route, BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router className="App">
      <Routes>
        <Route path="/" element={<div>home</div>} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </Router>
  );
}

export default App;
