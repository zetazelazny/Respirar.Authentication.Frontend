import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/navbar';
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import '../components/styles.css';
import { environment } from "@/environments/env";
import Footer from "@/components/footer";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;


  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  function validate() {
    let errors = [];

    if (!emailRegex.test(email)) {
      errors.push("Correo inválido");
    }

    return errors;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrores([]);
    const validationErrors = validate();

    if (validationErrors.length === 0) {
      setIsSubmitting(true);

      try {
        const request = {
          email: email
        };

        const response = await fetch(environment.backendUrl + "/recoverPassword", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        });

        const data = await response.json();
        if (response.ok) {
            setIsOpen(true);
        } else {
          if (data.errors && data.errors.length > 0) {
            setErrores(data.errors);
          } else {
            setErrores(["Ocurrió un error inesperado"]);
          }
        }
      } catch (error) {
        console.error(error);
        setErrores(["Ocurrió un error al procesar su solicitud"]);
      }

      setIsSubmitting(false);
    } else {
      setErrores(validationErrors);
    }
  };

  const onClickPopup = () => {
    setIsOpen(false);
    router.push('/login');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  return (
    <div className="">
      <Navbar />
      <div className="row ">
        <div className="">
          <div className="d-flex justify-content-center mt-5 align-items-center mx-auto col-10 col-md-8 col-lg-6">
            <div className="form-container register-form">
              <h2 className="d-flex justify-content-center">¿Olvidaste tu contraseña?</h2>
              <form className="" onSubmit={handleSubmit}>
                {errores.length > 0 && (
                  <ul className="error-modal alert alert-danger">
                    {errores.map((item, index) => (
                      <li className="error-modal" key={index}>{item}</li>
                    ))}
                  </ul>
                )}
                <div className="d-flex justify-content-center form-group row mt-4">
                  <label className="d-flex justify-content-center col-sm-4 col-form-label"> Email: </label>
                  <div className="col-sm-10">
                    <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <button className="btn btn-primary mt-4" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Enviando..." : "Enviar correo de recuperación"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Modal
          isOpen={isOpen}
          onRequestClose={() => setIsOpen(false)}
          style={customStyles}
          ariaHideApp={false}
        >
          <h4>Correo enviado</h4>
          <p>Te enviamos un correo para avanzar con la recuperación.</p>
          <button className="btn btn-primary" onClick={() => onClickPopup()}>
            Regresar
          </button>
        </Modal>
        <Footer/>
    </div>
  );
};

export default Login;

