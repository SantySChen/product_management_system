import { Outlet } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import Header from './components/Header'
import { useState } from 'react'

function App() {
 const [searchTerm, setSearchTerm] = useState('')

  return (
    <div>
      <Header onSearch={setSearchTerm}/>
      <main>
        
        <Outlet context={{ searchTerm }}/>
        
      </main>
      <Footer />
    </div>
  )
}

export default App
