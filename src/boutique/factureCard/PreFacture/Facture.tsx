import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import ReactToPrint from 'react-to-print'
import Notes from '../component/Notes'
import Header from '../component/Header'
import TableForm from '../component/TableForm'
import toast from 'react-hot-toast'
import { uniqueId } from 'lodash'
import { useFetchEntreprise } from '../../../usePerso/fonction.user'
import { generateOrderNumber } from '../../../usePerso/fonctionPerso'
import Nav from '../../../_components/Button/Nav'
import { BASE } from '../../../_services/caller.service'
import { Box, Button, Grid, Skeleton, Typography, Paper, TextField, Tooltip, Fade } from '@mui/material'
import TableList from '../component/Table'
import MyTextField from '../../../_components/Input/MyTextField'
import { useStoreUuid } from '../../../usePerso/store'
import PrintIcon from '@mui/icons-material/Print'
import ReceiptIcon from '@mui/icons-material/Receipt'
import PersonIcon from '@mui/icons-material/Person'
import NumbersIcon from '@mui/icons-material/Numbers'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import NoteAddIcon from '@mui/icons-material/NoteAdd'

type ItemType = {
  id: string;
  description?: string;
  quantity?: number;
  price?: number;
  amount: number;
};
type TypeText = {
  clientName: string,
  clientAddress: string,
  clientCoordonne: string,
  invoiceDate: string,
  dueDate: string,
  notes: string,
  invoiceNumber: number,
  description: string,
  quantity: number,
  price: number,
  bankAccount: string,
  website: string,
  bankName: string,
  
}

