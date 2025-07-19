import { Outlet } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import Header from './components/Header'
import { useContext, useEffect, useState } from 'react'
import CartPanel from './components/CartPanel'
import { Store } from './Store'
import { queryClient } from './main'

function App() {
 const [searchTerm, setSearchTerm] = useState('')
 const [showCart, setShowCart] = useState(false)

 const { state } = useContext(Store);
 const { userInfo } = state;

 useEffect(() => {
  if (userInfo) {
    queryClient.invalidateQueries({ queryKey: ['cart'] })
  } 
 }, [userInfo])

  return (
    <div>
      <Header onSearch={setSearchTerm} onCartOpen={() => setShowCart(true)}/>
      <CartPanel isOpen={showCart} onClose={() => setShowCart(false)} />
      <main>
        
        <Outlet context={{ searchTerm }}/>
        
      </main>
      <Footer />
    </div>
  )
}

export default App
