import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "@/hooks/use-fetch";
import { applyToJob } from "@/api/apiApplications";
import { BarLoader } from "react-spinners";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  Briefcase,
  GraduationCap,
  FileText,
  ChevronRight,
  Key,
  FileSignature,
  User,
  Database,
  Lock,
  Building,
  Award,
  Star,
} from "lucide-react";
import { Badge } from "./ui/badge";

axios.defaults.baseURL = "http://localhost:5000";

const schema = z.object({
  experience: z
    .number()
    .min(0, { message: "Experience must be at least 0" })
    .int(),
  skills: z.string().min(1, { message: "Skills are required" }),
  education: z.enum(["Intermediate", "Graduate", "Post Graduate"], {
    message: "Education is required",
  }),
  resume: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "application/pdf" ||
          file[0].type === "application/msword" ||
          file[0].type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file[0].type.startsWith("image/")),
      { message: "Only PDF, Word documents, or images are allowed" }
    ),
  // Changed certificates to file upload
  certificates: z
    .any()
    .optional()
    .refine(
      (file) =>
        !file[0] ||
        file[0].type === "application/pdf" ||
        file[0].type === "application/msword" ||
        file[0].type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file[0].type.startsWith("image/"),
      { message: "Only PDF, Word documents, or images are allowed" }
    ),
  // Added optional fields
  previous_company: z.string().optional(),
  certificate_name: z.string().optional(),
});

