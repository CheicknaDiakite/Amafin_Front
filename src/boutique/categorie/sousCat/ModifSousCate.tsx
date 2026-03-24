import { useParams } from "react-router-dom"
import { RouteParams } from "../../../typescript/DataType"
import { 
  Button, 
  IconButton, 
  Paper,
  Typography,
  Box,
  Alert
} from "@mui/material"
import { ChangeEvent, FormEvent, useState } from "react";
import { connect } from "../../../_services/account.service";
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import ImageIcon from '@mui/icons-material/Image';
import { useFetchUser } from "../../../usePerso/fonction.user";
import { useDeleteSousCate, useFetchSousCate, useUpdateSousCate } from "../../../usePerso/fonction.categorie";
import Nav from "../../../_components/Button/Nav";
import MyTextField from "../../../_components/Input/MyTextField";
import { BASE } from '../../../_services/caller.service';
import img from '../../../../public/icon-192x192.png';

export default function ModifSousCate() {
  const { uuid } = useParams<RouteParams>()

  // const {unSousCate, setUnSousCate, updateSousCate, deleteSousCate} = useSousCategorie(slug!)
  const { unSousCate, setUnSousCate } = useFetchSousCate(uuid!)
  unSousCate["user_id"] = connect
  const {unUser} = useFetchUser(connect)
  const {deleteSousCate} = useDeleteSousCate()

  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    deleteSousCate(unSousCate);
    setShowConfirm(false);
  };
  
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUnSousCate({
      ...unSousCate,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  const { updateSousCate } = useUpdateSousCate()

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    unSousCate.user_id = connect;
    unSousCate.image = image || unSousCate.image;
    updateSousCate(unSousCate);
  };

  const url = unSousCate.image ? BASE(unSousCate.image) : img;

  return (
    <div className="min-h-screen py-4 sm:py-6">
      {/* <Nav /> */}
      <Nav>
        <div className="flex items-center space-x-2">
          
          {(unUser.role === 1 || unUser.role === 2) && (
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
      <div className="max-w-full sm:max-w-4xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center space-x-4">
            <Typography variant="h5" className="font-semibold text-gray-900">
              Modifier le produit
            </Typography>
          </div>

          {/* <Tooltip title="Supprimer" arrow TransitionComponent={Fade}>
            <IconButton 
              onClick={handleDelete}
              className="bg-white hover:bg-red-50 text-red-600 shadow-sm"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip> */}
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
            Êtes-vous sûr de vouloir supprimer ce produit ?
          </Alert>
        )}

        <Paper elevation={0} className="border rounded-lg overflow-hidden">
          <form onSubmit={onSubmit}>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Typography variant="subtitle2" className="mb-2 text-gray-600">
                    Informations du produit
                  </Typography>
                  <MyTextField
                    fullWidth
                    label="Nom du produit"
                    name="libelle"
                    value={unSousCate.libelle}
                    onChange={onChange}
                    required
                  />
                </div>

                <div>
                  <Typography variant="subtitle2" className="mb-2 text-gray-600">
                    Image du produit
                  </Typography>
                  <div className="space-y-4">
                    <Box className="w-full aspect-video rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                      {(previewUrl || url) && (
                        <img 
                          src={previewUrl || url} 
                          alt={unSousCate.libelle} 
                          className="max-h-full object-contain"
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

            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
              <Button
                type="submit"
                variant="contained"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </Paper>
      </div>
    </div>
  )
}
