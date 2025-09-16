// src/Componente/admin/AdminTopbar.tsx
import React, { useState, useEffect } from "react";
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  Menu,
  Sun,
  Moon,
  Maximize,
  Activity,
  ChevronDown,
  LogOut,
  UserCircle,
  Shield,
  Zap,
  Wifi,
  Globe,
  Clock,
  Calendar,
  TrendingUp,
  Sparkles
} from "lucide-react";

interface AdminTopbarProps {
  title: string;
  onToggleSidebar?: () => void;
  sidebarCollapsed?: boolean;
}

export default function AdminTopbar({ title, onToggleSidebar, sidebarCollapsed }: AdminTopbarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(3);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showProfileMenu || showNotifications) {
        const target = event.target as Element;
        if (!target.closest('.profile-menu') && !target.closest('.notifications-menu')) {
          setShowProfileMenu(false);
          setShowNotifications(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu, showNotifications]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const notificationItems = [
    {
      id: 1,
      title: "Nouvelle commande reçue",
      message: "Commande #1234 d'un montant de 125€",
      time: "Il y a 2 min",
      type: "order",
      unread: true
    },
    {
      id: 2,
      title: "Stock faible",
      message: "iPhone 15 Pro - Plus que 3 unités",
      time: "Il y a 15 min",
      type: "warning",
      unread: true
    },
    {
      id: 3,
      title: "Nouveau client inscrit",
      message: "Marie Dupont s'est inscrite",
      time: "Il y a 1h",
      type: "user",
      unread: false
    }
  ];

  return (
    <header className={`
      transition-all duration-300 ease-in-out
      bg-gradient-to-r from-black via-gray-900 to-black
      border-b border-yellow-500/20
      sticky top-0 z-50
      shadow-2xl
      backdrop-blur-3xl
      particle-bg
    `}>
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Enhanced */}
        <div className="flex items-center space-x-6">
          <button
            onClick={onToggleSidebar}
            className="p-2.5 hover:bg-yellow-500/10 rounded-xl transition-all duration-300 group ripple hover-lift"
          >
            <Menu className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400 group-hover:scale-110 transition-all duration-200" />
          </button>
          
          <div className="flex flex-col animate-fade-in">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent tracking-tight animate-typewriter">
                {title}
              </h1>
              <div className="flex items-center space-x-1 animate-bounce-in animate-delay-200">
                <Sparkles className="w-5 h-5 text-yellow-500 animate-sparkle" />
                <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full font-semibold animate-glow">
                  PRO
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400 mt-1 animate-slide-in-left animate-delay-300">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(currentTime)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  isOnline ? 'bg-emerald-500' : 'bg-red-500'
                }`} />
                <span>{isOnline ? 'En ligne' : 'Hors ligne'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-yellow-400 font-medium">+12.5% aujourd'hui</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Section - Enhanced Search */}
        <div className="hidden md:flex items-center space-x-4 flex-1 max-w-lg mx-8 animate-scale-up animate-delay-500">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-all duration-200" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Rechercher des produits, commandes, clients..."
              className="
                w-full pl-12 pr-6 py-3.5
                bg-gray-800/50 backdrop-blur-sm
                border border-yellow-500/20
                rounded-2xl text-sm
                smooth-focus
                hover:border-yellow-400/40
                transition-all duration-300
                placeholder-gray-400
                text-yellow-100
              "
            />
            {searchValue && (
              <div className="absolute top-full mt-2 w-full bg-gray-800/90 backdrop-blur-sm rounded-xl border border-yellow-500/20 shadow-2xl animate-slide-up">
                <div className="p-4 space-y-2">
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">Résultats de recherche</div>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-3 hover:bg-yellow-500/10 rounded-lg cursor-pointer transition-all duration-200 hover-lift">
                      <div className="font-medium text-yellow-100">Résultat {i + 1}</div>
                      <div className="text-sm text-gray-400">Description du résultat...</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Enhanced */}
        <div className="flex items-center space-x-3">
          {/* Real-time Clock */}
          <div className="hidden sm:flex flex-col items-end animate-slide-in-right animate-delay-700">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <div className="text-lg font-mono font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                {formatTime(currentTime)}
              </div>
            </div>
            <div className="text-xs text-gray-400 flex items-center space-x-1">
              <Globe className="w-3 h-3" />
              <span>Paris, France</span>
            </div>
          </div>

          {/* Theme Toggle - Enhanced */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="
              p-3 bg-gray-800/50 backdrop-blur-sm rounded-xl transition-all duration-300 
              border border-yellow-500/20 hover:border-yellow-400/40
              hover:bg-yellow-500/10 ripple group
            "
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-400 group-hover:rotate-90 transition-all duration-300" />
            ) : (
              <Moon className="w-5 h-5 text-yellow-400 group-hover:rotate-12 transition-all duration-300" />
            )}
          </button>

          {/* Enhanced Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="
                relative p-3 bg-gray-800/50 backdrop-blur-sm rounded-xl transition-all duration-300
                border border-yellow-500/20 hover:border-yellow-400/40
                hover:bg-yellow-500/10 ripple group
              "
            >
              <Bell className="w-5 h-5 text-yellow-400 group-hover:animate-bounce" />
              {notifications > 0 && (
                <>
                  <span className="
                    absolute -top-1 -right-1 
                    w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs 
                    rounded-full flex items-center justify-center
                    animate-pulse font-bold shadow-lg
                  ">
                    {notifications}
                  </span>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full animate-pulse-ring" />
                </>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="notifications-menu absolute right-0 top-full mt-2 w-80 bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-yellow-500/20 shadow-2xl animate-scale-up z-50">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-yellow-100">Notifications</h3>
                    <button className="text-xs text-yellow-400 hover:text-yellow-300 font-medium">Tout marquer comme lu</button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                    {notificationItems.map((item) => (
                      <div key={item.id} className={`p-3 rounded-xl hover:bg-yellow-500/10 cursor-pointer transition-all duration-200 border-l-4 ${
                        item.type === 'order' ? 'border-emerald-500' :
                        item.type === 'warning' ? 'border-orange-500' : 'border-blue-500'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-yellow-100 text-sm">{item.title}</div>
                            <div className="text-xs text-gray-300 mt-1">{item.message}</div>
                            <div className="text-xs text-gray-400 mt-2">{item.time}</div>
                          </div>
                          {item.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Settings Button */}
          <button className="
            p-3 bg-gray-800/50 backdrop-blur-sm rounded-xl transition-all duration-300
            border border-yellow-500/20 hover:border-yellow-400/40
            hover:bg-yellow-500/10 ripple group
          ">
            <Settings className="w-5 h-5 text-yellow-400 group-hover:rotate-90 transition-all duration-300" />
          </button>

          {/* Fullscreen Button */}
          <button 
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen();
              } else {
                document.documentElement.requestFullscreen();
              }
            }}
            className="
              p-3 bg-gray-800/50 backdrop-blur-sm rounded-xl transition-all duration-300
              border border-yellow-500/20 hover:border-yellow-400/40
              hover:bg-yellow-500/10 ripple group
            "
          >
            <Maximize className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-all duration-300" />
          </button>

          {/* Enhanced User Profile */}
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 hover:bg-yellow-500/10 rounded-2xl transition-all duration-300 border-l border-yellow-500/20 pl-6 ripple"
            >
              <div className="hidden sm:flex flex-col items-end">
                <div className="text-sm font-bold text-yellow-100 flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-yellow-400" />
                  <span>Administrateur</span>
                </div>
                <div className="text-xs text-gray-400 flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  <span>Niveau Pro</span>
                </div>
              </div>
              <div className="relative">
                <div className="
                  w-12 h-12 bg-gradient-to-br from-yellow-500 via-amber-600 to-yellow-600
                  rounded-2xl flex items-center justify-center
                  shadow-xl hover:shadow-2xl transition-all duration-300
                  cursor-pointer hover-lift animate-morph
                ">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full border-2 border-gray-900 animate-pulse" />
              </div>
              <ChevronDown className="w-4 h-4 text-yellow-400 transition-transform duration-200" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="profile-menu absolute right-0 top-full mt-2 w-64 bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-yellow-500/20 shadow-2xl animate-scale-up z-50">
                <div className="p-4">
                  <div className="border-b border-yellow-500/20 pb-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-yellow-100">Admin Pro</div>
                        <div className="text-sm text-gray-300">admin@ecommerce.fr</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <button className="w-full flex items-center space-x-3 p-2 hover:bg-yellow-500/10 rounded-lg transition-all duration-200">
                      <UserCircle className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-yellow-100">Mon Profil</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-2 hover:bg-yellow-500/10 rounded-lg transition-all duration-200">
                      <Settings className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-yellow-100">Paramètres</span>
                    </button>
                    <hr className="border-yellow-500/20 my-2" />
                    <button className="w-full flex items-center space-x-3 p-2 hover:bg-red-500/10 rounded-lg transition-all duration-200 text-red-400">
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Déconnexion</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Progress Bar */}
      <div className="relative h-1 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-amber-500 via-yellow-600 to-amber-600 animate-gradient-shift" />
        <div className="absolute inset-0 bg-black/20" />
      </div>
    </header>
  );
}