import React, { useState, useEffect } from 'react';
import { User, Generation } from './types';
import { Storage } from './lib/storage';
import { AgeVerificationModal } from './components/AgeVerificationModal';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { DashboardLayout } from './components/DashboardLayout';
import { ImageStudio } from './components/ImageStudio';
import { VideoStudio } from './components/VideoStudio';
import { ChatStudio } from './components/ChatStudio';
import { HistoryView } from './components/HistoryView';
import { BillingView } from './components/BillingView';
import { SettingsView } from './components/SettingsView';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ReportModal } from './components/ReportModal';
import { ComplianceModal } from './components/ComplianceModal';

export default function App() {
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<string>('landing');
  const [user, setUser] = useState<User>(Storage.getUser());
  const [generations, setGenerations] = useState<Generation[]>(Storage.getGenerations());
  const [initialStudioPrompt, setInitialStudioPrompt] = useState<string>('');

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isComplianceOpen, setIsComplianceOpen] = useState(false);
  const [complianceTab, setComplianceTab] = useState('2257');
  const [reportGenId, setReportGenId] = useState<string | null>(null);

  // Check age verification on initial mount
  useEffect(() => {
    const verified = Storage.isAgeVerified();
    setIsAgeVerified(verified);
  }, []);

  const handleVerified = () => {
    setIsAgeVerified(true);
    setUser(Storage.getUser());
  };

  const handleResetAgeGate = () => {
    Storage.setAgeVerified(false);
    setIsAgeVerified(false);
  };

  const handleStartGenerating = (prompt?: string) => {
    if (prompt) {
      setInitialStudioPrompt(prompt);
    }
    setCurrentView('image');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerationComplete = (newGen: Generation) => {
    setGenerations(Storage.getGenerations());
    setUser(Storage.getUser());
  };

  const handleRegenerateFromHistory = (prompt: string, type: 'image' | 'video') => {
    setInitialStudioPrompt(prompt);
    setCurrentView(type === 'video' ? 'video' : 'image');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteGeneration = (id: string) => {
    Storage.deleteGeneration(id);
    setGenerations(Storage.getGenerations());
  };

  const handleOpenCompliance = (tab: string = '2257') => {
    setComplianceTab(tab);
    setIsComplianceOpen(true);
  };

  const handleUserUpdated = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleAccountDeleted = () => {
    setUser(Storage.getUser());
    setGenerations(Storage.getGenerations());
    setIsAgeVerified(false);
    setCurrentView('landing');
  };

  const handleAdminLoginSuccess = (adminUser: User) => {
    setUser(adminUser);
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-[#ECEEF4] flex flex-col selection:bg-rose-500/30 selection:text-rose-200">
      {/* 1. Age Verification Gate (Blocks entire app if not verified) */}
      <AgeVerificationModal
        isOpen={!isAgeVerified}
        onVerified={handleVerified}
      />

      {/* Main Application Shell (Rendered once age is verified) */}
      <div className={!isAgeVerified ? 'filter blur-sm pointer-events-none select-none' : 'flex flex-col min-h-screen'}>
        {/* Navigation Bar */}
        <Navbar
          currentView={currentView}
          onNavigate={(view) => {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          user={user}
          onOpenBilling={() => setCurrentView('pricing')}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
          onOpenCompliance={() => handleOpenCompliance('2257')}
          isAuthenticated={true}
        />

        {/* View Router */}
        <main className="flex-1">
          {currentView === 'landing' ? (
            <LandingPage
              onStartGenerating={handleStartGenerating}
              onOpenPricing={() => {
                setCurrentView('pricing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenCompliance={() => handleOpenCompliance('2257')}
            />
          ) : (
            <DashboardLayout
              currentView={currentView}
              onNavigate={(view) => {
                setCurrentView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              user={user}
              onOpenCompliance={() => handleOpenCompliance('2257')}
              onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
            >
              {currentView === 'image' && (
                <ImageStudio
                  user={user}
                  initialPrompt={initialStudioPrompt}
                  onOpenBilling={() => setCurrentView('pricing')}
                  onOpenReport={(id) => setReportGenId(id)}
                  onGenerationComplete={handleGenerationComplete}
                />
              )}

              {currentView === 'video' && (
                <VideoStudio
                  user={user}
                  onOpenBilling={() => setCurrentView('pricing')}
                  onOpenReport={(id) => setReportGenId(id)}
                  onGenerationComplete={handleGenerationComplete}
                />
              )}

              {currentView === 'chat' && (
                <ChatStudio
                  user={user}
                  onOpenBilling={() => setCurrentView('pricing')}
                  onOpenReport={(id) => setReportGenId(id)}
                />
              )}

              {currentView === 'history' && (
                <HistoryView
                  generations={generations}
                  onRegenerate={handleRegenerateFromHistory}
                  onOpenReport={(id) => setReportGenId(id)}
                  onDelete={handleDeleteGeneration}
                />
              )}

              {currentView === 'pricing' && (
                <BillingView
                  user={user}
                  onUserUpdated={handleUserUpdated}
                />
              )}

              {currentView === 'settings' && (
                <SettingsView
                  user={user}
                  onUserUpdated={handleUserUpdated}
                  onAccountDeleted={handleAccountDeleted}
                />
              )}

              {currentView === 'admin' && (
                <AdminPanel
                  currentUser={user}
                  onNavigate={(view) => {
                    setCurrentView(view);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
                />
              )}
            </DashboardLayout>
          )}
        </main>

        {/* Footer */}
        <Footer
          onOpenCompliance={handleOpenCompliance}
          onResetAgeGate={handleResetAgeGate}
        />
      </div>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(updated) => setUser(updated)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleAdminLoginSuccess}
        currentUser={user}
      />

      <ReportModal
        isOpen={!!reportGenId}
        generationId={reportGenId}
        onClose={() => setReportGenId(null)}
      />

      <ComplianceModal
        isOpen={isComplianceOpen}
        defaultTab={complianceTab}
        onClose={() => setIsComplianceOpen(false)}
      />
    </div>
  );
}