const ApplyJobDrawer = ({ user, job, applied = false, fetchJob }) => {
  const [showExperienceDrawer, setShowExperienceDrawer] = useState(false);
  const [showExperienceAlert, setShowExperienceAlert] = useState(false);
  const [experienceAlertMessage, setExperienceAlertMessage] = useState("");
  const [experienceAlertType, setExperienceAlertType] = useState("success");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(schema) });

  const {
    register: registerExperience,
    handleSubmit: handleSubmitExperience,
    formState: { errors: errorsExperience },
  } = useForm();

  const {
    loading: loadingApply,
    error: errorApply,
    fn: fnApply,
  } = useFetch(applyToJob);

  const onSubmit = async (data) => {
    try {
      // Create form data to properly handle file uploads
      const formData = {
        ...data,
        job_id: job.id,
        candidate_id: user.id,
        name: user.fullName,
        status: "applied",
        resume: data.resume[0],
        // Handle certificates file if it exists
        certificates:
          data.certificates && data.certificates[0]
            ? data.certificates[0]
            : null,
      };

      await fnApply(formData);

      toast.success("Application submitted successfully!");
      reset();

      try {
        await fetchJob();
      } catch (fetchError) {
        console.error("Failed to refresh job data:", fetchError);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const onExperienceSubmit = async (formData) => {
    try {
      const payload = {
        data: formData.data,
        publicKey: formData.publicKey,
        signature: formData.signature,
        userAddress: formData.userAddress,
        privateKey: formData.privateKey,
      };

      const response = await axios.post(
        "/api/blockchain/verify-signature",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.dismiss();
      if (response.data?.success) {
        const txHash = response.data.transactionHash || "Unknown hash";
        toast.success(`✅ Verified! TX Hash: ${txHash}`);
      } else {
        const errorMsg = response.data?.message || "Verification failed";
        toast.error(`❌ ${errorMsg}`);
      }
      setShowExperienceDrawer(false);
    } catch (error) {
      toast.dismiss();
      console.error("Full Error Context:", {
        error,
        response: error.response?.data,
      });

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Blockchain operation failed";
      toast.error(`❌ ${errorMessage}`);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Drawer open={applied ? false : undefined}>
        <DrawerTrigger asChild>
          <Button
            size="lg"
            className="w-full md:w-auto h-12 font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
            variant={job?.isOpen && !applied ? "blue" : "destructive"}
            disabled={!job?.isOpen || applied}
          >
            {job?.isOpen
              ? applied
                ? "Applied"
                : "Apply Now"
              : "Hiring Closed"}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-w-4xl mx-auto max-h-[95vh]">
          <DrawerHeader className="border-b pb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Briefcase className="w-5 h-5 text-blue-500" />
              <DrawerTitle className="text-2xl font-bold">
                Apply for {job?.title} at {job?.company?.name}
              </DrawerTitle>
            </div>
            <DrawerDescription className="text-base">
              Please complete the application form below to be considered for
              this position.
            </DrawerDescription>
          </DrawerHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto p-6">
            <div className="md:col-span-2">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-blue-500" />
                    <Label htmlFor="experience" className="font-medium">
                      Work Experience
                    </Label>
                  </div>
                  <Input
                    id="experience"
                    type="number"
                    placeholder="Years of Experience"
                    className="h-12 text-base"
                    {...register("experience", {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.experience && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />{" "}
                      {errors.experience.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-blue-500" />
                    <Label htmlFor="skills" className="font-medium">
                      Skills
                    </Label>
                  </div>
                  <Input
                    id="skills"
                    type="text"
                    placeholder="Skills (Comma Separated)"
                    className="h-12 text-base"
                    {...register("skills")}
                  />
                  {errors.skills && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />{" "}
                      {errors.skills.message}
                    </p>
                  )}
                </div>

                {/* Previous Company Field */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-blue-500" />
                    <Label htmlFor="previous_company" className="font-medium">
                      Previous Company (Optional)
                    </Label>
                  </div>
                  <Input
                    id="previous_company"
                    type="text"
                    placeholder="Previous Company Name"
                    className="h-12 text-base"
                    {...register("previous_company")}
                  />
                  {errors.previous_company && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />{" "}
                      {errors.previous_company.message}
                    </p>
                  )}
                </div>

                {/* Certificate Name Field */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-blue-500" />
                    <Label htmlFor="certificate_name" className="font-medium">
                      Name of the Certificate (Optional)
                    </Label>
                  </div>
                  <Input
                    id="certificate_name"
                    type="text"
                    placeholder="Enter the name of your certificate"
                    className="h-12 text-base"
                    {...register("certificate_name")}
                  />
                  {errors.certificate_name && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />{" "}
                      {errors.certificate_name.message}
                    </p>
                  )}
                </div>

                {/* Certificates Field - Changed to file upload */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-blue-500" />
                    <Label htmlFor="certificates" className="font-medium">
                      Certificates (Optional)
                    </Label>
                  </div>
                  <Input
                    id="certificates"
                    type="file"
                    accept=".pdf, .doc, .docx, image/*"
                    className="h-12 text-base file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    {...register("certificates")}
                  />
                  {errors.certificates && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />{" "}
                      {errors.certificates.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-blue-500" />
                    <Label className="font-medium">Education Level</Label>
                  </div>
                  <Controller
                    name="education"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        {...field}
                        className="grid grid-cols-1 md:grid-cols-3 gap-3"
                      >
                        <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-slate-50">
                          <RadioGroupItem
                            value="Intermediate"
                            id="intermediate"
                          />
                          <Label
                            htmlFor="intermediate"
                            className="cursor-pointer"
                          >
                            Intermediate
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-slate-50">
                          <RadioGroupItem value="Graduate" id="graduate" />
                          <Label htmlFor="graduate" className="cursor-pointer">
                            Graduate
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-slate-50">
                          <RadioGroupItem
                            value="Post Graduate"
                            id="post-graduate"
                          />
                          <Label
                            htmlFor="post-graduate"
                            className="cursor-pointer"
                          >
                            Post Graduate
                          </Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {errors.education && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />{" "}
                      {errors.education.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <Label htmlFor="resume" className="font-medium">
                      Resume
                    </Label>
                  </div>
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf, .doc, .docx, image/*"
                    className="h-12 text-base file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    {...register("resume")}
                  />
                  {errors.resume && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />{" "}
                      {errors.resume.message}
                    </p>
                  )}
                </div>

                {errorApply?.message && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md">
                    <p className="flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errorApply?.message}
                    </p>
                  </div>
                )}

                {loadingApply && (
                  <div className="py-3">
                    <BarLoader width={"100%"} color="#2563eb" />
                  </div>
                )}

                <Button
                  type="submit"
                  variant="blue"
                  size="lg"
                  className="h-12 font-semibold text-base"
                >
                  Submit Application
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowExperienceDrawer(true)}
                  className="w-full h-12 flex items-center justify-between"
                >
                  <span className="flex items-center">
                    <Badge variant="outline" className="mr-2">
                      Blockchain
                    </Badge>
                    Add Previous Experience Verification
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="md:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-4">
                    Application Tips
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>
                        Tailor your skills to match the job requirements
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Make sure your resume is up-to-date</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>
                        Include previous company information for validation
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>
                        Upload certificates to stand out from other applicants
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>
                        Verify your experience with blockchain for faster
                        processing
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mt-4">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-2">
                    About {job?.company?.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Learn more about the company culture and benefits before
                    applying.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Company Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <Drawer
            open={showExperienceDrawer}
            onOpenChange={setShowExperienceDrawer}
          >
            <DrawerContent className="max-w-4xl mx-auto">
              <DrawerHeader className="border-b pb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <FileSignature className="w-5 h-5 text-blue-500" />
                  <DrawerTitle className="text-2xl font-bold">
                    Blockchain Experience Verification
                  </DrawerTitle>
                </div>
                <DrawerDescription className="text-base">
                  Securely verify your previous work experience using blockchain
                  technology.
                </DrawerDescription>
              </DrawerHeader>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                <div className="md:col-span-2">
                  <form
                    onSubmit={handleSubmitExperience(onExperienceSubmit)}
                    className="flex flex-col gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Database className="w-4 h-4 text-blue-500" />
                        <Label htmlFor="exp-data" className="font-medium">
                          Experience Data
                        </Label>
                      </div>
                      <Input
                        id="exp-data"
                        type="text"
                        placeholder="Experience data to be verified"
                        className="h-12 text-base"
                        {...registerExperience("data")}
                      />
                      {errorsExperience?.data && (
                        <p className="text-red-500 text-sm flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />{" "}
                          {errorsExperience.data.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Key className="w-4 h-4 text-blue-500" />
                        <Label htmlFor="exp-publicKey" className="font-medium">
                          Public Key
                        </Label>
                      </div>
                      <Input
                        id="exp-publicKey"
                        type="text"
                        placeholder="Your blockchain public key"
                        className="h-12 text-base"
                        {...registerExperience("publicKey")}
                      />
                      {errorsExperience?.publicKey && (
                        <p className="text-red-500 text-sm flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />{" "}
                          {errorsExperience.publicKey.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <FileSignature className="w-4 h-4 text-blue-500" />
                        <Label htmlFor="exp-signature" className="font-medium">
                          Digital Signature
                        </Label>
                      </div>
                      <Input
                        id="exp-signature"
                        type="text"
                        placeholder="Cryptographic signature"
                        className="h-12 text-base"
                        {...registerExperience("signature")}
                      />
                      {errorsExperience?.signature && (
                        <p className="text-red-500 text-sm flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />{" "}
                          {errorsExperience.signature.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-blue-500" />
                        <Label
                          htmlFor="exp-userAddress"
                          className="font-medium"
                        >
                          Wallet Address
                        </Label>
                      </div>
                      <Input
                        id="exp-userAddress"
                        type="text"
                        placeholder="Your blockchain wallet address"
                        className="h-12 text-base"
                        {...registerExperience("userAddress")}
                      />
                      {errorsExperience?.userAddress && (
                        <p className="text-red-500 text-sm flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />{" "}
                          {errorsExperience.userAddress.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4 text-blue-500" />
                        <Label htmlFor="exp-privateKey" className="font-medium">
                          Private Key
                        </Label>
                      </div>
                      <Input
                        id="exp-privateKey"
                        type="password"
                        placeholder="Your private key (never shared)"
                        className="h-12 text-base"
                        {...registerExperience("privateKey")}
                      />
                      {errorsExperience?.privateKey && (
                        <p className="text-red-500 text-sm flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />{" "}
                          {errorsExperience.privateKey.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      variant="blue"
                      size="lg"
                      className="h-12 font-semibold text-base mt-2"
                    >
                      Verify Experience
                    </Button>
                  </form>
                </div>

                <div className="md:col-span-1">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-lg mb-4">
                        Verification Benefits
                      </h3>
                      <ul className="space-y-4">
                        <li className="flex gap-2">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>Instant verification of work history</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>Tamper-proof credential validation</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>Higher credibility with employers</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>Faster application processing time</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="mt-4">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-lg mb-2">Need Help?</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Not sure how to get your blockchain credentials?
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        View Verification Guide
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <DrawerFooter className="border-t">
                <DrawerClose asChild>
                  <Button variant="outline" className="h-12">
                    Cancel Verification
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          <DrawerFooter className="border-t">
            <DrawerClose asChild>
              <Button variant="outline" className="h-12">
                Cancel Application
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ApplyJobDrawer;
