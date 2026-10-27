
import AuthLayout from "../layouts/AuthLayout.jsx";
import Login from "../features/auth/pages/Login.jsx";
import PlaceholderPage from "../components/shared/PlaceholderPage.jsx";

export const authRoutes = [
    {
        path: "/login",
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <Login />,
            },
        ],
    },
    {
        path: "/register",
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: (
                    <PlaceholderPage
                        title="Create Your Account"
                        description="Create your Virsa.Shoe account to manage your profile and orders."
                    />
                ),
            },
        ],
    },
    {
        path: "/forgot-password",
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: (
                    <PlaceholderPage
                        title="Reset Password"
                        description="Password recovery will be implemented in a later phase."
                    />
                ),
            },
        ],
    },
];
