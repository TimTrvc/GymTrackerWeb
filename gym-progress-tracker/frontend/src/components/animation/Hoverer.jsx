import React from "react"
import { motion } from "motion/react"

const Hoverer = ({ children, scaleTap = 0.9, scaleHover = 1.1 }) => {
    return (
        <motion.div
            whileHover={{ scale: scaleHover }}
            whileTap={{ scale: scaleTap }}
        >
            {children}
        </motion.div>
    );
};

export default Hoverer;