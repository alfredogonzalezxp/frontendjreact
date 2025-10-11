import { useState } from 'react';

interface ClientFormProps {
  onClientCreated: (name: string, email: string) => Promise<void>;
}

const ClientForm = ({ onClientCreated }: ClientFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    await onClientCreated(name, email);
    setName('');
    setEmail('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
      <h2 className="text-xl font-semibold mb-4 text-slate-900">Registrar Cliente</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
        <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold py-2 px-4 rounded-md hover:opacity-90 transition-opacity">Crear Cliente</button>
      </form>
    </div>
  );
};

export default ClientForm;