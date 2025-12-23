import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

function MainContent() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const joursSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const moisNoms = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const jour = joursSemaine[currentDate.getDay()];
  const mois = moisNoms[currentDate.getMonth()];
  const annee = currentDate.getFullYear();
  const date = currentDate.getDate();

  const heure = currentDate.getHours().toString().padStart(2, '0');
  const minute = currentDate.getMinutes().toString().padStart(2, '0');
  const seconde = currentDate.getSeconds().toString().padStart(2, '0');

  return (
    <main className="py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">
          Informations du Jour
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date Card */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg shadow-md p-8 border-l-4 border-blue-600 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="text-blue-600" size={28} />
              <h3 className="text-xl font-semibold text-blue-600">Date</h3>
            </div>
            <p className="text-gray-700 text-lg">
              <span className="font-bold text-blue-600">{jour}</span>
              <span className="text-gray-500">, </span>
              <span className="font-semibold">{date} {mois} {annee}</span>
            </p>
          </div>

          {/* Time Card */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg shadow-md p-8 border-l-4 border-cyan-600 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="text-cyan-600" size={28} />
              <h3 className="text-xl font-semibold text-cyan-600">Heure</h3>
            </div>
            <p className="text-gray-700 text-lg font-mono">
              <span className="text-2xl font-bold text-blue-600">{heure}</span>
              <span className="text-gray-400">:</span>
              <span className="text-2xl font-bold text-blue-600">{minute}</span>
              <span className="text-gray-400">:</span>
              <span className="text-2xl font-bold text-cyan-600">{seconde}</span>
            </p>
          </div>
        </div>

        {/* Full message */}
        <div className="mt-8 p-6 bg-blue-100 rounded-lg border-l-4 border-blue-600">
          <p className="text-blue-900 text-lg text-center font-medium">
            Bonjour, on est le <span className="font-bold">{jour}, {date} {mois} {annee}</span> et il est <span className="font-bold text-cyan-600">{heure}:{minute}:{seconde}</span>
          </p>
        </div>
      </div>
    </main>
  );
}

export default MainContent;