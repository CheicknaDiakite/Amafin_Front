import { useParams, useNavigate } from 'react-router-dom'
import { 
  Button,
  IconButton, 
  Paper,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';
import { connect } from '../../_services/account.service';
import { RouteParams } from '../../typescript/DataType';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import ImageIcon from '@mui/icons-material/Image';
import { useDeleteCategorie, useFetchCategorie, useUpdateCategorie } from '../../usePerso/fonction.categorie';
import MyTextField from '../../_components/Input/MyTextField';
import { BASE } from '../../_services/caller.service';
import img from '../../../public/icon-192x192.png';

export default function ModifCate() {
  const { uuid } = useParams<RouteParams>()
  const navigate = useNavigate()
  
  // const {unCategorie, setCategorie, updateCategorie, deleteCategorie} = useCategorie(slug!)
  const { unCategorie, setUnCategorie } = useFetchCategorie(uuid!);
  
  const { updateCategorie } = useUpdateCategorie();
  const { deleteCategorie } = useDeleteCategorie();

  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    deleteCategorie(unCategorie, { onSuccess: () => navigate(-1) });
    setShowConfirm(false);
  };
  
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUnCategorie({
      ...unCategorie,
      [name]: value,
    });
  };

  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      ...unCategorie,
      user_id: connect,
      image: image || unCategorie.image
    };
    updateCategorie(payload, { onSuccess: () => navigate(-1) });
  };

  const url = unCategorie.image ? BASE(unCategorie.image) : img;

  return (
    <div className="min-h-screen py-4 sm:py-6">
      {/* <Nav /> */}
      
      <div className="max-w-full sm:max-w-4xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center space-x-4">
            
            <Typography variant="h5" className="font-semibold text-gray-900">
              Modifier l'article
            </Typography>
          </div>
          
        </div>

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
            Êtes-vous sûr de vouloir supprimer cet article ?
          </Alert>
        )}

        <Paper elevation={0} className="border rounded-lg overflow-hidden">
          <form onSubmit={onSubmit}>
            <div className="p-3 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <Typography variant="subtitle2" className="mb-2 text-gray-600">
                    Informations de l'article
                  </Typography>
                  <MyTextField
                    fullWidth
                    label="Nom de l'article"
                    name="libelle"
                    value={unCategorie.libelle}
                    onChange={onChange}
                    required
                  />
                </div>

                <div>
                  <Typography variant="subtitle2" className="mb-2 text-gray-600">
                    Image de l'article
                  </Typography>
                  <div className="space-y-4">
                    <Box className="w-full aspect-video rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                      {(previewUrl || url) && (
                        <img 
                          src={previewUrl || url} 
                          alt={unCategorie.libelle} 
                          className="max-h-40 sm:max-h-60 object-contain mx-auto"
                        />
                      )}
                    </Box>
                    <MyTextField
                      fullWidth
                      type="file"
                      onChange={handleImageChange}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: <ImageIcon className="mr-2 text-gray-400" />, 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t flex flex-col sm:flex-row gap-3 sm:gap-6 justify-end">
              <Button
                type="submit"
                variant="contained"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
              >
                Enregistrer les modifications
              </Button>
              
              <IconButton 
                onClick={handleDelete}
                size="small"
                className="text-red-600 hover:bg-red-50"
              >
                <DeleteIcon />
              </IconButton>
              
            </div>
          </form>
        </Paper>
      </div>
    </div>
  )
}
