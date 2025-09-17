import './App.css'
import MainCategory from './components/MainCategory'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <>
      <div>
        <MainCategory/>
        <Outlet/>
      </div>
    </>
  )
}

export default App