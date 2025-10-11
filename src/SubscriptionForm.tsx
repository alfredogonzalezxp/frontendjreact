                                import * as api from './api';

interface SubscriptionFormProps {
  plans: api.Plan[];
  selectedPlanId: string;
  onPlanChange: (planId: string) => void;
  onCreateSubscription: () => Promise<void>;
}

const SubscriptionForm = ({ plans, selectedPlanId, onPlanChange, onCreateSubscription }: SubscriptionFormProps) => {
  return (
    <div className="flex items-center space-x-4">
      <select
        value={selectedPlanId}
        onChange={e => onPlanChange(e.target.value)}
        className="flex-grow p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
        disabled={plans.length === 0}
      >
        {plans.map(plan => (
          <option key={plan.id} value={plan.id}>
            {plan.name} - ${plan.price}/{plan.billingCycle === 'MONTHLY' ? 'mes' : 'año'}
          </option>
        ))}
      </select>
      <button onClick={onCreateSubscription} className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md hover:opacity-90 transition-opacity">Suscribir</button>
    </div>
  );
};

export default SubscriptionForm;