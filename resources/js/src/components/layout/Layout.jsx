import React from "react";
import Header from "./Header";
import MainMenu from "../navigation/MainMenu";

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            <Header />
            <MainMenu />
            <main className="ml-64 pt-16 min-h-screen">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
