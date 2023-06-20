import ProfileComponent from '@/components/profileComponent';
import { SessionContext } from '@/components/session-provider';
import { useRouter } from 'next/router';
import React, { useContext, useState, useEffect } from 'react';
import { environment } from '@/environments/env';

const App: React.FC = () => {
  const { isAuthenticated } = useContext(SessionContext);
  const router = useRouter();
  const [arrayRoles, setArrayRoles] = useState<string[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(environment.backendUrl + '/roles', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'access-token': sessionStorage.getItem('accessToken') ?? '',
          },
        });
        const data = await response.json();
        const roles = data.result.roles.map((role: any) => role.name);
        setArrayRoles(roles);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRoles();
  }, []);

  const profileData = {
    username: sessionStorage.getItem('username') ?? '',
    roles: arrayRoles,
  };

  if (sessionStorage.getItem('accessToken')==='') {
    router.push('/login');
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ProfileComponent username={profileData.username} roles={arrayRoles} />
    </div>
  );
};

export async function getStaticProps(context: any) {
  return {
    props: {
      protected: true,
    },
  };
}

export default App;