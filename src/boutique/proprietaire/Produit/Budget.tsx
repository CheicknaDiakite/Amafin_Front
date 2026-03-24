import { ChangeEvent, FormEvent, useState, useEffect, SyntheticEvent } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Pagination,
  TextField,
  Typography,
  Box,
  InputAdornment,
  Card,
  CardContent,
  Alert,
  Autocomplete,
} from '@mui/material';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from '@mui/icons-material/Add';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { connect } from '../../../_services/account.service';
import { DepenseType, RecupType } from '../../../typescript/DataType';
import { useCreateDepense, useGetAllBudget, useGetAllDepense } from '../../../usePerso/fonction.entre';
import MyTextField from '../../../_components/Input/MyTextField';
import CardDepense from './CardDepense';
import Nav from '../../../_components/Button/Nav';
import { useStoreUuid } from '../../../usePerso/store';
import { formatNumberWithSpaces, isLicenceExpired } from '../../../usePerso/fonctionPerso';
import M_Abonnement from '../../../_components/Card/M_Abonnement';
import { useFetchEntreprise } from '../../../usePerso/fonction.user';
import Chart_Dep from '../../../_components/Chart/Chart_Dep';
import './mobile-produit.css';
import { useFetchAllSousCate } from '../../../usePerso/fonction.categorie';
import Comptes from '../../../components/Comptes';

export default function Budget() {
  const {ajoutDepense} = useCreateDepense();
  const uuid = useStoreUuid((state) => state.selectedId);
  const {unEntreprise} = useFetchEntreprise(uuid);

  const [is_prix, setPrix] = useState(true);
  const Is_Prix = () => setPrix(!is_prix);

  const {budgetsEntreprise, isLoading, isError} = useGetAllBudget(1);
  const {souscategories} = useFetchAllSousCate(1)

  const [isMobile, setIsMobile] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = isMobile ? 10 : 25;

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [selectedStartDate, setSelectedStartDate] = useState<string>('');
  const [selectedEndDate, setSelectedEndDate] = useState<string>('');

  const filteredDepenses = budgetsEntreprise?.filter((item) => {
    if (!item.date) return false;
    const itemDate = new Date(item.date).getTime();
    const startDate = selectedStartDate ? new Date(selectedStartDate).getTime() : null;
    const endDate = selectedEndDate ? new Date(selectedEndDate).getTime() : null;
    return (startDate === null || itemDate >= startDate) && (endDate === null || itemDate <= endDate);
  });

  const reversedDepenses = filteredDepenses?.slice().sort((a: DepenseType, b: DepenseType) => {
    if (a.id === undefined) return 1;
    if (b.id === undefined) return -1;
    return b.id - a.id;
  });
 
  const totalPages = Math.ceil((reversedDepenses?.length || 0) / itemsPerPage);     
  const depensesBoutic = reversedDepenses?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalMontant = depensesBoutic?.reduce((acc, depense) => {
    const somme = depense.somme ? parseFloat(String(depense.somme)) : 0;
    return acc + somme;
  }, 0);

  const handlePageChange = (_: ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStartDate(event.target.value);
    setCurrentPage(1);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedEndDate(event.target.value);
    setCurrentPage(1);
  };

  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState<DepenseType>({
    libelle: '',
    date: '',
    somme: 0,
    somme_dep: 0,
  });
  const [image, setImage] = useState<File | null>(null);

  const handleAutoCompleteChange = (_: SyntheticEvent<Element, Event>, value: string | RecupType | null) => {
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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formValues["user_id"] = connect;
    formValues["facture"] = image;
    formValues["is_prix"] = is_prix;

    ajoutDepense(formValues);
    setFormValues({ libelle: '', date: '', somme: 0 });
    setOpen(false);
  };

  if (isLoading) {
    return (
      <Box className={`${isMobile ? 'mobile-p-4' : 'p-8'}`}>
        <Card elevation={0} className={isMobile ? 'mobile-header-container' : ''}>
          <CardContent>
            <div className={`${isMobile ? 'mobile-loading' : 'animate-pulse'} space-y-4`}>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className={`${isMobile ? 'mobile-p-4' : 'p-8'}`}>
        <Alert severity="error" className={isMobile ? 'mobile-alert' : ''}>
          Une erreur est survenue lors du chargement des données
        </Alert>
      </Box>
    );
  }

  if (budgetsEntreprise) {
    return (
      <div className={`min-h-screen ${isMobile ? '' : '' } py-6`}>
        <div className="mt-6 px-4">
          <Comptes />
        </div>
      </div>
    );
  }

  return null;
}
