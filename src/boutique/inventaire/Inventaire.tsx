import React, { ChangeEvent, FormEvent, useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Button, Dialog, DialogContent, DialogTitle, Grid, Stack, TextField } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close"
import { connect } from '../../_services/account.service';
import { EntreType } from '../../typescript/DataType';

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
  price: number,
) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      {
        date: '2020-01-05',
        customerId: '11091700',
        amount: 3,
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        amount: 1,
      },
    ],
  };
}

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.calories}</TableCell>
        <TableCell align="right">{row.fat}</TableCell>
        <TableCell align="right">{row.carbs}</TableCell>
        <TableCell align="right">{row.protein}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(historyRow.amount * row.price * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 3.99),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
  createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
  createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
  createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
];

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top

export default function Inventaire() {

  // const {ajoutEntre} = useCreateEntre()
  
  const [open, openchange]= useState(false);
  const functionopen = () => {
    openchange(true)
  }
  const closeopen = () => {
    openchange(false)
  }

  const [formValues, setFormValues] = useState<EntreType>({
    libelle: '',
    categorie_slug: '',
    user_id: '',
    pu: 0,
    qte: 0,
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // const validSlug = slug || '';

    formValues["user_id"] = connect
    // formValues["categorie_slug"] = validSlug

    console.log("onSubmit Inventaire ...", formValues)

    // ajoutEntre(formValues)
  };

  return (
    <>
    <div className='m-8 p-8 flex space-x-4'>
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">
          <Button variant="outlined" onClick={functionopen} >Ajout Categorie</Button>
        </Typography>
      </Grid>
      {/* Modal */}
      <Dialog open={open} onClose={closeopen} fullWidth maxWidth="xs">
        <DialogTitle>Categorie<IconButton onClick={closeopen} style={{float: "right"}}><CloseIcon color="primary"></CloseIcon></IconButton> </DialogTitle>
        <DialogContent>
          {/* <DialogContentText>Categorie</DialogContentText> */}
          <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={onSubmit}>
            <Stack spacing={2} margin={2}>

              {/* <Autocomplete
                id="free-solo-demo"
                freeSolo
                options={souscategories}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.libelle || '')}
                onChange={handleAutoCompleteChange}
                renderInput={(params) => <TextField {...params} name='categorie_slug' onChange={onChange} label="Categorie" />}
              /> */}

              <TextField variant="outlined" label="libelle" name='libelle' onChange={onChange}></TextField>
              <TextField variant="outlined" type='number' label="pu" name='pu' onChange={onChange}></TextField>
              <TextField variant="outlined" type='number' label="qte" name='qte' onChange={onChange}></TextField>
              
              <Button type="submit" color="success" variant="outlined">Yes</Button>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </div>
    
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
}
