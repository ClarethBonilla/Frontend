import diente from "../assets/img/1.png"
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Nabvar() {
    const { usuario, logout } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg bg-primary">
            <div className="container-fluid">
                <Link to='/' className="navbar-brand w-25">
                    <img src={diente} className="img-fluid w-25 ms-5" alt="logo" />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse d-flex flex-row-reverse" id="navbarNavAltMarkup">
                    <div className="navbar-nav me-5">
                        <Link to='/tratamientos' className="nav-link text-white">Tratamientos</Link>
                        {usuario && usuario.rol === 'doctor' && (
                            <>
                            <Link to='/pacientes' className="nav-link text-white">Pacientes</Link>
                            <Link to='/calendar' className="nav-link text-white">Calendario</Link>
                            </>
                        )}
                        <Link to='/sobrenosotros' className="nav-link text-white">Sobre nosotros</Link>
                        <Link to='/formulario' className="nav-link text-white">Agenda aquí</Link>
                        
                        {usuario ? (
                            <>
                                <span className="nav-link text-white">👤 {usuario.nombre}</span>
                                <button 
                                    className="nav-link text-white btn btn-link"
                                    onClick={logout}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to='/login' className="nav-link text-white">Login</Link>
                        )}
                        
                        
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Nabvar;