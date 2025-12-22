import { useState } from 'react'
import logoVert from "./assets/logo-vert.png";
import './App.css'

function Header() {
return (
  <div>
     
            <img src={logoVert} alt="Logo" width={200} />

       
         <h1>Introduction à React</h1>
      <h4>A la découverte des premières notions de React</h4>
      </div>
)
}

function MainContent() {
  return (
    <main className="read-the-docs">
      <p>Ici  nous afficherons des informations interessantes :) </p>
    </main>
  )
}


function App() {
  

  return (
    <>
      <Header />
     
      <MainContent />
      
    </>
  )
}

export default App
