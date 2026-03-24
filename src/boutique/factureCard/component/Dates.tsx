
import { Box, Typography, Paper } from "@mui/material";

export default function Dates({ invoiceDate }: any) {
  return (
    <Box component="article" sx={{ mt: 5, mb: 7, display: "flex", justifyContent: "flex-end" }}>
      <Paper elevation={1} sx={{ p: 1.5, backgroundColor: "grey.100" }}>
        <Typography variant="body1">
          <strong>Date:</strong> {invoiceDate}
        </Typography>
      </Paper>
    </Box>
  );
}

