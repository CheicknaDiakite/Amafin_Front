import { useEffect, useRef, useState } from 'react'
import ReactToPrint from 'react-to-print'
import Header from './component/Header';
// import MainDetails from './component/MainDetails';
// import ClientDetails from './component/ClientDetails';
// import Dates from './component/Dates';
import Notes from './component/Notes';
// import Footer from './component/Footer';
import RemoveIcon from '@mui/icons-material/Remove';
import PrintIcon from '@mui/icons-material/Print';
import AddIcon from '@mui/icons-material/Add';
import { useStoreCart } from '../../usePerso/cart_store';
import TableFact from './TableFact';
import backgroundImage from '../../../public/assets/img/img.jpg'
import "./print.css";
// import { generateOrderNumber } from '../../usePerso/fonctionPerso';
import { BASE } from '../../_services/caller.service';
import { connect } from '../../_services/account.service';
import { RecupType } from '../../typescript/DataType';
import { Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack, IconButton } from '@mui/material';
import { useCreateFacSortie } from '../../usePerso/fonction.facture';
import CloseIcon from '@mui/icons-material/Close';
import html2pdf from 'html2pdf.js';
import { toast } from 'react-hot-toast';

export default function Fact({clientName, invoiceNumber, invoiceDate, notes, numeroFac, post, discountedTotal, payerTotal}: RecupType | any) {
  // let url = BASE(post.image);
  
  const url = post.image ? BASE(post.image) : backgroundImage;
  
  const selectedIds = useStoreCart(state => state.selectedIds)
  const reset = useStoreCart(state => state.reset)
  const sorties = useStoreCart(state => state.sorties);
  const selectSorties = sorties.filter((sor) => sor.id !== undefined && selectedIds.has(sor.id as number));
  // const totalPrix = selectSorties.reduce((sum, sor) => sum + sor.prix_total, 0);

  const totalPrix = selectSorties?.reduce((acc, sortie) => {
    // Convertir prix_total en nombre ou utiliser 0 si invalide
    const prixTotal = sortie.prix_total ? parseFloat(String(sortie.prix_total)) : 0;
    return acc + prixTotal;
  }, 0);
    
  const [quantity] = useState<number>(0);
  const [price] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);

  // const componentRef = useRef();
  const componentRef = useRef<HTMLDivElement>(null);

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({ libelle: '', ref: '', date: '' });
  const { ajoutFacSortie } = useCreateFacSortie();
  const [loadingPdf, setLoadingPdf] = useState(false);

  // Fonction utilitaire pour attendre le chargement de l'image
  const waitImageLoad = (imgUrl: string) => {
    return new Promise<void>((resolve, reject) => {
      const img = new window.Image();
      img.src = imgUrl;
      img.onload = () => resolve();
      img.onerror = reject;
    });
  };

  // Handle form changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Fonction de téléchargement manuel pour iPhone
  // const downloadPdfForIOS = async () => {
  //   try {
  //     const element = componentRef.current;
  //     if (!element) throw new Error('Aperçu facture introuvable');
      
  //     const opt = {
  //       margin: 0.2,
  //       filename: `facture-${form.ref || Date.now()}.pdf`,
  //       image: { type: 'jpeg', quality: 0.98 },
  //       html2canvas: { scale: 2 },
  //       jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
  //     };
      
  //     await waitImageLoad(url);
      
  //     // Générer en base64 pour iOS
  //     const pdfBase64 = await html2pdf().from(element).set(opt).outputPdf('datauristring');
      
  //     // Créer un lien de téléchargement
  //     const link = document.createElement('a');
  //     link.href = pdfBase64;
  //     link.download = opt.filename;
  //     link.style.display = 'none';
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
      
  //     toast.success('Téléchargement lancé !');
  //   } catch (error) {
  //     console.error('Erreur téléchargement:', error);
  //     toast.error('Erreur lors du téléchargement');
  //   }
  // };

  // Générer le PDF et envoyer le formData
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingPdf(true);
    try {
      // Générer le PDF à partir du composant
      const element = componentRef.current;
      if (!element) throw new Error('Aperçu facture introuvable');
      
      // Options html2pdf
      const opt = {
        margin: 0.2,
        filename: `facture-${form.ref || Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      };
      
      // Attendre que l'image soit chargée
      await waitImageLoad(url);
      
      // Détecter si on est sur iOS/Safari
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
      
      let pdfBlob: Blob;
      
      if (isIOS || isSafari) {
        // Méthode alternative pour iOS/Safari
        try {
          // Essayer d'abord la méthode normale
          pdfBlob = await html2pdf().from(element).set(opt).outputPdf('blob');
        } catch (iosError) {
          console.log('Méthode normale échouée sur iOS, tentative alternative...');
          // Méthode alternative : générer en base64 puis convertir
          const pdfBase64 = await html2pdf().from(element).set(opt).outputPdf('datauristring');
          const base64Data = pdfBase64.split(',')[1];
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          pdfBlob = new Blob([byteArray], { type: 'application/pdf' });
        }
      } else {
        // Méthode normale pour les autres navigateurs
        pdfBlob = await html2pdf().from(element).set(opt).outputPdf('blob');
      }
      
      // Préparer le formData
      const user_id = connect;
      const entreprise_id = post.entreprise_id || post.uuid || '';
      const formData: any = {
        ...form,
        user_id,
        entreprise_id,
        facture: new File([pdfBlob], opt.filename, { type: 'application/pdf' })
      };
      
      await ajoutFacSortie(formData);
      setForm({ libelle: '', ref: '', date: '' });
      setOpenModal(false);
      toast.success('Facture ajoutée avec succès !');
    } catch (err) {
      console.error('Erreur lors de la génération du PDF:', err);
      toast.error('Erreur lors de la génération du PDF. Veuillez réessayer.');
    } finally {
      setLoadingPdf(false);
    }
  };

  // Calculate items amount function
  useEffect(() => {
    const calculateAmount = () => {
      setAmount(quantity * price);
    };

    calculateAmount();
  }, [amount, price, quantity, setAmount]);

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-full sm:max-w-[1200px] mx-auto px-2 sm:px-4">
        <Paper elevation={0} className="bg-white rounded-lg overflow-hidden">
          <div className="p-2 sm:p-6">
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-4 mb-4 sm:mb-6">
              <button 
                onClick={() => reset()}
                className="inline-flex items-center justify-center px-3 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors duration-200 text-sm sm:text-base"
              >
                <RemoveIcon className="w-5 h-5 mr-2" />
                <span>Annuler</span>
              </button>
              
              <ReactToPrint
                trigger={() => (
                  <button className="inline-flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 text-sm sm:text-base">
                    <PrintIcon className="w-5 h-5 mr-2" />
                    <span>Imprimer / Télécharger</span>
                  </button>
                )}
                content={() => componentRef.current}
              />
              {/* Nouveau bouton pour ouvrir le modal */}
              <button
                onClick={() => setOpenModal(true)}
                className="inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base"
              >
                <AddIcon className="w-5 h-5 mr-2" />
                <span>Ajouter Facture de Sortie</span>
              </button>
            </div>

            {/* Modal d'ajout de facture de sortie */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
              <DialogTitle className="flex justify-between items-center">
                <span>Ajouter une facture de sortie</span>
                <IconButton onClick={() => setOpenModal(false)} size="small">
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                  <Stack spacing={2}>
                    <TextField
                      label="Libellé"
                      name="libelle"
                      value={form.libelle}
                      onChange={handleFormChange}
                      fullWidth
                      required
                    />
                    <TextField
                      label="Référence"
                      name="ref"
                      value={form.ref}
                      onChange={handleFormChange}
                      fullWidth
                      required
                    />
                    <TextField
                      label="Date"
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleFormChange}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Stack>
                  <DialogActions className="mt-4">
                    <Button onClick={() => setOpenModal(false)} color="secondary" disabled={loadingPdf}>
                      Annuler
                    </Button>
                    {/* <Button 
                      onClick={downloadPdfForIOS}
                      variant="outlined" 
                      color="primary" 
                      disabled={loadingPdf}
                      sx={{ mr: 1 }}
                    >
                      Télécharger PDF
                    </Button> */}
                    <Button type="submit" variant="contained" color="primary" disabled={loadingPdf}>
                      {loadingPdf ? 'Génération...' : 'Ajouter'}
                    </Button>
                  </DialogActions>
                </form>
              </DialogContent>
            </Dialog>

            {/* Invoice Content */}
            <div 
              ref={componentRef} 
              className="bg-white p-2 sm:p-8 rounded-lg shadow-sm border border-gray-100 print-container"
            >
              <Header
              // orderNumber={orderNumber}
              nom={post.nom}
              numeroFac={numeroFac}
              url={url}
              email={post.email}
              address={post.adresse}
              numero={post.numero}
              coordonne={post.coordonne}
              clientName={clientName}
              invoiceDate={invoiceDate}
              invoiceNumber={invoiceNumber}
              />

              <div className="overflow-x-auto w-full">
              <TableFact
              list={selectSorties}
              total={totalPrix}
              discountedTotal={discountedTotal}
              payerTotal={payerTotal}
              />
              </div>

              <Notes 
              notes={notes}
              />

            </div>
          </div>
        </Paper>
      </div>
    </div>
  )
}
