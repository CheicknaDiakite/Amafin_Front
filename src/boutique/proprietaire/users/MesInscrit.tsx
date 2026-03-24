import { FC, ChangeEvent, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  CardActions,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Pagination,
  Stack,
  Box,
  TableContainer,
  TableCell,
  TableRow,
  Table,
  TableHead,
  TableBody,
  Paper,
  Badge,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import clsx from 'clsx';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from "@mui/icons-material/Close";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { FormValueType } from "../../../typescript/FormType";
import { useAllMesUsers, useCreateCabinetUser } from "../../../usePerso/fonction.user";
import { connect } from "../../../_services/account.service";
import Nav from "../../../_components/Button/Nav";
import MyTextField from "../../../_components/Input/MyTextField";

// Types
interface UserData {
  id: number;
  uuid: string;
  last_name: string;
  first_name: string;
  email: string;
  numero: string;
  role: number;
}

interface UserTableRowProps {
  user: UserData;
}

interface RegisterDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormValueType) => void;
}

// Components
const LoadingState: FC = () => (
  <Box sx={{ width: 300, margin: '2rem auto' }}>
    <Stack spacing={2}>
      <Box sx={{ height: 60, bgcolor: 'grey.200', borderRadius: 1 }} />
      <Box sx={{ height: 60, bgcolor: 'grey.200', borderRadius: 1 }} />
      <Box sx={{ height: 60, bgcolor: 'grey.200', borderRadius: 1 }} />
    </Stack>
  </Box>
);

const ErrorState: FC = () => {
  window.location.reload();
  return (
    <Box display="flex" justifyContent="center" p={4}>
      <Typography color="error" variant="h6">
        Une erreur est survenue. Rechargement...
      </Typography>
    </Box>
  );
};

const UserTableRow: FC<UserTableRowProps> = ({ user }) => (
  <TableRow hover>
    <TableCell>
      {user.last_name} {user.first_name}
    </TableCell>
    <TableCell>{user.numero}</TableCell>
    <TableCell>{user.email}</TableCell>
    <TableCell>
      <span 
        className={clsx(
          "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
          {
            "bg-green-50 text-green-700 ring-green-700/10": user.role === 1,
            "bg-yellow-50 text-yellow-700 ring-yellow-700/10": user.role !== 1
          }
        )}
      >
        {user.role === 1 ? "Activer" : "Desactiver"}
      </span>
    </TableCell>
    <TableCell>
      <Link to={`/user/admin/modif/${user.uuid}`}>
        <IconButton color="info" size="small">
          <VisibilityIcon />
        </IconButton>
      </Link>
    </TableCell>
  </TableRow>
);

const RegisterDialog: FC<RegisterDialogProps> = ({ open, onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValueType>();

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Ajouter un utilisateur</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <Stack spacing={3}>
            <MyTextField
              label="Nom"
              {...register("last_name", { required: "Ce champ est obligatoire" })}
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
            />
            <MyTextField
              label="Prénom"
              {...register("first_name", { required: "Ce champ est obligatoire" })}
              error={!!errors.first_name}
              helperText={errors.first_name?.message}
            />
            <MyTextField
              label="Email"
              type="email"
              {...register("email", {
                required: "Ce champ est obligatoire",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Adresse email invalide"
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <MyTextField
              label="Numéro de téléphone"
              type="tel"
              {...register("numero", {
                required: "Ce champ est obligatoire",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Numéro de téléphone invalide"
                }
              })}
              error={!!errors.numero}
              helperText={errors.numero?.message}
            />
            <MyTextField
              label="Mot de passe"
              type="password"
              {...register("password", {
                required: "Ce champ est obligatoire",
                minLength: {
                  value: 6,
                  message: "Le mot de passe doit contenir au moins 6 caractères"
                }
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Ajouter
            </Button>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const MesInscrit: FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const { getMesUsers, isLoading, isError } = useAllMesUsers(connect);
  const { createCabinetAdmin } = useCreateCabinetUser();

  const sortedUsers = getMesUsers?.slice().sort((a: UserData, b: UserData) => b.id - a.id) || [];
  const currentUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil((sortedUsers.length || 0) / itemsPerPage);

  const handlePageChange = (_: ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleSubmit = async (data: FormValueType) => {
    const toastId = toast.loading("Envoi en cours...");
    try {
      await createCabinetAdmin(data);
      toast.success("Utilisateur ajouté avec succès", { id: toastId });
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Erreur lors de l'ajout de l'utilisateur", { id: toastId });
    }
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!getMesUsers) return null;

  return (
    <>
      <Nav />
      <Card elevation={3}>
        <CardHeader
          title={
            <Box>
              <Typography variant="h5" color="primary" gutterBottom>
                Mes nouveaux inscrits
              </Typography>
              <Typography variant="body2" color="text.secondary">
                L'ensemble des administrateurs de Gest Stock
              </Typography>
            </Box>
          }
          action={
            <Button
              variant="contained"
              startIcon={<PersonAddAltIcon />}
              onClick={() => setIsDialogOpen(true)}
            >
              Ajouter un utilisateur
            </Button>
          }
        />
        <CardContent>
          <Box mb={3}>
            <Badge 
              color="secondary" 
              badgeContent={getMesUsers.length} 
              showZero
              max={999}
            >
              <PersonAddAltIcon fontSize="large" color="primary" />
            </Badge>
          </Box>

          <TableContainer component={Paper} elevation={0}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Numéro</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentUsers.map((user: UserData) => (
                  <UserTableRow key={user.uuid} user={user} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
        
        <CardActions sx={{ justifyContent: 'center', padding: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </CardActions>
      </Card>

      <RegisterDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default MesInscrit;
