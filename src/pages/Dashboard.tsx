import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import userApis from '@/apis/user';
import AdminDashboard from '@/components/AdminDashboard';
import EmployeeDashboard from '@/components/EmployeeDashboard';
import useUserStore from '@/store/useUserStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();

  useEffect(() => {
    (async () => {
      try {
        const res = await userApis.getYourInfo();
        setUser(res.data);
     
      } catch (err) {
        if (err instanceof Error) {
          console.warn("Not authenticated");
        } navigate('/login');
      }
    })();
  }, [navigate, setUser]);

  if (!user) return <div>Loading...</div>;

  return user.role === 'Admin' ? <AdminDashboard /> : <EmployeeDashboard />;
};

export default Dashboard;
