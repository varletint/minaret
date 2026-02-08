import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

const messages = [
  "Support the Ummah • Give Sadaqah Today",
  "Your Donation Keeps Us Running • Support Minaret Live",
  "Help Spread Islamic Knowledge • Donate Now",
  "Support Da'wah Efforts • Make a Difference",
  "Keep the Broadcasts Alive • Donate with Barakah",
];

export function DonationBanner() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/donate");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={handleClick}
      className='fixed top-17 left-0 right-0 z-40 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white cursor-pointer overflow-hidden group hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-500 transition-all duration-300'
      role='button'
      aria-label='Navigate to donation page'>
      {/* Animated background pattern */}
      <div className='absolute inset-0 opacity-20'>
        <div className='absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]' />
      </div>

      <div className='relative flex items-center justify-center gap-3 py-2 px-4'>
        {/* Animated heart icon */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
          }}>
          <Heart className='h-4 w-4 fill-white' />
        </motion.div>

        {/* Scrolling text container */}
        <div className='flex-1 overflow-hidden'>
          <motion.div
            className='flex gap-8 whitespace-nowrap'
            animate={{
              x: [0, -1000],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            }}>
            {/* Duplicate messages for seamless loop */}
            {[...messages, ...messages, ...messages].map((message, index) => (
              <span
                key={index}
                className='text-sm font-medium inline-flex items-center gap-2'>
                {message}
                <span className='text-white/60'>•</span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* Call to action */}
        <motion.div
          className='hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}>
          <span className='text-xs font-semibold'>Donate</span>
          <motion.span
            animate={{ x: [0, 3, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "loop",
            }}>
            →
          </motion.span>
        </motion.div>
      </div>

      {/* Shimmer effect on hover */}
      <motion.div
        className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100'
        initial={{ x: "-100%" }}
        whileHover={{
          x: "100%",
          transition: {
            duration: 0.6,
            ease: "easeInOut",
          },
        }}
      />
    </motion.div>
  );
}
