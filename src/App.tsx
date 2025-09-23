import './App.css'
import MainCategory from './components/MainCategory'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <>
      <div>
        <MainCategory kodeApi='PillarSatu' IdPillar='1'/>
        <MainCategory kodeApi='PillarDua' IdPillar='2'/>
        <MainCategory kodeApi='PillarTiga' IdPillar='3'/>
        <Outlet/>
      </div>
    </>
  )
}

export default App
