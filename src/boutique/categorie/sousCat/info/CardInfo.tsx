import { TableCell, TableRow } from '@mui/material'
import { formatNumberWithSpaces, priceRow } from '../../../../usePerso/fonctionPerso';
import { format } from 'date-fns';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

export default function CardInfo({row}: any) {
  const validDate = row.date ?? new Date();
  const price = priceRow(row.qte, row.pu);
    return (
        <TableRow>
                
            <TableCell>            
              {format(new Date(validDate), 'dd/MM/yyyy')}           
            </TableCell>
            <TableCell>            
              {row.client}           
            </TableCell>
            <TableCell> 
              {row.libelle &&               
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {row.libelle}
                </span>           
              }           
             </TableCell>
            <TableCell align="right">{row.qte}</TableCell>
            <TableCell align="right">{formatNumberWithSpaces(row.pu)}</TableCell>
            <TableCell align="right">{formatNumberWithSpaces(price)} <LocalAtmIcon color="primary" fontSize='small' /></TableCell>
        </TableRow>
      )
}
