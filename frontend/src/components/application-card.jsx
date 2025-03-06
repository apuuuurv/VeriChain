import { useState } from "react";
import { Boxes, BriefcaseBusiness, Download, School } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import useFetch from "@/hooks/use-fetch";
import { updateApplicationStatus } from "@/api/apiApplications";
import { BarLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import axios from "axios"; // Import axios for API calls
import { toast } from "react-toastify"; // Import Toastify

const ApplicationCard = ({ application, isCandidate = false }) => {
  const [status, setStatus] = useState(application?.status);
  const [userAddress, setUserAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [index, setIndex] = useState("");
  const [newData, setNewData] = useState("");
  const [isFieldsFilled, setIsFieldsFilled] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateApplicationStatus,
    {
      job_id: application.job_id,
    }
  );

  const handleStatusChange = (status) => {
    fnHiringStatus(status);
  };

  const handleDecision = async (decision) => {
    try {
      await updateApplicationStatus(application.job_id, decision);
      setStatus(decision);
      alert(`You have ${decision} the job offer.`);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleInputChange = () => {
    if (userAddress && privateKey && newData) {
      setIsFieldsFilled(true);
    } else {
      setIsFieldsFilled(false);
    }
  };

  const handleUpdateBlock = async () => {
    try {
      // Validation
      if (!userAddress || !privateKey || !newData) {
        toast.error("❌ Please fill all required fields");
        return;
      }

      const payload = {
        userAddress,
        privateKey,
        newData,
      };

      const response = await axios.post(
        "http://localhost:5000/api/blockchain/update-block",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.message === "Block updated successfully") {
        toast.success(`✅ Block updated! TX Hash: ${response.data.receipt.transactionHash}`);
      } else {
        toast.error(`❌ ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error updating block:", error);
      toast.error(`❌ Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <Card>
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          {isCandidate
            ? `${application?.job?.title} at ${application?.job?.company?.name}`
            : application?.name}
          <Download
            size={18}
            className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer"
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex gap-2 items-center">
            <BriefcaseBusiness size={15} />
            {application?.experience} years of experience
          </div>
          <div className="flex gap-2 items-center">
            <School size={15} />
            {application?.education}
          </div>
          <div className="flex gap-2 items-center">
            <Boxes size={15} />
            Skills: {application?.skills}
          </div>
        </div>
        <hr />

        {/* Show input fields if the user is hired */}
        {isCandidate && status === "hired" && (
          <div className="flex gap-3 w-full">
            <input
              type="text"
              placeholder="User  Address"
              className="bg-black text-white border border-gray-400 p-2 rounded-md flex-1"
              value={userAddress}
              onChange={(e) => {
                setUserAddress(e.target.value);
                handleInputChange();
              }}
            />
            <input
              type="text"
              placeholder="Private Key"
              className="bg-black text-white border border-gray-400 p-2 rounded-md flex-1"
              value={privateKey}
              onChange={(e) => {
                setPrivateKey(e.target.value);
                handleInputChange();
              }}
            />
            <input
              type="text"
              placeholder="New Data"
              className="bg-black text-white border border-gray-400 p-2 rounded-md flex-1"
              value={newData}
              onChange={(e) => {
                setNewData(e.target.value);
                handleInputChange();
              }}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="capitalize font-bold">
          {new Date(application?.created_at).toLocaleString()}
        </span>
        {isCandidate ? (
          status === "hired" ? (
            isFieldsFilled ? (
              <div className="flex gap-4">
                <Button
                  className="px-4 py-2 bg-green-500 text-white rounded-md"
                  onClick={() => handleDecision("Accepted")}
                >
                  Accept
                </Button>
                <Button
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                  onClick={() => handleDecision("Rejected")}
                >
                  Reject
                </Button>
                <Button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  onClick={handleUpdateBlock}
                >
                  Update Block
                </Button>
              </div>
            ) : (
              <span className="text-red-500">Please fill all fields</span>
            )
          ) : (
            <span>Status: {status}</span>
          )
        ) : (
          <Select
            onValueChange={handleStatusChange}
            defaultValue={application.status}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;