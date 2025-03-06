import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

export function ReviewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews] = useState([
    { 
      image: "", 
      text: "Absolutely breathtaking experience! Would highly recommend.", 
      author: "Alice" 
    },
    { 
      image: "", 
      text: "A service that exceeded all my expectations!", 
      author: "Bob" 
    },
    { 
      image: "", 
      text: "A magical journey from start to finish!", 
      author: "Charlie" 
    },
    { 
      image: "", 
      text: "Incredible attention to detail and exceptional customer service!", 
      author: "David" 
    },
    { 
      image: "", 
      text: "Transformative experience that I'll never forget!", 
      author: "Emma" 
    },
    { 
      image: "", 
      text: "Professionalism combined with creativity at its finest!", 
      author: "Frank" 
    },
    { 
      image: "", 
      text: "A perfect blend of innovation and customer satisfaction!", 
      author: "Grace" 
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 3) % reviews.length
      );
    }, 5000); // Change reviews every 5 seconds

    return () => clearInterval(interval);
  }, [reviews.length]);

  const displayedReviews = reviews.slice(currentIndex, currentIndex + 3)
    .concat(reviews.slice(0, Math.max(0, (currentIndex + 3) - reviews.length)));

  return (
    <motion.div
      className="w-full max-w-5xl mx-auto py-16 px-8 rounded-xl bg-gray-900/50 text-white shadow-xl backdrop-blur-md border border-gray-700/30 
      group transition-all duration-500 hover:shadow-purple-500/40 hover:bg-purple-500/20"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Title Section with Hover Effect */}
      <motion.h2
        className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent 
        transition-all duration-500 group-hover:text-purple-300 group-hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]"
      >
        What Our Customers Say
      </motion.h2>
      <motion.p
        className="text-center text-gray-400 italic mb-10 text-lg transition-all duration-500 
        group-hover:text-purple-300 group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]"
      >
        "Your words inspire us to grow!"
      </motion.p>

      <AnimatePresence mode="wait">
        <div 
          key={currentIndex} 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {displayedReviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card 
                className="w-full h-full border border-gray-600/30 bg-gray-800/50 p-6 rounded-xl shadow-lg backdrop-blur-md 
                group-hover:shadow-purple-400/50 group-hover:bg-purple-500/10 transition-all duration-500"
              >
                <CardContent className="flex flex-col items-center text-center">
                  <Avatar className="w-20 h-20 mb-4 border-2 border-purple-400 shadow-md">
                    <AvatarImage src={review.image} alt={review.author} />
                    <AvatarFallback className="text-purple-400 text-2xl">
                      {review.author[0]}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-gray-300 mb-3 text-lg">"{review.text}"</p>
                  <p className="font-semibold text-purple-400 text-lg">- {review.author}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </motion.div>
  );
}

export default ReviewsCarousel;