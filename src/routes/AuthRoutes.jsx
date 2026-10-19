import { lazy, Suspense } from "react";
/* eslint-disable react-refresh/only-export-components */


import { Link } from "react-router";

function AuthSecondaryPage({ title, description }) {
    return (
        <div>
            <p className="text-[10px] font-bold tracking-[0.18em] text-[#977332]">
                VIRSA.SHOE ACCOUNT
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#33251B]">
                {title}
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#776653]">{description}</p>

            <div className="mt-7 rounded-md border border-[#E6D8BC] bg-white p-4 text-xs leading-6 text-[#776653]">
                This page is a frontend placeholder. Account services will be connected when backend authentication is implemented.
            </div>

            <Link
                to="/login"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-[#3D2A1D] px-5 text-xs font-semibold text-white hover:bg-[#78531F]"
            >
                Return to sign in
            </Link>
        </div>
    );
}

const RouteChunkFallback = () => (
    <div
        role="status"
        aria-live="polite"
        className="flex min-h-24 items-center justify-center text-sm text-slate-600"
    >
        Loading Virsa.Shoe...
    </div>
);

const AuthLayoutLazy = lazy(() => import("../layouts/AuthLayout.jsx"));
const AuthLayout = (routeProps) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <AuthLayoutLazy {...routeProps} />
    </Suspense>
);

const LoginLazy = lazy(() => import("../features/auth/pages/Login.jsx"));
const Login = (routeProps) => (
    <Suspense fallback={<RouteChunkFallback />}>
        <LoginLazy {...routeProps} />
    </Suspense>
);


export const authRoutes = [
    {
        path: "/login",
        element: (
            <AuthLayout>
                <Login />
            </AuthLayout>
        ),
    },
    {
        path: "/register",
        element: (
            <AuthLayout>
                <AuthSecondaryPage
                    title="Create your account."
                    description="Set up your Virsa.Shoe customer account."
                />
            </AuthLayout>
        ),
    },
    {
        path: "/forgot-password",
        element: (
            <AuthLayout>
                <AuthSecondaryPage
                    title="Reset your password."
                    description="Password recovery will be connected to the authentication service."
                />
            </AuthLayout>
        ),
    },
    {
        path: "/verify-email",
        element: (
            <AuthLayout>
                <AuthSecondaryPage
                    title="Verify your email."
                    description="Email verification requires the future authentication backend."
                />
            </AuthLayout>
        ),
    },
];
