import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { accountService } from '../_services/account.service';

interface AuthGuardProps {
  children: JSX.Element;
}

const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
  
  if (!accountService.isLogged()) {
    // Redirigez vers la page de connexion si l'utilisateur n'est pas authentifié
    return <Navigate to="/auth/login" replace />;
  }

  // Sinon, retournez les enfants (le composant routeur à rendre)
  return children;
};

export default AuthGuard;
