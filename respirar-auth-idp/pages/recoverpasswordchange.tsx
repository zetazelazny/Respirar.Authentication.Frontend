import { useForm } from 'react-hook-form';
import Navbar from '../components/navbar';
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/router';
import { environment } from '@/environments/env';
import Footer from "@/components/footer";


interface PasswordChangeProps {
  // Add any props if needed
}

function PasswordChange({}: PasswordChangeProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errores, setErrores] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false); // New flag
  const [username, setUsername] = useState("");
  const cambioPass = false;
  const uppercaseRegExp = /(?=.*?[A-Z])/;
  const lowercaseRegExp = /(?=.*?[a-z])/;
  const digitsRegExp = /(?=.*?[0-9])/;
  const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
  const minLengthRegExp = /.{8,}/;

  const router = useRouter();

  useEffect(() => {
    const { query } = router;
    const { changecode, username } = query;

    if(username) {
      setUsername(username as string);
    }

    if(changecode){
      checkCode(changecode as string);
    }
  }, [router.query]);

  const handleNewPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
  };

  function validate() {
    const newErrores: string[] = [];
      if (newPassword === '') {
        newErrores.push('Ingrese la nueva contraseña');
      } else {
        if (confirmPassword === '') {
          newErrores.push('Debe reingresar la nueva contraseña');
        } else {
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
        }

        if (newPassword !== confirmPassword) {
          newErrores.push('Las contraseñas no coinciden');
        }
    }
    setErrores(newErrores);
  }

  useEffect(() => {
    if (submitted) {
      validate();
    }
  }, [newPassword, confirmPassword, submitted]);

  const checkCode = async (changeCode : string) => {
    try {  
      const response = await fetch(environment.backendUrl + "/validateRecoverCode/" + changeCode, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    if (errores.length === 0) {
      try {
        const response = await fetch( environment.backendUrl + '/updatepassword', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            currentPassword: null,
            newPassword: newPassword,
            cambioPass: false
          }),
        });

        if (!response.ok) {
          throw new Error('Error al cambiar la contraseña');
        }

        const data = await response.json();
        console.log(data);
        setSubmitted(false); // Reset the submitted flag
        router.push('/login'); // Handle the response from the backend
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    setErrores([]);
  }, []);

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
              <h2 className="d-flex justify-content-center">Cambio de contraseña</h2>
              <form className="" onSubmit={handleSubmit}>
                {errores.length > 0 && (
                  <ul className="error-modal alert alert-danger">
                    {errores.map((item, index) => (
                      <li className="error-modal" key={index}>{item}</li>
                    ))}
                  </ul>
                )}
                <div className="d-flex justify-content-center form-group row mt-4">
                  <label className="d-flex justify-content-center col-form-label"> Contraseña nueva: </label>
                  <div className="col-sm-10">
                    <input className="form-control" type="password" value={newPassword} onChange={handleNewPasswordChange} />
                  </div>
                </div>
                <div className="d-flex justify-content-center form-group row">
                  <label className="d-flex justify-content-center col-form-label mt-2"> Confirmar contraseña: </label>
                  <div className="col-sm-10">
                    <input className="form-control" type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <button className="btn btn-primary mt-4" type="submit">
                    Cambiar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default PasswordChange;