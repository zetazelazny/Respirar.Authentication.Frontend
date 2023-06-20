import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'

function Modal(mensaje: string) {




    return (
        <div className="modalBackground">
            <div className="modalContainer">
                {/* <button onClick ={()=> modalState(false)} > X </button> */}
                <div className="title">
                    <h1> {mensaje} </h1>
               
                </div>
                <div className="body"> </div>
                <div className="footer"> </div>
                <button> Continuar </button>
            </div>
        </div>

    );
}

export default Modal;