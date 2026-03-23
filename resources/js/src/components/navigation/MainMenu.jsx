import React from "react";
import { Link, useLocation } from "react-router-dom";

const MainMenu = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-slate-100 flex flex-col z-20 overflow-hidden">
            <div className="flex-1 overflow-y-auto py-6 px-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">Навигация</p>
                <nav className="flex flex-col gap-1">
                    <Link 
                        to="/" 
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                            isActive('/') 
                                ? 'bg-teal-500 text-white' 
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                        }`}
                    >
                        <div className="w-4 h-4 flex items-center justify-center">
                            {isActive('/') ? (
                                <i className="ri-calendar-2-fill text-base"></i>
                            ) : (
                                <i className="ri-calendar-2-line text-base"></i>
                            )}
                        </div>
                        Все события
                    </Link>
                    <Link 
                        to="/occasions" 
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                            isActive('/occasions') 
                                ? 'bg-teal-500 text-white' 
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                        }`}
                    >
                        <div className="w-4 h-4 flex items-center justify-center">
                            {isActive('/occasions') ? (
                                <i className="ri-bookmark-fill text-base"></i>
                            ) : (
                                <i className="ri-bookmark-line text-base"></i>
                            )}
                        </div>
                        Мои события
                        <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-500 hidden">3</span>
                    </Link>
                    <Link 
                        to="/users" 
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                            isActive('/users') 
                                ? 'bg-teal-500 text-white' 
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                        }`}
                    >
                        <div className="w-4 h-4 flex items-center justify-center">
                            {isActive('/users') ? (
                                <i className="ri-user-3-fill text-base"></i>
                            ) : (
                                <i className="ri-user-3-line text-base"></i>
                            )}
                        </div>
                        Профиль
                    </Link>
                </nav>

                <div className="mt-8">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">Категории</p>
                    <div className="flex flex-col gap-1">
                        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all cursor-pointer whitespace-nowrap">
                            <div className="w-4 h-4 flex items-center justify-center">
                                <i className="ri-palette-line text-base text-violet-500"></i>
                            </div>
                            Культура
                        </button>
                        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all cursor-pointer whitespace-nowrap">
                            <div className="w-4 h-4 flex items-center justify-center">
                                <i className="ri-code-s-slash-line text-base text-cyan-500"></i>
                            </div>
                            Технологии
                        </button>
                        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all cursor-pointer whitespace-nowrap">
                            <div className="w-4 h-4 flex items-center justify-center">
                                <i className="ri-run-line text-base text-orange-500"></i>
                            </div>
                            Спорт
                        </button>
                        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all cursor-pointer whitespace-nowrap">
                            <div className="w-4 h-4 flex items-center justify-center">
                                <i className="ri-music-2-line text-base text-amber-500"></i>
                            </div>
                            Музыка
                        </button>
                        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all cursor-pointer whitespace-nowrap">
                            <div className="w-4 h-4 flex items-center justify-center">
                                <i className="ri-restaurant-line text-base text-green-500"></i>
                            </div>
                            Еда
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default MainMenu;
