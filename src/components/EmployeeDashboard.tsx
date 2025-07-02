
import React, { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import LeaveApplication from './LeaveApplication';
import useUserStore from '@/store/useUserStore';
import leavesApi from '@/apis/leaves';
import Logout from './Logout';
import PasswordChange from './PasswordChange';

export interface leaves {
  _id: string,
  userName: string,
  title: string,
  reason: string,
  startDate: string,
  endDate: string,
  noOfDays: number,
  status: string,
  appliedDate: string
}


const EmployeeDashboard: React.FC = () => {

  const { user } = useUserStore();

  const [userLeaves, setUserLeaves] = useState<leaves[]>([]);

  useEffect(() => {
    (async () => {

      const yourLeaves = await leavesApi.getYourLeaves();

      if (yourLeaves.status === 200) {
        setUserLeaves(yourLeaves.data);
      }
    })();
  }, [])



  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.name}</span>
              <Logout />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, {user?.name}!
              </h2>
              <p className="text-blue-100">
                Manage your leave applications and account settings.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Remaining Leave Days</h3>
              <div className="text-3xl font-bold">
                {user?.leaveBalance || 0} days
              </div>
              <p className="text-green-100 text-sm">
                Out of 15 annual leave days
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="apply" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="apply">Apply for Leave</TabsTrigger>
            <TabsTrigger value="status" >Leave Status</TabsTrigger>
            <TabsTrigger  value="change-password">Change Password</TabsTrigger>
          </TabsList>

          <TabsContent value="apply">
            <LeaveApplication />
          </TabsContent>

          <TabsContent value="status">
            <Card>
              <CardHeader>
                <CardTitle>My Leave Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {userLeaves.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No leave applications found
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left p-3">Title</th>
                          <th className="text-left p-3">Start Date</th>
                          <th className="text-left p-3">End Date</th>
                          <th className="text-left p-3">Days</th>
                          <th className="text-left p-3">Applied Date</th>
                          <th className="text-left p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userLeaves.map((leave) => (
                          <tr key={leave._id} className="border-b hover:bg-gray-50">
                            <td className="p-3">{leave.title}</td>
                            <td className="p-3">{new Date(leave.startDate).toLocaleDateString()}</td>
                            <td className="p-3">{new Date(leave.endDate).toLocaleDateString()}</td>
                            <td className="p-3">{leave.noOfDays}</td>
                            <td className="p-3">{new Date(leave.appliedDate).toLocaleDateString()}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${leave.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                  leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                {leave.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="change-password" >
            <PasswordChange />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
