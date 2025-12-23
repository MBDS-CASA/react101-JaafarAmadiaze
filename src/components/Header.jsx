import logoVert from "../assets/logo-vert.png";

function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white py-4 px-4 text-center shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img 
            src={logoVert} 
            alt="Logo React" 
            width={60} 
            className="drop-shadow-md"
          />
          <div className="text-left">
            <h1 className="text-2xl font-bold">
              Introduction à React
            </h1>
            <p className="text-sm opacity-90">
              À la découverte des premières notions de React
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;