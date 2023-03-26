import React from 'react';
import Routes from './Routes';
import { Provider } from 'react-redux'
import store from './redux-store/store'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <Provider store={store}>
       <Routes/>
       <ToastContainer/>
      </Provider>
  );
}

export default App;


