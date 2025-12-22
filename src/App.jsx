import { useState } from 'react'
import './App.css'
import Header from './components/Header.jsx';
import MainContent from './components/MainContent.jsx';
import Footer from './components/Footer.jsx';
import RandomItemViewer from './components/RandomItemViewer.jsx';
import Menu from './components/Menu.jsx';





function App() {
  

  return (
    <>
      <Header />
     <Menu />
      <MainContent />
      <RandomItemViewer />
      <Footer />
      
    </>
  )
}

export default App