export default function Facture() {
  const uuid = useStoreUuid((state) => state.selectedId)

  const {unEntreprise, isLoading, isError} = useFetchEntreprise(uuid)
  // const {userEntreprises, isLoading, isError} = useGetUserEntreprises(String(connect))
  let url = BASE(unEntreprise.image as string | File);

  const [amount, setAmount] = useState<number>(0);
  const [list, setList] = useState<Array<ItemType>>([]);
  const [total] = useState<number>(0);
  
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // const componentRef = useRef();
  const componentRef = useRef<HTMLDivElement>(null);

  const [texte, setNom] = useState<TypeText>({
    clientName: '',
    clientAddress: '',
    clientCoordonne: '',
    invoiceDate: '',
    dueDate: '',
    notes: '',
    invoiceNumber: 0,
    description: '',
    quantity: 0,
    price: 0,
    bankAccount: '',
    website: '',
    bankName: '',
    
  });

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNom({
      ...texte,
      [name]: value,
    });
  };

  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const handleClick = () => {
    const newOrderNumber = generateOrderNumber();
    setOrderNumber(newOrderNumber);
  };

  const [showInvoice, setShowInvoice] = useState(false); // État pour afficher ou masquer la section de facture

  const toggleInvoice = () => {
    setShowInvoice(!showInvoice);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!texte.description || !texte.quantity || !texte.price) {
      toast.error("Veuillez remplir tous les champs requis");
    } else {
      const newItems: ItemType = {
        id: uniqueId(),
        description: texte.description,
        quantity: texte.quantity,
        price: texte.price,
        amount,
      };
      setAmount(0);
      setList([...list, newItems]);
      setIsEditing(false);
    }
  };

  // Calculate items amount function
  useEffect(() => {
    const calculateAmount = () => {
      setAmount(texte.quantity * texte.price);
    };

    calculateAmount();
  }, [amount, texte.price, texte.quantity, setAmount]);

  if (isLoading) {
    return (
      <Box sx={{ width: '100%', padding: 3 }}>
        <Skeleton height={60} />
        <Skeleton height={40} />
        <Skeleton height={400} />
      </Box>
    );
  }

  if (isError) {
    window.location.reload();
    return <div>Erreur lors du chargement...</div>
  }

  if (unEntreprise) {
    return (
      <div className="min-h-screen">
        <Nav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Paper elevation={0} className="p-6 rounded-lg border">
            <div className="mb-6">
              <Typography variant="h4" className="font-semibold text-gray-900">
                Création de Facture
              </Typography>
              <Typography variant="body2" className="text-gray-500 mt-1">
                Remplissez les informations pour générer une facture
              </Typography>
            </div>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper elevation={0} className="p-4 border rounded-lg">
                  <Typography variant="subtitle1" className="font-medium mb-4 flex items-center">
                    <PersonIcon className="mr-2" />
                    Informations Client
                  </Typography>
                  
                  <div className="space-y-4">
                    <MyTextField
                      fullWidth
                      label="Nom du client"
                      name="clientName"
                      placeholder="Nom du client"
                      value={texte.clientName}
                      onChange={onChange}
                      required
                    />

                    <MyTextField
                      fullWidth
                      type="number"
                      label="Numéro du client"
                      name="invoiceNumber"
                      placeholder="Numéro du client"
                      value={texte.invoiceNumber || ''}
                      onChange={onChange}
                      required
                    />

                    <MyTextField
                      fullWidth
                      type="date"
                      label="Date de la facture"
                      name="invoiceDate"
                      value={texte.invoiceDate}
                      onChange={onChange}
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={0} className="p-4 border rounded-lg">
                  <Typography variant="subtitle1" className="font-medium mb-4 flex items-center">
                    <ReceiptIcon className="mr-2" />
                    Détails de la Facture
                  </Typography>

                  <TableForm 
                    isEditing={isEditing}
                    onChange={onChange}
                    handleSubmit={handleSubmit}
                    amount={amount}
                    list={list}
                    total={total}
                  />
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper elevation={0} className="p-4 border rounded-lg">
                  <Typography variant="subtitle1" className="font-medium mb-4 flex items-center">
                    <NoteAddIcon className="mr-2" />
                    Notes et Informations Supplémentaires
                  </Typography>

                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    name="notes"
                    placeholder="Ajoutez des notes ou des informations supplémentaires..."
                    value={texte.notes}
                    onChange={onChange}
                    variant="outlined"
                    className="bg-white"
                  />
                </Paper>
              </Grid>
            </Grid>

            <div className="mt-6 flex justify-between items-center">
              <div className="space-x-3">
                <Button
                  variant="contained"
                  onClick={toggleInvoice}
                  startIcon={showInvoice ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {showInvoice ? 'Masquer l\'aperçu' : 'Afficher l\'aperçu'}
                </Button>

                <Button
                  variant="outlined"
                  onClick={handleClick}
                  startIcon={<NumbersIcon />}
                >
                  Générer numéro
                </Button>
              </div>
            </div>
          </Paper>

          {showInvoice && (
            <Paper elevation={0} className="mt-6 p-6 rounded-lg border">
              <div className="flex justify-between items-center mb-6">
                <Typography variant="h5" className="font-semibold text-gray-900">
                  Aperçu de la Facture
                </Typography>

                <ReactToPrint
                  trigger={() => (
                    <Tooltip title="Imprimer / Télécharger" arrow TransitionComponent={Fade}>
                      <Button
                        variant="contained"
                        startIcon={<PrintIcon />}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Imprimer
                      </Button>
                    </Tooltip>
                  )}
                  content={() => componentRef.current}
                />
              </div>

              <div ref={componentRef} className="bg-white p-6 rounded-lg border">
                <Header 
                  nom={unEntreprise.nom}
                  numeroFac={orderNumber}
                  url={url}
                  email={unEntreprise.email}
                  address={unEntreprise.adresse}
                  numero={unEntreprise.numero}
                  coordonne={unEntreprise.coordonne}
                  clientName={texte.clientName}
                  invoiceDate={texte.invoiceDate}
                  invoiceNumber={texte.invoiceNumber}
                />

                <TableList 
                  list={list}
                  total={total}
                />

                <Notes 
                  notes={texte.notes}
                />
              </div>
            </Paper>
          )}
        </div>
      </div>
    )
  }
}
