import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AppLayout = () => {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 md:pl-[280px] lg:pl-[280px] transition-all duration-300">
                {/* 
                   We keep Header fixed, but we might want to offset its content 
                   or move it inside the main area. For now, we'll keep it fixed.
                */}
                <Header />

                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
