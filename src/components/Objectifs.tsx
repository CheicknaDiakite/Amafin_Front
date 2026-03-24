import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Alert,
} from "@mui/material";
import { Objectif, getObjectifs, createObjectif, updateObjectif, deleteObjectif } from "../api/objectif";
import { Compte, getComptes } from "../api/compte";

const Objectifs: React.FC = () => {
  const [objectifs, setObjectifs] = useState<Objectif[]>([]);
  const [comptes, setComptes] = useState<Compte[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    nom: "",
    montant_cible: "",
    date_limite: "",
    compte_associe: "",
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const objs = await getObjectifs();
        setObjectifs(objs || []);
      } catch (err) {
        console.error('Erreur chargement objectifs', err);
        setError('Erreur chargement objectifs');
      }

      try {
        const cps = await getComptes();
        setComptes(cps || []);
      } catch (err) {
        console.error('Erreur chargement comptes', err);
        setError('Erreur chargement comptes');
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  // debug: affichage des comptes au rendu
  // eslint-disable-next-line no-console
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      // convertir montant_cible en number avant envoi
      const payload = {
        nom: form.nom,
        montant_cible: Number(form.montant_cible || 0),
        date_limite: form.date_limite || undefined,
        compte_associe: form.compte_associe ? Number(form.compte_associe) : undefined,
      };
      await createObjectif(payload);
      alert("✅ Objectif ajouté avec succès !");
      const objs = await getObjectifs();
      setObjectifs(objs || []);
      // setObjectifs((prev) => [newObt, ...prev]);
      setForm({
        nom: "",
        montant_cible: "",
        date_limite: "",
        compte_associe: "",
      });
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de l’ajout de l’objectif");
    }
  };

  // Edition / suppression
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Objectif | null>(null);
  const [editForm, setEditForm] = useState({ nom: "", montant_cible: "", date_limite: "", compte_associe: "" });

  const handleEditOpen = (obj: Objectif) => {
    setEditing(obj);
    setEditForm({
      nom: obj.nom || "",
      montant_cible: String(obj.montant_cible || ""),
      date_limite: obj.date_limite || "",
      compte_associe: obj.compte_associe ? String(obj.compte_associe) : "",
    });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditing(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    if (!editing || !editing.id) return;
    try {
      const payload: Partial<Objectif> = {
        nom: editForm.nom,
        montant_cible: Number(editForm.montant_cible || 0),
        date_limite: editForm.date_limite || undefined,
        compte_associe: editForm.compte_associe ? Number(editForm.compte_associe) : undefined,
      };
      await updateObjectif(Number(editing.id), payload);
      const objs = await getObjectifs();
      setObjectifs(objs || []);
      handleEditClose();
    } catch (err) {
      console.error('Erreur update objectif', err);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!window.confirm('Supprimer cet objectif ?')) return;
    try {
      await deleteObjectif(id);
      const objs = await getObjectifs();
      setObjectifs(objs || []);
    } catch (err) {
      console.error('Erreur suppression objectif', err);
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Alert severity="info" sx={{ borderRadius: 2 }}>
        Les dépenses enregistrées dans <strong>Dépenses</strong> doivent être rattachées à un objectif
        financier : choisissez l&apos;objectif correspondant lors de chaque saisie pour un suivi cohérent.
      </Alert>
      {loading && <Typography>Chargement...</Typography>}
      {error && (
        <div>
          <Typography color="error">{error}</Typography>
          <Button onClick={async () => {
            setLoading(true);
            setError(null);
            try {
              const cps = await getComptes();
              setComptes(cps || []);
            } catch (err) {
              console.error('Retry erreur comptes', err);
              setError('Erreur chargement comptes');
            } finally {
              setLoading(false);
            }
          }}>Rafraîchir</Button>
        </div>
      )}
      <Card>
        <CardContent>
          <Typography variant="h6">Nouvel Objectif Financier</Typography>
          <TextField
            label="Nom"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Montant Cible (€)"
            name="montant_cible"
            value={form.montant_cible}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            label="Date Limite"
            name="date_limite"
            value={form.date_limite}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="date"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            label="Compte Associé"
            name="compte_associe"
            value={form.compte_associe}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            {comptes.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.nom}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
            sx={{ mt: 2 }}
          >
            Ajouter
          </Button>
        </CardContent>
      </Card>

      {objectifs.map((obj) => (
        <Card key={obj.id}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">{obj.nom}</Typography>
              <Box>
                <IconButton color="primary" size="small" onClick={() => handleEditOpen(obj)} aria-label="edit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                </IconButton>
                <IconButton color="error" size="small" onClick={() => handleDelete(obj.id)} aria-label="delete">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
                </IconButton>
              </Box>
            </Box>
            <Typography>
              {obj.montant_atteint ?? 0} / {obj.montant_cible} €
            </Typography>
            <LinearProgress
              variant="determinate"
              value={
                obj.montant_cible
                  ? ((obj.montant_atteint ?? 0) / obj.montant_cible) * 100
                  : 0
              }
              sx={{ mt: 1 }}
            />
            {obj.date_limite && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Date limite : {obj.date_limite}
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}

      <Dialog open={editOpen} onClose={handleEditClose} fullWidth maxWidth="sm">
        <DialogTitle>Modifier l'objectif</DialogTitle>
        <DialogContent>
          <TextField
            label="Nom"
            name="nom"
            value={editForm.nom}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Montant Cible (€)"
            name="montant_cible"
            value={editForm.montant_cible}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            label="Date Limite"
            name="date_limite"
            value={editForm.date_limite}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
            type="date"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            label="Compte Associé"
            name="compte_associe"
            value={editForm.compte_associe}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          >
            {comptes.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.nom}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Annuler</Button>
          <Button variant="contained" onClick={handleEditSubmit}>Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Objectifs;
