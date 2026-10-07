import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { QuarryProvider, useQuarry } from './context/QuarryContext';
import { GoogleAuthScreen } from './components/auth/GoogleAuthScreen';
import { Header } from './components/common/Header';
import { Sidebar, NavTab } from './components/common/Sidebar';
import { MobileNav } from './components/common/MobileNav';

// Modals
import { NewLoadModal } from './components/modals/NewLoadModal';
import { GatePassModal } from './components/modals/GatePassModal';
import { StatementPrintModal } from './components/modals/StatementPrintModal';
import { PaymentModal } from './components/modals/PaymentModal';
import { ExpenseModal } from './components/modals/ExpenseModal';
import { ProductionModal } from './components/modals/ProductionModal';

// Views
import { DashboardView } from './views/DashboardView';
import { QuarryManagementView } from './views/QuarryManagementView';
import { LoadManagementView } from './views/LoadManagementView';
import { GatePassView } from './views/GatePassView';
import { VehicleManagementView } from './views/VehicleManagementView';
import { DriverManagementView } from './views/DriverManagementView';
import { CustomerManagementView } from './views/CustomerManagementView';
import { CustomerAccountsView } from './views/CustomerAccountsView';
import { DriverAccountsView } from './views/DriverAccountsView';
import { VehicleAccountsView } from './views/VehicleAccountsView';
import { ProductionView } from './views/ProductionView';
import { StockView } from './views/StockView';
import { QuarryIncomeView } from './views/QuarryIncomeView';
import { QuarryExpensesView } from './views/QuarryExpensesView';
import { StaffManagementView } from './views/StaffManagementView';
import { StaffAttendanceView } from './views/StaffAttendanceView';
import { StaffSalaryPayrollView } from './views/StaffSalaryPayrollView';
import { PaymentsCollectionsView } from './views/PaymentsCollectionsView';
import { RateMasterView } from './views/RateMasterView';
import { ReportsView } from './views/ReportsView';
import { StatementBillGeneratorView } from './views/StatementBillGeneratorView';
import { DailyAccountView } from './views/DailyAccountView';
import { SettingsView } from './views/SettingsView';

import { Customer, GatePass, LoadOrder } from './types/quarry';

