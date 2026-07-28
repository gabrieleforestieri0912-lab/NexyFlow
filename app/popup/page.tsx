/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { 
  Sparkles, LogOut, User as UserIcon, Zap, 
  BarChart3, Heart, MessageCircle, Save, 
  Crown, TrendingUp, Info, Users, Target, CheckCircle
} from 'lucide-react';
import { Skeleton } from '@/components/Skeleton';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/context/ToastContext';

interface AnalysisData {
  username: string;
  followers: string;
  engagementRate: string;
  sentiment: string;
  trending: boolean;
  lastPostImpact: string;
}

type ActiveTab = 'analysis' | 'strategy';

const Popup = () => {
  const { user, googleLogin, logout } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<ActiveTab>('analysis');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('');

  useEffect(() => {
    setCurrentUrl('instagram.com/cristiano');
  }, []);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setAnalysisData(null);
    
    setTimeout(() => {
      setAnalysisData({
        username: '@cristiano',
        followers: '624M',
        engagementRate: '1.2%',
        sentiment: t('popup.sentimentPositive'),
        trending: true,
        lastPostImpact: t('popup.impactHigh')
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="w-[380px] min-h-[550px] bg-white text-gray-900 p-0 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f09433] to-[#dc2743] flex items-center justify-center shadow-md">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-normal text-lg tracking-tight">NextBrand <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded ml-1 text-gray-500 uppercase font-normal">AI</span></span>
        </div>
        <div className="flex items-center gap-2">
          {user && (
            <button onClick={logout} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {!user ? (
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f09433] to-[#dc2743] blur-2xl opacity-20 animate-pulse" />
            <div className="relative w-20 h-20 bg-white rounded-[2rem] shadow-xl flex items-center justify-center border border-gray-50">
              <Sparkles className="w-10 h-10 text-[#dc2743]" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-normal text-gray-900 mb-2">{t('popup.signupTitle')}</h2>
            <p className="text-gray-500 text-sm leading-relaxed px-4">
              {t('popup.signupDesc')}
            </p>
          </div>
          <div className="w-full pt-4">
            <GoogleLogin
              onSuccess={async (res) => {
                try {
                  await googleLogin(res.credential);
                  showToast('Accesso effettuato con successo!', 'success');
                } catch (error: any) {
                  showToast('Errore durante l\'accesso con Google', 'error');
                }
              }}
              onError={() => {
                showToast('Errore durante l\'accesso con Google', 'error');
              }}
              use_fedcm_for_prompt={false}
              theme="filled_blue"
              shape="pill"
              width="316px"
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="flex p-1 bg-gray-100 m-4 rounded-2xl">
            <button 
              onClick={() => setActiveTab('analysis')}
              className={`flex-1 py-2 text-xs font-normal rounded-xl transition-all ${activeTab === 'analysis' ? 'bg-white text-black shadow-sm' : 'text-gray-500'}`}
            >
              {t('popup.analysisTab')}
            </button>
            <button 
              onClick={() => setActiveTab('strategy')}
              className={`flex-1 py-2 text-xs font-normal rounded-xl transition-all ${activeTab === 'strategy' ? 'bg-white text-black shadow-sm' : 'text-gray-500'}`}
            >
              {t('popup.strategyTab')}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 custom-scrollbar pb-4">
            {activeTab === 'analysis' ? (
              <div className="space-y-4">
                {/* Profile Card */}
                <div className="bg-gray-900 rounded-[2rem] p-6 text-white relative overflow-hidden group shadow-xl">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full group-hover:scale-110 transition-transform duration-700" />
                  <div className="relative z-10">
                    <p className="text-[10px] font-normal text-gray-400 uppercase tracking-widest mb-1">{t('popup.profileDetected')}</p>
                    <h3 className="text-xl font-normal mb-6 truncate">{currentUrl}</h3>
                    
                    {!analysisData && !isAnalyzing ? (
                      <button 
                        onClick={handleAnalyze}
                        className="w-full py-4 bg-white text-black rounded-2xl font-normal flex items-center justify-center gap-2 hover:bg-gray-100 transition-all active:scale-95 shadow-lg"
                      >
                        <Zap className="w-5 h-5 fill-black" />
                        {t('popup.analyzeButton')}
                      </button>
                    ) : isAnalyzing ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 animate-pulse">
                          <div className="w-2 h-2 bg-[#f09433] rounded-full animate-bounce" />
                          <p className="text-sm font-normal text-gray-300">{t('popup.analyzing')}</p>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#f09433] to-[#dc2743] w-1/2 animate-[progress_2s_ease-in-out_infinite]" />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                          <div className="flex items-center gap-2 text-gray-400 text-[10px] font-normal uppercase mb-1">
                            <TrendingUp className="w-3 h-3" /> {t('popup.engagement')}
                          </div>
                          <p className="text-xl font-normal">{analysisData.engagementRate}</p>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                          <div className="flex items-center gap-2 text-gray-400 text-[10px] font-normal uppercase mb-1">
                            <MessageCircle className="w-3 h-3" /> {t('popup.sentiment')}
                          </div>
                          <p className="text-xl font-normal text-green-400">{analysisData.sentiment}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Insights Section */}
                <div className="bg-amber-50 rounded-[2rem] p-6 border border-amber-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <h4 className="font-normal text-amber-900 text-sm">{t('popup.insights')}</h4>
                    </div>
                  </div>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    {t('popup.insightText')}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Competitor Analysis Card */}
                <div className="bg-indigo-50 rounded-[2rem] p-6 border border-indigo-100">
                  <h4 className="font-normal text-indigo-900 text-sm mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4" /> {t('popup.competitorTitle')}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs bg-white/50 p-3 rounded-xl">
                      <span className="text-gray-500">{t('popup.vsIndustryAvg')}</span>
                      <span className="font-normal text-green-600">+12.4%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs bg-white/50 p-3 rounded-xl">
                      <span className="text-gray-500">{t('popup.estimatedGrowth')}</span>
                      <span className="font-normal text-indigo-600">{t('popup.growthHigh')}</span>
                    </div>
                  </div>
                </div>

                {/* Goals Card */}
                <div className="bg-purple-50 rounded-[2rem] p-6 border border-purple-100">
                  <h4 className="font-normal text-purple-900 text-sm mb-4 flex items-center gap-2">
                    <Target className="w-4 h-4" /> {t('popup.aiGoals')}
                  </h4>
                  <div className="relative pl-6 space-y-4">
                    <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-purple-200" />
                    {[
                      { t: t('popup.goal1'), s: 'done' },
                      { t: t('popup.goal2'), s: 'pending' },
                      { t: t('popup.goal3'), s: 'pending' }
                    ].map((g, i) => (
                      <div key={i} className="relative text-xs flex items-center justify-between">
                        <div className={`absolute -left-[21px] w-2 h-2 rounded-full ${g.s === 'done' ? 'bg-purple-600' : 'bg-gray-300'}`} />
                        <span className={g.s === 'done' ? 'line-through text-gray-400' : 'text-purple-900'}>{g.t}</span>
                        {g.s === 'done' && <CheckCircle className="w-3 h-3 text-purple-600" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Navigation */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 rounded-2xl text-xs font-normal text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
                <Save className="w-3 h-3" /> {t('common.save')}
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-900 text-white rounded-2xl text-xs font-normal hover:bg-black transition-all shadow-lg">
                <BarChart3 className="w-3 h-3" /> {t('common.dashboard')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[10px] font-normal text-gray-400 uppercase tracking-widest">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          {t('popup.aiActive')}
        </div>
        <span>v1.2.0-PRO</span>
      </div>
      
      <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default Popup;
