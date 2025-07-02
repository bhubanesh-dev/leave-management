import type { User } from '@/components/UserManagement';
import axios from 'axios';

interface user{
    name: string,
    email: string,
    role: 'Employee' | 'Admin'
}

const getYourInfo = () => axios.get("/user/me", {
  withCredentials: true
});

const createUser = (user:user) => axios.post('user/create',user,{withCredentials:true} );

const getAllUser = () => axios.get('/user/',{withCredentials:true});

const deleteUser = (id:string) =>  axios.delete(`/user/${id}`,{withCredentials: true});

const editUser = (payload:User) => axios.put(`/user`,payload, {withCredentials: true});

const checkPassword = (id:string) => axios.get(`/user/check-password/${id}`, {withCredentials : true});

const userApis = { getYourInfo,createUser,getAllUser,deleteUser, editUser,checkPassword };
export default userApis;
