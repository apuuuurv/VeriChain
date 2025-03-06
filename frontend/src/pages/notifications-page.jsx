import CreatedApplications from "@/components/created-applications";
import CreatedJobs from "@/components/created-jobs";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import { motion } from "framer-motion";

const Notifications = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
    >
      <motion.h1
        className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
      >
        {user?.unsafeMetadata?.role === "candidate"
          ? "My Recruiting Status"
          : "My Jobs"}
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: 0.7 } }}
      >
        {user?.unsafeMetadata?.role === "candidate" ? (
          <CreatedApplications />
        ) : (
          <CreatedJobs />
        )}
      </motion.div>
    </motion.div>
  );
};

export default Notifications;
