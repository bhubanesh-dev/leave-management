import axios from "axios";

export interface Leaves {
  title: string;
  reason: string;
  startDate: string;
  endDate: string;
}

interface Payload{
    id: string,
    status: string,
    noOfDays :  number
}

const getAllLeaves = () =>
  axios.get("/leave/all-leaves", { withCredentials: true });
const applyLeaves = (leave: Leaves) =>
  axios.post("leave/create", leave, { withCredentials: true });
const getYourLeaves = () => axios.get("leave/me", { withCredentials: true });

const updateLeaves = (payload : Payload) =>
  axios.put(
    `leave/${payload.id}/${payload.status}`,
    { noOfDays: payload.noOfDays },
    { withCredentials: true }
  );

const leavesApi = { getAllLeaves, applyLeaves, getYourLeaves, updateLeaves };

export default leavesApi;
