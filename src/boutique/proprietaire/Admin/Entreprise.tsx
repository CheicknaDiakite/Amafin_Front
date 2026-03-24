import { ChangeEvent, FC, FormEvent, ReactNode, SyntheticEvent, useState } from 'react';
import CloseIcon from "@mui/icons-material/Close"
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, SelectChangeEvent, Skeleton, Stack } from '@mui/material';
import { EntrepriseType } from '../../../typescript/Account';
import { connect } from '../../../_services/account.service';
import EntrepriseIcon from '@mui/icons-material/ProductionQuantityLimits';
import { Link } from 'react-router-dom';
import { useCreateEntreprise, useFetchUser, useGetUserEntreprises } from '../../../usePerso/fonction.user';
import { getLicenceDuration, isLicenceExpired } from '../../../usePerso/fonctionPerso';
import { BASE } from '../../../_services/caller.service';
import MyTextField from '../../../_components/Input/MyTextField';
// import countryList from 'react-select-country-list';
import { useStoreUuid } from '../../../usePerso/store';
import CountrySelect from '../../../_components/Liste_Pays/CountrySelect';
import { RecupType } from '../../../typescript/DataType';
import clsx from 'clsx';
import backgroundImage from '../../../../public/assets/img/img.jpg'

// const CARD = ({post}) => (
  
//   <Fragment>
//     <CardContent>
//       <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
//         {post.adresse}
//       </Typography>
//       <Typography variant="h5" component="div">
//         {post.nom}
//       </Typography>
//       <Typography sx={{ mb: 1.5 }} color="text.secondary">
//         {post.email}
//       </Typography>
//       <Typography variant="body2">
//        Votre licence doit expirer le {post.licence_date_expiration}.
//         <br />
//         Tel : {post.numero}
//       </Typography>
//     </CardContent>
//     <CardActions>
//       <Link to={`/user/Entreprise/${post.id}`}>Info <AdsClickIcon color='primary' /></Link>
//     </CardActions>
//   </Fragment>
// );

interface IconsGridProps {
  icon: ReactNode;
  title: string;
  image: string;
  description: ReactNode;
}

interface EntrepriseFormValues extends EntrepriseType {
  libelle?: string;
}

interface LicenceTagProps {
  type: string;
  children: ReactNode;
}

export const LicenceTag: FC<LicenceTagProps> = ({ type, children }) => (
  <span
    className={clsx(
      "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
      {
        "bg-red-50 text-red-700 ring-red-700/10": type === "Essai",
        "bg-yellow-50 text-yellow-700 ring-yellow-700/10": type === "Standard",
        "bg-green-50 text-green-700 ring-green-700/10": type === "Premium",
      }
    )}
  >
    {children}
  </span>
);

const IconsGrid: FC<IconsGridProps> = ({ icon, title, description, image }) => (
  <div className="bg-white p-4 sm:p-6 shadow-md hover:shadow-lg rounded-xl text-center transition-all duration-300 transform hover:-translate-y-1 h-full">
    <div className="flex justify-center items-center mb-4">
      <img 
        src={image} 
        alt={title} 
        className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-full border-4 border-gray-100 shadow-sm" 
      />
    </div>
    <h4 className="text-lg sm:text-xl font-semibold mb-3 flex items-center justify-center gap-2 text-gray-800">
      <span className="text-blue-600">{title}</span>
      {icon}
    </h4>
    <div className="text-gray-600 text-sm sm:text-base">{description}</div>
  </div>
);

const LoadingState = () => (
  <div className="flex justify-center items-center min-h-64 p-4">
    <Box sx={{ width: '100%', maxWidth: 300 }}>
      <Skeleton height={60} />
      <Skeleton animation="wave" height={60} />
      <Skeleton animation={false} height={60} />
    </Box>
  </div>
);

const ErrorState = () => {
  window.location.reload();
  return (
    <div className="flex justify-center items-center min-h-64 p-4">
      <Typography color="error" className="text-center">
        Une erreur est survenue. Rechargement...
      </Typography>
    </div>
  );
};

const EntrepriseDialog: FC<{
  open: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  formValues: EntrepriseFormValues;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  licenceType: string;
  onLicenceChange: (event: SelectChangeEvent) => void;
  onCountryChange: (event: any, value: string | RecupType) => void;
}> = ({
  open,
  onClose,
  onSubmit,
  formValues,
  onChange,
  // licenceType,
  // onLicenceChange,
  onCountryChange
}) => (
  <Dialog 
    open={open} 
    onClose={onClose} 
    maxWidth="sm" 
    fullWidth
    PaperProps={{
      style: {
        margin: '1rem',
        width: 'calc(100% - 2rem)',
        maxWidth: '500px',
        borderRadius: '12px'
      }
    }}
  >
    <DialogTitle className="bg-gradient-to-r from-blue-500 to-green-600 text-white">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" className="text-white font-semibold">
          Ajouter une entreprise
        </Typography>
        <IconButton onClick={onClose} size="small" className="text-white hover:bg-white/20">
          <CloseIcon />
        </IconButton>
      </Box>
    </DialogTitle>
    <DialogContent className="p-6 ">
      <form onSubmit={onSubmit} className="space-y-4 m-3">
        <Stack spacing={3}>
          <MyTextField
            label="Nom de l'entreprise"
            name="nom"
            value={formValues.nom}
            onChange={onChange}
            required
          />
          <MyTextField
            label="Email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={onChange}
            
          />
          <MyTextField
            label="Numéro de téléphone"
            name="numero"
            type="tel"
            value={formValues.numero || ''}
            onChange={onChange}
            
          />
          <MyTextField
            label="Adresse"
            name="adresse"
            value={formValues.adresse}
            onChange={onChange}
            
          />
          <CountrySelect onChange={onCountryChange} label="Choisir le pays" />
          {/* <FormControl fullWidth>
            <InputLabel>Type de licence</InputLabel>
            <Select
              value={licenceType}
              label="Type de licence"
              onChange={onLicenceChange}
              
            >
              <MenuItem value="Free">Gratuit</MenuItem>
              <MenuItem value="Basic">Basique</MenuItem>
              <MenuItem value="Premium">Premium</MenuItem>
            </Select>
          </FormControl> */}
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth
            className="bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 py-3 text-white font-semibold rounded-lg"
          >
            Ajouter l'entreprise
          </Button>
        </Stack>
      </form>
    </DialogContent>
  </Dialog>
);

