import { Button ,Card,Dialog, DialogContent, DialogTitle, IconButton, Stack, TextField, Typography } from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import CloseIcon from "@mui/icons-material/Close"
import { SlugType } from "../../typescript/DataType";
import { connect } from "../../_services/account.service";
import { useStoreCart } from "../../usePerso/cart_store";
import { useCreateCategorie, useFetchAllCategorie } from "../../usePerso/fonction.categorie";
import { CategorieFormType } from "../../typescript/FormType";
 
export default function Categorie() {
    const [open, openchange]= useState(false);
    const functionopen = () => {
        openchange(true)
    }
    const closeopen = () => {
        openchange(false)
    }

    const recup: SlugType = {
      all: 'all',
      user_id: connect
    }

    // const {categories, ajoutCategorie} = useCategorie(top)
    const {categories} = useFetchAllCategorie(recup)
    const {ajoutCategorie} = useCreateCategorie()

    const [formValues, setFormValues] = useState<CategorieFormType>({
        libelle: '',
        user_id: '',
        entreprise_id: '',
      });
    
      const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues({
          ...formValues,
          [name]: value,
        });
      };
    
    
      const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        formValues["user_id"] = connect
    
        ajoutCategorie(formValues)
      };
  return (
    <>
    <div className="py-2">
        <Button variant="outlined" onClick={functionopen} >Ajout Categorie</Button>
    </div>

    <Card className="h-full w-full overflow-scroll">
      <table className="w-full min-w-max table-auto text-left">      
        <thead>
          <tr>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Libelle
              </Typography>
            </th>
            
            <th />
          </tr>
        </thead>
        <tbody>
          {categories?.length > 0 ? 
              categories.map((post, index)=> {
                const isLast = index === categories.length - 1;
                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                return (
                  <tr key={index}>
                    <td className={classes}>
                      <Typography color="blue-gray" className="font-normal">
                        {post.libelle}
                      </Typography>
                    </td>
                  </tr>
                );
              })
              : 'Pas de Categorie'
              } 
        </tbody>
      </table>
    </Card>

    <Dialog open={open} onClose={closeopen} fullWidth maxWidth="xs">
        <DialogTitle>Categorie<IconButton onClick={closeopen} style={{float: "right"}}><CloseIcon color="primary"></CloseIcon></IconButton> </DialogTitle>
        <DialogContent>
          {/* <DialogContentText>Categorie</DialogContentText> */}
          <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={onSubmit}>
            <Stack spacing={2} margin={2}>
              <TextField variant="outlined" label="libelle" name='libelle' onChange={onChange}></TextField>
              <Button type="submit" color="success" variant="outlined">Yes</Button>
            </Stack>
          </form>
        </DialogContent>
    </Dialog>
    </>
  );
}


export const CartContent = () => {
  
  const selectedIds = useStoreCart(state => state.selectedIds)
  const reset = useStoreCart(state => state.reset)
  
  const sorties = useStoreCart(state => state.sorties);
  const selectSorties = sorties.filter((sor) => sor.id !== undefined && selectedIds.has(sor.id as number));
  return <div>Content 
    <button type="button" className="text-red-100 bg-red-600" onClick={()=>reset()}>reset</button>
    {selectSorties.map(sor => (
      <div key={sor.id}>
        {sor.qte}
      </div>
    ))}
  </div>;
}