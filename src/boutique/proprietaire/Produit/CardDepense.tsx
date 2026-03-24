import { Stack, TableCell, TableRow, IconButton, Tooltip } from '@mui/material'

import { Link } from 'react-router-dom';
import { DepenseType } from '../../../typescript/DataType';
import { format } from 'date-fns';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { formatNumberWithSpaces } from '../../../usePerso/fonctionPerso';

type EntreProps = {
  row: DepenseType;
  onEdit: (depense: DepenseType) => void;
  onDelete: (depense: DepenseType) => void;
}

export default function CardDepense({ row, onEdit, onDelete }: EntreProps) {

  const validDate = row.date ?? new Date();
  return (
    <TableRow>


        <TableCell>
          {/* {format(new Date(row.date), 'dd/MM/yyyy')} */}
          {format(new Date(validDate), 'dd/MM/yyyy')}
        </TableCell>

        <TableCell>
          {row.libelle}
         </TableCell>

        <TableCell >{formatNumberWithSpaces(row.somme)} <LocalAtmIcon color="primary" fontSize='small' /></TableCell>

        <TableCell sx={{ maxWidth: 160 }}>
          <span className="line-clamp-2 text-sm text-gray-700">
            {row.objectif_nom?.trim() || '—'}
          </span>
        </TableCell>

        <TableCell>
          <Stack direction="row" spacing={1}>
            {/* <Tooltip title="Voir les détails">
              <Link to={`/entreprise/depense/${row.uuid}`}>
                <IconButton size="small" color="info">
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </Link>
            </Tooltip> */}
            <Tooltip title="Modifier">
              <IconButton size="small" color="primary" onClick={() => onEdit(row)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Supprimer">
              <IconButton size="small" color="error" onClick={() => onDelete(row)}>
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
    </TableRow>
  )

}
