import { motion } from "motion/react"

const Hoverer = ({ children }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
        >
            {children}
        </motion.div>
    );
};

export default Hoverer;