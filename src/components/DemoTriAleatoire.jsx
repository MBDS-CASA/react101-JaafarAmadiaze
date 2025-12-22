import React, { useState } from 'react';

// Fonction de tri aléatoire simplifiée
function trierItemAleatoirementSimple(liste, itemId) {
  const nouvelleListe = [...liste];
  const indexItem = nouvelleListe.findIndex(item => item.id === itemId);
  
  if (indexItem === -1) return nouvelleListe;
  
  const [item] = nouvelleListe.splice(indexItem, 1);
  const nouvellePosition = Math.floor(Math.random() * nouvelleListe.length);
  nouvelleListe.splice(nouvellePosition, 0, item);
  
  return nouvelleListe;
}

function DemoTriAleatoire() {
  const [items, setItems] = useState([
    { id: 1, nom: 'Premier', couleur: 'bg-red-200' },
    { id: 2, nom: 'Deuxième', couleur: 'bg-blue-200' },
    { id: 3, nom: 'Troisième', couleur: 'bg-green-200' },
    { id: 4, nom: 'Quatrième', couleur: 'bg-yellow-200' },
    { id: 5, nom: 'Cinquième', couleur: 'bg-purple-200' },
  ]);

  const [historique, setHistorique] = useState([]);

  const trierItem = (id) => {
    const ancienneListe = [...items];
    const nouvelleListe = trierItemAleatoirementSimple(items, id);
    
    // Trouver l'item déplacé
    const itemDeplace = items.find(item => item.id === id);
    
    // Trouver l'ancienne et nouvelle position
    const anciennePosition = ancienneListe.findIndex(item => item.id === id);
    const nouvellePosition = nouvelleListe.findIndex(item => item.id === id);
    
    // Ajouter à l'historique
    setHistorique(prev => [
      {
        item: itemDeplace.nom,
        anciennePos: anciennePosition + 1,
        nouvellePos: nouvellePosition + 1,
        timestamp: new Date().toLocaleTimeString()
      },
      ...prev.slice(0, 5) // Garder seulement les 5 derniers
    ]);
    
    setItems(nouvelleListe);
  };

  const trierItemAleatoire = () => {
    if (items.length === 0) return;
    const indexAleatoire = Math.floor(Math.random() * items.length);
    trierItem(items[indexAleatoire].id);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Démonstration Tri Aléatoire</h1>
      
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Liste des Items</h2>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`p-4 rounded-lg shadow ${item.couleur} transition-all duration-300`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold">Position {index + 1}</span>
                  <span className="ml-4">{item.nom}</span>
                  <span className="ml-4 text-sm text-gray-600">(ID: {item.id})</span>
                </div>
                <button
                  onClick={() => trierItem(item.id)}
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                >
                  Déplacer aléatoirement
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <button
          onClick={trierItemAleatoire}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition-opacity"
        >
          🎲 Trier un item aléatoire au hasard
        </button>
      </div>

      {historique.length > 0 && (
        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">Historique des tris</h3>
          <div className="space-y-2">
            {historique.map((action, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded border"
              >
                <div className="flex justify-between">
                  <span className="font-medium">{action.item}</span>
                  <span className="text-sm text-gray-500">{action.timestamp}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Déplacé de la position {action.anciennePos} → position {action.nouvellePos}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-bold mb-2">Comment fonctionne le tri aléatoire ?</h3>
        <ol className="list-decimal pl-5 space-y-1 text-gray-700">
          <li>Identification de l'item à déplacer par son ID</li>
          <li>Retrait de l'item de sa position actuelle</li>
          <li>Génération d'une nouvelle position aléatoire</li>
          <li>Insertion de l'item à cette nouvelle position</li>
          <li>Les autres items conservent leur ordre relatif</li>
        </ol>
      </div>
    </div>
  );
}

export default DemoTriAleatoire;