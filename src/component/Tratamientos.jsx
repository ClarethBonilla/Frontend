import blanqueamiento from './../assets/img/blanqueamiento.png'
import limpieza from './../assets/img/limpieza.png'
import nuevaEPS from './../assets/img/nuevaEPS.png'
import ortodoncia from './../assets/img/ortodoncia.png'
import sanitas from './../assets/img/sanitas.png'
import sonrisa from './../assets/img/sonrisa.png'
import sura from './../assets/img/sura.png'
import urgencias from './../assets/img/urgencias.png'
import Nabvar from './Nabvar'
import Footer from './Footer'
import './Tratamientos.css'
function Tratamientos() {

    return (
        <>
            <Nabvar />
            <div class="row p-5" style={{ backgroundColor: '#DBEAFE' }}>
                <div class="col px-5">
                    <p class="text-primary fs-1 fw-bold">Tratamientos</p>
                    <p class="fs-5">
                        En nuestra clínica dental, no solo cuidamos tus dientes, ¡creamos sonrisas que inspiran confianza!
                        Con tratamientos rápidos, indoloros y realizados por especialistas certificados, lograrás esa salud
                        bucal que siempre has deseado.
                    </p>
                    <p class="text-primary fs-3 fw-bold">Convenios con EPS</p>
                    <div class="d-flex gap-2">
                        <img src={nuevaEPS} class="img-fluid w-25" alt="..." />
                        <img src={sura} class="img-fluid w-25" alt="..." />
                        <img src={sanitas} class="img-fluid w-25" alt="..." />
                    </div>
                </div>
                <div class="col text-center">
                    <img src={sonrisa} class="img-fluid w-75" alt="..." />
                </div>
            </div>
            <div class="row p-5">
                <p class="text-primary fs-3 fw-bold">¡Transforma tu sonrisa hoy mismo!</p>
                <p>Invierte en tu sonrisa... es la mejor carta de presentación.</p>
                <div class="card col-6 border-0 mx-auto my-3">
                    <img src={limpieza} class="card-img" alt="..." />
                    <div class="card-body">
                        <h5 class="card-title text-primary">Limpieza</h5>
                        <p class="card-text">
                            Elimina el sarro y la placa acumulada en solo 30 minutos. ¡Notarás la diferencia al instante!
                        </p>
                        <a href="#" class="btn btn-secondary fw-bold">AGENDA TU CITA AHORA</a>
                    </div>
                </div>
                <div class="card col-6 border-0 mx-auto my-3">
                    <img src={ortodoncia} class="card-img" alt="..." />
                    <div class="card-body">
                        <h5 class="card-title text-primary">Ortodoncia</h5>
                        <p class="card-text">
                            Corrige la posición de tus dientes con brackets discretos o alineadores casi invisibles. ¡La sonrisa perfecta está más cerca de lo que imaginas!
                        </p>
                        <a href="#" class="btn btn-secondary fw-bold">AGENDA TU CITA AHORA</a>
                    </div>
                </div>
                <div class="card col-6 border-0 mx-auto my-3">
                    <img src={blanqueamiento} class="card-img" alt="..." />
                    <div class="card-body">
                        <h5 class="card-title text-primary">Blanqueamiento</h5>
                        <p class="card-text">
                            Aclara varios tonos tu sonrisa en una sola sesión. Ideal para eventos especiales o simplemente para sentirte más seguro cada día.
                        </p>
                        <a href="#" class="btn btn-secondary fw-bold">AGENDA TU CITA AHORA</a>
                    </div>
                </div>
                <div class="card col-6 border-0 mx-auto my-3">
                    <img src={urgencias} class="card-img" alt="..." />
                    <div class="card-body">
                        <h5 class="card-title text-primary">Urgencias</h5>
                        <p class="card-text">
                            Dolor intenso? Fractura? Infección? Te atendemos el mismo día con especialistas en emergencias odontológicas
                        </p>
                        <a href="#" class="btn btn-secondary fw-bold">AGENDA TU CITA AHORA</a>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
export default Tratamientos