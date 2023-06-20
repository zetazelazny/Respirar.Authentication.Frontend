import { useContext, useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from '../components/navbar'
//import { useRouter } from "next/router";
//import queryString from "query-string";
import { useRouter } from 'next/router';
import Footer from "@/components/footer";
import '../components/styles.css'
import { environment  } from "@/environments/env";
import { SessionContext } from "@/components/session-provider";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);
  const router = useRouter();
  const [redirectUrl, setRedirectUrl] = useState("");
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const { setAuth } = useContext(SessionContext)

  function validate() {
    let errors = [];

    if (!emailRegex.test(email)) {
      errors.push("Correo inválido");
    }

    if (password === "") {
      errors.push("Ingrese una contraseña");
    }

    return errors;
  }

  useEffect(() => {
    const { query } = router;
    const { redirect_url } = query;

    if (redirect_url) {
      setRedirectUrl(redirect_url as string);
    }
  }, [router.query]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrores([]);
    const validationErrors = validate();

    if (validationErrors.length === 0) {
      setIsSubmitting(true);

      try {
        const request = {
          name: email,
          password: password,
          grant_type: 'password'
        };

        const response = await fetch(environment.backendUrl + "/login", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        });

        const data = await response.json();

        if (response.ok) {
          const result = data.result;
          const accessToken = result?.access_token;
          const searchParams = new URLSearchParams();

          if (data.status === "OK") {
            if (redirectUrl) {
              searchParams.append("access_token", accessToken);
              searchParams.append("username", email);
              window.location.href = redirectUrl + '?' + searchParams;
            } else {
              sessionStorage.setItem('accessToken', accessToken);
              sessionStorage.setItem('username', email);
              setAuth();
              router.push("/profile");
            }
          } else {
            // if (data.errors && data.errors[0] === "Invalid grant: user credentials are invalid") {
            //   setErrores(["Credenciales de usuario inválidas"]);
            // } else {
            //   setErrores(["Ocurrió un error inesperado"]);
            // }
            if (data.errors.length > 0) {
              setErrores(["Credenciales de usuario inválidas"]);
            } else {
              setErrores(["Ocurrió un error inesperado"]);
            }
          }
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

  const handleRecoverPassword= () => {
    router.push("/recoverpassword")
  }

  return (
    <div className="">
      <Navbar />
      <div className="row ">
        <div className="">
          <div className="d-flex justify-content-center mt-5 align-items-center mx-auto col-10 col-md-8 col-lg-6">
            <div className="form-container register-form">
              <h2 className="d-flex justify-content-center">Login</h2>
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
                <div className="d-flex justify-content-center form-group row">
                  <label className="d-flex justify-content-center col-sm-4 col-form-label mt-2">Password:</label>
                  <div className="col-sm-10">
                    <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <button className="btn btn-primary mt-4" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Ingresar"}
                  </button>
                </div>
              </form>
              <div>
                <p onClick={handleRecoverPassword} className="d-flex justify-content-center mt-4"><u> ¿Olvidaste la contraseña?</u></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
