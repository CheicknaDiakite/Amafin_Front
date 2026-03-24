import {
    Typography,
    Button,
    InputLabel,
    MenuItem,
    Select,
    FormControl,
    SelectChangeEvent,
    Paper,
    Box,
  } from "@mui/material";
  import { ChangeEvent, FormEvent } from "react";
import { connect } from "../../../../_services/account.service";
import { useUnClient, useUpdateClient } from "../../../../usePerso/fonction.user";
import MyTextField from "../../../../_components/Input/MyTextField";
import { UuType } from "../../../../typescript/Account";
import { useStoreUuid } from "../../../../usePerso/store";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
 
 export function ClientModif(uuid: UuType) {
    const entreprise_id = useStoreUuid((state) => state.selectedId)
    const {unClient, setUnClient } = useUnClient(uuid.uuid!);
    
    unClient["user_id"] = connect;
    const { updateClient } = useUpdateClient();
    
    // const { userEntreprises } = useGetUserEntreprises(connect);
  
    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement >) => {
      const { name, value } = e.target;
      setUnClient({
        ...unClient,
        [name]: value,
      });
    };
  
    const onSelectChange = (e: SelectChangeEvent<number>) => {
      setUnClient({
        ...unClient,
        [e.target.name]: e.target.value,
      });
    };
  
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      unClient["entreprise_id"] =  entreprise_id!
      updateClient(unClient);
    };
  
    return (
      <Box className="max-w-2xl mx-auto">
        <Paper elevation={0} className="p-6 space-y-6">
          <div className="border-b pb-4">
            <Typography variant="h5" className="font-semibold text-gray-900">
              Modification du profil
            </Typography>
            <Typography variant="body2" className="text-gray-500 mt-1">
              Mettez à jour les informations du client
            </Typography>
          </div>
  
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Nom complet */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-700">
                <PersonIcon fontSize="small" />
                <Typography variant="subtitle2">Nom Complet</Typography>
              </div>
              <MyTextField 
              fullWidth
              variant="outlined"
              name="nom"
              onChange={onChange}
              value={unClient.nom}
              placeholder="Nom complet du client"
              className="bg-white"
              />
            </div>
  
            {/* Email */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-700">
                <EmailIcon fontSize="small" />
                <Typography variant="subtitle2">Email</Typography>
              </div>
              <MyTextField 
              fullWidth
              variant="outlined"
              name="email"
              type="email"
              onChange={onChange}
              value={unClient.email}
              placeholder="Adresse email"
              className="bg-white"
              />
            </div>
  
            {/* Adresse */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-700">
                <LocationOnIcon fontSize="small" />
                <Typography variant="subtitle2">Adresse</Typography>
              </div>
              <MyTextField 
              fullWidth
              variant="outlined"
              name="adresse"
              onChange={onChange}
              value={unClient.adresse}
              placeholder="Adresse complète"
              className="bg-white"
              />
            </div>
  
            {/* Coordonnées */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-700">
                <BusinessIcon fontSize="small" />
                <Typography variant="subtitle2">Coordonnées</Typography>
              </div>
              <MyTextField 
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                name="coordonne"
                onChange={onChange}
                value={unClient.coordonne}
                placeholder="Coordonnées supplémentaires"
                className="bg-white"
              />
            </div>
  
            {/* Numéro */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-700">
                <PhoneIcon fontSize="small" />
                <Typography variant="subtitle2">Numéro de téléphone</Typography>
              </div>
              <MyTextField 
              fullWidth
              variant="outlined"
              name="numero"
              onChange={onChange}
              value={unClient.numero}
              placeholder="Numéro de téléphone"
              className="bg-white"
              />
            </div>
  
            {/* Type de client */}
            <FormControl fullWidth variant="outlined" className="bg-white">
              <InputLabel id="role-label">Type de client</InputLabel>
              <Select
                labelId="role-label"
                id="role-select"
                name="role"
                value={unClient.role || 0}
                onChange={onSelectChange}
                label="Type de client"
              >
                <MenuItem value={1}>Client</MenuItem>
                <MenuItem value={2}>Fournisseur</MenuItem>
                <MenuItem value={3}>Les deux</MenuItem>
              </Select>
            </FormControl>
  
            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </Paper>
      </Box>
    );
  }
  