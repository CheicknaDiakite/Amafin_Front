import { 
  Autocomplete, 
  Box, 
  Button, 
  Modal, 
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
import { UuType } from '../../../../typescript/Account'
import CardClientSortie from './CardClientSortie';
import MyTextField from '../../../../_components/Input/MyTextField';
import { connect } from '../../../../_services/account.service';
import { ChangeEvent, FormEvent, SyntheticEvent, useEffect, useState } from 'react';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import QuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CloseIcon from '@mui/icons-material/Close';
import { RecupType, SortieType } from '../../../../typescript/DataType';
import { useCreateSortie, useFetchAllSortie, useGetAllEntre } from '../../../../usePerso/fonction.entre';
import { useFetchEntreprise, useFetchUser, useUnClient } from '../../../../usePerso/fonction.user';
import { useStoreUuid } from '../../../../usePerso/store';
import { formatNumberWithSpaces, isLicenceExpired } from '../../../../usePerso/fonctionPerso';
import Fact from '../../../factureCard/Fact';
import { useStoreCart } from '../../../../usePerso/cart_store';
import { TypeText } from '../../../sortie/Sortie';
import { format } from 'date-fns';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: '600px',
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  p: 4,
};

export default function ClientSortie(uuid: UuType) {
  const top = {
    user_id: connect,
    client_id: uuid.uuid,
  }
  const {unUser} = useFetchUser(connect)
  const {unClient} = useUnClient(uuid.uuid!);
  
    // const {ajoutEntre} = useCreateEntre()
    const {ajoutSortie} = useCreateSortie()
    const entreprise_id = useStoreUuid((state) => state.selectedId)
  const { unEntreprise } = useFetchEntreprise(entreprise_id);
    // Pour la remise

      const [texte, setNom] = useState<TypeText>({
      clientName: '',
      clientAddress: '',
      clientCoordonne: '',
      invoiceDate: '',
      dueDate: '',
      notes: '',
      numeroFac: '',
      invoiceNumber: 0,
    });

    const onChan = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setNom({
        ...texte,
        [name]: value,
      });
    };
            
    const selectedIds = useStoreCart(state => state.selectedIds)
    const sortiess = useStoreCart(state => state.sorties);
    const selectSorties = sortiess.filter((sor) => sor.id !== undefined && selectedIds.has(sor.id as number));
    
    const {unEntreprise: entreprise} = useFetchEntreprise(entreprise_id!)
    
    const {entresEntreprise: entres} = useGetAllEntre(entreprise_id!)
    // const {entresEntreprise, isLoading, isError} = useGetAllEntre(connect)
    // const {sortiesEntreprise: entresEntreprise , isLoading, isError} = useGetAllSortie(connect)
    const {sorties: entresEntreprise , isLoading, isError} = useFetchAllSortie(top)

    const [showInvoice, setShowInvoice] = useState(false); // État pour afficher ou masquer la section de facture
    const setSorties = useStoreCart(state => state.setSorties)
    const top_st = {
      all: "all",
      user_id: connect
    }
    
    const {sorties} = useFetchAllSortie(top_st)

    const handleOnClick = () => {
      setShowInvoice(true); // Affiche la section de facture lorsque le bouton est cliqué
    };
    const handleOpenClick = () => {
      setShowInvoice(false); // Affiche la section de facture lorsque le bouton est cliqué
    };

    const handleSaveSorties = () => {
      setSorties(sorties);
    };

    // Ouvrir/fermer le modal
    // Normaliser la saisie (remplace ',' par '.')
    const normalizeInput = (value: string) => value.replace(",", ".");

    const total = selectSorties?.reduce((acc, sortie) => {
      // Convertir prix_total en nombre ou utiliser 0 si invalide
      const prixTotal = sortie.prix_total ? parseFloat(String(sortie.prix_total)) : 0;
      return acc + prixTotal;
    }, 0);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenPay, setIsModalOpenPay] = useState(false);
    const [fixedDiscount, setFixedDiscount] = useState<number | string>(""); // Remise fixe
    const [payDiscount, setPayDiscount] = useState<number | string>(""); // Remise fixe
    const [percentageDiscount, setPercentageDiscount] = useState<number | string>(""); // Remise en %
    const [discountedTotal, setDiscountedTotal] = useState(total); // Total avec remise
    const [payerTotal, setPayerTotal] = useState(total); // Total avec remise

    // Calculer le nouveau total
    const calculateDiscountedTotal = () => {
      let newTotal = total;
      const fixed = parseFloat(normalizeInput(fixedDiscount as string)) || 0;
      const percentage = parseFloat(normalizeInput(percentageDiscount as string)) || 0;
  
      if (fixed) {
        newTotal -= fixed;
      }
      if (percentage) {
        newTotal -= (percentage / 100) * total;
      }
      setDiscountedTotal(Math.max(0, newTotal)); // Empêche un total négatif
    };

    const calculatePayerTotal = () => {
      let newTotal = total;
      const fixed = parseFloat(normalizeInput(payDiscount as string)) || 0;
      
      if (fixed) {
        newTotal -= fixed;
      }
      
      setPayerTotal(Math.max(0, newTotal)); // Empêche un total négatif
    };

    const toggleModal = () => setIsModalOpen(!isModalOpen);
    const toggleModalPay = () => setIsModalOpenPay(!isModalOpenPay);

    // Appliquer la remise
      const handleApplyDiscount = () => {
        calculateDiscountedTotal();
        calculatePayerTotal();
        toggleModal();
      };
      const handleApplyPayer = () => {
        calculatePayerTotal();
        toggleModalPay();
      };
      // fin

      // États pour les dates de recherche
    const [selectedStartDate, setSelectedStartDate] = useState<string>('');
    const [selectedEndDate, setSelectedEndDate] = useState<string>('');

    const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedStartDate(event.target.value);
      setCurrentPage(1);
    };
  
    const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedEndDate(event.target.value);
      setCurrentPage(1);
    };
    
    const itemsPerPage = 10; // Nombre d'éléments par page
  
    // État pour la page courante et les éléments par page
    const [currentPage, setCurrentPage] = useState(1);
  
    // Filtrage entre les deux dates sélectionnées
  const filteredBoutiques = entresEntreprise?.filter((item) => {
    if (!item.date) {
      return false; // Ignore les éléments sans date valide
    }
  
    const itemDate = new Date(item.date).getTime();
    const startDate = selectedStartDate ? new Date(selectedStartDate).getTime() : null;
    const endDate = selectedEndDate ? new Date(selectedEndDate).getTime() : null;
  
    return (
      (startDate === null || itemDate >= startDate) &&
      (endDate === null || itemDate <= endDate)
    );
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
  
    const [formValues, setFormValues] = useState<SortieType>({
      user_id: '',
      qte: 0,
      pu: 0,
      entre_id: '',
      });

      const [amount, setAmount] = useState<number>(0);
      useEffect(() => {
        const calculateAmount = () => {
          setAmount(formValues.pu * formValues.qte);
        };
    
        calculateAmount();
      }, [amount, formValues.pu, formValues.qte, setAmount]);

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
          entre_id: value.uuid ?? '',
        });
      } else {
        setFormValues({
          ...formValues,
          entre_id: '',
        });
      }
    };

    const itemDate = format(new Date(), 'dd/MM/yyyy');
    
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      formValues["user_id"] = connect
      formValues["client_id"] = uuid.uuid
      ajoutSortie(formValues)
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
      window.location.reload();
      return <div>Error fetching data</div>
    }
    
    if (unClient.role === 1 || unClient.role === 3 || unClient.role === 2) {

      if (entresEntreprise) {
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Paper elevation={0} className="rounded-lg overflow-hidden">
                <div className="p-6 space-y-6">
                  {/* Header Section */}
                  <div className="flex justify-between items-center border-b pb-6">
                    <div>
                      <Typography variant="h4" className="font-semibold text-gray-900">
                        Gestion des Ventes
                      </Typography>
                      <Typography variant="body2" className="text-gray-500 mt-1">
                        Client : {unClient.nom}
                      </Typography>
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        variant="contained"
                        onClick={() => {
                          handleSaveSorties();
                          handleOnClick();
                        }}
                        startIcon={<ReceiptIcon />}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Créer Facture
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleOpenClick}
                        startIcon={<CloseIcon />}
                        className="border-red-500 text-red-500 hover:bg-red-50"
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>

                  {/* Main Form Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextField
                      fullWidth
                      label="Numéro de Facture"
                      name="numeroFac"
                      variant="outlined"
                      onChange={onChan}
                      className="bg-white"
                    />
                    <TextField
                      fullWidth
                      label="Notes"
                      name="notes"
                      multiline
                      rows={1}
                      variant="outlined"
                      onChange={onChan}
                      className="bg-white"
                    />
                  </div>

                  {/* Actions Section */}
                  <div className="flex flex-wrap gap-4">
                    <Button
                      variant="contained"
                      onClick={toggleModal}
                      startIcon={<LocalAtmIcon />}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      Appliquer Remise
                    </Button>
                    <Button
                      variant="contained"
                      onClick={toggleModalPay}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Enregistrer Paiement
                    </Button>
                  </div>

                  {/* Date Filter Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow-sm">
                    <TextField
                      fullWidth
                      label="Date de début"
                      type="date"
                      value={selectedStartDate}
                      onChange={handleStartDateChange}
                      InputLabelProps={{ shrink: true }}
                      className="bg-white"
                    />
                    <TextField
                      fullWidth
                      label="Date de fin"
                      type="date"
                      value={selectedEndDate}
                      onChange={handleEndDateChange}
                      InputLabelProps={{ shrink: true }}
                      className="bg-white"
                    />
                    {unUser.role === 1 && (
                      <Paper elevation={0} className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <LocalAtmIcon color="primary" />
                          <Typography variant="h6" className="text-gray-900">
                            Total : {formatNumberWithSpaces(totalPrice)} F
                          </Typography>
                        </div>
                      </Paper>
                    )}
                  </div>

                  {/* New Sale Form */}
                  <Paper elevation={0} className="p-6 bg-white rounded-lg">
                    <form onSubmit={onSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-1">
                          <Autocomplete
                            freeSolo
                            options={entres}
                            getOptionLabel={(option) => (typeof option === 'string' ? option : `${option.categorie_libelle} (${option.libelle}) [${option.qte}]` || '')}
                            onChange={handleAutoCompleteChange}
                            renderInput={(params) => (
                              <TextField 
                                {...params} 
                                label="Désignation" 
                                className="bg-white"
                              />
                            )}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <QuantityLimitsIcon color="primary" fontSize="small" />
                            <Typography variant="subtitle2">Quantité</Typography>
                          </div>
                          <MyTextField
                            required
                            type="number"
                            name="qte"
                            value={formValues.qte}
                            onChange={onChange}
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
                            value={formValues.pu}
                            onChange={onChange}
                            disabled={formValues.is_prix}
                            className="bg-white"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Typography variant="h6" className="text-gray-700">
                          Montant Total : {formatNumberWithSpaces(amount)} F
                        </Typography>

                        {isLicenceExpired(unEntreprise.licence_date_expiration) ? (
                          <Typography variant="subtitle1" color="error">
                            L'abonnement de cette entreprise a expiré
                          </Typography>
                        ) : (
                          <Button
                            type="submit"
                            variant="contained"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Ajouter la vente
                          </Button>
                        )}
                      </div>
                    </form>
                  </Paper>

                  {/* Sales Table */}
                  <TableContainer component={Paper} elevation={0}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                          <TableCell>Image</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Référence</TableCell>
                          <TableCell>Désignation</TableCell>
                          <TableCell align="right">Quantité</TableCell>
                          <TableCell align="right">Prix Unitaire</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {displayedBoutiques?.length > 0 ? (
                          displayedBoutiques?.map((row, index) => (
                            <CardClientSortie key={index} row={row} />
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} align="center" className="py-8">
                              <Typography variant="body1" className="text-gray-500">
                                Aucune vente enregistrée
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Pagination */}
                  <div className="flex justify-center">
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                    />
                  </div>
                </div>
              </Paper>

              {/* Modals */}
              <Modal open={isModalOpen} onClose={toggleModal}>
                <Box sx={style}>
                  <Typography variant="h6" className="mb-4">
                    Appliquer une remise
                  </Typography>
                  <div className="space-y-4">
                    <TextField
                      fullWidth
                      label="Montant fixe"
                      variant="outlined"
                      value={fixedDiscount}
                      onChange={(e) => setFixedDiscount(normalizeInput(e.target.value))}
                      helperText="Ex: 1500 ou 85.45"
                    />
                    <TextField
                      fullWidth
                      label="Pourcentage"
                      variant="outlined"
                      value={percentageDiscount}
                      onChange={(e) => setPercentageDiscount(normalizeInput(e.target.value))}
                      helperText="Ex: 2% ou 5%"
                    />
                    <div className="flex justify-end space-x-3 pt-4">
                      <Button variant="outlined" onClick={toggleModal}>
                        Annuler
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleApplyDiscount}
                      >
                        Appliquer
                      </Button>
                    </div>
                  </div>
                </Box>
              </Modal>

              <Modal open={isModalOpenPay} onClose={toggleModalPay}>
                <Box sx={style}>
                  <Typography variant="h6" className="mb-4">
                    Enregistrer le paiement
                  </Typography>
                  <TextField
                    fullWidth
                    label="Montant payé"
                    variant="outlined"
                    value={payDiscount}
                    onChange={(e) => setPayDiscount(normalizeInput(e.target.value))}
                    helperText="Ex: 1500 ou 85.45"
                    className="mb-4"
                  />
                  <div className="flex justify-end space-x-3">
                    <Button variant="outlined" onClick={toggleModalPay}>
                      Annuler
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleApplyPayer}
                    >
                      Confirmer
                    </Button>
                  </div>
                </Box>
              </Modal>

              {/* Invoice Preview */}
              {(showInvoice && entreprise) && (
                <div className="mt-6">
                  <Fact               
                    clientName={unClient.nom}
                    clientAddress={unClient.adresse}
                    clientCoordonne={unClient.coordonne}
                    invoiceNumber={unClient.numero}
                    invoiceDate={itemDate}
                    numeroFac={texte.numeroFac}
                    notes={texte.notes}
                    post={entreprise}
                    discountedTotal={discountedTotal}
                    payerTotal={payerTotal}
                  />
                </div>
              )}
            </div>
          </div>
        );
      }
    } else {
      return <Typography variant="h6" className="text-gray-700 p-4">
        Celui-ci est un fournisseur 
      </Typography>
    }
}
