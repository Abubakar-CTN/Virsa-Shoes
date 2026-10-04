import { Outlet } from "react-router";

function StoreLayout() {
    return (
        <div className="min-h-screen">
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default StoreLayout;