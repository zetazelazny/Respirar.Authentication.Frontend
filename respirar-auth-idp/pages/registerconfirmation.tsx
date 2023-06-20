import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { environment } from '@/environments/env';
``
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
      
    const handleRedirection = () => {
        router.push("/profile/")
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
            <div>
                Su registro ha sido confirmado exitosamente
            </div>
            <div>
                <a onClick={handleRedirection}>Haga click aqui para ver su perfil</a>
            </div>
          </div>
        );
      }
    }
}

export default RegisterConfirmation