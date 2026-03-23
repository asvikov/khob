import React from "react";
import { useState } from "react";
import authService from "../../services/authService";

const Header = () => {
    const user = authService.getUser();
    const [search, setSearch] = useState("");

    return (
        <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-white border-b border-slate-100 flex items-center px-6 gap-4">
            <div className="flex items-center gap-3 w-64 flex-shrink-0">
                <div className="w-8 h-8 flex items-center justify-center">
                    <img alt="Логотип" className="w-8 h-8 object-contain" src="/storage/img/design/logo_100x100.png" />
                </div>
                <span className="font-semibold text-slate-800 text-lg tracking-tight whitespace-nowrap">Khob</span>
            </div>
            <div className="flex-1 max-w-lg">
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-slate-400">
                        <i className="ri-search-line text-sm"></i>
                    </div>
                    <input 
                        placeholder="Поиск событий..." 
                        className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400/20 focus:border-teal-400 transition-all" 
                        type="text" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <div className="ml-auto flex items-center gap-3">
                <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer">
                    <i className="ri-notification-3-line text-lg"></i>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-400 rounded-full"></span>
                </button>
                <div className="flex items-center gap-2.5 pl-3 border-l border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-sm font-semibold cursor-pointer">А</div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700 whitespace-nowrap">{user.name}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
