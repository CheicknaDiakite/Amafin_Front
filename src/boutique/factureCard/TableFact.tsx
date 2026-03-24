import React from 'react';
import { Typography } from '@mui/material';
import { formatNumberWithSpaces } from '../../usePerso/fonctionPerso'

interface TableFactProps {
  list: { 
    categorie_libelle: string;
    qte: number;
    pu: number;
    prix_total: number;
    date: string;
    ref: string;
  }[];
  total: number;
  discountedTotal: number;
  payerTotal: number;
}

const TableFact: React.FC<TableFactProps> = ({ list, total, discountedTotal, payerTotal }) => {
  const resteAPayer = (total - ((total - discountedTotal) + (total - payerTotal)));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="overflow-x-auto">
        <table className="w-full print-table">
          {/* Table Header */}
          <thead className="print-table-header">
            <tr className="bg-gray-600 border-b-2 border-gray-900">
              <th className="text-left p-4 font-semibold text-gray-50 border-r border-gray-100">
                Désignation
              </th>
              <th className="text-right p-4 font-semibold text-gray-50 border-r border-gray-100">
                Quantité
              </th>
              <th className="text-right p-4 font-semibold text-gray-50 border-r border-gray-100">
                Prix unitaire
              </th>
              <th className="text-right p-4 font-semibold text-gray-50">
                Total
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="print-table-body">
            {list.map((post, index) => (
              <tr 
                key={index}
                className="hover:bg-gray-50 transition-colors duration-200 border-b border-gray-900"
              >
                <td className="p-4 border-r border-gray-200">
                  <div className="space-y-1">
                    <Typography variant="body2" className="font-medium text-gray-900">
                      {post.ref}
                    </Typography>
                    <Typography variant="body2" className="text-gray-500">
                      {post.categorie_libelle}
                    </Typography>
                  </div>
                </td>
                <td className="text-right p-4 border-r border-gray-200">
                  {post.qte}
                </td>
                <td className="text-right p-4 border-r border-gray-200">
                  {formatNumberWithSpaces(post.pu)} F
                </td>
                <td className="text-right p-4 font-medium">
                  {formatNumberWithSpaces(post.prix_total)} F
                </td>
              </tr>
            ))}

            {/* Summary Rows */}
            <tr className="border-b border-gray-900">
              <td rowSpan={4} className="border-r border-gray-200"></td>
              <td 
                colSpan={2} 
                className="text-right p-4 text-gray-600 font-semibold border-r border-gray-200"
              >
                Sous-total
              </td>
              <td className="text-right p-4 font-semibold text-gray-900">
                {formatNumberWithSpaces(total)} F
              </td>
            </tr>

            <tr className="border-b border-gray-900">
              <td 
                colSpan={2} 
                className="text-right p-4 text-gray-600 font-semibold border-r border-gray-200"
              >
                Remise
              </td>
              <td className="text-right p-4 font-semibold text-red-600">
                - {formatNumberWithSpaces(total - discountedTotal)} F
              </td>
            </tr>

            {(total - payerTotal) > 0 && (
              <tr className="border-b border-gray-900">
                <td 
                  colSpan={2} 
                  className="text-right p-4 text-gray-600 font-semibold border-r border-gray-200"
                >
                  Montant Payé
                </td>
                <td className="text-right p-4 font-semibold text-green-600">
                  {formatNumberWithSpaces(total - payerTotal)} F
                </td>
              </tr>
            )}

            <tr className="border-t-2 border-gray-900 bg-gray-300">
              <td 
                colSpan={2} 
                className="text-right p-4 text-gray-900 font-semibold border-r border-gray-200"
              >
                {(total - payerTotal) > 0 ? "Reste à Payer" : "Total à Payer"}
              </td>
              <td className="text-right p-4 font-bold text-lg text-gray-900">
                {formatNumberWithSpaces(resteAPayer)} F
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableFact;
