import React, { useState, useEffect } from 'react';
import { Shuffle } from 'lucide-react';

// Fonction utilitaire pour obtenir un élément aléatoire
const getRandomItem = (array) => {
  if (!array || array.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

// Composant pour afficher un élément individuel en table
const ItemDisplay = ({ item }) => {
  if (!item) {
    return (
      <div className="text-center text-gray-500 py-12">
        <p className="text-lg">Aucun élément à afficher</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="w-full bg-white border-collapse shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
              <th className="px-6 py-5 text-left font-bold border border-blue-700">Propriété</th>
              <th className="px-6 py-5 text-left font-bold border border-blue-700">Valeur</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(item).map(([key, value], index) => (
              <tr 
                key={key} 
                className={`hover:bg-blue-200 transition-all duration-200 cursor-default border-b-2 border-blue-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-blue-50'
                }`}
              >
                <td className="px-6 py-5 font-semibold text-blue-700 capitalize border border-blue-200 bg-blue-100 bg-opacity-40">
                  {key}
                </td>
                <td className="px-6 py-5 text-gray-800 border border-blue-200 break-words">
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Composant pour le bouton de shuffle
const ShuffleButton = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto hover:scale-105 active:scale-95 font-semibold px-8 py-3"
    >
      <Shuffle size={22} />
      Élément aléatoire
    </button>
  );
};

// Composant pour afficher les statistiques
const DataStats = ({ count }) => {
  return (
    <div className="text-center mt-8 p-6 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg border-l-4 border-blue-600 shadow-md inline-block mx-auto">
      <span className="text-blue-800 font-bold text-lg">
        📊 Total: <span className="text-cyan-700">{count}</span> élément{count > 1 ? 's' : ''}
      </span>
    </div>
  );
};

// Composant pour gérer le chargement
const LoadingState = () => {
  return (
    <div className="text-center py-16">
      <div className="inline-block">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <div className="text-xl text-blue-600 font-semibold">Chargement des données...</div>
      </div>
    </div>
  );
};

// Composant pour afficher les erreurs
const ErrorState = ({ message }) => {
  return (
    <div className="py-12 px-4">
      <div className="max-w-md mx-auto bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md">
        <div className="flex items-start gap-3">
          <div className="text-2xl mt-1">⚠️</div>
          <div>
            <h3 className="font-bold mb-2">Erreur de chargement</h3>
            <p className="text-sm">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant principal pour l'affichage aléatoire
const RandomItemViewer = () => {
  const [data, setData] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Essayer d'abord dans public/, puis à la racine
        let response = await fetch('/data.json');
        if (!response.ok) {
          response = await fetch('../data.json');
        }
        if (!response.ok) {
          throw new Error('Fichier data.json introuvable. Placez-le dans le dossier public/');
        }
        const jsonData = await response.json();
        
        const items = Array.isArray(jsonData) ? jsonData : (jsonData.data || jsonData.items || []);
        
        if (items.length === 0) {
          throw new Error('Le fichier data.json est vide ou mal formaté');
        }
        
        setData(items);
        setCurrentItem(getRandomItem(items));
        setLoading(false);
      } catch (err) {
        setError(`Erreur lors du chargement: ${err.message}`);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleShuffle = () => {
    setCurrentItem(getRandomItem(data));
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h2 className="text-5xl font-bold text-center text-blue-700 mb-3">
            Élément Aléatoire
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="fade-in">
          <ItemDisplay item={currentItem} />
        </div>
        
        <div className="text-center mt-12">
          <ShuffleButton onClick={handleShuffle} disabled={data.length === 0} />
        </div>

        <div className="text-center mt-12 flex justify-center">
          <DataStats count={data.length} />
        </div>
      </div>
    </section>
  );
};

export default RandomItemViewer;