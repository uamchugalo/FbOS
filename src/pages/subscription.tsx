import React from 'react';
import { SubscriptionButton } from '../components/SubscriptionButton';

const SubscriptionPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Plano Premium
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="ml-3 text-gray-700">Acesso ilimitado ao chat</span>
            </div>
            
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="ml-3 text-gray-700">Suporte prioritário</span>
            </div>
            
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="ml-3 text-gray-700">Recursos exclusivos</span>
            </div>
          </div>

          <div className="mt-8">
            <div className="text-center mb-4">
              <span className="text-4xl font-bold">R$29,90</span>
              <span className="text-gray-600">/mês</span>
            </div>
            
            <SubscriptionButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
