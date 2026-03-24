import { Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/DeleteOutline';

export default function Supp() {
    const confirmation = window.confirm("Vous êtes sûr de vouloir supprimer ?");
  return <>
  {confirmation && 
    <Button size="small" className='rounded-full shadow-md shadow-red-800/50'>
        <DeleteIcon fontSize='small' />
    </Button>
  }
    <Button size="small" className='rounded-full shadow-md shadow-red-800/50'>
        <DeleteIcon fontSize='small' />
    </Button>
  </>
}
