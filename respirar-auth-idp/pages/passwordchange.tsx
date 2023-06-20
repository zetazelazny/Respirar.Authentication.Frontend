import { useForm } from 'react-hook-form';
import Navbar from '../components/navbar';
import React, { useState, ChangeEvent, FormEvent, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/router';
import { SessionContext } from '@/components/session-provider';
import { environment } from '@/environments/env';

interface PasswordChangeProps {
  // Add any props if needed
}

function PasswordChange({}: PasswordChangeProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errores, setErrores] = useState<string[]>([]);
  const { isAuthenticated, getAccessToken } = useContext(SessionContext);
  const cambioPass = true;
  const uppercaseRegExp = /(?=.*?[A-Z])/;
  const lowercaseRegExp = /(?=.*?[a-z])/;
  const digitsRegExp = /(?=.*?[0-9])/;
  const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
  const minLengthRegExp = /.{8,}/;

  const router = useRouter();

  const handleCurrentPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(event.target.value);
  };

  const handleNewPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  };

  if (sessionStorage.getItem('accessToken')==='') {
    router.push('/login');
    return <div>Loading...</div>;
  }

  function returnProfile() {
    router.push('/profile');
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const newErrores: string[] = [];

    if (currentPassword === '') {
      newErrores.push('Ingrese su contraseña actual');
    }
    if (newPassword === '') {
      newErrores.push('Ingrese la nueva contraseña');
    }
    if (confirmPassword === '') {
      newErrores.push('Debe reingresar la nueva contraseña');
    }
    if (!uppercaseRegExp.test(newPassword)) {
      newErrores.push('La contraseña debe tener al menos una mayúscula');
    }
    if (!lowercaseRegExp.test(newPassword)) {
      newErrores.push('La contraseña debe tener al menos una minúscula');
    }
    if (!digitsRegExp.test(newPassword)) {
      newErrores.push('La contraseña debe tener al menos un número');
    }
    if (!specialCharRegExp.test(newPassword)) {
      newErrores.push('La contraseña debe tener al menos un caracter especial');
    }
    if (!minLengthRegExp.test(newPassword)) {
      newErrores.push('La contraseña debe tener al menos 8 caracteres');
    }
    if (newPassword !== confirmPassword) {
      newErrores.push('Las contraseñas no coinciden');
    }

    setErrores(newErrores);

    if (newErrores.length === 0) {
      const username = sessionStorage.getItem('username') ?? '';
      try {
        const response = await fetch(environment.backendUrl + '/updatepassword', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'access-token': getAccessToken() ?? '',
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            cambioPass,
            username: sessionStorage.getItem('username'),
          }),
        });

        if (!response.ok) {
          throw new Error('Error al cambiar la contraseña');
        }

        const data = await response.json();
        console.log(data);
        router.push('/login');
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <form onSubmit={handleSubmit}>
        <div className="row ">
          <div className="d-flex justify-content-center mt-5 align-items-center mx-auto col-10 col-md-8 col-lg-2">
            <div className="register-form">
              <h3 className="form-title">Cambio de Contraseña</h3>
              {errores.length > 0 && (
                <ul className="alert alert-danger">
                  {errores.map((item, index) => (
                    <li key={index}> {item} </li>
                  ))}
                </ul>
              )}
              <div>
                <div className="form-group row mt-4">
                  <label htmlFor="currentPassword">Contraseña Actual</label>
                  <input
                    type="password"
                    id="currentPassword"
                    className="form-control"
                    value={currentPassword}
                    onChange={handleCurrentPasswordChange}
                  />
                </div>
              </div>
              <div>
                <div className="form-group row mt-4">
                  <label htmlFor="newPassword">Contraseña Nueva</label>
                  <input
                    type="password"
                    id="newPassword"
                    className="form-control"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                  />
                </div>
              </div>
              <div>
                <div className="form-group row mt-4">
                  <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-control"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                </div>
              </div>
              <button className="btn btn-primary mt-4" type="submit">
                Confirmar
              </button>
              <button className="btn btn-primary mt-4" onClick={returnProfile}> Cancelar </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PasswordChange;