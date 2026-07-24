import { useNavigate } from "react-router-dom";

export default function UnderConstructionPage() {
    const navigate = useNavigate();

    return (
        <section className="page-state" role="status">
            <h1>Funcionalidad en construcción</h1>
            <p>Esta sección todavía no se encuentra disponible.</p>
            <button type="button" className="button button-primary" onClick={() => navigate("/app", { replace: true })}>
                Volver al dashboard
            </button>
        </section>
    );
}