
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner"

import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog"


import { Trash, Edit, Lock } from 'lucide-react';
import userApis from '@/apis/user';
import useUserStore from '@/store/useUserStore';
import { DialogTitle } from '@radix-ui/react-dialog';

export type User = {
    _id: string
    name: string
    email: string
    role: 'Employee' | 'Admin'
    leaveBalance: number
    createdAt: string
    password: string
};


const UserManagement: React.FC = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Employee' as 'Employee' | 'Admin',
        password: ""
    });



    const [users, setUsers] = useState<User[]>([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const { user: currentUser } = useUserStore();
    const [selectedUser, setSelectedUser] = useState<User>({
        _id: "",
        name: "",
        email: "",
        role: "Employee",
        leaveBalance: 0,
        createdAt: "",
        password: ""
    })

    useEffect(() => {
        (async () => {
            const allUserResponse = await userApis.getAllUser();
         
            if ((allUserResponse).status === 200) {
                setUsers(allUserResponse.data);
            }
        })();
    }, []);


    const handlePasswordCheck = async(id: string) => {
        const response = await userApis.checkPassword(id);

        if(response.status === 200){
            alert("User password: " + response.data.password)
        }else{
            toast("OOPS! unknown error ");
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const createUserResponse = await userApis.createUser(formData);
            if (createUserResponse.status === 200) {
                toast("User created successfully ")
              
            }
            if (createUserResponse.data.user) {
                setUsers(prevUsers => [createUserResponse.data.user, ...prevUsers]);
            }
        } catch (error) {
            if (error instanceof Error) {
                toast(error.message);
            }
        }
        finally {
            setFormData({
                name: '',
                email: '',
                role: 'Employee',
                password: ""
            });
        };
    }

    const handleDelete = async (id: string) => {
        try {
            const deleteResponse = await userApis.deleteUser(id);
            if (deleteResponse.status === 200) {
                toast("User deleted");
                setUsers(prev =>
                    prev.filter(user => user._id !== id))
            }
        } catch (error) {
            if (error instanceof Error)
                toast(error.message);
        }
    }

    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        setEditDialogOpen(true);
    };

    const handleEditSubmit = async () => {
        try {
            const editResponse = await userApis.editUser(selectedUser);
            if (editResponse.status === 200) {
                toast("edit success")
            }

        } catch (error) {
            if (error instanceof Error)
               toast(error.message)
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Create New User Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="Enter email address"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Role
                                </label>
                                <Select value={formData.role} onValueChange={(value: 'Employee' | 'Admin') => setFormData(prev => ({ ...prev, role: value }))}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Employee">Employee</SelectItem>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <Input
                                    type="text"
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    placeholder="Enter email address"
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            Create User Account
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-2">Name</th>
                                    <th className="text-left p-2">Email</th>
                                    <th className="text-left p-2">Role</th>
                                    <th className="text-left p-2">Leave Balance</th>
                                    <th className="text-left p-2">Created</th>
                                    <th className='text-left p-2'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} className="border-b hover:bg-gray-50">
                                        <td className="p-2">{user.name}</td>
                                        <td className="p-2">{user.email}</td>
                                        <td className="p-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'Admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-2">{user.leaveBalance} days</td>
                                        <td className="p-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="p-3">

                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleEditClick(user)}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    <Edit />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handlePasswordCheck(user._id)}
                                                    className="bg-blue-400 hover:bg-blue-700"
                                                >
                                                    <Lock />
                                                </Button>

                                                {currentUser?._id != user._id && <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(user._id)}
                                                >
                                                    <Trash />
                                                </Button>}
                                            </div>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name
                                    </label>
                                    <Input
                                        value={selectedUser.name}
                                        onChange={(e) => setSelectedUser(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Enter full name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <Input
                                        type="email"
                                        value={selectedUser.email}
                                        onChange={(e) => setSelectedUser(prev => ({ ...prev, email: e.target.value }))}
                                        placeholder="Enter email address"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Role
                                    </label>
                                    <Select value={selectedUser.role} onValueChange={(value: 'Employee' | 'Admin') => setSelectedUser(prev => ({ ...prev, role: value }))}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Employee">Employee</SelectItem>
                                            <SelectItem value="Admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Leave Assigned
                                    </label>
                                    <Input
                                        type="number"
                                        value={selectedUser.leaveBalance}
                                        onChange={(e) => setSelectedUser(prev => ({ ...prev, leaveBalance: Number(e.target.value) }))}
                                        placeholder="enter number of"
                                        required
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" >
                                Edit User
                            </Button>
                        </form>
                    </DialogHeader>

                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserManagement;
