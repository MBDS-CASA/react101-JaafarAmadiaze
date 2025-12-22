function MainContent() {

  const currentDate = new Date();
  

  const joursSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const moisNoms = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  
  const jour = joursSemaine[currentDate.getDay()];
  const mois = moisNoms[currentDate.getMonth()];
  const annee = currentDate.getFullYear();

  const heure = currentDate.getHours().toString().padStart(2, '0');
  const minute = currentDate.getMinutes().toString().padStart(2, '0');
  const seconde = currentDate.getSeconds().toString().padStart(2, '0');

  return (
    <main className="read-the-docs">
      <p>Bonjour, on est le {jour}, {currentDate.getDate()} {mois} {annee} et il est {heure}:{minute}:{seconde}</p>
    </main>
  )
}

export default MainContent;