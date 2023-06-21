import respirar from '../public/respirar.png'
import { useContext } from 'react';
import { SessionContext } from './session-provider';

const Navbar = () => {
    const { logout } = useContext(SessionContext);
 
    const handleClick = () => {
        logout();
    }
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className='ms-2'>
      <img src={respirar.src}  />
      </div>
     <span className="navbar-brand mb-0 ms-3 h1">Respir.AR</span>
     <div className="navbar-nav flex-row ms-auto">
        <button className="btn btn-primary align-items-end me-5 " onClick={handleClick}> Logout </button>
     </div>
    </nav>
  );
};

export default Navbar;