// components
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { googleLogin } from "../../../redux/thunks/authThunk";
import type { AppDispatch } from "../../../redux/store";

declare global {
    interface Window {
        google?: any;
    }
}

export default function SocialAuthButtons() {
    const dispatch = useDispatch<AppDispatch>();

    const handleCredentialResponse = async (response: any) => {
        try {
            await dispatch(googleLogin({ token: response.credential })).unwrap();
            toast.success("Welcome back!");
        } catch (err: any) {
            toast.error(err?.message || "Google login failed");
        }
    };

    useEffect(() => {
        // Load Google Identity Services script
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
            // Initialize Google button after script loads
            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
                auto_select: false,
                cancel_on_tap_outside: true,
            });

            // Render the beautiful official Google button
            window.google.accounts.id.renderButton(
                document.getElementById("google-signin-button")!,
                {
                    type: "standard",
                    theme: "outline",
                    size: "large",
                    text: "continue_with",
                    shape: "rectangular",
                    logo_alignment: "left",
                    width: "100%",
                }
            );
        };

        return () => {
            document.body.removeChild(script);
        };
    }, [dispatch]);

    return (
        <div style={{ marginTop: "20px" }}>
            <div id="google-signin-button" style={{ width: "100%" }}></div>
        </div>
    );
}