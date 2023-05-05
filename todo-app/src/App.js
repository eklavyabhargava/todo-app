import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/register';
import Login from './pages/login'
import AuthRoute from './route/authRoute'

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/*' element={<AuthRoute />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
