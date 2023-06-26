import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-modal';
import { useRouter } from 'next/router';
import Navbar from '../components/navbar';
import '../components/styles.css';
import Footer from '@/components/footer';
import { environment } from '@/environments/env';

interface FormState {
  username: string;
  password: string;
  confirmPassword: string;
  errores: string[];
  submitted: boolean;
  isOpenSuccess: boolean;
  disabled: boolean;
  loading: boolean;
}

const Register: React.FC = () => {
  const [formState, setFormState] = useState<FormState>({
    username: '',
    password: '',
    confirmPassword: '',
    errores: [],
    submitted: false,
    isOpenSuccess: false,
    disabled: false,
    loading: false,
  });

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

  const validate = useCallback(() => {
    const newErrores: string[] = [];

    if (!emailRegex.test(formState.username)) {
      newErrores.push('Correo inválido');
    }

    if (formState.password === '') {
      newErrores.push('Ingrese una contraseña');
    } else {
      if (!uppercaseRegExp.test(formState.password)) {
        newErrores.push('La contraseña debe tener al menos una mayúscula');
      }
      if (!lowercaseRegExp.test(formState.password)) {
        newErrores.push('La contraseña debe tener al menos una minúscula');
      }
      if (!digitsRegExp.test(formState.password)) {
        newErrores.push('La contraseña debe tener al menos un número');
      }
      if (!specialCharRegExp.test(formState.password)) {
        newErrores.push('La contraseña debe tener al menos un caracter especial');
      }
      if (!minLengthRegExp.test(formState.password)) {
        newErrores.push('La contraseña debe tener al menos 8 caracteres');
      }
    }

    if (formState.password !== formState.confirmPassword) {
      newErrores.push('Las contraseñas no coinciden');
    }

    setFormState((prevState) => ({
      ...prevState,
      errores: newErrores,
    }));

    return newErrores.length === 0;
  }, [formState.username, formState.password, formState.confirmPassword]);

  useEffect(() => {
    setFormState((prevState) => ({
      ...prevState,
      disabled: true,
    }));

    if (formState.submitted) {
      validate();
    }

    setFormState((prevState) => ({
      ...prevState,
      disabled: false,
    }));
  }, [validate, formState.submitted]);

  const registerUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState((prevState) => ({
      ...prevState,
      submitted: true,
    }));

    if (validate()) {
      const body = {
        username: formState.username,
        password: formState.password,
      };

      try {
        setFormState((prevState) => ({
          ...prevState,
          loading: true,
        }));

        const response = await fetch(environment.backendUrl + '/userregister', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        setFormState((prevState) => ({
          ...prevState,
          isOpenSuccess: true,
          submitted: false,
        }));
      } catch (error) {
        console.log(error);
      } finally {
        setFormState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }
    }
  };

  const onClickPopupSuccess = () => {
    setFormState((prevState) => ({
      ...prevState,
      isOpenSuccess: false,
    }));
    router.push('/login');
  };

  useEffect(() => {
    if (formState.submitted) {
      validate();
    }
  }, [validate, formState.username, formState.password, formState.confirmPassword, formState.submitted]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  return (
    <div>
      <Navbar />
      <div className="row">
        <div className="d-flex justify-content-center mt-5 align-items-center mx-auto col-10 col-md-8 col-lg-6">
          <div className="form-container register-form">
            <h2 className="d-flex justify-content-center">Registrese aquí</h2>
            <form onSubmit={registerUser}>
              {formState.errores.length > 0 && formState.submitted && (
                <ul className="alert alert-danger">
                  {formState.errores.map((item, index) => (
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
                    value={formState.username}
                    onChange={(e) =>
                      setFormState((prevState) => ({
                        ...prevState,
                        username: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="d-flex justify-content-center form-group row">
                <label className="d-flex justify-content-center col-sm-4 col-form-label">Contraseña</label>
                <div className="col-sm-10">
                  <input
                    type="password"
                    className="form-control"
                    value={formState.password}
                    onChange={(e) =>
                      setFormState((prevState) => ({
                        ...prevState,
                        password: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="d-flex justify-content-center form-group row">
                <label className="d-flex justify-content-center col-sm-8 col-form-label">Reingrese la contraseña</label>
                <div className="col-sm-10">
                  <input
                    type="password"
                    className="form-control"
                    value={formState.confirmPassword}
                    onChange={(e) =>
                      setFormState((prevState) => ({
                        ...prevState,
                        confirmPassword: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <button
                  disabled={formState.disabled || formState.loading}
                  type="submit"
                  className="btn btn-primary mt-4"
                >
                  {formState.loading ? 'Registrando...' : 'Registrarse'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div>
        <Modal
          isOpen={formState.isOpenSuccess}
          onRequestClose={() =>
            setFormState((prevState) => ({
              ...prevState,
              isOpenSuccess: false,
            }))
          }
          style={customStyles}
          ariaHideApp={false}
        >
          <h4>Registro exitoso</h4>
          <p>Verifique su casilla de correo para finalizar el proceso.</p>
          <button className="btn btn-primary" onClick={onClickPopupSuccess}>
            Regresar
          </button>
        </Modal>
      </div>
      <Footer />
    </div>
  );
};

export default Register;