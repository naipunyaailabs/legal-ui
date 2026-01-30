import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useExperienceMode } from "@/contexts/ExperienceModeContext";

const NotFound = () => {
  const location = useLocation();
  const { mode } = useExperienceMode();
  const isLawyerMode = mode === 'lawyer';

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className={`flex min-h-screen items-center justify-center ${
      isLawyerMode ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <div className="text-center">
        <h1 className={`mb-4 text-4xl font-bold ${
          isLawyerMode ? 'text-blue-100' : 'text-gray-900'
        }`}>
          404
        </h1>
        <p className={`mb-4 text-xl ${
          isLawyerMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Oops! Page not found
        </p>
        <a 
          href="/" 
          className={`underline ${
            isLawyerMode 
              ? 'text-blue-400 hover:text-blue-300' 
              : 'text-blue-500 hover:text-blue-700'
          }`}
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;