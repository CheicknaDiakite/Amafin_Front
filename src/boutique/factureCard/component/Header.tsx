import { Typography, Divider } from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';

export default function Header({ 
  orderNumber, 
  nom, 
  numeroFac, 
  url, 
  address, 
  numero, 
  coordonne, 
  clientName, 
  invoiceDate, 
  invoiceNumber, 
  email 
}: any) {
  return (
    <div className="mb-8">
      {/* Company Header */}
      <div className="flex items-center justify-between bg-blue-400 mb-8 m-3">
        <div className="flex items-center space-x-4 m-3">
          <img src={url} alt="Logo" className="h-20 w-20 object-contain" />
          <div>
            <Typography variant="h4" className="font-bold text-white">
              {nom}
            </Typography>
          </div>
        </div> 
        <div className="flex items-center space-x-4 m-3">
          {address && (
            <div className="flex items-center text-white">
              <LocationOnIcon className="w-5 h-5 mr-2" />
              <Typography variant="h4">{address}</Typography>
            </div>
          )}
        </div>        
      </div>

      <div className="text-right p-5 m-3">
        {(orderNumber || numeroFac) && (
          <Typography variant="h4" className="text-gray-700 mb-1">
            N° Facture : {orderNumber || numeroFac}
          </Typography>
        )}
        <Typography variant="h4" className="text-gray-600">
          Date : {invoiceDate}
        </Typography>
      </div>

      {/* Company Info */}
      <div className="grid grid-cols-2 gap-8 mb-8 m-3">
        <div className="space-y-2">
          <Typography variant="h4" className="text-gray-500 font-medium">
            Informations de l'entreprise
          </Typography>
          <div className="space-y-1">
            
            {email && (
              <div className="flex items-center text-gray-600">
                <EmailIcon className="w-5 h-5 mr-2" />
                <Typography variant="h5">{email}</Typography>
              </div>
            )}
            {numero && (
              <div className="flex items-center text-gray-600">
                <PhoneIcon className="w-5 h-5 mr-2" />
                <Typography variant="h5">{numero}</Typography>
              </div>
            )}
            {coordonne && (
              <Typography variant="h5" className="text-gray-600">
                {coordonne}
              </Typography>
            )}
          </div>
        </div>

        {/* Client Info */}
        <div className="space-y-2 m-3">
          <Typography variant="h5" className="text-gray-500 font-medium">
            Informations du client
          </Typography>
          <div className="space-y-1">
            <Typography variant="h5" className="text-gray-600">
              <span className="font-medium">Nom :</span> {clientName}
            </Typography>
            {invoiceNumber &&            
            <Typography variant="h5" className="text-gray-600">
              <span className="font-medium">Téléphone :</span> {invoiceNumber}
            </Typography>
            }
           
          </div>
        </div>
      </div>

      {/* Facture Title */}
      <div className="text-center mb-8">
        <Divider className="mb-4" />
        <Typography variant="h5" className="font-bold text-gray-900">
          FACTURE
        </Typography>
      </div>
    </div>
  );
}

