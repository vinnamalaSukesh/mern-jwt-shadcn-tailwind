import { Route, BrowserRouter, Routes } from 'react-router-dom'
import LoginRegister from './_components/loginRegister'
import Admin from './_components/admin'
import Agent from './_components/agent'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginRegister />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/agent' element={<Agent />} />
      </Routes>
    </BrowserRouter>
  )
}
