import { createRoot } from 'react-dom/client';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from "./store/store.js"

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}>
   <Provider store = {store}> 
    <App />
   </Provider>
  </BrowserRouter>
)
