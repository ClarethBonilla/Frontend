import logo from './../assets/img/sinfondo.png'
import frame from './../assets/img/frame.png'

function Footer() {

    return (
        <>
            <div className="row justify-content-around align-items-center" style={{backgroundColor:'#75A9BE'}}>
                <img src={logo} class="img-fluid w-25" alt="..." />
                <div className='col-6 center mx-5'>
                    <img src={frame} class="rounded float-end" alt="..."></img>
                </div>
            </div>
        </>
    )
}

export default Footer
