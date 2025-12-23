import { Heart, Github, Mail } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <p>© {currentYear} - AMADIAZE.JAAFAR, Tous droits réservés.</p>
    </footer>
  );
}

export default Footer;