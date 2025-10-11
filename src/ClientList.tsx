import * as api from './api';

interface ClientListProps {
  clients: api.Client[];
  selectedClient: api.Client | null;
  onSelectClient: (client: api.Client) => void;
}

const ClientList = ({ clients, selectedClient, onSelectClient }: ClientListProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
      <h2 className="text-xl font-semibold mb-4 text-slate-900">Clientes</h2>
      <ul className="space-y-2">
        {clients.map(client => (
          <li key={client.id}
              onClick={() => onSelectClient(client)}              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-md ${selectedClient?.id === client.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 hover:bg-indigo-100'}`}>
            <p className="font-semibold text-slate-800">{client.name}</p>
            <p className="text-sm">{client.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientList;