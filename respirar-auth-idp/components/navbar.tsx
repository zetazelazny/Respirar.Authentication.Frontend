import respirar from '../public/respirar.png'

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className='ms-2'>
      <img src={respirar.src}  />
      </div>
     <span className="navbar-brand mb-0 ms-3 h1">Respir.AR</span>
     <div className="collapse navbar-collapse nav-item" id="navbarSupportedContent">
      <ul className="navbar-nav nav-item">
       <li className="nav-item">
        <a className="nav-link" href="/login">Login</a>
       </li>
       <li className="nav-item">
        <a className="nav-link" href="/register">Register</a>
       </li>
      </ul>
     </div>
    </nav>
  );
};

export default Navbar;