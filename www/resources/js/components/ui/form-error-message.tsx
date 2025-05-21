import { AnimatePresence, motion } from 'motion/react';

interface FormErrorMessageProps {
  message?: string;
}

export function FormErrorMessage({ message }: FormErrorMessageProps) {
  return (
    <div className="min-h-[1.25rem] text-sm text-destructive">
      <AnimatePresence mode="wait">
        {message && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
