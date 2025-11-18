import Navbar from "../Nabvar"
import Footer from "../Footer"
import "./Sobrenosotros.css"
import frame2 from './../../assets/img/Frame 2.png'
import frame4 from './../../assets/img/Frame4.png'

function Sobrenosotros() {

    return (
        <>
            <Navbar />
            <div className="row py-5 align-items-center" style={{ backgroundColor: '#DBEAFE' }}>
                <div className="col">
                    <p class="fs-1 text-primary fw-bold mx-5">SOBRE NOSOTROS</p>
                    <p className="fw-medium parrafo-color mx-5">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquet nibh viverra sollicitudin sed faucibus elit enim amet faucibus. Velit diam id odio fermentum risus amet at ultricies.
                    </p>
                    <button type="button" class="btn btn-primary btn-lg mx-5">Agenda tu cita ahora</button>
                </div>
                <div className="col">
                    <img src={frame2} class="rounded float-end" alt="..."/>
                </div>
            </div>
            <div className="row py-5 align-items-center text-center">
  <p className="fs-1 text-primary fw-bold">NUESTRAS INSTALACIONES</p>
  <div className="col">
    <img src={frame4} className="img-fluid mx-auto d-block" alt="..." />
  </div>
</div>
<Footer/>
        </>
    )
}

export default Sobrenosotros