const QuarryAppInner: React.FC = () => {
  const { user, isAccessRestricted } = useAuth();
  const { gatePasses, customers, loads } = useQuarry();

  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals state
  const [newLoadModalOpen, setNewLoadModalOpen] = useState(false);
  const [initialLoadData, setInitialLoadData] = useState<Partial<LoadOrder> | undefined>(undefined);

  const [gatePassModalOpen, setGatePassModalOpen] = useState(false);
  const [selectedGatePass, setSelectedGatePass] = useState<GatePass | null>(null);

  const [statementModalOpen, setStatementModalOpen] = useState(false);
  const [statementCustomer, setStatementCustomer] = useState<Customer | null>(null);
  const [statementDateRange, setStatementDateRange] = useState({ from: '', to: '' });
  const [statementOptions, setStatementOptions] = useState<{
    vehicleNumber?: string;
    driverName?: string;
    materialFilter?: string;
  }>({});

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [defaultPaymentCustomerId, setDefaultPaymentCustomerId] = useState<string | undefined>(undefined);

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [productionModalOpen, setProductionModalOpen] = useState(false);

  // If not verified or access is restricted, show Google verification screen
  if (!user || isAccessRestricted) {
    return <GoogleAuthScreen />;
  }

  // Handlers
  const handleOpenNewLoad = (initialData?: Partial<LoadOrder>) => {
    setInitialLoadData(initialData);
    setNewLoadModalOpen(true);
  };

  const handleOpenGatePassModal = (gp: GatePass) => {
    setSelectedGatePass(gp);
    setGatePassModalOpen(true);
  };

  const handleViewGatePassByNumber = (gpNumber: string) => {
    const gp = gatePasses.find((g) => g.gatePassNumber === gpNumber);
    if (gp) {
      setSelectedGatePass(gp);
      setGatePassModalOpen(true);
    } else {
      alert(`Gate Pass ${gpNumber} not found.`);
    }
  };

  const handleOpenStatementModal = (
    customer: Customer,
    dateRange: { from: string; to: string },
    options?: { vehicleNumber?: string; driverName?: string; materialFilter?: string }
  ) => {
    setStatementCustomer(customer);
    setStatementDateRange(dateRange);
    setStatementOptions(options || {});
    setStatementModalOpen(true);
  };

  const handleOpenPaymentModal = (customerId?: string) => {
    setDefaultPaymentCustomerId(customerId);
    setPaymentModalOpen(true);
  };

  const handleNavigateToCustomerLedger = (customerId: string) => {
    setCurrentTab('customer_accounts');
  };

  return (
    <div className="min-h-screen bg-[#090a0d] text-[#e5e7eb] flex flex-col antialiased">
      {/* Top Header */}
      <Header
        onOpenNewLoad={() => handleOpenNewLoad()}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      <div className="flex flex-1">
        {/* Sidebar for Desktop & Drawer for Mobile */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-72 p-3 sm:p-6 pb-20 lg:pb-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenNewLoad={() => handleOpenNewLoad()}
              onOpenGatePass={() => setCurrentTab('gate_pass')}
              onOpenPayment={() => handleOpenPaymentModal()}
              onOpenExpense={() => setExpenseModalOpen(true)}
              onOpenProduction={() => setProductionModalOpen(true)}
            />
          )}

          {currentTab === 'quarry_mgmt' && <QuarryManagementView />}

          {currentTab === 'loads' && (
            <LoadManagementView
              onOpenNewLoad={handleOpenNewLoad}
              onViewGatePass={handleViewGatePassByNumber}
            />
          )}

          {currentTab === 'gate_pass' && (
            <GatePassView
              onSelectGatePass={handleOpenGatePassModal}
              onOpenNewLoad={() => handleOpenNewLoad()}
            />
          )}

          {currentTab === 'vehicles' && <VehicleManagementView />}

          {currentTab === 'drivers' && <DriverManagementView />}

          {currentTab === 'customers' && (
            <CustomerManagementView
              onViewCustomerLedger={handleNavigateToCustomerLedger}
            />
          )}

          {currentTab === 'customer_accounts' && (
            <CustomerAccountsView
              onOpenStatementModal={handleOpenStatementModal}
              onOpenPaymentModal={handleOpenPaymentModal}
            />
          )}

          {currentTab === 'driver_accounts' && <DriverAccountsView />}

          {currentTab === 'vehicle_accounts' && <VehicleAccountsView />}

          {currentTab === 'production' && (
            <ProductionView onOpenProductionModal={() => setProductionModalOpen(true)} />
          )}

          {currentTab === 'stock' && <StockView />}

          {currentTab === 'income' && <QuarryIncomeView />}

          {currentTab === 'expenses' && (
            <QuarryExpensesView onOpenExpenseModal={() => setExpenseModalOpen(true)} />
          )}

          {currentTab === 'staff' && <StaffManagementView />}

          {currentTab === 'attendance' && <StaffAttendanceView />}

          {currentTab === 'salary' && <StaffSalaryPayrollView />}

          {currentTab === 'payments' && (
            <PaymentsCollectionsView onOpenPaymentModal={() => handleOpenPaymentModal()} />
          )}

          {currentTab === 'rates' && <RateMasterView />}

          {currentTab === 'reports' && <ReportsView />}

          {currentTab === 'bill_generator' && (
            <StatementBillGeneratorView onOpenStatementModal={handleOpenStatementModal} />
          )}

          {currentTab === 'daily_account' && <DailyAccountView />}

          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Bottom Quick Navigation */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenSidebar={() => setSidebarOpen(true)}
        onOpenNewLoad={() => handleOpenNewLoad()}
      />

      {/* Global Modals */}
      <NewLoadModal
        isOpen={newLoadModalOpen}
        onClose={() => setNewLoadModalOpen(false)}
        initialData={initialLoadData}
      />

      <GatePassModal
        isOpen={gatePassModalOpen}
        onClose={() => setGatePassModalOpen(false)}
        gatePass={selectedGatePass}
      />

      <StatementPrintModal
        isOpen={statementModalOpen}
        onClose={() => setStatementModalOpen(false)}
        customer={statementCustomer}
        loads={loads}
        dateRange={statementDateRange}
        vehicleNumber={statementOptions.vehicleNumber}
        driverName={statementOptions.driverName}
        materialFilter={statementOptions.materialFilter}
      />

      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        defaultCustomerId={defaultPaymentCustomerId}
      />

      <ExpenseModal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
      />

      <ProductionModal
        isOpen={productionModalOpen}
        onClose={() => setProductionModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <QuarryProvider>
        <QuarryAppInner />
      </QuarryProvider>
    </AuthProvider>
  );
}
