// src/pages/Transactions.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip,
  Divider,
  Snackbar,
  Alert,
  Grow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getTransacts, createTransact, updateTransact, deleteTransact, Transact, getStatis } from "../api/transac";
import { getComptes } from "../api/compte";
import { useCategoriesEntreprise } from "../usePerso/fonction.categorie";

const typeMeta: Record<string, { label: string; color: "success" | "error" | "default"; icon: React.ReactElement }> = {
  revenu: { label: "Revenu", color: "success", icon: <ArrowUpwardIcon /> },
  depense: { label: "Dépense", color: "error", icon: <ArrowDownwardIcon /> },
  transfert: { label: "Transfert", color: "default", icon: <SwapHorizIcon /> },
};

const fmt = (v: number) => v.toLocaleString("fr-FR", { maximumFractionDigits: 2 });

const Transac: React.FC = () => {
  const [transactions, setTransactions] = useState<Transact[]>([]);
  const [trans, setTrans] = useState([]);
  const [comptes, setComptes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" }>({
    open: false,
    message: "",
    severity: "info",
  });

  const t = getStatis()
  
  const { cateEntreprises } = useCategoriesEntreprise("1");
  
  const [form, setForm] = useState<Partial<Transact>>({
    montant: 0,
    type: "",
    description: "",
    compte_source: null,
    compte_destination: null,
  });

  // states for edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transact | null>(null);
  const [editForm, setEditForm] = useState<Partial<Transact>>({});

  useEffect(() => {
    (async () => {
      try {
        const [txs, cps] = await Promise.all([getTransacts(), getComptes()]);
        // trier par created_at (desc). Si pas de created_at, fallback sur id (desc)
        const txArray = Array.isArray(txs) ? [...txs] : [];
        txArray.sort((a, b) => {
          const ta = a.created_at ? new Date(a.created_at).getTime() : Number(a.id ?? 0);
          const tb = b.created_at ? new Date(b.created_at).getTime() : Number(b.id ?? 0);
          return tb - ta;
        });
        setTransactions(txArray);
        setComptes(Array.isArray(cps) ? cps : []);
      } catch (err) {
        setSnack({ open: true, message: "Erreur chargement", severity: "error" });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const resetForm = () =>
    setForm({
      montant: 0,
      type: "",
      description: "",
      compte_source: null,
      compte_destination: null,
      categorie: null,
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // validation
    if (!form.type) return setSnack({ open: true, message: "Choisis le type", severity: "error" });
    if (!form.montant || Number(form.montant) <= 0) return setSnack({ open: true, message: "Montant invalide", severity: "error" });

    if (form.type === "depense" && !form.compte_source)
      return setSnack({ open: true, message: "Sélectionne le compte source", severity: "error" });
    if (form.type === "revenu" && !form.compte_destination)
      return setSnack({ open: true, message: "Sélectionne le compte destination", severity: "error" });
    if (form.type === "transfert" && (!form.compte_source || !form.compte_destination))
      return setSnack({ open: true, message: "Sélectionne les deux comptes pour le transfert", severity: "error" });
    if (form.type === "transfert" && form.compte_source === form.compte_destination)
      return setSnack({ open: true, message: "Source et destination doivent être différents", severity: "error" });

    try {
      const payload: any = {
        type: form.type,
        montant: Number(form.montant),
        description: form.description || "",
      };
      if (form.categorie != null) payload.categorie = form.categorie;
      if (form.type === "depense") payload.compte_source = form.compte_source;
      else if (form.type === "revenu") payload.compte_destination = form.compte_destination;
      else if (form.type === "transfert") {
        payload.compte_source = form.compte_source;
        payload.compte_destination = form.compte_destination;
      }

      const newTx = await createTransact(payload);
      setTransactions((prev) => [newTx, ...prev]);
      setSnack({ open: true, message: "Transaction enregistrée", severity: "success" });
      resetForm();
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: "Erreur lors de la création", severity: "error" });
    }
  };

  // --- Edition handlers ---
  const handleEditOpen = (tx: Transact) => {
    setEditingTx(tx);
    setEditForm({ ...tx });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditingTx(null);
    setEditForm({});
    setEditOpen(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.type) return setSnack({ open: true, message: "Choisis le type", severity: "error" });
    if (!editForm.montant || Number(editForm.montant) <= 0)
      return setSnack({ open: true, message: "Montant invalide", severity: "error" });

    if (editForm.type === "depense" && !editForm.compte_source)
      return setSnack({ open: true, message: "Sélectionne le compte source", severity: "error" });
    if (editForm.type === "revenu" && !editForm.compte_destination)
      return setSnack({ open: true, message: "Sélectionne le compte destination", severity: "error" });
    if (editForm.type === "transfert" && (!editForm.compte_source || !editForm.compte_destination))
      return setSnack({ open: true, message: "Sélectionne les deux comptes pour le transfert", severity: "error" });
    if (editForm.type === "transfert" && editForm.compte_source === editForm.compte_destination)
      return setSnack({ open: true, message: "Source et destination doivent être différents", severity: "error" });

    try {
      const payload: any = {
        type: editForm.type,
        montant: Number(editForm.montant),
        description: editForm.description || "",
      };
      if (editForm.categorie != null) payload.categorie = editForm.categorie;
      if (editForm.type === "depense") payload.compte_source = editForm.compte_source;
      else if (editForm.type === "revenu") payload.compte_destination = editForm.compte_destination;
      else if (editForm.type === "transfert") {
        payload.compte_source = editForm.compte_source;
        payload.compte_destination = editForm.compte_destination;
      }

      if (!editingTx?.id) throw new Error("Transaction ID missing");
      const updated = await updateTransact(editingTx.id, payload);
      setTransactions((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setSnack({ open: true, message: "Transaction mise à jour", severity: "success" });
      handleEditClose();
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: "Erreur lors de la mise à jour", severity: "error" });
    }
  };

  const handleDelete = async (tx: Transact) => {
    if (!tx.id) return;
    const ok = window.confirm("Supprimer cette transaction ?");
    if (!ok) return;
    try {
      await deleteTransact(tx.id);
      setTransactions((prev) => prev.filter((p) => p.id !== tx.id));
      setSnack({ open: true, message: "Transaction supprimée", severity: "success" });
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: "Erreur lors de la suppression", severity: "error" });
    }
  };

  const findCompteName = (id: number | null | undefined) => comptes.find((c) => c.id === id)?.nom || "—";

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Typography variant="h6" gutterBottom>
            Nouvelle transaction
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="type-label">Type</InputLabel>
              <Select
                labelId="type-label"
                label="Type"
                value={form.type || ""}
                onChange={(e) => setForm((s) => ({ ...s, type: e.target.value as any }))}
              >
                <MenuItem value="revenu">
                  <Chip icon={<ArrowUpwardIcon />} label="Revenu" color="success" size="small" />
                </MenuItem>
                <MenuItem value="depense">
                  <Chip icon={<ArrowDownwardIcon />} label="Dépense" color="error" size="small" />
                </MenuItem>
                <MenuItem value="transfert">
                  <Chip icon={<SwapHorizIcon />} label="Transfert" size="small" />
                </MenuItem>
              </Select>
            </FormControl>

            {form.type !== "revenu" && (
              <FormControl fullWidth size="small">
                <InputLabel id="source-label">Compte source</InputLabel>
                <Select
                  labelId="source-label"
                  label="Compte source"
                  value={form.compte_source ?? ""}
                  onChange={(e) => setForm((s) => ({ ...s, compte_source: e.target.value ? Number(e.target.value) : null }))}
                >
                  <MenuItem value="">Aucun</MenuItem>
                  {comptes.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <AccountBalanceWalletIcon fontSize="small" />
                        <span>
                          {c.nom} — {fmt(Number(c.solde || 0))} {c.devise || "XOF"}
                        </span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {form.type !== "depense" && (
              <FormControl fullWidth size="small">
                <InputLabel id="dest-label">Compte destination</InputLabel>
                <Select
                  labelId="dest-label"
                  label="Compte destination"
                  value={form.compte_destination ?? ""}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, compte_destination: e.target.value ? Number(e.target.value) : null }))
                  }
                >
                  <MenuItem value="">Aucun</MenuItem>
                  {comptes.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <AccountBalanceWalletIcon fontSize="small" />
                        <span>
                          {c.nom} — {fmt(Number(c.solde || 0))} {c.devise || "XOF"}
                        </span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {form.type === "depense" && (
              <FormControl fullWidth size="small">
                <InputLabel id="dest-label">Categorie</InputLabel>
                <Select
                  labelId="dest-label"
                  label="Categorie"
                  value={form.categorie ?? ""}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, categorie: e.target.value ? Number(e.target.value) : null }))
                  }
                >
                  <MenuItem value="">Aucun</MenuItem>
                  {cateEntreprises.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <AccountBalanceWalletIcon fontSize="small" />
                        <span>
                          {c.libelle}
                        </span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <TextField
              size="small"
              type="number"
              label="Montant"
              value={form.montant ?? ""}
              onChange={(e) => setForm((s) => ({ ...s, montant: Number(e.target.value) }))}
              inputProps={{ min: 0, step: 0.01 }}
              fullWidth
            />

            <TextField
              size="small"
              label="Description (optionnel)"
              value={form.description ?? ""}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
              multiline
              rows={2}
              fullWidth
            />

            <Box display="flex" gap={2}>
              <Button type="submit" variant="contained" color="primary" startIcon={<MonetizationOnIcon />}>
                Enregistrer
              </Button>
              <Button type="button" variant="outlined" onClick={resetForm}>
                Réinitialiser
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={7}>
          <Typography variant="h6" gutterBottom>
            Historique des transactions
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {loading && <Typography>Chargement...</Typography>}

          <List>
            {transactions.length === 0 && !loading && <Typography color="text.secondary">Aucune transaction</Typography>}
            {transactions.map((t, idx) => {
              const meta = typeMeta[t.type] || { label: t.type, color: "default", icon: <MonetizationOnIcon /> };
              return (
                <Grow key={t.id} in timeout={200 + idx * 60}>
                  <ListItem
                    sx={{
                      mb: 1,
                      borderRadius: 1,
                      bgcolor: "background.paper",
                      boxShadow: 1,
                    }}
                    secondaryAction={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip label={meta.label} color={meta.color} size="small" icon={meta.icon} />
                        {/* <IconButton edge="end" aria-label="edit" onClick={() => handleEditOpen(t)} size="small">
                          <EditIcon color="primary" fontSize="small" />
                        </IconButton> */}
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(t)} size="small">
                          <DeleteIcon color="error" fontSize="small" />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor:
                            t.type === "depense"
                              ? "error.main"
                              : t.type === "revenu"
                              ? "success.main"
                              : "primary.main",
                        }}
                      >
                        {t.type === "depense" ? (
                          <ArrowDownwardIcon />
                        ) : t.type === "revenu" ? (
                          <ArrowUpwardIcon />
                        ) : (
                          <SwapHorizIcon />
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle2">
                            {fmt(Number(t.montant || 0))} {t.devise || "XOF"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            · {t.description || "—"}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {t.type === "transfert"
                            ? `De ${findCompteName(t.compte_source)} → ${findCompteName(t.compte_destination)}`
                            : t.type === "depense"
                            ? `Compte: ${findCompteName(t.compte_source)}`
                            : `Compte: ${findCompteName(t.compte_destination)}`}
                          {t.created_at ? ` · ${new Date(t.created_at).toLocaleString("fr-FR")}` : ""}
                        </Typography>
                      }
                    />
                  </ListItem>
                </Grow>
              );
            })}
          </List>
        </Grid>
      </Grid>

        <Dialog open={editOpen} onClose={handleEditClose} fullWidth maxWidth="sm">
          <DialogTitle>Modifier la transaction</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleEditSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="edit-type-label">Type</InputLabel>
                <Select
                  labelId="edit-type-label"
                  label="Type"
                  value={editForm.type || ""}
                  onChange={(e) => setEditForm((s) => ({ ...s, type: e.target.value as any }))}
                >
                  <MenuItem value="revenu">
                    <Chip icon={<ArrowUpwardIcon />} label="Revenu" color="success" size="small" />
                  </MenuItem>
                  <MenuItem value="depense">
                    <Chip icon={<ArrowDownwardIcon />} label="Dépense" color="error" size="small" />
                  </MenuItem>
                  <MenuItem value="transfert">
                    <Chip icon={<SwapHorizIcon />} label="Transfert" size="small" />
                  </MenuItem>
                </Select>
              </FormControl>

              {editForm.type !== "revenu" && (
                <FormControl fullWidth size="small">
                  <InputLabel id="edit-source-label">Compte source</InputLabel>
                  <Select
                    labelId="edit-source-label"
                    label="Compte source"
                    value={editForm.compte_source ?? ""}
                    onChange={(e) => setEditForm((s) => ({ ...s, compte_source: e.target.value ? Number(e.target.value) : null }))}
                  >
                    <MenuItem value="">Aucun</MenuItem>
                    {comptes.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <AccountBalanceWalletIcon fontSize="small" />
                          <span>
                            {c.nom} — {fmt(Number(c.solde || 0))} {c.devise || "XOF"}
                          </span>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {editForm.type !== "depense" && (
                <FormControl fullWidth size="small">
                  <InputLabel id="edit-dest-label">Compte destination</InputLabel>
                  <Select
                    labelId="edit-dest-label"
                    label="Compte destination"
                    value={editForm.compte_destination ?? ""}
                    onChange={(e) => setEditForm((s) => ({ ...s, compte_destination: e.target.value ? Number(e.target.value) : null }))}
                  >
                    <MenuItem value="">Aucun</MenuItem>
                    {comptes.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <AccountBalanceWalletIcon fontSize="small" />
                          <span>
                            {c.nom} — {fmt(Number(c.solde || 0))} {c.devise || "XOF"}
                          </span>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {editForm.type === "depense" && (
                <FormControl fullWidth size="small">
                  <InputLabel id="edit-categorie-label">Categorie</InputLabel>
                  <Select
                    labelId="edit-categorie-label"
                    label="Categorie"
                    value={editForm.categorie ?? ""}
                    onChange={(e) => setEditForm((s) => ({ ...s, categorie: e.target.value ? Number(e.target.value) : null }))}
                  >
                    <MenuItem value="">Aucun</MenuItem>
                    {cateEntreprises.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <AccountBalanceWalletIcon fontSize="small" />
                          <span>
                            {c.libelle}
                          </span>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <TextField
                size="small"
                type="number"
                label="Montant"
                value={editForm.montant ?? ""}
                onChange={(e) => setEditForm((s) => ({ ...s, montant: Number(e.target.value) }))}
                inputProps={{ min: 0, step: 0.01 }}
                fullWidth
              />

              <TextField
                size="small"
                label="Description (optionnel)"
                value={editForm.description ?? ""}
                onChange={(e) => setEditForm((s) => ({ ...s, description: e.target.value }))}
                multiline
                rows={2}
                fullWidth
              />

              <DialogActions>
                <Button onClick={handleEditClose}>Annuler</Button>
                <Button type="submit" variant="contained" startIcon={<MonetizationOnIcon />}>Enregistrer</Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default Transac;
