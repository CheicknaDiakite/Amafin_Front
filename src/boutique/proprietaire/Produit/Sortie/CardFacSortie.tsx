import { Stack, TableCell, TableRow } from '@mui/material'
import { Link } from 'react-router-dom'
import VisibilityIcon from '@mui/icons-material/Visibility';
import { format } from 'date-fns';
export default function CardFacSortie({row}: any) {
  // let url = BASE(row.facture)
  const validDate = row.date ?? new Date();
  return (
    <TableRow>            
      
      <TableCell>
        {/* {row.date} */}
        {format(new Date(validDate), 'dd/MM/yyyy')}
      </TableCell>
      
      <TableCell>
          {/* {row.libelle} */}
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
          {row.libelle}
          </span>           
      </TableCell>
      <TableCell >{row.ref}</TableCell>

      <TableCell>
        <Link to={`/entreprise/produit/sortie/modif/${row.uuid}`}>
          <Stack direction="row" spacing={2}>
            {/* <Item>Modifier</Item> */}
            <VisibilityIcon color="info" fontSize="medium" />
          </Stack>
        </Link>
      </TableCell>       
    </TableRow>
  )
}
