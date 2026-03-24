import { Box, Typography, Button } from '@mui/material'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function M_Abonnement() {
  return (
    <Box
      sx={{
        mt: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        p: 3,
        borderRadius: 3,
        background: '#fff3f3',
        border: '1px solid #f87171'
      }}
      className="m-5"
    >
      <WarningAmberIcon color="error" sx={{ fontSize: 48 }} />
      <Typography variant="h5" color="error" sx={{ fontWeight: 700, textAlign: 'center' }}>
        L'abonnement de cette entreprise a expiré !
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center' }}>
        Veuillez renouveler votre abonnement pour continuer à ajouter des articles.
      </Typography>
      <Button
        variant="contained"
        color="success"
        href="https://wa.me/91154834"
        target="_blank"
        rel="noopener noreferrer"
        startIcon={<LocalPhoneIcon />}
        sx={{ mt: 2, fontWeight: 600, textTransform: 'none' }}
      >
        Nous contacter sur WhatsApp
      </Button>
    </Box>
  )
}