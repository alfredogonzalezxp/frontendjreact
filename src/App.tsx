import { useState, useEffect, useCallback } from 'react';
import * as api from './api';
import type { AxiosResponse } from 'axios';
import ClientList from './ClientList';
import ClientForm from './ClientForm';
import SubscriptionForm from './SubscriptionForm';
import InvoiceList from './InvoiceList';
import PlanForm from './components/PlanForm';

function App() {
  const [clients, setClients] = useState<api.Client[]>([]);
  const [plans, setPlans] = useState<api.Plan[]>([]);
  const [invoices, setInvoices] = useState<api.Invoice[]>([]);
  const [selectedClient, setSelectedClient] = useState<api.Client | null>(null);
  
  const [selectedPlanId, setSelectedPlanId] = useState('');

  // Estados para feedback al usuario
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      
      const [clientsRes, plansRes] = await Promise.all([api.getClients(), api.getPlans()]);
      setClients(clientsRes.data);
      setPlans(plansRes.data);
      if (plansRes.data.length > 0) {
        setSelectedPlanId(plansRes.data[0].id);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
      setError("No se pudo cargar la información inicial. ¿El backend está funcionando?");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (selectedClient) {
      // Mostrar un indicador de carga para las facturas
      setInvoices([]);
      api.getInvoicesByClient(selectedClient.id)
        .then((res: AxiosResponse<api.Invoice[]>) => setInvoices(res.data))
        .catch((err: unknown) => {
          // It's safer to handle 'unknown' by checking its type before using it.
          if (err instanceof Error) {
            console.error("Error fetching invoices:", err.message);
          } else {
            console.error("An unknown error occurred while fetching invoices:", err);
          }
          setError(`Error al cargar las facturas de ${selectedClient.name}.`);
        });
    } else {
      setInvoices([]);
    }
  }, [selectedClient]);

  const handleCreateClient = async (name: string, email: string) => {
    if (!name || !email) return;
    try {
      const newClientRes = await api.createClient({ name, email });
      setSelectedClient(newClientRes.data); // Seleccionar el nuevo cliente automáticamente
      fetchData(); // Recargar clientes
    } catch (error) {
      console.error("Error creating client:", error);
      setError("Error al crear el cliente. Inténtalo de nuevo.");
    }
  };

  const handleCreateSubscription = async () => {
    if (!selectedClient || !selectedPlanId) return;
    try {
      await api.createSubscription(selectedClient.id, selectedPlanId);
      // Recargar facturas del cliente seleccionado
      const res = await api.getInvoicesByClient(selectedClient.id);
      setInvoices(res.data);
    } catch (error) {
      console.error("Error creating subscription:", error);
      setError("Error al crear la suscripción. Verifica que el plan y cliente sean válidos.");
    }
  };

  const handlePayInvoice = async (invoiceId: string) => {
    if (!selectedClient) return;
    try {
      await api.payInvoice(invoiceId);
      // Recargar facturas
      const res = await api.getInvoicesByClient(selectedClient.id);
      setInvoices(res.data);
    } catch (error) {
      console.error("Error paying invoice:", error);
      setError("Error al procesar el pago.");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-10 border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text--2xl font-bold text-slate-900">Panel de Suscripciones</h1>
        </div>
      </header>

      {/* Mensajes de Carga y Error */}
      {isLoading && <p className="text-center py-4 text-indigo-600 font-semibold">Cargando datos...</p>}
      {error && <div className="container mx-auto mt-4 p-4 bg-red-200 text-red-800 rounded-md text-center">
          <p>{error}</p>
          <button onClick={() => setError(null)} className="mt-2 text-sm font-bold">Cerrar</button>
        </div>}

      <main className="container mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Clientes y Acciones */}
        <div className="lg:col-span-1 space-y-6">
          {/* Lista de Clientes */}
          <ClientList clients={clients} selectedClient={selectedClient} onSelectClient={setSelectedClient} />

          {/* Crear Nuevo Cliente */}
          <ClientForm onClientCreated={handleCreateClient} />

          {/* Crear Nuevo Plan */}
          <PlanForm onPlanCreated={fetchData} />
        </div>

        {/* Columna Derecha: Detalles y Facturas */}
        <div className="lg:col-span-2 space-y-6">
          {selectedClient ? (
            <>
              {/* Crear Suscripción */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Nueva Suscripción para {selectedClient.name}</h2>
                <SubscriptionForm
                  plans={plans}
                  selectedPlanId={selectedPlanId}
                  onPlanChange={setSelectedPlanId}
                  onCreateSubscription={handleCreateSubscription}
                />
              </div>

              {/* Lista de Facturas */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Facturas de {selectedClient.name}</h2>
                <InvoiceList invoices={invoices} onPayInvoice={handlePayInvoice} />
              </div>
            </>
          ) : (
            <div className="bg-white p-10 rounded-lg shadow-lg text-center border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-700">Selecciona un cliente para ver sus detalles</h2>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;