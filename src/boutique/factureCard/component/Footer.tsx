import { Box, Typography, Divider } from "@mui/material";
export default function Footer({ name, email, phone }: any) {
  return (
    <Box 
  component="footer"
  sx={{
    borderTop: 2,
    borderColor: "gray.300",
    py: 2,
    width: "100%", // Prend toute la largeur disponible
    maxWidth: "100vw", // Limite à la largeur de la vue
    boxSizing: "border-box",
    fontSize: "clamp(0.75rem, 1vw + 0.5rem, 1.25rem)" // Taille de police responsive
  }}
>
  {/* Container principal adaptable */}
  <Box 
    sx={{ 
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      alignItems: "center",
      gap: "1rem",
      px: 2,
      overflow: "hidden"
    }}
  >
    {/* Éléments avec largeur flexible */}
    <Box sx={{ 
      flex: "1 1 auto", 
      minWidth: "20px", 
      textAlign: "center",
      whiteSpace: "nowrap"
    }}>
      <Typography variant="inherit">
        <strong>Nom:</strong> {name}
      </Typography>
    </Box>

    <Divider orientation="vertical" flexItem sx={{ height: "1.5em" }} />

    <Box sx={{ 
      flex: "1 1 auto", 
      minWidth: "20px", 
      textAlign: "center" 
    }}>
      <Typography variant="inherit">
        <strong>Email:</strong> {email}
      </Typography>
    </Box>

    <Divider orientation="vertical" flexItem sx={{ height: "1.5em" }} />

    <Box sx={{ 
      flex: "1 1 auto", 
      minWidth: "20px", 
      textAlign: "center" 
    }}>
      <Typography variant="inherit">
        <strong>Tél:</strong> {phone}
      </Typography>
    </Box>
  </Box>

  <Divider sx={{ my: 2 }} />

  {/* Section basse scalable */}
  <Box sx={{ 
    textAlign: "center", 
    fontSize: "0.8em",
    padding: "0.5rem"
  }}>
    {/* <Typography variant="inherit">
      Pre_Facture chez D_D • 
      <a 
        href="https://tsbsankara.com" 
        style={{ 
          textDecoration: "underline",
          marginLeft: "0.3rem"
        }}
      >
        Diakite Digital
      </a>
    </Typography> */}
  </Box>
</Box>
  );
}

