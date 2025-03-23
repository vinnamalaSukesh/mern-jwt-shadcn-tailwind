import { Route, BrowserRouter, Routes } from 'react-router-dom'
import LoginRegister from './_components/loginRegister'
import Home from './_components/home'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginRegister />} />
        <Route path='/home' element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