export default function Entreprise() {

    const {userEntreprises, isLoading, isError} = useGetUserEntreprises()
    
    const {unUser} = useFetchUser()
    const {ajoutEntreprise} = useCreateEntreprise()
    // const options = countryList().getData();

    const addId = useStoreUuid(state => state.addId)

    const [age, setAge] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleChange = (event: SelectChangeEvent) => {
      setAge(event.target.value as string);
    };
    
    const [formValues, setFormValues] = useState<EntrepriseFormValues>({
        nom: '',
        email: '',
        numero: 0,
        adresse: '',
        user_id: '',
    });

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues({
          ...formValues,
          [name]: value,
        });
      };

      const handleAutoFourChange = (_: SyntheticEvent<Element, Event>,
        value: string | RecupType,
        // reason: AutocompleteChangeReason
        ) => {
        if (typeof value === 'object' && value !== null) {
          
          setFormValues({
            ...formValues,
            pays: value.label ?? '',
            // phone: value.phone ?? '',
          });
        } else {
          setFormValues({
            ...formValues,
            pays: '',
          });
        }
      };
    
      const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        formValues["user_id"]= connect
        // formValues["user_id"]= connect
        formValues["libelle"]= age

        ajoutEntreprise(formValues)

        setFormValues({
          nom: '',
          email: '',
          numero: 0,
          adresse: '',
          user_id: '',
          libelle: '',
        })
        setIsDialogOpen(false)
      };

  if (isLoading) {
    return <LoadingState />
  }

  if (isError) {
    return <ErrorState />
  }

  if (userEntreprises) {
  return (
    <div 
      className="min-h-screen p-4 sm:p-6 lg:p-8"
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {unUser.role === 1 ? (
        <div className="text-center mb-6 sm:mb-8">
          <Button 
            variant="contained" 
            onClick={() => setIsDialogOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 px-8 py-3 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Ajout de l'Entreprise
          </Button>
        </div>
      ) : (unUser.role === 2 || unUser.role === 3 || unUser.role === 4) ? (
        ""
      ) : (
        <div className="bg-gradient-to-r from-blue-500 to-green-600 text-white p-6 sm:p-8 rounded-2xl shadow-xl mx-4 sm:mx-8 mb-6 sm:mb-8">
          <Typography variant="body1" className="text-center text-sm sm:text-base leading-relaxed">
            Nous vous remercions pour votre inscription sur Gest Stocks.<br/>
            Veuillez-vous patienter avant l'activation de votre compte !<br/>
            Pour plus d'information contacter (91 15 48 34 // 63 83 51 14)
          </Typography>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        
      {userEntreprises?.map((post: any, index) => {
        let url = post.image ? BASE(post.image) : backgroundImage;
        const expired = isLicenceExpired(post.licence_date_expiration);
        const validDate = post.licence_date_expiration ?? new Date();
        return (
          <div
            key={index}
            className={`group relative transition-all duration-300 ${
              expired ? 'opacity-60 grayscale' : ''
            }`}
          >
            {/* Badge Expirée */}
            {expired && (
              <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded shadow-lg">
                Licence expirée
              </div>
            )}
            <Link
              to={`/entreprise`}
              onClick={() => addId(post.uuid)}
              className="block h-full"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                pointerEvents: 'auto', // désactive le lien si expiré
              }}
              tabIndex={expired ? -1 : 0}
              aria-disabled={expired}
            >
              <IconsGrid
                icon={<EntrepriseIcon fontSize="small" className="text-blue-500" />}
                image={url}
                title={post.nom}
                description={
                  post.licence_active && (
                    <div className="space-y-3">
                      <p className="text-gray-700 font-medium">
                        {expired
                          ? "Cette entreprise n'a plus de licence active"
                          : "Cette entreprise est activée et possède une licence"}
                      </p>
                      <div className="flex flex-col items-center gap-2">
                        <LicenceTag type={post.licence_type}>
                          {post.licence_type} {getLicenceDuration(validDate)}
                        </LicenceTag>
                        {/* <p className="text-gray-600 text-sm">jusqu'au</p>
                        <LicenceTag type={post.licence_type}>
                          {format(new Date(validDate), 'dd/MM/yyyy')}
                          
                        </LicenceTag> */}
                      </div>
                    </div>
                  )
                }
              />
            </Link>
            
          </div>
        );
      })}

      </div>
    
      <EntrepriseDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={onSubmit}
        formValues={formValues}
        onChange={onChange}
        licenceType={age}
        onLicenceChange={handleChange}
        onCountryChange={handleAutoFourChange}
      />
    </div>
  );
  } else {
    return (
      <div className="min-h-screen p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <Button 
            variant="outlined" 
            onClick={() => setIsDialogOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 px-8 py-3 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Ajout de l'entreprise
          </Button>
          
          <EntrepriseDialog
            open={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onSubmit={onSubmit}
            formValues={formValues}
            onChange={onChange}
            licenceType={age}
            onLicenceChange={handleChange}
            onCountryChange={handleAutoFourChange}
          />
        </div>
      </div>
    );
  };
}
