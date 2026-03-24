import { Checkbox, TableCell, TableRow } from '@mui/material'

import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { RecupType } from '../../../../typescript/DataType';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { formatNumberWithSpaces, priceRow } from '../../../../usePerso/fonctionPerso';
import { useStoreCart } from '../../../../usePerso/cart_store';
import { ChangeEvent, useState } from 'react';
import { BASE } from '../../../../_services/caller.service';
import img from '../../../../../public/icon-192x192.png'

type EntreProps = {
  row: RecupType
}

export default function CardClientSortie({ row }: EntreProps | any) {
  const id = row.id ?? 0;
  const url = row.image ? BASE(row.image) : img;

  const validDate = row.date ?? new Date();
  const [checked, setChecked] = useState(false);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    };

  const addId = useStoreCart(state => state.toggleId)
  if (row.qte !== undefined && row.pu !== undefined) {
    const price = priceRow(row.qte, row.pu);

  return (
    <TableRow>
        <TableCell align="right"><img src={url} alt="img" className="h-16 w-16" /></TableCell> 

        <TableCell>
          <Checkbox
            onClick={() => addId(id)}
            checked={checked}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'controlled' }}
          />
          <Link to={`/sortie/modif/${row.uuid}`}>
            {format(new Date(validDate), 'dd/MM/yyyy')}
          </Link>
        </TableCell>
            
        
        <TableCell>
          {/* {row.date} */}
          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
            {row.ref}
          </span>
        </TableCell>
        
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
