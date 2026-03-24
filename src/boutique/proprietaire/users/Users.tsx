import { FC, ChangeEvent, FormEvent, useState } from "react";
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from "@mui/icons-material/Close";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { FormValueType } from "../../../typescript/FormType";
import { useAllUsers, useCreateAdminUser } from "../../../usePerso/fonction.user";
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
  is_cabinet: boolean;
  role: number;
}

interface UserTableRowProps {
  user: UserData;
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
      {user.is_cabinet && (
        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
          Intermediere
        </span>
      )}
    </TableCell>
    <TableCell 
      className={user.role === 1 ? "" : "bg-red-300 text-white"}
    >
      {user.role === 1 ? "Activer" : "Visiteur"}
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

const AddUserDialog: FC<{
  open: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}> = ({ open, onClose, onSubmit, onChange }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Ajouter un administrateur</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
    </DialogTitle>
    <DialogContent>
      <form onSubmit={onSubmit} className="space-y-4 mt-4">
        <Stack spacing={3}>
          <MyTextField
            label="Nom d'utilisateur"
            name="username"
            onChange={onChange}
            required
          />
          <MyTextField
            label="Nom"
            name="last_name"
            onChange={onChange}
            required
          />
          <MyTextField
            label="Prénom"
            name="first_name"
            onChange={onChange}
            required
          />
          <MyTextField
            label="Email"
            type="email"
            name="email"
            onChange={onChange}
            required
          />
          <MyTextField
            label="Mot de passe"
            type="password"
            name="password"
            onChange={onChange}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Ajouter
          </Button>
        </Stack>
      </form>
    </DialogContent>
  </Dialog>
);

export default function Users() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formValues, setFormValues] = useState<FormValueType>({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const { getUsers, isLoading, isError } = useAllUsers(connect);
  const { createAdmin } = useCreateAdminUser();
  
  const itemsPerPage = 25;
  const sortedUsers = getUsers?.slice().sort((a: UserData, b: UserData) => b.id - a.id) || [];
  const currentUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil((sortedUsers.length || 0) / itemsPerPage);

  const handlePageChange = (_: ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createAdmin(formValues);
    setIsDialogOpen(false);
    setFormValues({
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    });
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!getUsers) return null;

  return (
    <>
      <Nav />
      <Card elevation={3}>
        <CardHeader
          title={
            <Box>
              <Typography variant="h5" color="primary" gutterBottom>
                Les nouveaux inscrits
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
              Ajouter un admin
            </Button>
          }
        />
        <CardContent>
          <Box mb={3}>
            <Badge 
              color="secondary" 
              badgeContent={getUsers.length} 
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
                  <TableCell>Intermédiaire</TableCell>
                  <TableCell>Type de compte</TableCell>
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

      <AddUserDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        onChange={handleInputChange}
      />
    </>
  );
}
