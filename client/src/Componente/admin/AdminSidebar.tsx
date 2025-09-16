// src/Componente/admin/AdminSidebar.tsx
import React, { Dispatch, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  Plus, 
  Users, 
  ShoppingCart, 
  MessageSquare, 
  LogOut,
  ChevronLeft,
  Settings
} from "lucide-react";

interface AdminSidebarProps {
  activePage: string;
  setActivePage: Dispatch<SetStateAction<string>>;
  handleLogout: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function AdminSidebar({
  activePage,
  setActivePage,
  handleLogout,
  isCollapsed = false,
  onToggleCollapse,
}: AdminSidebarProps) {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleAddProduct = () => {
    navigate("/admin/add");
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Tableau de bord",
      icon: LayoutDashboard,
      onClick: () => setActivePage("dashboard"),
      gradient: "from-yellow-500 to-amber-500"
    },
    {
      id: "products",
      label: "Tous les produits", 
      icon: Package,
      onClick: () => setActivePage("products"),
      gradient: "from-yellow-400 to-yellow-600"
    },
    {
      id: "add-product",
      label: "Ajouter un produit",
      icon: Plus,
      onClick: handleAddProduct,
      gradient: "from-amber-500 to-yellow-500",
      special: true
    },
    {
      id: "clients",
      label: "Utilisateurs",
      icon: Users,
      onClick: () => setActivePage("clients"),
      gradient: "from-yellow-600 to-amber-600"
    },
    {
      id: "orders",
      label: "Commandes",
      icon: ShoppingCart,
      onClick: () => setActivePage("orders"),
      gradient: "from-amber-400 to-yellow-400"
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageSquare,
      onClick: () => setActivePage("messages"),
      gradient: "from-yellow-500 to-amber-400"
    }
  ];
  return (
    <aside className={`
      ${isCollapsed ? 'w-20' : 'w-72'} 
      bg-gradient-to-br from-black via-gray-900 to-black
      backdrop-blur-xl
      border-r border-yellow-500/20
      min-h-screen 
      p-6 
      fixed 
      top-0 
      left-0 
      flex 
      flex-col
      transition-all 
      duration-300 
      ease-in-out
      shadow-2xl
      z-50
    `}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
            <Settings className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-xs text-slate-400">Dashboard Pro</p>
            </div>
          )}
        </div>
        
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-200 group"
          >
            <ChevronLeft className={`w-5 h-5 text-slate-400 group-hover:text-white transition-all duration-200 ${
              isCollapsed ? 'rotate-180' : ''
            }`} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activePage === item.id || (item.id === 'add-product' && window.location.pathname === '/admin/add');
          const isHovered = hoveredItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`
                group relative flex items-center space-x-4 p-3 rounded-xl transition-all duration-300
                ${isActive 
                  ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg transform scale-[1.02]' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/30'
                }
                ${isCollapsed ? 'justify-center' : ''}
                ${item.special ? 'border border-orange-500/20 hover:border-orange-500/40' : ''}
              `}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Background effect */}
              {!isActive && (
                <div className={`
                  absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-all duration-300
                  bg-gradient-to-r ${item.gradient}
                `} />
              )}
              
              {/* Icon */}
              <div className={`
                relative z-10 p-2 rounded-lg transition-all duration-300
                ${isActive ? 'bg-white/20' : 'group-hover:bg-slate-600/50'}
              `}>
                <Icon className={`w-5 h-5 transition-all duration-300 ${
                  isActive || isHovered ? 'transform scale-110' : ''
                }`} />
              </div>
              
              {/* Label */}
              {!isCollapsed && (
                <span className={`
                  font-medium transition-all duration-300 relative z-10
                  ${isActive ? 'text-white' : ''}
                `}>
                  {item.label}
                </span>
              )}
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-full" />
              )}
              
              {/* Hover tooltip for collapsed state */}
              {isCollapsed && isHovered && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg border border-slate-600 whitespace-nowrap z-50">
                  {item.label}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-600" />
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700/50 pt-6 mt-6">
        <button
          onClick={handleLogout}
          onMouseEnter={() => setHoveredItem('logout')}
          onMouseLeave={() => setHoveredItem(null)}
          className={`
            group w-full flex items-center space-x-4 p-3 rounded-xl transition-all duration-300
            text-slate-400 hover:text-red-400 hover:bg-red-500/10
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <div className="p-2 rounded-lg group-hover:bg-red-500/20 transition-all duration-300">
            <LogOut className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <span className="font-medium">Déconnexion</span>
          )}
          
          {/* Hover tooltip for collapsed state */}
          {isCollapsed && hoveredItem === 'logout' && (
            <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg border border-slate-600 whitespace-nowrap z-50">
              Déconnexion
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-600" />
            </div>
          )}
        </button>
        
        {!isCollapsed && (
          <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-slate-400">Système en ligne</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">v2.0.1 - Dashboard Pro</div>
          </div>
        )}
      </div>
    </aside>
  );
}
