// src/components/Comptes.tsx
import { useEffect, useState } from "react";
import { getComptes, createCompte, updateCompte, deleteCompte, Compte } from "../api/compte";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
  Avatar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grow,
  Backdrop,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

export default function Comptes() {
  const [comptes, setComptes] = useState<Compte[]>([]);
  const [nom, setNom] = useState("");
  const [solde, setSolde] = useState<number | "">("");
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity?: "success" | "error" | "info" }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Compte | null>(null);
  const [editNom, setEditNom] = useState("");
  const [editSolde, setEditSolde] = useState<number | "">("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getComptes();
        setComptes(Array.isArray(data) ? data : []);
      } catch (err) {
        setSnack({ open: true, message: "Erreur lors du chargement des comptes", severity: "error" });
      }
    })();
  }, []);

  const totalSolde = comptes.reduce((acc, c) => acc + Number(c.solde || 0), 0);

  const fmt = (v: number) => v.toLocaleString("fr-FR", { maximumFractionDigits: 2 });

  const handleAddCompte = async () => {
    if (!nom.trim() || solde === "") {
      setSnack({ open: true, message: "Nom et solde requis", severity: "error" });
      return;
    }
    try {
      const nouveau = await createCompte({ nom: nom.trim(), solde: Number(solde), devise: "XOF" });
      setComptes((prev) => [nouveau, ...prev]);
      setNom("");
      setSolde("");
      setSnack({ open: true, message: "Compte ajouté", severity: "success" });
    } catch (err) {
      setSnack({ open: true, message: "Erreur ajout compte", severity: "error" });
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm("Supprimer ce compte ? Cette action est irréversible.")) return;
    // Optimistic UI
    const prev = comptes;
    setComptes((p) => p.filter((c) => c.id !== id));
    try {
      await deleteCompte(id);
      setSnack({ open: true, message: "Compte supprimé", severity: "info" });
    } catch (err) {
      // rollback on error
      setComptes(prev);
      setSnack({ open: true, message: "Erreur suppression (rollback)", severity: "error" });
    }
  };

  const openEdit = (c: Compte) => {
    setEditing(c);
    setEditNom(c.nom || "");
    setEditSolde(Number(c.solde || 0));
    setEditOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editing) return;
    if (!editNom.trim() || editSolde === "") {
      setSnack({ open: true, message: "Nom et solde requis", severity: "error" });
      return;
    }
    const payload = { nom: editNom.trim(), solde: Number(editSolde) };
    // Optimistic update
    const prev = comptes;
    setComptes((p) => p.map((c) => (c.id === editing.id ? { ...c, ...payload } : c)));
    setEditOpen(false);
    try {
      const updated = await updateCompte(editing.id, payload);
      setComptes((p) => p.map((c) => (c.id === editing.id ? updated : c)));
      setSnack({ open: true, message: "Compte mis à jour", severity: "success" });
    } catch (err) {
      setComptes(prev);
      setSnack({ open: true, message: "Erreur mise à jour (rollback)", severity: "error" });
    }
  };

  const initials = (name = "") =>
    name
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <Paper elevation={2} className="p-4">
      <Stack >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <AccountBalanceWalletIcon />
          </Avatar>
          <Box>
            <Typography variant="h6">Mes comptes</Typography>
            <Typography variant="body2" color="text.secondary">
              Solde total : <strong>{fmt(totalSolde)} XOF</strong>
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleAddCompte(); }} className="py-3">
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom du compte"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                variant="outlined"
                size="small"
              />
            </Grid>

            <Grid item xs={9} sm={4}>
              <TextField
                fullWidth
                label="Solde initial"
                value={solde}
                type="number"
                onChange={(e) => setSolde(e.target.value === "" ? "" : Number(e.target.value))}
                variant="outlined"
                size="small"
                InputProps={{
                  endAdornment: <InputAdornment position="end">XOF</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={3} sm={2}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                sx={{ height: "40px" }}
              >
                Ajouter
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Divider />

        <Grid container spacing={2}>
          {comptes.length === 0 && (
            <Grid item xs={12}>
              <Alert severity="info">Aucun compte pour le moment. Ajoute ton premier compte.</Alert>
            </Grid>
          )}

          {comptes.map((c, idx) => (
            <Grid item xs={12} sm={6} key={c.id}>
              <Grow in timeout={250 + idx * 80}>
                <div>
                  <Card
                    elevation={3}
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(250,250,250,1))",
                      transition: "transform 240ms ease, box-shadow 240ms ease",
                      "&:hover": { transform: "translateY(-6px)", boxShadow: "0 12px 30px rgba(15,23,42,0.08)" },
                    }}
                  >
                    <CardHeader
                      avatar={<Avatar sx={{ bgcolor: "secondary.main" }}>{initials(c.nom)}</Avatar>}
                      title={<Typography variant="subtitle1">{c.nom}</Typography>}
                      subheader={<Typography variant="caption">{c.devise || "XOF"}</Typography>}
                      action={
                        <Stack direction="row" spacing={1}>
                          <IconButton size="small" aria-label="éditer" onClick={() => openEdit(c)}>
                            <EditIcon color="primary" fontSize="small" />
                          </IconButton>
                          <IconButton size="small" aria-label="supprimer" onClick={() => handleDelete(c.id)}>
                            <DeleteOutlineIcon color="error" fontSize="small" />
                          </IconButton>
                        </Stack>
                      }
                    />
                    <CardContent>
                      <Typography variant="h6">{fmt(Number(c.solde || 0))} {c.devise || "XOF"}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Solde affiché en temps réel. Clique sur éditer pour modifier ou supprimer pour retirer.
                      </Typography>
                    </CardContent>
                  </Card>
                </div>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Stack>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="xs" BackdropComponent={Backdrop}>
        <DialogTitle className="flex justify-between items-center">
          <span>Éditer le compte</span>
          <IconButton onClick={() => setEditOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Nom" value={editNom} onChange={(e) => setEditNom(e.target.value)} fullWidth />
            <TextField
              label="Solde"
              value={editSolde}
              type="number"
              onChange={(e) => setEditSolde(e.target.value === "" ? "" : Number(e.target.value))}
              fullWidth
              InputProps={{ endAdornment: <InputAdornment position="end">XOF</InputAdornment> }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleEditSubmit}>Enregistrer</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
