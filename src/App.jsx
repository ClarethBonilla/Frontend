import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './component/Home/Home'
import Tratamientos from './component/Tratamientos'
import Sobrenosotros from './component/Sobrenosotros/Sobrenosotros'
import Formulario from './component/Formulario'
import Pacientes from "./component/Pacientes"
import Login from './component/Login'
import CalendarGoogleStyle from './component/CalendarGoogleStyle'

function App() {
  return (
    <AuthProvider>
      <div className="container-fluid px-0">
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/tratamientos' element={<Tratamientos />} />
            <Route path='/sobrenosotros' element={<Sobrenosotros />} />
            <Route path='/formulario' element={<Formulario />} />
            <Route path='/pacientes' element={<Pacientes />} />
            <Route path='/login' element={<Login />} />
            <Route path='/calendar' element={<CalendarGoogleStyle />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  )
}

export default App
