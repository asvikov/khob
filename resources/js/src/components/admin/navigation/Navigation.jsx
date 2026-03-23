import React from 'react';
import {Link, useLocation} from 'react-router-dom';

const Navigation = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <aside className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <nav className="flex flex-col gap-1">
                <Link
                    to="/admin"
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive('/admin')
                            ? 'bg-teal-50 text-teal-700 border border-teal-200'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                    dashboard
                </Link>
                <Link
                    to="/admin/users"
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive('/admin/users')
                            ? 'bg-teal-50 text-teal-700 border border-teal-200'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                    users
                </Link>
            </nav>
        </aside>
    );
}

export default Navigation;
