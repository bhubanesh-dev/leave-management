
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import authApi from '@/apis/auth';
import { toast } from 'sonner';
import routes from '@/routes';
import useUserStore from '@/store/useUserStore';

const Logout = () => {
    const navigate = useNavigate();
    const {setUser} =  useUserStore();

    const handleLogout = async() => { 

        try {
            const logout  =  await  authApi.logout();
            toast(logout.data.message);
            navigate(routes.login);
            setUser(null);

            
        } catch (error) {
            if(error instanceof Error)
                toast("OOPs! unknown error");
            
        }
    }

    return (
        <Button variant="outline" onClick={handleLogout}>
            Logout
        </Button>
    )
}

export default Logout