import { BarChart } from '@mui/x-charts/BarChart';

interface ChartProps {
    details: { libelle: string; somme_qte: number }[];
  }
  
  export default function Chart_2({ details }: ChartProps) {
    // Vérifiez si `details` est fourni et non vide
    if (!details || details.length === 0) {
      return <div>Aucune donnée disponible pour afficher le graphique.</div>;
    }
  
    // Mappez les données pour le graphique
    const chartData = details.map((post) => ({
      month: post.libelle || 'Inconnu', // Utilisez "Inconnu" si `libelle` est vide ou manquant
      count: post.somme_qte || 0, // Par défaut, utilisez 0 si `count` est vide ou manquant
    }));
  
    // Trier les données par `count` de manière décroissante et prendre les 15 premiers
    const topChartData = chartData
      .sort((a, b) => b.count - a.count) // Trier par `count` décroissant
      .slice(0, 20); // Prendre les 15 premiers
  
    // Extraire les données pour les axes X et Y
    const xAxisData = topChartData.map((item) => item.month); // Labels des mois
    const seriesData = topChartData.map((item) => item.count); // Valeurs associées
  
    // Rendu du graphique à barres
    return (
      <BarChart
        xAxis={[
          {
            id: 'barCategories',
            data: xAxisData,
            scaleType: 'band',
          },
        ]}
        series={[
          {
            data: seriesData,
          },
        ]}
        width={250} // Largeur du graphique
        height={250} // Hauteur du graphique
      />
    );
  }
