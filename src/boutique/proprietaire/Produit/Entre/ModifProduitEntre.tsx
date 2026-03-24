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
  InputAdornment,
} from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDeleteFacEntre, useFacEntre, useUpdateFacEntre } from '../../../../usePerso/fonction.facture';
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

export default function ModifProduitEntre() {
  const {uuid} = useParams();
  const {unFacEntre, setUnFacEntre} = useFacEntre(uuid!);
  const {deleteFacEntre} = useDeleteFacEntre();
  const {updateFacEntre} = useUpdateFacEntre();
  const {unUser} = useFetchUser(connect);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    deleteFacEntre(unFacEntre);
    setShowConfirm(false);
  };

  unFacEntre["user_id"] = connect;
  const url = BASE(unFacEntre.facture ? unFacEntre.facture : '');
  
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUnFacEntre({
      ...unFacEntre,
      [name]: value,
    });
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    unFacEntre["user_id"] = connect;
    unFacEntre["facture"] = image;
    updateFacEntre(unFacEntre);
  };

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Nav>
          <div className="flex items-center space-x-2">
            {/* <Link to="/entreprise/facture-entre">
              <IconButton size="small" className="hover:bg-gray-100">
                <ArrowBackIcon />
              </IconButton> */}
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
          <Box className="p-6">
            {/* Header */}
            <div className="border-b pb-4 mb-6">
              <Typography variant="h4" className="font-semibold text-gray-900">
                Modification de la Facture d'Entrée
              </Typography>
              <Typography variant="body2" className="text-gray-500 mt-1">
                Modifiez les informations de la facture
              </Typography>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              <Grid container spacing={4}>
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
                      value={unFacEntre.libelle}
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
                      value={unFacEntre.ref}
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
                      value={unFacEntre.date}
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
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ReceiptIcon className="text-gray-400" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    {unFacEntre.facture && (
                      <Paper elevation={0} className="p-4 bg-gray-50 border rounded-lg">
                        <Typography variant="subtitle2" className="text-gray-700 mb-2">
                          Facture actuelle
                        </Typography>
                        <div className="max-h-[400px] overflow-auto">
                          <PdfViewer fileUrl={url} />
                        </div>
                        <div className="mt-2">
                          <a 
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                          >
                            <ReceiptIcon fontSize="small" />
                            <span>Voir en plein écran</span>
                          </a>
                        </div>
                      </Paper>
                    )}
                  </div>
                </Grid>
              </Grid>

              <Divider className="my-6" />

              <div className="flex justify-end space-x-3">
                <Link to="/entreprise/facture-entre">
                  <Button variant="outlined">
                    Annuler
                  </Button>
                </Link>
                {(unUser.role === 1 || unUser.role === 2) && (
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Enregistrer les modifications
                  </Button>
                )}
              </div>
            </form>
          </Box>
        </Paper>
      </div>
    </div>
  );
}
