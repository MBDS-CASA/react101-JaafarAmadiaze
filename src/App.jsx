import { useState } from 'react'
import logoVert from "./assets/logo-vert.png";
import './App.css'
import Header from './components/Header.jsx';
import MainContent from './components/MainContent.jsx';
import Footer from './components/Footer.jsx';
import RandomItemViewer from './components/RandomItemViewer.jsx';





function App() {
  

  return (
    <>
      <Header />
     
      <MainContent />
      <RandomItemViewer />
      <Footer />
      
    </>
  )
}

export default App
