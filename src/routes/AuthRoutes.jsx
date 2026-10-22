/* eslint-disable react-refresh/only-export-components */

import { lazy, Suspense } from "react";

// Lazy-loaded layout and authentication pages
const AuthLayout = lazy(
    () => import("../layouts/AuthLayout.jsx")
);

const Login = lazy(
    () => import("../features/auth/pages/Login.jsx")
);

const Register = lazy(
    () => import("../features/auth/pages/Register.jsx")
);

const ForgotPassword = lazy(
    () => import("../features/auth/pages/ForgotPassword.jsx")
);

const VerifyEmail = lazy(
    () => import("../features/auth/pages/VerifyEmail.jsx")
);

// Loading state
function RouteChunkFallback() {
    return (
        <div
            role="status"
            aria-live="polite"
            className="flex min-h-screen items-center justify-center bg-surface-muted px-4 text-sm text-text-secondary"
        >
            Loading Virsa.Shoe account...
        </div>
    );
}

// Shared authentication layout
function AuthPage({ children }) {
    return (
        <Suspense fallback={<RouteChunkFallback />}>
            <AuthLayout>{children}</AuthLayout>
        </Suspense>
    );
}

// Authentication routes
export const authRoutes = [
    {
        path: "/login",
        element: (
            <AuthPage>
                <Login />
            </AuthPage>
        ),
    },
    {
        path: "/register",
        element: (
            <AuthPage>
                <Register />
            </AuthPage>
        ),
    },
    {
        path: "/forgot-password",
        element: (
            <AuthPage>
                <ForgotPassword />
            </AuthPage>
        ),
    },
    {
        path: "/verify-email",
        element: (
            <AuthPage>
                <VerifyEmail />
            </AuthPage>
        ),
    },
];