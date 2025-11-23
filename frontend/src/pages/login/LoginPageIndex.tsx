
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "../../redux/thunks/authThunk";
import SocialAuthButtons from "./components/SocialAuthButtons";
import toast from "react-hot-toast";
import type { AppDispatch } from "../../redux/store";

const LoginPageIndex = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState("");

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            let res;

            if (isRegister) {
                res = await dispatch(
                    registerUser({ name, email, password })
                ).unwrap();
            } else {
                res = await dispatch(
                    loginUser({ email, password })
                ).unwrap();
            }

            if (res.status === "success") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
        } catch (err: any) {
            toast.error(err?.message || "Something went wrong");
        }
    };



    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <form onSubmit={handleSubmit} style={{ maxWidth: "400px", width: "100%", padding: "32px", border: "1px solid #e5e7eb", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }}>
                <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px", textAlign: "center" }}>
                    {isRegister ? "Create Account" : "Login"}
                </h2>

                {isRegister && (
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: "100%", padding: "10px", marginBottom: "16px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px" }}
                    />
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: "100%", padding: "10px", marginBottom: "16px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" }}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: "100%", padding: "10px", marginBottom: "24px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" }}
                />

                <button
                    type="submit"
                    style={{ width: "100%", backgroundColor: "#9333ea", color: "white", padding: "10px", borderRadius: "6px", border: "none", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}
                >
                    {isRegister ? "Register" : "Login"}
                </button>

                <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }}></div>
                    <span style={{ fontSize: "14px", color: "#6b7280" }}>OR</span>
                    <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }}></div>
                </div>

                <SocialAuthButtons />

                <div style={{ marginTop: "20px", textAlign: "center", fontSize: "14px", color: "#6b7280" }}>
                    {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                        type="button"
                        onClick={() => setIsRegister(!isRegister)}
                        style={{ color: "#9333ea", cursor: "pointer", fontWeight: "600", border: "none", background: "none" }}
                    >
                        {isRegister ? "Login" : "Register"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginPageIndex;
