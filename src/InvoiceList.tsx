import * as api from './api';

interface InvoiceListProps {
  invoices: api.Invoice[];
  onPayInvoice: (invoiceId: string) => Promise<void>;
}

const InvoiceList = ({ invoices, onPayInvoice }: InvoiceListProps) => {
  if (invoices.length === 0) {
    return <p className="text-gray-500 mt-4">No hay facturas para este cliente.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 text-left">Fecha</th>
            <th className="py-2 px-4 text-left">Monto</th>
            <th className="py-2 px-4 text-left">Estado</th>
            <th className="py-2 px-4 text-left">Acción</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(invoice => (
            <tr key={invoice.id} className="border-b">
              <td className="py-2 px-4">{new Date(invoice.dueDate).toLocaleDateString()}</td>
              <td className="py-2 px-4">${invoice.amount.toFixed(2)}</td>
              <td className="py-2 px-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${invoice.status === 'PAID' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                  {invoice.status === 'PAID' ? 'Pagada' : 'Pendiente'}
                </span>
              </td>
              <td className="py-2 px-4">
                {invoice.status === 'PENDING' && (
                  <button onClick={() => onPayInvoice(invoice.id)} className="bg-indigo-500 text-white py-1 px-3 rounded-md text-sm hover:bg-indigo-600 transition-colors">
                    Simular Pago
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceList;