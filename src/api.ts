import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://backendapp-1760226657062.azurewebsites.net/api', // URL de tu backend Spring Boot
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Tipos de Datos (deben coincidir con el backend) ---
export type BillingCycle = 'MONTHLY' | 'YEARLY';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELED';
export type InvoiceStatus = 'PENDING' | 'PAID';

export interface Plan { id: string; name: string; price: number; billingCycle: BillingCycle; }
export interface Client { id: string; name: string; email: string; }
export interface Subscription { id: string; clientId: string; planId: string; startDate: string; status: SubscriptionStatus; }
export interface Invoice { id: string; subscriptionId: string; clientId: string; amount: number; dueDate: string; status: InvoiceStatus; }

// --- Funciones de la API ---

// Planes
export const getPlans = () => apiClient.get<Plan[]>('/plans');
export const createPlan = (plan: Omit<Plan, 'id'>) => apiClient.post<Plan>('/plans', plan);

// Clientes
export const getClients = () => apiClient.get<Client[]>('/clients');
export const createClient = (client: Omit<Client, 'id'>) => apiClient.post<Client>('/clients', client);

// Suscripciones
export const createSubscription = (clientId: string, planId: string) => apiClient.post<Subscription>('/subscriptions', { clientId, planId });

// Facturas
export const getInvoicesByClient = (clientId: string) => apiClient.get<Invoice[]>(`/invoices/${clientId}`);
export const payInvoice = (invoiceId: string) => apiClient.post<Invoice>(`/invoices/${invoiceId}/pay`);