import { Outlet } from 'react-router-dom'
import './App.css'
import { Container } from 'react-bootstrap'
import Footer from './components/Footer'

function App() {
 

  return (
    <div>
      <header>
        hello
      </header>
      <main>
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </div>
  )
}

export default App
