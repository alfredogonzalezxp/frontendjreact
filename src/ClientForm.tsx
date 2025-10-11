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
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Registrar Cliente</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre" className="w-full p-2 border rounded-md" />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded-md" />
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors">Crear Cliente</button>
      </form>
    </div>
  );
};

export default ClientForm;