
import { BrowserRouter, Route, Routes, Outlet  } from 'react-router'
import './App.css'
import PaymentPage from './pages/PaymentPage'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import SuccessPage from './pages/SucessPage'
import CancelPage from './pages/CancelPage'   
import HomePage from './pages/HomePage'
import NavBar from './components/NavBar'
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)  

     export const Root = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  )
}

function App() {

  const options = {
    // passing the client secret obtained from the server
    clientSecret: "{{CLIENT_SECRET}}",
  };    
  
  return (    
    <>
     
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />} >
          <Route index element={<HomePage />} />
          <Route path="/paymentMern" element={<PaymentPage />} />
          <Route path="/paymentMern/success" element={<SuccessPage />} />
            <Route path="/paymentMern/cancel" element={<CancelPage />} />
            <Route
      path="*"
      element={
        <main style={{ padding: "1rem" }}>
          <p>There's nothing here!</p>
        </main>
      }
    />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}


export default App
