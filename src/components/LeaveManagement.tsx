import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import leavesApi from '@/apis/leaves';
import { toast } from 'sonner';
import type { leaves } from './EmployeeDashboard';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const LeaveManagement: React.FC = () => {
    const [leaveApplications, setLeavesApplication] = useState<leaves[]>([]);
    const [selectedLeave, setSelectedLeave] = useState<leaves | null>(null);
    const [approveDays, setApproveDays] = useState<number>(0);
    const [alertOpen, setAlertOpen] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const getAllLeavesResponse = await leavesApi.getAllLeaves();
                if (getAllLeavesResponse.status === 200) {
                    setLeavesApplication(getAllLeavesResponse.data);
                }
            } catch (error) {
                if (error instanceof Error) {
                    toast(error.message);
                }
            }
        })();
    }, []);

    const handleApproveClick = (leave: leaves) => {
        setSelectedLeave(leave);
        setApproveDays(leave.noOfDays);
        setAlertOpen(true);
    };

    const handleApproveConfirm = async () => {
        if (!selectedLeave) return;
        try {
            const payload = {
                id: selectedLeave._id,
                noOfDays: approveDays,
                status: "Approved"
            }

            const updateLeaveResponse = await leavesApi.updateLeaves(payload);
           
            if (updateLeaveResponse.status === 200) {
                toast(updateLeaveResponse.data.message);
                setLeavesApplication(prev =>
                    prev.map(leave =>
                        leave._id === selectedLeave._id
                            ? { ...leave, status: 'Approved', noOfDays: approveDays }
                            : leave
                    )
                );
            }else if(updateLeaveResponse.status === 202){
               
                toast(updateLeaveResponse.data.message)
            }
        } catch (error) {
            if (error instanceof Error)
                toast("Failed to approve leave");
        } finally {
            setAlertOpen(false);
            setSelectedLeave(null);
        }
    };

    const handleDeny = async (leaveId: string) => {
        try {

            const payload = {
                id: leaveId,
                status: "Denied", noOfDays: 0
            }
            const denyLeaveResponse = await leavesApi.updateLeaves(payload);

            if (denyLeaveResponse.status === 200) {
                toast("Leave denied!");
                setLeavesApplication(prev =>
                    prev.map(leave =>
                        leave._id === leaveId
                            ? { ...leave, status: 'Denied' }
                            : leave
                    )
                );
            }


        } catch (error) {
            if (error instanceof Error)
                toast("Failed to deny leave");
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Leave Applications </CardTitle>
            </CardHeader>
            <CardContent>
                {leaveApplications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No leave applications found
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="text-left p-3">Employee Id</th>
                                    <th className="text-left p-3">Name</th>
                                    <th className="text-left p-3">Leave Title</th>
                                    <th className="text-left p-3">Start Date</th>
                                    <th className="text-left p-3">End Date</th>
                                    <th className="text-left p-3">Days</th>
                                    <th className="text-left p-3">Apply Date</th>
                                    <th className="text-left p-3">Status</th>
                                    <th className="text-left p-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaveApplications.map((leave) => (
                                    <tr key={leave._id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{leave._id}</td>
                                        <td className="p-3">{leave.userName}</td>
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
                                        <td className="p-3">
                                            {leave.status === 'Pending' && (
                                                <div className="flex space-x-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleApproveClick(leave)}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleDeny(leave._id)}
                                                    >
                                                        Deny
                                                    </Button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>

            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Approve Leave</AlertDialogTitle>
                        <AlertDialogDescription>
                            Please enter the number of days to approve for this leave application.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <input
                        type="number"
                        defaultValue={1}

                        onChange={e => setApproveDays(Number(e.target.value))}
                        className="border rounded px-2 py-1 w-full my-2"
                    />
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setAlertOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleApproveConfirm}>Approve</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
};

export default LeaveManagement; 