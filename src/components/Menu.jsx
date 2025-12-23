import React, { useState } from 'react';
import { Menu as MenuIcon, X } from 'lucide-react';
import { Routes, Route, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MainContent from './MainContent';
import Courses from '../pages/Courses';
import Grades from '../pages/Grades';
import Students from '../pages/Students';

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Accueil', path: '/' },
    { name: 'Cours', path: '/courses' },
    { name: 'Notes', path: '/grades' },
    { name: 'Étudiants', path: '/students' }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="fixed top-20 left-4 z-50">
        {/* Bouton hamburger */}
        <button
          onClick={toggleMenu}
          className="btn-primary p-3 rounded-lg hover:scale-110"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>

        {/* Menu déroulant */}
        {isOpen && (
          <div className="mt-2 bg-white rounded-lg shadow-xl overflow-hidden min-w-[200px] border-2 border-blue-200 animate-in fade-in slide-in-from-top-2 duration-200">
            <nav>
              <ul className="py-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-100 transition duration-150 text-gray-700 hover:text-blue-600 font-medium border-l-4 border-transparent hover:border-blue-600 block"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}

        {/* Overlay pour fermer le menu en cliquant à l'extérieur */}
        {isOpen && (
          <div
            className="fixed inset-0 -z-10"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>

      {/* Routes */}
      <main className="flex-1 page-transition">
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/students" element={<Students />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default Menu;