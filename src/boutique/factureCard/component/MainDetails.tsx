
import { Box, Typography, Divider } from "@mui/material";

export default function MainDetails({ name, address, numero, coordonne }: any) {
  return (
    <Box component="section" sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right" }}>
      <Typography variant="h4" fontWeight="bold" textTransform="uppercase" gutterBottom>
        {name}
      </Typography>
      <Typography variant="body1">{address}</Typography>
      <Typography variant="body1">{coordonne}</Typography>
      
      <Divider sx={{ my: 1, width: "100%" }} />

      <Typography variant="body1">
        <strong>Tel:</strong> {numero}
      </Typography>
    </Box>
  );
}

