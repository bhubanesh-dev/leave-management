
import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useUserStore from '@/store/useUserStore';
import UserManagement from './UserManagement';
import LeaveManagement from './LeaveManagement';
import PasswordChange from './PasswordChange';
import Logout from './Logout';
import { Card, CardContent } from './ui/card';


const AdminDashboard: React.FC = () => {
    const { user } = useUserStore();

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600">Welcome, {user?.name}</span>
                            <Logout />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white mb-8">
                    <CardContent className="p-6">
                        <h2 className="text-2xl font-bold mb-2">
                            Welcome back, {user?.name}!
                        </h2>
                        <p className="text-blue-100">
                            Manage your leave applications and account settings.
                        </p>
                    </CardContent>
                </Card>

                <Tabs defaultValue="users" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="users">User Management</TabsTrigger>
                        <TabsTrigger value="leaves">Leave Management</TabsTrigger>
                        <TabsTrigger value="change-password">Change Password</TabsTrigger>
                    </TabsList>
                    <TabsContent value="users">
                        <UserManagement />
                    </TabsContent>
                    <TabsContent value="leaves">
                        <LeaveManagement />
                    </TabsContent>
                    <TabsContent value="change-password" >
                        <PasswordChange />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
};

export default AdminDashboard;
