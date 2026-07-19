import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import useAuth from "../hooks/useAuth";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setError("");
        try {
            await login({
                email,
                password,
            });
            navigate("/app", {
                replace: true,
            });
        } catch (err) {
            setError(err.detail ?? "Invalid credentials.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className="login-page" onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
            />
            {loading && <LoadingState message="Signing in..." />}
            {error && <ErrorState message={error} />}
            <button type="submit" disabled={loading}>
                Login
            </button>
        </form>
    );
}