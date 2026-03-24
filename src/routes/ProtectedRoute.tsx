import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useFetchUser } from '../usePerso/fonction.user';
import { connect } from '../_services/account.service';

interface ProtectedRouteProps {
  requiredRole: number | number[];  // Accepte un seul rôle ou plusieurs rôles
  redirectPath?: string;            // Chemin vers lequel rediriger si l'utilisateur n'est pas autorisé
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole,
  redirectPath = '/', // Par défaut, redirige vers la page d'accueil ou une autre page
}) => {
  
  const { us } = useFetchUser(String(connect)); // Récupérer l'utilisateur connecté
  
  // Si l'utilisateur n'est pas connecté, rediriger
  if (!us) {
    return <Navigate to={redirectPath} replace />;
  }

  // Vérification du rôle
  const hasAccess = Array.isArray(requiredRole)
    ? requiredRole.includes(us.role) // Si `requiredRole` est un tableau, vérifier si `us.role` est inclus
    : us.role === requiredRole;      // Sinon, comparer directement le rôle

  // Si l'utilisateur n'a pas le bon rôle, rediriger
  if (!hasAccess) {
    return <Navigate to={redirectPath} replace />;
  }

  // Si tout est correct, permettre l'accès aux enfants (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;
