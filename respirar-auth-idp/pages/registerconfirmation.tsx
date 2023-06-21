import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { environment } from '@/environments/env';
import Navbar from '../components/navbar'
import Footer from "@/components/footer";


const RegisterConfirmation: React.FC = () => {
    const router = useRouter();
    const [validationResponse, setValidationResponse] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
      const { query } = router;
      const { id } = query;
       
      const validateUser = async () => {
        if(id && environment){
          try {
            const requestUrl = environment.backendUrl + '/validateUser/' + id
            const response = await fetch(requestUrl);
            if (!response.ok) {
              throw new Error('Request failed');
            }
            const responseJson = await response.json();
            return responseJson;
          } catch (error) {
              console.error('Error fetching data:', error);
          }
        }
      };
          
     
      validateUser().then((response) => {
          if(response){
            const result = response.result as boolean
            if(result){
              console.log(response)
              setValidationResponse(true)
            }
            else{
              setErrors(errores=>[...errors, response.errors])
              setValidationResponse(true)
            }
          }
        }
      );
      
    }, [router.query]);
      
    const handleIngresar = () => {
        router.push("/login/")
    }

    if (!validationResponse) {
      return <p>Loading...</p>;
    }
    else{
      if(errors.length > 0){
        return <div>{errors}</div>;
      }
      else{
        return (
          <div> 
          <Navbar />
          <div className="d-flex justify-content-center mt-5 align-items-center mx-auto col-10 col-md-8 col-lg-6 ">
            <div className="form-container register-form">
            <div className='mt-2'>
                ¡Su registro ha sido confirmado exitosamente!
            </div>
            <div>
            <button onClick={handleIngresar} className="btn btn-primary justify-content-center"> Ingresar </button>
            </div>
          </div>
          </div>
          <Footer/>
          </div>
        );
      }
    }
}

export default RegisterConfirmation