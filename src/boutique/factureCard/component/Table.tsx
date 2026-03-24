import { Fragment } from 'react'
import { Money } from '../../../_components/icons/Money';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function TableList({list}: any) {
  const totalPrix = list.reduce((sum: any, sor: any) => sum + sor.amount, 0);
  return (
    <>
     
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="spanning table">
          <TableHead>
            <TableRow>
              <TableCell>Designation</TableCell>
              <TableCell>Quantite</TableCell>
              <TableCell>Prix unitaire</TableCell>
              <TableCell>Somme</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            
            {list.map(({ id, description, quantity, price, amount }: any) => (
              <Fragment key={id} >
              <TableRow>            
                  
                  <TableCell>{description}</TableCell>                  
                  <TableCell>{quantity}</TableCell>
                  <TableCell >{price}</TableCell>
                  <TableCell >{amount}</TableCell>        
                  {/* <TableCell >{row.prix_total}</TableCell>         */}
              </TableRow>
            </Fragment>
            ))} 
          </TableBody>
        </Table>
      </TableContainer>

      <div>
        <h2 className="flex items-end justify-end text-gray-800 text-4xl font-bold">
          {/* <PaidIcon fontSize='large' /> {totalPrix} */}
          <Money size={40} className='inline' />{totalPrix}
        </h2>
      </div>
    </>
  )
}
