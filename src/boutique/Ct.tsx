import { CheckIcon } from '@heroicons/react/20/solid'

// Types
interface PricingTier {
  name: string;
  id: string;
  href: string;
  priceMonthly: string;
  price?: string;
  description: string;
  features: string[];
  featured: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Trimestriel',
    id: 'tier-quarterly',
    href: '#',
    priceMonthly: '20 000 f',
    // price: '25 000 f',
    description: "Le plan parfait si vous venez de commencer avec notre produit.",
    features: [
      'Suivis des stocks',
      'Voir le nombre de vente effectuer (par mois)', 
      'Les produits les plus vendus (par mois)',
      'Gestion de facture', 
      'Suivis des dépenses', 
      'Gestion d\'historique des produits',
      'Gestion d\'archive',
    ],
    featured: false,
  },
  {
    name: 'Annuel',
    id: 'tier-yearly',
    href: '#',
    priceMonthly: '75 000 f',
    price: '80 000 f',
    description: "Le choix idéal pour profiter pleinement de notre produit toute l'année.",
    features: [
      'Suivis des stocks',
      'Voir le nombre de vente effectuer (par mois)', 
      'Les produits les plus vendus (par mois)',
      'Gestion de facture', 
      'Suivis des dépenses', 
      'Gestion d\'historique des produits',
      'Gestion d\'archive',
    ],
    featured: true,
  },
];

const PricingCard: React.FC<{ tier: PricingTier }> = ({ tier }) => (
  <div
    className={`rounded-3xl p-8 ring-1 ring-gray-900/10 ${
      tier.featured 
        ? 'relative bg-gray-900 shadow-2xl' 
        : 'bg-white/60'
    }`}
  >
    <h3
      id={tier.id}
      className={`${
        tier.featured ? 'text-indigo-400' : 'text-indigo-600'
      } text-base/7 font-semibold`}
    >
      {tier.name}
    </h3>

      {tier.price && 
        <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-700/10 line-through">
          {tier.price}
        </span>
      }

    <p className="mt-4 flex items-baseline gap-x-2">
      <span
        className={`${
          tier.featured ? 'text-white' : 'text-gray-900'
        } text-5xl font-semibold tracking-tight`}
      >
        {tier.priceMonthly}
      </span>
      <span className={`${tier.featured ? 'text-gray-400' : 'text-gray-500'} text-base`}>
        .
      </span>
    </p>

    <p className={`${tier.featured ? 'text-gray-300' : 'text-gray-600'} mt-6 text-base/7`}>
      {tier.description}
    </p>

    <ul
      role="list"
      className={`${
        tier.featured ? 'text-gray-300' : 'text-gray-600'
      } mt-8 space-y-3 text-sm/6`}
    >
      {tier.features.map((feature) => (
        <li key={feature} className="flex gap-x-3">
          <CheckIcon
            className={`${
              tier.featured ? 'text-indigo-400' : 'text-indigo-600'
            } h-6 w-5 flex-none`}
            aria-hidden="true"
          />
          {feature}
        </li>
      ))}
    </ul>

    <a
      href="https://wa.me/91154834"
      aria-describedby={tier.id}
      className={`
        mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold
        focus-visible:outline-2 focus-visible:outline-offset-2
        ${
          tier.featured
            ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500'
            : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-indigo-600'
        }
      `}
    >
      Contactez-nous !
    </a>
  </div>
);

export default function PricingSection() {
  return (
    <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      {/* Background decoration */}
      <div 
        aria-hidden="true" 
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
      >
        <div
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-base/7 font-semibold text-indigo-600">
          Gest Stocks
        </h2>
        <p className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          Pour l'abonnement de votre entreprise !
        </p>
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-gray-600">
        Choisissez un plan abordable qui contient les meilleures fonctionnalités pour engager 
        votre entreprise, fidéliser vos clients et stimuler les ventes.
      </p>

      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {pricingTiers.map((tier) => (
          <PricingCard key={tier.id} tier={tier} />
        ))}
      </div>
    </div>
  );
}
