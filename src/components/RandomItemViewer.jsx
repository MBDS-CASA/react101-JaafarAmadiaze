import React, { useState, useEffect } from 'react';
import { Shuffle } from 'lucide-react';

// Fonction utilitaire pour obtenir un élément aléatoire
const getRandomItem = (array) => {
  if (!array || array.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

// Composant pour afficher un élément individuel
const ItemDisplay = ({ item }) => {
  if (!item) {
    return (
      <div className="text-center text-gray-500 py-8">
        Aucun élément à afficher
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="space-y-4">
        {Object.entries(item).map(([key, value]) => (
          <div key={key} className="border-b border-gray-200 pb-2">
            <span className="font-semibold text-gray-700 capitalize">
              {key}:
            </span>
            <span className="ml-2 text-gray-900">
              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
            </span>
          </div>
        ))}
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
      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200 flex items-center gap-2 mx-auto"
    >
      <Shuffle size={20} />
      Élément aléatoire
    </button>
  );
};

// Composant pour afficher les statistiques
const DataStats = ({ count }) => {
  return (
    <div className="text-center mt-4 text-gray-600">
      Total: {count} élément{count > 1 ? 's' : ''}
    </div>
  );
};

// Composant pour gérer le chargement
const LoadingState = () => {
  return (
    <div className="text-center py-12">
      <div className="text-xl text-gray-600">Chargement...</div>
    </div>
  );
};

// Composant pour afficher les erreurs
const ErrorState = ({ message }) => {
  return (
    <div className="py-12 px-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
        {message}
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
    <section className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Élément Aléatoire
        </h2>
        
        <ItemDisplay item={currentItem} />
        
        <div className="text-center mt-6">
          <ShuffleButton onClick={handleShuffle} disabled={data.length === 0} />
        </div>

        <DataStats count={data.length} />
      </div>
    </section>
  );
};

export default RandomItemViewer;