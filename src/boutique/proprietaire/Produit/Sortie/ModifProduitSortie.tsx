import { 
  Button, 
  Paper,
  Typography,
  TextField,
  IconButton,
  Grid,
  Box,
  Divider,
  Alert,
  InputAdornment
} from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDeleteFacSortie, useFacSortie, useUpdateFacSortie } from '../../../../usePerso/fonction.facture';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import SaveIcon from '@mui/icons-material/Save';
import DescriptionIcon from '@mui/icons-material/Description';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { BASE } from '../../../../_services/caller.service';
import { connect } from '../../../../_services/account.service';
import PdfViewer from '../../../../usePerso/PdfFile';
import Nav from '../../../../_components/Button/Nav';
import { useFetchUser } from '../../../../usePerso/fonction.user';

export default function ModifProduitSortie() {
  const {uuid} = useParams();
  const {unFacSortie, setUnFacSortie} = useFacSortie(uuid!);
  
  const {deleteFacSortie} = useDeleteFacSortie();
  const {updateFacSortie} = useUpdateFacSortie();
  const {unUser} = useFetchUser(connect);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    deleteFacSortie(unFacSortie);
    setShowConfirm(false);
  };

  unFacSortie["user_id"] = connect;
  const url = BASE(unFacSortie.facture ?? "");
  
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUnFacSortie({
      ...unFacSortie,
      [name]: value,
    });
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    unFacSortie["user_id"] = connect;
    unFacSortie["facture"] = image;
    updateFacSortie(unFacSortie);
  };

  return (
    <div className="min-h-screen py-4 sm:py-6">
      <div className="max-w-full sm:max-w-4xl mx-auto px-2 sm:px-4 lg:px-8">
        <Nav>
          <div className="flex items-center space-x-2">
            {unUser.role === 1 && (
              <IconButton 
                onClick={handleDelete}
                size="small"
                className="text-red-600 hover:bg-red-50"
              >
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        </Nav>

        {showConfirm && (
          <Alert 
            severity="warning" 
            className="mt-4"
            action={
              <div className="space-x-2">
                <Button color="inherit" size="small" onClick={() => setShowConfirm(false)}>
                  Annuler
                </Button>
                <Button color="error" size="small" onClick={confirmDelete}>
                  Confirmer
                </Button>
              </div>
            }
          >
            Êtes-vous sûr de vouloir supprimer cette facture ?
          </Alert>
        )}

        <Paper elevation={0} className="mt-6 rounded-lg overflow-hidden">
          <Box className="p-3 sm:p-6">
            {/* Header */}
            <div className="border-b pb-3 sm:pb-4 mb-4 sm:mb-6">
              <Typography variant="h5" className="font-semibold text-gray-900">
                Modification de la Facture de Sortie
              </Typography>
              <Typography variant="body2" className="text-gray-500 mt-1">
                Modifiez les informations de la facture
              </Typography>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-gray-700 mb-2">
                      <DescriptionIcon fontSize="small" />
                      <Typography variant="subtitle2">Informations de base</Typography>
                    </div>

                    <TextField
                      fullWidth
                      label="Libellé"
                      name="libelle"
                      value={unFacSortie.libelle}
                      onChange={onChange}
                      variant="outlined"
                      className="bg-white"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DescriptionIcon className="text-gray-400" />
                          </InputAdornment>
                        ),
                      }}
                      InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                      fullWidth
                      label="Référence"
                      name="ref"
                      value={unFacSortie.ref}
                      onChange={onChange}
                      variant="outlined"
                      className="bg-white"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ReceiptIcon className="text-gray-400" />
                          </InputAdornment>
                        ),
                      }}
                      InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                      fullWidth
                      label="Date"
                      name="date"
                      type="date"
                      value={unFacSortie.date}
                      onChange={onChange}
                      variant="outlined"
                      className="bg-white"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DateRangeIcon className="text-gray-400" />
                          </InputAdornment>
                        ),
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>
                </Grid>

                <Grid item xs={12} md={6}>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-gray-700 mb-2">
                      <ReceiptIcon fontSize="small" />
                      <Typography variant="subtitle2">Facture</Typography>
                    </div>

                    <TextField
                      fullWidth
                      type="file"
                      label="Nouvelle facture"
                      onChange={handleImageChange}
                      variant="outlined"
                      className="bg-white"
                      InputLabelProps={{ shrink: true }}
                    />

                    {url && (
                      <div className="overflow-x-auto rounded border border-gray-200 p-2 bg-gray-50">
                        <PdfViewer fileUrl={url} />
                      </div>
                    )}
                  </div>
                </Grid>
              </Grid>

              <Divider className="my-4" />

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-end">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  className="w-full sm:w-auto"
                >
                  Enregistrer
                </Button>
                <Link to="/entreprise/produit/sortie" className="w-full sm:w-auto">
                  <Button variant="outlined" color="secondary" className="w-full sm:w-auto">
                    Retour
                  </Button>
                </Link>
              </div>
            </form>
          </Box>
        </Paper>
      </div>
    </div>
  );
}
