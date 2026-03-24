import { TableCell, TableRow } from '@mui/material'

import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { RecupType } from '../../../../typescript/DataType';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { formatNumberWithSpaces, priceRow } from '../../../../usePerso/fonctionPerso';

type EntreProps = {
  row: RecupType
}

export default function CardClientEntrer({ row }: EntreProps) {
  const validDate = row.date ?? new Date();
  if (row.qte !== undefined && row.pu !== undefined) {
    const price = priceRow(row.qte, row.pu);

  return (
    <TableRow>
            
        <Link to={`/entre/modif/${row.uuid}`}>
          <TableCell>
            {/* {row.date} */}
            {format(new Date(validDate), 'dd/MM/yyyy')}
          </TableCell>
        </Link>
        <TableCell>
        {row.categorie_libelle}{" "}
        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
          {row.libelle}
        </span>           
         </TableCell>
        <TableCell align="right">{row.qte}</TableCell>
        <TableCell align="right">{row.pu}</TableCell>
        <TableCell align="right">{formatNumberWithSpaces(price)} <LocalAtmIcon color="primary" fontSize='small' /></TableCell>
    </TableRow>
  )
} else {
  console.log("erreur de typage PU | QTE")
}
}
