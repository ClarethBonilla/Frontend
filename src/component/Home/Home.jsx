import './Home.css'
import Nabvar from './../Nabvar'
import dentista from './../../assets/img/dentista.png'
import nuevaeps from './../../assets/img/nuevaeps11.jpg'
import sura from './../../assets/img/sura.png'
import sanitas from './../../assets/img/sanitas.webp'
import Footer from '../Footer'
function Home() {

  return (
    <>
      <Nabvar />
      <div className="fondo row py-5">
        <h1 className="titulo text-center my-5">MiSonrisa</h1>
        <p class="h4 text-center my-1">Tu sonrisa es nuestra prioridad</p>
        <p className='text-center fs-3 my-1'>Agenda citas odontológicas de forma rápida, segura y desde cualquier lugar.</p>
        <p className="h5 fw-bold text-center my-5 text-white" >
          ¡Cuida tu salud bucal con solo un clic!
        </p>
        <button type='button' class="btn btn-primary w-25 mx-auto my-5">AGENDA TU CITA AHORA</button>
      </div>
      <div className="row align-items-center">
        <div className='col px-5'>
          <p class="text-primary fw-bold mx-5">TU SONRISA, UN CLIC DE DISTANCIA</p>
          <p class="fw-normal mx-5">Reserva citas dentales fácilmente: Contamos con especialistas verificados y pagos seguros. Te ofrecemos servicios de limpieza, blanqueamiento, ortodoncia y urgencias dentales. </p>
          <p class="fw-normal mx-5">¡Cuida tu sonrisa sin esfuerzo!</p>
        </div>
        <div className='col p-5'>
          <img src={dentista} class="rounded float-end" alt="..."></img>
        </div>
      </div>
      <div className="row gap-5 justify-content-center">
        <div class="card col-3 p-3 border-0">
          <img src={nuevaeps} class="card-img-top w-50 mx-auto" alt="..." />
          <div class="card-body">
            <p class="card-text">Tu salud bucal es prioridad. Con Nueva EPS, obtén acceso a redes odontológicas certificadas y precios reducidos.</p>
          </div>
        </div>
        <div class="card col-3 p-3 border-0">
          <img src={sura} class="card-img-top w-50 mx-auto" alt="..." />
          <div class="card-body">
            <p class="card-text">Con tu plan Sura, accede a descuentos exclusivos en limpiezas, tratamientos preventivos y ortodoncia. ¡Aprovecha tu cobertura al máximo!</p>
          </div>
        </div>
        <div class="card col-3 p-3 border-0">
          <img src={sanitas} class="card-img-top w-50 mx-auto" alt="..." />
          <div class="card-body">
            <p class="card-text">Sanitas te cubre hasta un 30% en procedimientos dentales básicos y especializados. Agenda sin trámites adicionales desde la app.</p>
          </div>
        </div>
      </div>
      <div className="row align-items-center">
        <div className='col px-5'>
          <p class="text-primary fw-bold mx-5">Beneficios de usar nuestra plataforma</p>
          <p class="fw-normal mx-5">Agendar tu cita odontológica nunca fue tan sencillo. Con nuestro servicio podrás: </p>
          <ol class="list-group list-group-numbered mx-5">
            <li class="list-group-item border-0">Ahorrar tiempo</li>
            <li class="list-group-item border-0">Acceder a especialistas certificados</li>
            <li class="list-group-item border-0">Dejar de preocuparte por olvidar las citas </li>
          </ol>
          <p class="fw-bolder text-primary fw-bold mx-5">EMPIEZA HOY MISMO.</p>
          <p class="fw-normal mx-5">Tu salud bucal es importante. Reserva tu cita ahora y da el primer paso hacia una sonrisa más saludable..</p>
        </div>
        <div className='col mx-5'>
          <div class="card border-0">

            <div class="card-body">
              <h5 class="card-title text-primary fw-bold mx-5">Limpieza dental profesional</h5>
              <p class="card-text">Elimina placa y sarro con un procedimiento indoloro que devuelve el brillo natural a tu sonrisa. Prevención básica para una boca saludable..</p>

            </div>
            <div class="card border-0">

              <div class="card-body">
                <h5 class="card-title text-primary fw-bold mx-5">Tratamientos de ortodoncia</h5>
                <p class="card-text">Corrige la alineación de tus dientes con soluciones personalizadas (brackets o alineadores transparentes) para una sonrisa perfecta y funcional.</p>

              </div>
            </div>
            <div class="card border-0">

              <div class="card-body">
                <h5 class="card-title text-primary fw-bold mx-5">Procedimientos de blanqueamiento</h5>
                <p class="card-text">Aclara varios tonos el color de tus dientes en una sola sesión. Resultados visibles, seguros y libres de sensibilidad.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Home
