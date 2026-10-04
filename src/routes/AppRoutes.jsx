import { Routes, Route } from "react-router";
import Home from "../pages/store/Home";
import Shop from "../pages/store/Shop";
import NotFound from "../pages/NotFound";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AppRoutes;