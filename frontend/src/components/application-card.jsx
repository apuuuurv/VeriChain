import { useState, useEffect } from "react";
import {
  Boxes,
  BriefcaseBusiness,
  Download,
  School,
  Building,
  Award,
  CheckCircle,
  ShieldX,
  ShieldCheck,
  FileSignature,
  Info,
} from "lucide-react";
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
import { Badge } from "./ui/badge";
import axios from "axios"; // Import axios for API calls
import { toast } from "react-toastify"; // Import Toastify

const ApplicationCard = ({ application, isCandidate = false }) => {
  const [status, setStatus] = useState(application?.status);
  const [userAddress, setUserAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [index, setIndex] = useState("");
  const [newData, setNewData] = useState("");
  const [isFieldsFilled, setIsFieldsFilled] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showBlockchainDetails, setShowBlockchainDetails] = useState(false);

  useEffect(() => {
    // Check if this user has blockchain verification
    const checkVerification = async () => {
      if (application?.userAddress) {
        setIsLoading(true);
        try {
          const response = await axios.post(
            "http://localhost:5000/api/blockchain/get-blocks",
            { userAddress: application.userAddress },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          // If there are blocks associated with this user, they are verified
          if (response.data?.blocks && response.data.blocks.length > 0) {
            setIsVerified(true);
            console.log("User verified via blockchain");
          } else {
            setIsVerified(false);
            console.log("User not verified via blockchain");
          }
        } catch (error) {
          console.error("Error checking verification status:", error);
          // Don't set verification to false on error, as it might be a network issue
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    checkVerification();
  }, [application]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

  const handleCertificateDownload = () => {
    if (application?.certificates) {
      const link = document.createElement("a");
      link.href = application?.certificates;
      link.target = "_blank";
      link.click();
    } else {
      toast.info("No certificate available for download");
    }
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
      toast.success(`You have ${decision.toLowerCase()} the job offer.`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update application status");
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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.message === "Block updated successfully") {
        toast.success(
          `✅ Block updated! TX Hash: ${response.data.receipt.transactionHash}`
        );
        setIsVerified(true); // Set verification to true after successful update
      } else {
        toast.error(`❌ ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error updating block:", error);
      toast.error(
        `❌ Error: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const BlockchainVerificationBadge = () => {
    if (!isCandidate) {
      return (
        <div className="flex items-center gap-2">
          {application?.blockchain_verified ? (
            <Badge variant="outline" className="bg-green-50 text-green-600">
              <ShieldCheck className="mr-2 h-8 w-7" /> Blockchain Verified
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-50 text-red-600">
              <ShieldX className="mr-2 h-8 w-7" /> Not Verified
            </Badge>
          )}
          {/* {application?.blockchain_verified && (
            <Info
              className="text-blue-500 cursor-pointer"
              onClick={() => setShowBlockchainDetails(!showBlockchainDetails)}
            />
          )} */}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          {isCandidate
            ? `${application?.job?.title} at ${application?.job?.company?.name}`
            : application?.name}
          <div className="flex items-center gap-2">
            <BlockchainVerificationBadge />
            <Download
              size={18}
              className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer"
              onClick={handleDownload}
            />
          </div>
        </CardTitle>
      </CardHeader>
      
       {/* Blockchain Verification Details */}
       {/* {!isCandidate && showBlockchainDetails && application?.blockchain_verified && (
        <div className="bg-blue-50 p-4 border-t text-sm">
          <div className="flex items-center mb-2">
            <FileSignature className="mr-2 h-5 w-5 text-blue-600" />
            <span className="font-semibold">Blockchain Verification Details</span>
          </div>
          <div className="space-y-1">
            <p><strong>Transaction Hash:</strong> {application.blockchain_transaction_hash}</p>
            <p><strong>Verified On:</strong> {new Date(application.blockchain_verification_date).toLocaleString()}</p>
            <p><strong>Wallet Address:</strong> {application.blockchain_user_address}</p>
          </div>
        </div>
      )} */}

      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col md:flex-row justify-between mb-2">
          <div className="flex gap-2 items-center">
            <BriefcaseBusiness size={15} />
            {application?.experience} years of experience
            {isVerified && (
              <CheckCircle size={14} className="text-green-500 ml-1" />
            )}
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

        {/* Add Previous Company Information */}
        {application?.previous_company && (
          <div className="flex gap-2 items-center mb-2">
            <Building size={15} />
            Previous Company: {application?.previous_company}
            {isVerified && (
              <CheckCircle size={14} className="text-green-500 ml-1" />
            )}
          </div>
        )}

        {/* Add Certificate Information */}
        {application?.certificates && (
          <div className="flex gap-2 items-center justify-between mb-2">
            <div className="flex gap-2 items-center">
              <Award size={15} />
              {application?.certificate_name
                ? `Certificate: ${application?.certificate_name}`
                : "Certificate Available"}
              {isVerified && (
                <CheckCircle size={14} className="text-green-500 ml-1" />
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={handleCertificateDownload}
            >
              <Download size={12} className="mr-1" /> View Certificate
            </Button>
          </div>
        )}

        <hr />

        {/* Show input fields if the user is hired */}
        {isCandidate && status === "hired" && (
          <div className="flex flex-col gap-3 w-full">
            <div className="flex gap-2 mb-2">
              <h3 className="font-medium">Blockchain Verification</h3>
              {isVerified ? (
                <Badge className="bg-green-500 text-white">Verified</Badge>
              ) : (
                <Badge className="bg-yellow-500 text-white">Not Verified</Badge>
              )}
            </div>
            <div className="flex gap-3 w-full">
              <input
                type="text"
                placeholder="User Address"
                className="bg-black text-white border border-gray-400 p-2 rounded-md flex-1"
                value={userAddress}
                onChange={(e) => {
                  setUserAddress(e.target.value);
                  handleInputChange();
                }}
              />
              <input
                type="password"
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
                placeholder="Experience Data"
                className="bg-black text-white border border-gray-400 p-2 rounded-md flex-1"
                value={newData}
                onChange={(e) => {
                  setNewData(e.target.value);
                  handleInputChange();
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="capitalize font-bold">
            {new Date(application?.created_at).toLocaleString()}
          </span>
          {isVerified && (
            <span className="text-green-500 text-sm flex items-center">
              <CheckCircle size={12} className="mr-1" />
              Blockchain Verified
            </span>
          )}
        </div>
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
