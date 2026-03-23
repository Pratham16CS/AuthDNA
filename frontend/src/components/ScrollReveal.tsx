import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
}

const getVariants = (direction: string): Variants => {
  const initial = { opacity: 0, filter: "blur(4px)" };
  if (direction === "up") return { hidden: { ...initial, y: 16 }, visible: { opacity: 1, y: 0, filter: "blur(0px)" } };
  if (direction === "left") return { hidden: { ...initial, x: -20 }, visible: { opacity: 1, x: 0, filter: "blur(0px)" } };
  if (direction === "right") return { hidden: { ...initial, x: 20 }, visible: { opacity: 1, x: 0, filter: "blur(0px)" } };
  return { hidden: initial, visible: { opacity: 1, filter: "blur(0px)" } };
};

const ScrollReveal = ({ children, className, delay = 0, direction = "up" }: ScrollRevealProps) => (
  <motion.div
    className={className}
    variants={getVariants(direction)}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

export default ScrollReveal;
