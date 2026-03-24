import toast from "react-hot-toast";
import { RecupType } from "../typescript/DataType";
import { useEffect } from "react";
import { accountService, userService } from "../_services/account.service";

export function ccyFormat(num: number) {
    return `${num.toFixed(2)}`;
  }

// Pour retouner la multiplication de deux numbres
export function priceRow(qte: number, pu: number) {
    return qte * pu;
  }

export function subtotal(items: readonly RecupType[]) {
  return items
    .map(({ prix_total }) => prix_total || 0) // Assurez-vous que prix_total est défini
    .reduce((sum, i) => (sum ?? 0) + (i ?? 0), 0); // Assurez-vous que sum et i sont définis
}
  

export const generateOrderNumber = (): string => {
  return 'FAC-' + Math.floor(Math.random() * 1000000).toString();
};

// Vérification si la licence est expirée
export const isLicenceExpired = (expirationDate: string): boolean => {
  const currentDate = new Date();
  const licenceExpirationDate = new Date(expirationDate);
  return currentDate > licenceExpirationDate;
};

export function getLicenceDuration(dateStr: string) {
  if (!dateStr) return '';
  const now = new Date();
  const exp = new Date(dateStr);
  const diffMs = exp.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'expirée';
  } else if (diffDays < 30) {
    return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  } else if (diffDays < 365) {
    const months = Math.round(diffDays / 30);
    return `${months} mois`;
  } else {
    const years = Math.round(diffDays / 365);
    return `${years} an${years > 1 ? 's' : ''}`;
  }
}

export function isRecupType(value: unknown): value is RecupType {
    return typeof value === 'object' && value !== null && 'all' in value && typeof (value as RecupType).all === 'string';
  }

export function reloadOnce() {
  const hasReloaded = localStorage.getItem('hasReloaded');

  if (!hasReloaded) {
      localStorage.setItem('hasReloaded', 'true');
      window.location.reload();
  }
}
export function notClick() {
  return useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu, false);

    return () => {
      // Nettoyer l'écouteur d'événements lors du démontage du composant
      document.removeEventListener('contextmenu', handleContextMenu, false);
    };
  }, []);
}

// export function formatNumberWithSpaces(number: number): string {
//   return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
// }

// export function formatNumberWithSpaces(number: number | null | undefined): string {
//   if (number == null || isNaN(number)) return '0,00';

//   const formattedNumber = number.toFixed(2).replace('.', ',');
//   return formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
// }
export function formatNumberWithSpaces(number: string | number | null | undefined): string {
  if (number == null || isNaN(Number(number))) return '0,00';

  // Convertir en nombre si c'est une chaîne
  const num = typeof number === 'string' ? parseFloat(number) : number;

  // Formater en deux décimales et remplacer le point par une virgule
  const formattedNumber = num.toFixed(2).replace('.', ',');

  // Ajouter les espaces comme séparateurs de milliers
  return formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function foncError(error: any)  {

  const message = error?.response?.data?.message || error.message || "Une erreur est survenue";
  
  return toast.error(message);
}

export const logout = () => {
  accountService.logout();
  userService.userLogout();
  toast.success("Déconneter");
};

export const getBgClass = (qte: number): string => {
  if (qte <= 5) return 'bg-red-600';
  if (qte <= 20) return 'bg-red-100';
  if (qte <= 50) return 'bg-orange-100';
  if (qte <= 100) return 'bg-green-100';
  return ''; // Pas de classe supplémentaire si qte >= 100
};
export function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function stringAvatar(name: string) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('.')
    .toUpperCase();

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: initials,
  };
}

export function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

