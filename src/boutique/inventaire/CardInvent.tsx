import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Stack, TableCell, TableRow } from '@mui/material'
import { Link } from 'react-router-dom';
import { formatNumberWithSpaces, getBgClass, priceRow } from '../../usePerso/fonctionPerso';
import { RecupType } from '../../typescript/DataType';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { format } from 'date-fns';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useFetchUser } from '../../usePerso/fonction.user';
import img from '../../../public/icon-192x192.png'
import { connect } from '../../_services/account.service';
import { BASE } from '../../_services/caller.service';
import CloseIcon from "@mui/icons-material/Close"
import QrCode2Icon from '@mui/icons-material/QrCode2';

// import { saveAs } from 'file-saver';

// const downloadImage = async (imageUrl: string, filename: string) => {
//   try {
//     const response = await fetch(imageUrl, { mode: 'cors' });
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     const blob = await response.blob();
//     const blobUrl = URL.createObjectURL(blob);
    
//     // Création d'un lien temporaire pour lancer le téléchargement
//     const link = document.createElement('a');
//     link.href = blobUrl;
//     link.download = filename;
//     document.body.appendChild(link);
//     link.click();
    
//     // Nettoyage : suppression du lien et révocation de l'URL blob
//     document.body.removeChild(link);
//     URL.revokeObjectURL(blobUrl);
//   } catch (error) {
//     console.error('Erreur lors du téléchargement de l\'image:', error);
//   }
// };

type EntreProps = {
  row: RecupType
}

export default function CardInvent({ row }: EntreProps) {
  const { unUser } = useFetchUser();
  const [open, setOpen] = useState(false);
  const functionOpen = () => {
    setOpen(true);
  };
  const closeOpen = () => {
    setOpen(false);
  };

  const url = row.image ? BASE(row.image) : img;
  const code_barre = row.code_barre ? BASE(row.code_barre) : img;
  const validDate = row.date ?? new Date();

  if (row.qte !== undefined && row.pu_achat !== undefined) {
    const price = priceRow(row.qte, row.pu_achat);

    return (
      <>
        <TableRow className={getBgClass(row.qte)}>
          <TableCell align="right">
            <img src={url} alt="img" className="h-16 w-16" />
          </TableCell>
          <TableCell>{row.ref}</TableCell>
          <TableCell>{format(new Date(validDate), 'dd/MM/yyyy')}</TableCell>
          <TableCell>
            {row.client && (
              <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                {row.client}
              </span>
            )}
          </TableCell>
          <TableCell>
            {row.categorie_libelle}{' '}
              {row.libelle && (
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {row.libelle}
                </span>
              )}
          </TableCell>
          <TableCell align="right">{row.qte}</TableCell>
          <TableCell align="right">{formatNumberWithSpaces(row.pu)}</TableCell>
          {unUser.role === 1 && (
            <>
              <TableCell align="right">{formatNumberWithSpaces(row.pu_achat)}</TableCell>
              <TableCell align="right">
                {formatNumberWithSpaces(price)}{' '}
                <LocalAtmIcon color="primary" fontSize="small" />
              </TableCell>
            </>
          )}
          {(unUser.role === 1 || unUser.role === 2) && (
            <TableCell className={row.is_sortie ? 'bg-white' : 'bg-white'}>
              <Link to={`/entre/modif/${row.uuid}`}>
                <Stack direction="row" spacing={2}>
                  <VisibilityIcon color={row.is_sortie ? 'info' : 'error'} fontSize="medium" />
                </Stack>
              </Link>
            </TableCell>
          )}
          <TableCell className={row.is_sortie ? 'bg-white' : 'bg-white'}>
            <Stack direction="row" spacing={2}>
              <QrCode2Icon onClick={functionOpen} color={row.is_sortie ? 'info' : 'error'} fontSize="medium" />
            </Stack>
          </TableCell>
        </TableRow>

        <Dialog open={open} onClose={closeOpen} fullWidth maxWidth="xs">
          <DialogTitle>
            Code (QR)
            <IconButton onClick={closeOpen} style={{ float: 'right' }}>
              <CloseIcon color="primary" />
            </IconButton>
          </DialogTitle>

          <DialogContent style={{ textAlign: 'center' }}>
  {/* Affichage de l'image du code barre */}
  <img src={code_barre} alt="Code barre" className="h-50 w-50" />
  {/* Bouton de téléchargement */}
  <a href={code_barre} download>
    <button
      style={{
        marginTop: '1rem',
        padding: '0.5rem 1rem',
        backgroundColor: '#1976d2',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      Télécharger l'image
    </button>
  </a>
</DialogContent>


        </Dialog>
      </>
    );
  } else {
    console.log('erreur de typage PU | QTE');
    return null;
  }
}
