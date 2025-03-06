import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import companies from "../data/companies.json";
import faqs from "../data/faq.json";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import ContactForm from "./contact-form";
import Reviews, { ReviewsCarousel } from "./reviews";
import ThreeScene from "@/components/particles-background";
import ParticlesBackground from "@/components/particles-background";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.6, 0.05, 0.01, 0.9],
    },
  },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.6, 0.05, 0.01, 0.9],
    },
  },
};
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.3 } },
};

const LandingPage = () => {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-indigo-950/20 to-gray-950 -z-10"></div>
      <div className="opacity-80">
        <ParticlesBackground />
      </div>
      <motion.main
        className="relative flex flex-col gap-10 sm:gap-20 py-10 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <section className="text-center relative z-10">
          {/* Subtle glow effect behind the title */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl mx-auto bg-blue-500/10 rounded-full blur-3xl -z-10"></div>

          <motion.h1
            className="flex flex-col items-center justify-center font-extrabold text-4xl sm:text-6xl lg:text-8xl tracking-tighter py-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
            variants={fadeInUp}
          >
            Find Your Dream Job
            <span className="flex items-center gap-2 sm:gap-6">
              and get
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-xl"></div>
                <motion.img
                  src="/logo.png"
                  className="h-14 sm:h-24 lg:h-32 relative z-10"
                  alt="Hirrd Logo"
                  whileHover={{ scale: 1.1 }}
                />
              </div>
            </span>
          </motion.h1>
          <motion.p
            className="text-gray-300 sm:mt-4 text-xs sm:text-xl max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            Explore thousands of job listings or find the perfect candidate
          </motion.p>
        </section>

        <div className="flex gap-6 justify-center">
          <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }}>
            <Link to={"/jobs"}>
              <Button
                variant="blue"
                size="xl"
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-600/20 transition-all duration-300"
              >
                Find Jobs
              </Button>
            </Link>
          </motion.div>
          <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }}>
            <Link to={"/post-job"}>
              <Button
                variant="destructive"
                size="xl"
                className="bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-500 hover:to-pink-400 shadow-lg shadow-red-600/20 transition-all duration-300"
              >
                Post a Job
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-950 to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-950 to-transparent z-10"></div>
          <Carousel
            plugins={[Autoplay({ delay: 2000 })]}
            className="w-full py-10"
          >
            <CarouselContent className="flex gap-5 sm:gap-20 items-center">
              {companies.map(({ name, id, path }) => (
                <CarouselItem key={id} className="basis-1/3 lg:basis-1/6 ">
                  <motion.img
                    src={path}
                    alt={name}
                    className="h-9 sm:h-14 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 px-0">
          {[
            {
              title: "For Job Seekers",
              icon: "🚀",
              description:
                "Search and apply for jobs, track applications, and receive personalized job recommendations tailored to your skills and experience.",
            },
            {
              title: "For Employers",
              icon: "✨",
              description:
                "Post jobs, manage applications, and find the best candidates with our AI-powered matching system that connects you with top talent.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={index % 2 === 0 ? fadeInLeft : fadeInRight}
              whileHover={{
                scale: 1.03,
                y: -5,
                boxShadow:
                  "0 20px 25px -5px rgba(139, 92, 246, 0.1), 0 10px 10px -5px rgba(139, 92, 246, 0.04)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="w-full"
            >
              <Card
                className="w-full border border-gray-700/50 bg-gray-900/60 rounded-xl shadow-lg backdrop-blur-md 
                hover:bg-purple-900/20 hover:border-purple-500/40 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full" />
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{item.icon}</span>
                    <CardTitle className="font-bold text-xl sm:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                      {item.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        <motion.section variants={fadeInUp} className="w-full mx-auto">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
            variants={fadeInUp}
          >
            Frequently Asked Questions
          </motion.h2>
          <Accordion
            type="single"
            collapsible
            className="bg-gray-900/60 border border-gray-800 rounded-xl backdrop-blur-md p-2"
          >
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={fadeInUp} custom={index}>
                <AccordionItem
                  value={`item-${index + 1}`}
                  className="border-b border-gray-800 last:border-b-0 w-full"
                >
                  <AccordionTrigger className="hover:text-purple-400 transition-colors py-4 px-2">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 py-4 px-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.section>

        <motion.section variants={fadeInUp} className="relative w-full">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1/2 bg-blue-600/10 rounded-full blur-3xl -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 2 }}
          />
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
            variants={fadeInUp}
          ></motion.h2>
          <ReviewsCarousel />
        </motion.section>

        <motion.div variants={fadeInUp} className="relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1/2 max-w-3xl mx-auto bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
          <ContactForm />
        </motion.div>

        <motion.section
          variants={fadeInUp}
          className="relative w-full flex flex-col items-center py-10"
        >
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
            variants={fadeInUp}
          >
            How Our Website Works
          </motion.h2>
          <motion.video
            className="w-full h-auto rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
            controls
            preload="metadata"
            variants={fadeInUp}
          >
            <source src="/VeriChain.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </motion.video>
        </motion.section>
      </motion.main>
    </>
  );
};

export default LandingPage;
