import React, { ChangeEvent, FormEvent, SyntheticEvent, useState } from 'react'
import { UuType } from '../../../../typescript/Account'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Pagination,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import QuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from '@mui/icons-material/Add';
import MyTextField from '../../../../_components/Input/MyTextField';
import { connect } from '../../../../_services/account.service';
import { RecupType } from '../../../../typescript/DataType';
import { EntreFormType } from '../../../../typescript/FormType';
import { useCreateEntre, useFetchAllEntre } from '../../../../usePerso/fonction.entre';
import { useFetchAllSousCate } from '../../../../usePerso/fonction.categorie';
import CardClientEntrer from './CardClientEntrer';
import { useUnClient } from '../../../../usePerso/fonction.user';
import { useStoreUuid } from '../../../../usePerso/store';
import { formatNumberWithSpaces } from '../../../../usePerso/fonctionPerso';

export default function ClientEntrer(uuid: UuType) {

  const top = {
    user_id: connect,
    client_id: uuid.uuid,
  }
  const {unClient} = useUnClient(uuid.uuid!);
  const {ajoutEntre} = useCreateEntre()
  const entreprise_id = useStoreUuid((state) => state.selectedId)
  const {souscategories} = useFetchAllSousCate(entreprise_id!)

  const [ajout_terminer, setTerminer] = useState(false);

  const Ajout_Terminer = () => {
    ajout_terminer ? setTerminer(false) : setTerminer(true);
  };
  
  // const {entresEntreprise, isLoading, isError} = useGetAllEntre(connect)
  const {entres: entresEntreprise, isLoading, isError} = useFetchAllEntre(top)
  
  const itemsPerPage = 10; // Nombre d'éléments par page

  // État pour la page courante et les éléments par page
  const [currentPage, setCurrentPage] = useState(1);

  // État pour la date sélectionnée par l'utilisateur
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Calcul du nombre total de pages en fonction des résultats filtrés
  const filteredBoutiques = entresEntreprise?.filter((item) => {
    return selectedDate ? item.date === selectedDate : true;
  });

  // Inverser les boutiques pour que les plus récentes apparaissent en premier
  const reversedBoutiques = filteredBoutiques?.slice().sort((a: RecupType, b: RecupType) => {
    if (a.id === undefined) return 1;
    if (b.id === undefined) return -1;
    return Number(b.id) - Number(a.id);
  });
  const totalPages = Math.ceil(reversedBoutiques?.length / itemsPerPage);

  // Calculer la somme des "price" pour la date sélectionnée
  const totalPrice = reversedBoutiques?.reduce((acc, row: RecupType) => {
    const price = (row.qte !== undefined && row.pu !== undefined) ? row.qte * row.pu : 0;
    return acc + price;
  }, 0);

  // Récupération des éléments à afficher sur la page courante
  const displayedBoutiques = reversedBoutiques?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  // Gestion du changement de page
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    // setUserInteracted(true); // Indiquer que l'utilisateur a interagi avec la pagination
  };

  // Gestion du changement de date
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
    setCurrentPage(1); // Revenir à la première page lorsque la recherche est appliquée
    // setUserInteracted(false); // Réinitialiser l'interaction utilisateur
  };
  
  const [open, openchange]= useState(false);
  const functionopen = () => {
    openchange(true)
  }
  const closeopen = () => {
    openchange(false)
  }

  const [formValues, setFormValues] = useState<EntreFormType>({
    libelle: '',
    cumuler_quantite: false,
    categorie_slug: '',
    user_id: '',
    date: '',
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

  const handleAutoCompleteChange = (_: SyntheticEvent<Element, Event>,
    value: string | RecupType | null,
    // reason: AutocompleteChangeReason
    ) => {
    if (typeof value === 'object' && value !== null) {
      
      setFormValues({
        ...formValues,
        categorie_slug: value.uuid ?? '',
      });
    } else {
      setFormValues({
        ...formValues,
        categorie_slug: '',
      });
    }
  };
  
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    formValues["cumuler_quantite"] = ajout_terminer
    formValues["user_id"] = connect
    formValues["client_id"] = uuid.uuid
    
    ajoutEntre(formValues)
    // window.location.reload();
  };

  if (isLoading) {
    return <Box sx={{ width: 300 }}>
    <Skeleton />
    <Skeleton animation="wave" />
    <Skeleton animation={false} />
  </Box>
  }

  if (isError) {
    // window.location.reload();
    return <div>Non autoriser !</div>
  }

  if (unClient.role === 2 || unClient.role === 3 || unClient.role === 1) {
    if (entresEntreprise) {
      return (
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <Typography variant="h5" className="font-semibold text-gray-900">
              Gestion des Entrées
            </Typography>
            <Button
              variant="contained"
              onClick={functionopen}
              startIcon={<AddIcon />}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Nouvelle Entrée
            </Button>
          </div>

          {/* Filters Section */}
          <Paper elevation={0} className="p-4 bg-white rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <TextField
                label="Recherche par date"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                className="bg-white"
              />
              
              <div className="flex items-center space-x-2">
                <LocalAtmIcon color="primary" />
                <Typography variant="h6" className="text-gray-700">
                  Total : {formatNumberWithSpaces(totalPrice)} F
                </Typography>
              </div>

              <div className="flex justify-end">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="medium"
                />
              </div>
            </div>
          </Paper>

          {/* Table Section */}
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Désignation</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Quantité</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Prix Unitaire</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedBoutiques?.length > 0 ? (
                  displayedBoutiques.map((row, index) => (
                    <CardClientEntrer key={index} row={row} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" className="py-8">
                      <Typography variant="body1" className="text-gray-500">
                        Aucun achat enregistré
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Add Entry Modal */}
          <Dialog 
            open={open} 
            onClose={closeopen} 
            fullWidth 
            maxWidth="sm"
            PaperProps={{
              elevation: 0,
              className: "rounded-lg"
            }}
          >
            <DialogTitle className="flex justify-between items-center border-b pb-3">
              <Typography variant="h6" className="font-semibold">
                Ajouter une nouvelle entrée
              </Typography>
              <IconButton onClick={closeopen} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            
            <DialogContent className="mt-4">
              <form onSubmit={onSubmit} className="space-y-4">
                <Autocomplete
                  freeSolo
                  options={souscategories}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.libelle || '')}
                  onChange={handleAutoCompleteChange}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      required
                      label="Catégorie"
                      name="categorie_slug"
                      onChange={onChange}
                      className="bg-white"
                    />
                  )}
                />

                <MyTextField
                  label="Libellé"
                  name="libelle"
                  onChange={onChange}
                  fullWidth
                  className="bg-white"
                />

                <MyTextField
                  required
                  type="date"
                  label="Date"
                  name="date"
                  onChange={onChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  className="bg-white"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <QuantityLimitsIcon color="primary" fontSize="small" />
                      <Typography variant="subtitle2">Quantité</Typography>
                    </div>
                    <MyTextField
                      required
                      type="number"
                      name="qte"
                      onChange={onChange}
                      fullWidth
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <LocalAtmIcon color="primary" fontSize="small" />
                      <Typography variant="subtitle2">Prix Unitaire</Typography>
                    </div>
                    <MyTextField
                      required
                      type="number"
                      name="pu"
                      onChange={onChange}
                      fullWidth
                      className="bg-white"
                    />
                  </div>
                </div>

                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={ajout_terminer}
                      onChange={Ajout_Terminer}
                      color="primary"
                    />
                  }
                  label="Ajouter au stock existant"
                />

                <div className="pt-4 flex justify-end space-x-3">
                  <Button 
                    onClick={closeopen}
                    variant="outlined"
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Enregistrer
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      );
    }
  } else {
      return <Typography variant="h6" className='mx-2'>
        Celui-ci est un client 
      </Typography>
    }

  
}
