import React, { useState } from 'react';
import { Menu as MenuIcon, X } from 'lucide-react';

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = ['Notes', 'Etudiants', 'Matières', 'A propos'];

  const handleMenuClick = (item) => {
    alert(item);
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      {/* Bouton hamburger */}
      <button
        onClick={toggleMenu}
        className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg shadow-lg transition duration-200"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <div className="mt-2 bg-white rounded-lg shadow-xl overflow-hidden min-w-[200px]">
          <nav>
            <ul className="py-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleMenuClick(item)}
                    className="w-full text-left px-4 py-3 hover:bg-indigo-50 transition duration-150 text-gray-700 hover:text-indigo-600 font-medium"
                  >
                    {item}
                  </button>
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
  );
};

export default Menu;