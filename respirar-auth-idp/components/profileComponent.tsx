import React, { useContext, useState } from 'react';
import './styles.css';
import './profile.css';
import { environment } from '@/environments/env';
import { useRouter } from 'next/router';
import { SessionContext, SessionProvider } from './session-provider';
import Modal from 'react-modal';
import Navbar from './navbar_logueado';

interface ProfileProps {
  username: string;
  roles: string[];
}

const ProfileComponent: React.FC<ProfileProps> = ({ username, roles }) => {
  const router = useRouter();
  const { getAccessToken, logout } = useContext(SessionContext);
  const [isOpenModal, setIsOpenModal] = useState(false);

  console.log(roles)

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

  const handleChangePassword = async () => {
    router.push('/passwordchange');
  };

  const handleDeleteUser = () => {
    setIsOpenModal(true);
  };

  const onClickModalVolver = () => {
    setIsOpenModal(false);
  };

  const onClickModalEliminar = async () => {
    const response = await fetch(environment.backendUrl + '/deleteuser', {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'access-token': getAccessToken() ?? '',
      },
    });
    const data = await response.json();
    if (data.status === 'OK') {
      setIsOpenModal(true);
    }
    logout();
  };

  console.log("pre return", roles);
  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <h2 className="profile-title">Perfil</h2>
        <div className="profile-section">
          <div className="profile-label">Correo</div>
          <div className="profile-value">{username}</div>
        </div>
        <div className="roles-card">
          <div className="profile-label">Roles</div>
          <div className="roles-list">
            {roles.length === 0 ? (
              <div>No se encontraron roles</div>
            ) : (
              <ul>
                {roles.map((item, index) => (
                  <li key={index}>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="change-password-button">
          <button onClick={handleChangePassword} className="btn btn-primary">
            Cambiar contraseña
          </button>
          <button onClick={handleDeleteUser} className="btn btn-danger">
            Borrar usuario
          </button>
        </div>
        <div>
          <Modal
            isOpen={isOpenModal}
            onRequestClose={() => setIsOpenModal(false)}
            style={customStyles}
            ariaHideApp={false}
          >
            <h4>¿Está seguro que desea eliminar la cuenta?</h4>
            <button className="btn btn-primary" onClick={() => onClickModalVolver()}>
              Regresar
            </button>
            <button className="btn btn-danger" onClick={() => onClickModalEliminar()}>
              Eliminar
            </button>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
