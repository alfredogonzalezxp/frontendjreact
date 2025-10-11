import { useState } from 'react';
import * as api from '../api';

interface PlanFormProps {
  onPlanCreated: () => Promise<void>;
}

const PlanForm = ({ onPlanCreated }: PlanFormProps) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [billingCycle, setBillingCycle] = useState<api.BillingCycle>('MONTHLY');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = parseFloat(price);
    if (!name || isNaN(numericPrice) || numericPrice <= 0) return;
    
    await api.createPlan({ name, price: numericPrice, billingCycle });
    await onPlanCreated(); // Llama a la función para recargar los datos

    setName('');
    setPrice('');
    setBillingCycle('MONTHLY');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
      <h2 className="text-xl font-semibold mb-4 text-slate-900">Crear Nuevo Plan</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre del Plan" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" required />
        <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Precio" step="0.01" min="0" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" required />
        <select value={billingCycle} onChange={e => setBillingCycle(e.target.value as api.BillingCycle)} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" required>
          <option value="MONTHLY">Mensual</option>
          <option value="YEARLY">Anual</option>
        </select>
        <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-md hover:opacity-90 transition-opacity">Crear Plan</button>
      </form>
    </div>
  );
};

export default PlanForm;