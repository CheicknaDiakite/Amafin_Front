import { Fragment } from 'react'
import { ToastContainer } from 'react-toastify'
import { Money } from '../../../_components/icons/Money';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import QuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import MyTextField from '../../../_components/Input/MyTextField';
export default function TableForm({isEditing, handleSubmit, amount, list, onChange}: any) {
  const totalPrix = list.reduce((sum: any, sor: any) => sum + sor.amount, 0);
  
  return (
    <>
      <ToastContainer position="top-right" theme="colored" />

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:mt-8">
          
          <Typography variant="h4">
            Designation
          </Typography>
          <MyTextField 
          type="text"
          name="description"
          id="description"
          placeholder="Item description"
          onChange={onChange}
          />
        </div>

        <div className="md:grid grid-cols-3 gap-10">
          <div className="flex flex-col">
            
            <Typography variant="h4">
            Quantite <QuantityLimitsIcon fontSize='medium' />
            </Typography>
            <MyTextField 
            type="number"
            name="quantity"
            id="quantity"
            placeholder="Quantiter"
            onChange={onChange}
            />
          </div>

          <div className="flex flex-col">
            
            <Typography variant="h4">
            Prix Unitaire <LocalAtmIcon fontSize='medium' />
            </Typography>
            <MyTextField 
            type="number"
            name="price"
            id="price"
            placeholder="Prix Unitaire"
            onChange={onChange}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="amount">Somme <Money size={40} className='inline' /></label>
            <p>{amount}</p>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 mb-5 text-white font-bold py-2 px-8 rounded hover:bg-blue-600 hover:text-white transition-all duration-150 hover:ring-4 hover:ring-blue-400"
        >
          {isEditing ? "Finish Editing" : "Ajouter"}
        </button>
      </form>

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
            {/* {facEntresUtilisateur?.length > 0 ? 
            
            facEntresUtilisateur?.map((row, index) => {            
                return <CardFacEntre key={index} row={row} />
  
              })
              : "Pas de Produit"
            } */}
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
            )
            // {          
            //   return <CardTableSortie key={index} row={row} />                
            // }
            )} 
          </TableBody>
        </Table>
      </TableContainer>

      <div>
        <h2 className="flex items-end justify-end text-gray-800 text-4xl font-bold">
          {/* CFA. {totalPrix} */}
          <Money size={40} className='inline' />{totalPrix}
        </h2>
      </div>
    </>
  )
}
