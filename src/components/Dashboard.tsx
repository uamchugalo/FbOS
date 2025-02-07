import React, { useState } from 'react';
import { ServiceOrderForm } from './ServiceOrderForm';
import { MaterialsManagement } from './MaterialsManagement';
import { AccountingDashboard } from './AccountingDashboard';
import { CompanyInfo } from './CompanyInfo';
import { ServiceOrderList } from './ServiceOrderList';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Wrench, ClipboardList, Calculator, Settings, List, Building2, LogOut } from 'lucide-react';

export function Dashboard() {
  const [currentTab, setCurrentTab] = useState('orders');
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'orders':
        return <ServiceOrderForm />;
      case 'order-list':
        return <ServiceOrderList />;
      case 'materials':
        return <MaterialsManagement />;
      case 'accounting':
        return <AccountingDashboard />;
      case 'company':
        return <CompanyInfo />;
      default:
        return <ServiceOrderForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Desktop Navigation */}
      <nav className="bg-white shadow-sm hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Wrench className="h-8 w-8 text-blue-500" />
                <span className="ml-2 text-xl font-bold text-gray-900">Sistema OS</span>
              </div>
              <div className="ml-6 flex space-x-8">
                <button
                  onClick={() => setCurrentTab('orders')}
                  className={`${
                    currentTab === 'orders'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  <ClipboardList className="h-5 w-5 mr-1" />
                  Nova OS
                </button>
                <button
                  onClick={() => setCurrentTab('order-list')}
                  className={`${
                    currentTab === 'order-list'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  <List className="h-5 w-5 mr-1" />
                  Lista de OS
                </button>
                <button
                  onClick={() => setCurrentTab('materials')}
                  className={`${
                    currentTab === 'materials'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  <Settings className="h-5 w-5 mr-1" />
                  Materiais e Serviços
                </button>
                <button
                  onClick={() => setCurrentTab('accounting')}
                  className={`${
                    currentTab === 'accounting'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  <Calculator className="h-5 w-5 mr-1" />
                  Financeiro
                </button>
                <button
                  onClick={() => setCurrentTab('company')}
                  className={`${
                    currentTab === 'company'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  <Building2 className="h-5 w-5 mr-1" />
                  Empresa
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4 mr-1.5" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="sm:hidden bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Wrench className="h-6 w-6 text-blue-500" />
            <span className="ml-2 text-lg font-bold text-gray-900">Sistema OS</span>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="inline-flex items-center p-1.5 text-gray-700"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-8 mb-16 sm:mb-8 mt-14 sm:mt-0">
        {renderContent()}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-5 h-[4.5rem] px-1">
          <button
            onClick={() => setCurrentTab('orders')}
            className={`flex flex-col items-center justify-center py-1 ${
              currentTab === 'orders' ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            <ClipboardList className="h-5 w-5" />
            <span className="text-[0.65rem] mt-0.5 leading-tight">Nova OS</span>
          </button>
          <button
            onClick={() => setCurrentTab('order-list')}
            className={`flex flex-col items-center justify-center py-1 ${
              currentTab === 'order-list' ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            <List className="h-5 w-5" />
            <span className="text-[0.65rem] mt-0.5 leading-tight">Lista OS</span>
          </button>
          <button
            onClick={() => setCurrentTab('materials')}
            className={`flex flex-col items-center justify-center py-1 ${
              currentTab === 'materials' ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            <Settings className="h-5 w-5" />
            <span className="text-[0.65rem] mt-0.5 leading-tight">Materiais e Serviços</span>
          </button>
          <button
            onClick={() => setCurrentTab('accounting')}
            className={`flex flex-col items-center justify-center py-1 ${
              currentTab === 'accounting' ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            <Calculator className="h-5 w-5" />
            <span className="text-[0.65rem] mt-0.5 leading-tight">Financeiro</span>
          </button>
          <button
            onClick={() => setCurrentTab('company')}
            className={`flex flex-col items-center justify-center py-1 ${
              currentTab === 'company' ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            <Building2 className="h-5 w-5" />
            <span className="text-[0.65rem] mt-0.5 leading-tight">Empresa</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
