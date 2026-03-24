import React, { useEffect, useState } from "react";
import {
  getTransactions,
  createTransaction,
  getAllComptes,
  Transaction,
  Compte,
} from "../api/transaction";
import { getUser } from "../api/user";
import { getComptes } from "../api/compte";
import { useFetchUser } from "../usePerso/fonction.user";

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [comptes, setComptes] = useState<Compte[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const { unUser } = useFetchUser();

  const [form, setForm] = useState({
    montant: 0,
    type: "transfert",
    description: "",
    compte_source: null as number | null,
    compte_destination: null as number | null,
  });

  // Chargement initial
  useEffect(() => {
    (async () => {
      try {
        const user = await getUser();
        setUserId(user.id);
        const [transactionsData] = await Promise.all([
          getTransactions(),
          
        ]);
        setTransactions(transactionsData);
        
      } catch (err) {
        console.error("Erreur de chargement :", err);
      }
    })();
    getComptes().then(setComptes);
  }, []);

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        // Si ce n’est pas un transfert, on ignore le compte_destination
        compte_destination:
          form.type === "" ? form.compte_destination : null,
      };

      // const newTransaction = await createTransaction(payload);
      // setTransactions([newTransaction, ...transactions]);
      console.log("New ..",payload);
      alert("Transaction réussie !");
      setForm({
        montant: 0,
        type: "transfert",
        description: "",
        compte_source: null,
        compte_destination: null,
      });
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la transaction.");
    }
  };

  // Texte d'affichage selon le type
  const getTransactionLabel = (t: Transaction) => {
    const source = comptes.find((c) => c.id === t.compte_source);
    const dest = comptes.find((c) => c.id === t.compte_destination);

    const isSender = source?.utilisateur === userId;
    const isReceiver = dest?.utilisateur === userId;

    if (t.type === "transfert") {
      if (isSender) return `➡️ Transfert envoyé à ${dest?.nom || "?"}`;
      if (isReceiver) return `⬅️ Transfert reçu de ${source?.nom || "?"}`;
    }
    if (t.type === "revenu") return "💰 Revenu";
    if (t.type === "depense") return "💸 Dépense";
    return t.type;
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Transactions</h2>

      {/* --- Formulaire --- */}
      <form onSubmit={handleSubmit} className="grid gap-3 mb-6 border p-4 rounded bg-white shadow">
        {/* Type de transaction */}
        <label>Type de transaction</label>
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="border rounded p-2"
        >
          <option value="revenu">Revenu</option>
          <option value="depense">Dépense</option>
          <option value="transfert">Transfert</option>
        </select>

        {/* Compte source */}
        <label>Compte source (vous)</label>
        <select
          required
          value={form.compte_source ?? ""}
          onChange={(e) => setForm({ ...form, compte_source: Number(e.target.value) })}
          className="border rounded p-2"
        >
          <option value="">-- Choisir un de vos comptes --</option>
          {comptes
            .filter((c) => c.utilisateur === unUser.id)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom} (solde: {c.solde} €)
              </option>
            ))}
        </select>

        {/* Compte destination visible uniquement pour un transfert */}
        {form.type === "transfert" && (
          <>
            <label>Compte destination (autre utilisateur)</label>
            <select
              required
              value={form.compte_destination ?? ""}
              onChange={(e) => setForm({ ...form, compte_destination: Number(e.target.value) })}
              className="border rounded p-2"
            >
              <option value="">-- Choisir un compte destinataire --</option>
              {comptes
                .filter((c) => c.utilisateur !== unUser.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom} — utilisateur #{c.utilisateur}
                  </option>
                ))}
            </select>
          </>
        )}

        {/* Montant */}
        <input
          type="number"
          placeholder="Montant (€)"
          value={form.montant}
          onChange={(e) => setForm({ ...form, montant: Number(e.target.value) })}
          className="border rounded p-2"
          required
        />

        {/* Description */}
        <textarea
          placeholder="Description ou motif"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border rounded p-2"
        />

        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Valider
        </button>
      </form>

      {/* --- Historique --- */}
      <h3 className="text-lg font-semibold mt-4">Historique des Transactions</h3>
      <ul className="mt-3">
        {transactions.map((t) => {
          const label = getTransactionLabel(t);
          const isSender =
            comptes.find((c) => c.id === t.compte_source)?.utilisateur === userId;
          return (
            <li
              key={t.id}
              className={`border p-3 rounded mb-2 ${
                isSender ? "bg-red-50" : "bg-green-50"
              }`}
            >
              <div className="font-semibold">{label}</div>
              <div>Montant : {t.montant} €</div>
              {t.description && <div>Description : {t.description}</div>}
              <div className="text-sm text-gray-500">
                Date : {new Date(t.date_transaction ?? "").toLocaleString()}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Transactions;
