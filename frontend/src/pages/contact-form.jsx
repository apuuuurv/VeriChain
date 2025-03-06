import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  FaEnvelope,
  FaUser ,
  FaPaperPlane,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { motion } from "framer-motion";

const FormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email("Invalid email address."),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
});

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:5001/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(`Thanks ${data.name}, your message has been sent!`);
        reset();
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col md:flex-row justify-between p-8 gap-8 bg-gray-900 text-white rounded-lg shadow-lg"
    >
      {/* Left Side */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="w-full md:w-1/2 p-6"
      >
        <h2 className="text-3xl font-bold">We’d Love to Hear from You!</h2>
        <p className="text-gray-300 mt-2">
          Reach out with any questions or feedback.
        </p>
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Email</h3>
          <p className="flex items-center gap-2 text-blue-400">
            <FaEnvelope className="text-xl" />
            <a href="mailto:verichain04@gmail.com" className="hover:underline">
              verichain04@gmail.com
            </a>
          </p>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Socials</h3>
          <div className="flex gap-4 mt-2">
            <a href="#" className="text-blue-400 text-2xl hover:text-blue-500 hover:scale-110 transition-transform">
              <FaFacebookF />
            </a>
            <a href="#" className="text-blue-400 text-2xl hover:text-blue-500 hover:scale-110 transition-transform">
              <FaLinkedinIn />
            </a>
            <a href="#" className="text-pink-400 text-2xl hover:text-pink-500 hover:scale-110 transition-transform">
              <FaInstagram />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Right Side: Contact Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="w-full md:w-1/2 p-8 rounded-lg bg-opacity-10 backdrop-blur-lg shadow-lg border border-gray-700 hover:shadow-[0_0_20px_rgba(138,43,226,0.6)] transition-shadow duration-300"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <motion.div whileHover={{ scale: 1.05 }} className="relative transition-all">
            <FaUser  className="absolute left-3 top-3 text-gray-400" />
            <Input
              {...register("name")}
              placeholder="Name"
              className="pl-10 border-gray-300 bg-gray-800 text-white focus:ring-2 focus:ring-purple-400"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="relative transition-all">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <Input
              {...register("email")}
              placeholder="Email"
              className="pl-10 border-gray-300 bg-gray-800 text-white focus:ring-2 focus:ring-purple-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="transition-all">
            <Textarea
              {...register("message")}
              placeholder="Message"
              className="border-gray-300 bg-gray-800 text-white focus:ring-2 focus:ring-purple-400"
            />
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message.message}</p>
            )}
          </motion.div>
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: " 0px 0px 20px rgba(138, 43, 226, 0.6)",
            }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center gap-2 py-2 rounded-md shadow-md hover:shadow-lg"
          >
            <FaPaperPlane />
            Send Message
          </motion.button>
        </form>
      </motion.div>
      <ToastContainer />
    </motion.div>
  );
};

export default ContactForm;