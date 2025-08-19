import {
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";

/*
NOTE: 
- The page components (AnimalPage, CCSPage, etc.) are placeholders.
- You should replace them with your actual page components from your project.
- I've added a basic layout (`PageLayout`) with a "Back" button for better UX.
*/

/**
 * A reusable layout for the sub-pages.
 * It includes a title and a "Back" button to return to the main menu.
 * @param {{title: string, children: React.ReactNode}} props
 */
const PageLayout = ({ title, children }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0">
        <div className="max-w-4xl mx-auto p-4 flex items-center">
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-800 ml-4">{title}</h1>
        </div>
      </header>
      <main className="p-6">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

// --- Placeholder Pages (Replace with your actual pages) ---
const AnimalPage = () => (
  <PageLayout title="Página de Animais">
    Conteúdo da página de gerenciamento de animais...
  </PageLayout>
);
const CCSPage = () => (
  <PageLayout title="Página de CCS Individual">
    Conteúdo da página de análise de CCS Individual...
  </PageLayout>
);
const RaquetePage = () => (
  <PageLayout title="Página da Raquete">
    Conteúdo da página de visualização da Raquete (CMT)...
  </PageLayout>
);
const CCSTanquePage = () => (
  <PageLayout title="Página de CCS Tanque">
    Conteúdo da página de análise do CCS do Tanque...
  </PageLayout>
);
// --- End Placeholder Pages ---

/**
 * The new home page, which serves as the main navigation hub.
 */
const HomePage = () => (
  <h1 className="text-3xl font-bold underline bg-sky-400 text-red-700 p-8">
    Olá, Tailwind!
  </h1>
);

/**
 * The main App component that sets up the routing.
 */
export default function App() {
  return (
    <Router>
      <Routes>
        {/* The default route is now the HomePage */}
        <Route path="/" element={<HomePage />} />

        {/* Routes for the individual feature pages */}
        <Route path="/animal" element={<AnimalPage />} />
        <Route path="/ccs" element={<CCSPage />} />
        <Route path="/raquete" element={<RaquetePage />} />
        <Route path="/ccs-tanque" element={<CCSTanquePage />} />

        {/* A fallback route that redirects any unknown URL to the HomePage */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
}
