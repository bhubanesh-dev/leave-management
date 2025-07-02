
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useUserStore from '@/store/useUserStore';
import { toast } from 'sonner';
import type { Leaves } from '@/apis/leaves';
import leavesApi from '@/apis/leaves';


const LeaveApplication: React.FC = () => {

  const { user } = useUserStore();

  const [formData, setFormData] = useState<Leaves>({
    title: '',
    reason: '',
    startDate: '',
    endDate: ''
  });

  const calculateDays = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    const daysRequested = calculateDays(formData.startDate, formData.endDate);
    if (daysRequested <= 0) {
      toast("Fill dates")
      return;
    }

    if (daysRequested > user?.leaveBalance) {
      toast("Your are short of leaves");
      return
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast("Invalid date selection")
      return;
    }

    const leaveApplyResponse = await leavesApi.applyLeaves(formData);

    if (leaveApplyResponse.status === 201) {
      toast(leaveApplyResponse.data.message);
    }


    setFormData({
      title: '',
      reason: '',
      startDate: '',
      endDate: ''
    });
  };

  const daysRequested = calculateDays(formData.startDate, formData.endDate);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apply for Leave</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leave Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Annual Leave, Sick Leave, Personal Leave"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason *
            </label>
            <Input
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Please provide reason for leave"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                required
                min={formData.startDate || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {daysRequested > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Days Requested:</strong> {daysRequested} day{daysRequested !== 1 ? 's' : ''}
              </p>
              {(user?.leaveBalance || 0) - daysRequested >= 0 && (
                <p className="text-sm text-blue-600">
                  Remaining Balance: {(user?.leaveBalance || 0) - daysRequested} days
                </p>
              )}
               

            </div>
          )}
          <Button type="submit" onClick={() => handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
            Submit Leave Application
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LeaveApplication;
