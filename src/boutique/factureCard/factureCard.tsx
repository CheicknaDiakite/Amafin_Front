import { useRef } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DownloadIcon from '@mui/icons-material/DownloadForOffline';
import RemoveIcon from '@mui/icons-material/Remove';
import { useStoreCart } from '../../usePerso/cart_store';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// export function ccyFormat(num: number) {
//   return `${num.toFixed(2)}`;
// }

// export function priceRow(qty: number, unit: number) {
//   return qty * unit;
// }

export default function FactureCard() {
    const selectedIds = useStoreCart(state => state.selectedIds)
    const reset = useStoreCart(state => state.reset)

    const contentRef = useRef<HTMLDivElement>(null);
    const handleDownload = async () => {
      if (contentRef.current) {
        try {
          const canvas: HTMLCanvasElement = await html2canvas(contentRef.current);
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF();
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save('download.pdf');
        } catch (error) {
          console.error("Erreur lors de la génération du PDF :", error);
        }
      }
    };
    
    const sorties = useStoreCart(state => state.sorties);
    const selectSorties = sorties.filter((sor) => sor.id !== undefined && selectedIds.has(sor.id as number));

    const totalPrix = selectSorties.reduce((sum, sor) => sum + sor.prix_total, 0);
  
  return (
    <>
    <div className='py-3'>
      <button type="button" className="text-red-100 bg-red-600 rounded-sm" onClick={()=>reset()}>
        <RemoveIcon />
      </button>

      <button onClick={handleDownload} className="text-green-100 bg-green-600 mx-2 ">
        Download PDF
        <DownloadIcon />
      </button>
    </div>

    <TableContainer component={Paper} ref={contentRef}>
      <Table sx={{ minWidth: 700 }} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={3}>
              Details
            </TableCell>
            <TableCell align="right">Prix</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Produit</TableCell>
            
            <TableCell align="right">Qty.</TableCell>
            <TableCell align="right">P.Unit</TableCell>
            <TableCell align="right">Sum</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {selectSorties.map((row, index) =>            
            (
            <TableRow key={index}>
              <TableCell>{row.categorie_libelle}</TableCell>
              <TableCell align="right">{row.qte}</TableCell>
              <TableCell align="right">{row.pu}</TableCell>
              <TableCell align="right">{row.prix_total}</TableCell>
            </TableRow>
          )
          )}
          <TableRow>
            <TableCell rowSpan={3} />
            <TableCell colSpan={2}>Prix Total:</TableCell>
            <TableCell align="right">{totalPrix}</TableCell>
          </TableRow>
          {/* <TableRow>
            <TableCell>Tax</TableCell>
            <TableCell align="right">0000</TableCell>
            <TableCell align="right">0000</TableCell>
          </TableRow> */}
          {/* <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell align="right">0000</TableCell>
          </TableRow> */}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
}
