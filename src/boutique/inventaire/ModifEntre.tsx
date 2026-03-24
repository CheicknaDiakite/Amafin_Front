import { ChangeEvent, FormEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import { RouteParams } from '../../typescript/DataType'
import { 
  Button,  
  Checkbox,  
  FormControlLabel,
  TextField,
  Typography,
  Paper,
  Box,
  IconButton,
  Alert
} from '@mui/material'
import { connect } from '../../_services/account.service'
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { useDeleteEntre, useFetchEntre, useUpdateEntre } from '../../usePerso/fonction.entre'
import Nav from '../../_components/Button/Nav'
import { useFetchUser } from '../../usePerso/fonction.user'
import { useStoreUuid } from '../../usePerso/store'
import SaveIcon from '@mui/icons-material/Save';

export default function ModifEntre() {
  const {uuid} = useParams<RouteParams>()
  const entreprise_id = useStoreUuid((state) => state.selectedId)

  const {unEntre, setUnEntre} = useFetchEntre(uuid!)
  const {unUser} = useFetchUser()
  const {updateEntre} = useUpdateEntre()
  const {deleteEntre} = useDeleteEntre()

  const [ajout_terminer, setTerminer] = useState(true);
  
  const Ajout_Terminer = () => setTerminer(!ajout_terminer);

  const [is_prix, setPrix] = useState(true);
  
  const Is_Prix = () => setPrix(!is_prix);
  
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    deleteEntre(unEntre);
    setShowConfirm(false);
  };

  // const {souscategories} = useFetchAllSousCate(top)
  
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUnEntre({
      ...unEntre,
      [name]: value,
    });
  };

  unEntre["user_id"] = connect
  unEntre["entreprise_id"] = entreprise_id!
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    unEntre["is_sortie"] = ajout_terminer
    unEntre["is_prix"] = is_prix
    console.log(unEntre)
    updateEntre(unEntre)
    
  };

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Êtes-vous sûr de vouloir supprimer cette entrée ?
          </Alert>
        )}

        <Paper elevation={0} className="mt-6 rounded-lg overflow-hidden">
          <Box className="p-6">
            {/* Header */}
            <div className="border-b pb-4 mb-6">
              <Typography variant="h4" className="font-semibold text-gray-900">
                Modification d'une Entrée
              </Typography>
              <Typography variant="body2" className="text-gray-500 mt-1">
                Modifiez les informations de l'entrée en stock
              </Typography>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <TextField
                  label="Désignation"
                  variant="outlined"
                  disabled
                  value={unEntre.categorie_slug}
                  fullWidth
                  className="bg-gray-50"
                />

                <TextField
                  label="Libellé"
                  variant="outlined"
                  name="libelle"
                  value={unEntre.libelle}
                  onChange={onChange}
                  fullWidth
                  className="bg-white"
                />

                <TextField
                  label="Quantité"
                  variant="outlined"
                  name="qte"
                  type="number"
                  value={unEntre.qte}
                  onChange={onChange}
                  fullWidth
                  className="bg-white"
                />

                <TextField
                  label="Prix de vente"
                  variant="outlined"
                  name="pu"
                  type="number"
                  value={unEntre.pu}
                  onChange={onChange}
                  fullWidth
                  className="bg-white"
                />
                
                {unUser.role === 1 && (
                  <TextField
                    label="Prix d'achat"
                    variant="outlined"
                    name="pu_achat"
                    type="number"
                    value={unEntre.pu_achat}
                    onChange={onChange}
                    fullWidth
                    className="bg-white"
                  />
                )}

                <div className="space-y-4 pt-2">
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={!is_prix}
                        onChange={Is_Prix}
                        color="primary"
                      />
                    }
                    label="Prix de vente manuel"
                    className="text-gray-700"
                  />

                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={!ajout_terminer}
                        onChange={Ajout_Terminer}
                        color="primary"
                      />
                    }
                    label="Ne pas autoriser la sortie de ce produit"
                    className="text-gray-700"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Enregistrer les modifications
                </Button>
              </div>
            </form>
          </Box>
        </Paper>
      </div>
    </div>
  )
}
