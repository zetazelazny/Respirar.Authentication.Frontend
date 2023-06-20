import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-modal';
import { useRouter } from 'next/router';
import Navbar from '../components/navbar';
import '../components/styles.css';
import Footer from '@/components/footer';
import { environment } from '@/environments/env';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errores, setErrores] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false); // New flag
  const [isOpenSuccess, setIsOpenSuccess] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false); // Add a new state variable for loading
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const uppercaseRegExp = /(?=.*?[A-Z])/;
  const lowercaseRegExp = /(?=.*?[a-z])/;
  const digitsRegExp = /(?=.*?[0-9])/;
  const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
  const minLengthRegExp = /.{8,}/;
  const router = useRouter();

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
    const newErrores: string[] = [];

    if (!emailRegex.test(username)) {
      newErrores.push('Correo inválido');
    }

    if (password === '') {
      newErrores.push('Ingrese una contraseña');
    } else {
      if (!uppercaseRegExp.test(password)) {
        newErrores.push('La contraseña debe tener al menos una mayúscula');
      }
      if (!lowercaseRegExp.test(password)) {
        newErrores.push('La contraseña debe tener al menos una minúscula');
      }
      if (!digitsRegExp.test(password)) {
        newErrores.push('La contraseña debe tener al menos un número');
      }
      if (!specialCharRegExp.test(password)) {
        newErrores.push('La contraseña debe tener al menos un caracter especial');
      }
      if (!minLengthRegExp.test(password)) {
        newErrores.push('La contraseña debe tener al menos 8 caracteres');
      }
    }

    if (password !== confirmPassword) {
      newErrores.push('Las contraseñas no coinciden');
    }

    setErrores(newErrores);
  }

  useEffect(() => {
    setDisabled(true);
    if (submitted) {
      validate();
    }
    setDisabled(false);
  }, [username, password, confirmPassword, submitted]);

  const registerUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    if (errores.length === 0 && username !== '' && password !== '' && confirmPassword !== '') {
      const body = {
        username: username,
        password: password,
      };

      try {
        setLoading(true); // Set loading to true before making the request
        const response = await fetch(environment.backendUrl + '/userregister', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        setIsOpenSuccess(true);
        setSubmitted(false); // Reset the submitted flag
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or error
      }
    }
  };

  const onClickPopupSuccess = () => {
    setIsOpenSuccess(false);
    router.push('/login');
  };

  useEffect(() => {
    if (submitted) {
      validate();
    }
  }, [username, password, confirmPassword, submitted]);

  return (
    <div>
      <Navbar />
      <div className="row">
        <div className="d-flex justify-content-center mt-5 align-items-center mx-auto col-10 col-md-8 col-lg-6">
          <div className="form-container register-form">
            <h2 className="d-flex justify-content-center">Registrese aquí</h2>
            <form onSubmit={registerUser}>
              {errores.length > 0 && submitted && (
                <ul className="alert alert-danger">
                  {errores.map((item, index) => (
                    <li key={index}> {item} </li>
                  ))}
                </ul>
              )}
              <div className="d-flex justify-content-center form-group row mt-4">
                <label className="d-flex justify-content-center col-sm-4 col-form-label">Email</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-center form-group row">
                <label className="d-flex justify-content-center col-sm-4 col-form-label">Contraseña</label>
                <div className="col-sm-10">
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-center form-group row">
                <label className="d-flex justify-content-center col-sm-8 col-form-label">Reingrese la contraseña</label>
                <div className="col-sm-10">
                  <input
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <button disabled={disabled || loading} type="submit" className="btn btn-primary mt-4">
                  {loading ? 'Registrando...' : 'Registrarse'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div>
        <Modal
          isOpen={isOpenSuccess}
          onRequestClose={() => setIsOpenSuccess(false)}
          style={customStyles}
          ariaHideApp={false}
        >
          <h4>Registro exitoso</h4>
          <p>Haga click abajo para ingresar</p>
          <button className="btn btn-primary" onClick={() => onClickPopupSuccess()}>
            Regresar
          </button>
        </Modal>
      </div>
      <Footer />
    </div>
  );
};

export default Register;