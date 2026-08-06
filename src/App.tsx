import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LocalizationProvider } from './context/LocalizationContext';
import { ThemeProvider } from './context/ThemeContext';

// Auth Components
import { Splash } from './components/auth/Splash';
import { Onboarding } from './components/auth/Onboarding';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';

// Layout Components
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { EmergencyBanner } from './components/layout/EmergencyBanner';

// Main Views
import { HomeDashboard } from './components/home/HomeDashboard';
import { LiveMonitoring } from './components/monitoring/LiveMonitoring';
import { VitalDetailGraph } from './components/monitoring/VitalDetailGraph';
import { VideoPlayerDetail } from './components/monitoring/VideoPlayerDetail';
import { AlertsList } from './components/alerts/AlertsList';
import { CriticalAlertDetail } from './components/alerts/CriticalAlertDetail';
import { AIRiskInsights } from './components/insights/AIRiskInsights';
import { ReportBuilder } from './components/insights/ReportBuilder';
import { MedicationSchedule } from './components/care/MedicationSchedule';
import { AdultAccessManagement } from './components/settings/AdultAccessManagement';
import { ProfileSettings } from './components/settings/ProfileSettings';
import { AddChildModal } from './components/child/AddChildModal';

// Modals
import { ChildSwitcherModal } from './components/home/ChildSwitcherModal';
import { AddCareNoteModal } from './components/care/AddCareNoteModal';
import { ResolveAlertModal } from './components/alerts/ResolveAlertModal';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, activeTab, selectedDetailView } = useApp();

  const [showSplash, setShowSplash] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');

  // 1. Splash Screen
  if (showSplash) {
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  // 2. Unauthenticated Flow
  if (!isAuthenticated) {
    if (!hasSeenOnboarding) {
      return <Onboarding onComplete={() => setHasSeenOnboarding(true)} />;
    }

    if (authScreen === 'login') {
      return <Login onNavigateToRegister={() => setAuthScreen('register')} />;
    }

    return <Register onNavigateToLogin={() => setAuthScreen('login')} />;
  }

  // 3. Authenticated App Flow
  const renderMainContent = () => {
    // Detail views override tabs
    if (selectedDetailView === 'heart_rate') {
      return <VitalDetailGraph />;
    }
    if (selectedDetailView === 'camera_feed') {
      return <VideoPlayerDetail />;
    }
    if (selectedDetailView === 'critical_alert') {
      return <CriticalAlertDetail />;
    }
    if (selectedDetailView === 'care_notes') {
      return <MedicationSchedule />;
    }
    if (selectedDetailView === 'report_builder') {
      return <ReportBuilder />;
    }
    if (selectedDetailView === 'access_mgmt') {
      return <AdultAccessManagement />;
    }
    if (selectedDetailView === 'add_child') {
      return <AddChildModal />;
    }

    // Active Tabs
    switch (activeTab) {
      case 'home':
        return <HomeDashboard />;
      case 'live':
        return <LiveMonitoring />;
      case 'alerts':
        return <AlertsList />;
      case 'insights':
        return <AIRiskInsights />;
      case 'profile':
        return <ProfileSettings />;
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F9] dark:bg-[#0D1513] text-gray-900 dark:text-gray-100 flex flex-col font-sans selection:bg-[#006A53] selection:text-white">
      <Header />
      <EmergencyBanner />

      <main className="flex-1 w-full max-w-md mx-auto relative">
        {renderMainContent()}
      </main>

      <BottomNav />

      {/* Global Modals */}
      <ChildSwitcherModal />
      <AddCareNoteModal />
      <ResolveAlertModal />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <LocalizationProvider>
        <AppProvider>
          <MainAppContent />
        </AppProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
