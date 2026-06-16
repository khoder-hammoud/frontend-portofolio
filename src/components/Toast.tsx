import React, { useEffect, useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { CheckCircle, XCircle, AlertCircle, Info, X, Loader2, ExternalLink } from 'lucide-react';



export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';



export interface ToastAction {

  label: string;

  onClick: () => void;

  href?: string;

}



export interface ToastProps {

  id: string;

  type: ToastType;

  title?: string;

  message: string;

  duration?: number;

  persistent?: boolean;

  action?: ToastAction;

  progress?: number;

  onClose: (id: string) => void;

}



const Toast: React.FC<ToastProps> = ({ 

  id, 

  type, 

  title, 

  message, 

  duration = 5000, 

  persistent = false,

  action,

  progress,

  onClose 

}) => {

  const [isExpanded, setIsExpanded] = useState(false);

  const [shouldShow, setShouldShow] = useState(true);



  useEffect(() => {

    if (!persistent && duration > 0) {

      const timer = setTimeout(() => {

        setShouldShow(false);

        setTimeout(() => onClose(id), 300); // Allow exit animation

      }, duration);



      return () => clearTimeout(timer);

    }

  }, [id, duration, persistent, onClose]);



  const icons = {

    success: <CheckCircle size={20} />,

    error: <XCircle size={20} />,

    warning: <AlertCircle size={20} />,

    info: <Info size={20} />,

    loading: <Loader2 size={20} className="animate-spin" />

  };



  const colors = {

    success: 'bg-green-500/10 border-green-500/30 text-green-400',

    error: 'bg-red-500/10 border-red-500/30 text-red-400',

    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',

    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',

    loading: 'bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan'

  };



  const progressColors = {

    success: 'bg-green-400',

    error: 'bg-red-400',

    warning: 'bg-yellow-400',

    info: 'bg-blue-400',

    loading: 'bg-neon-cyan'

  };



  const handleActionClick = () => {

    if (action) {

      if (action.href) {

        window.open(action.href, '_blank');

      }

      action.onClick();

      onClose(id);

    }

  };



  const messageLength = message.length;

  const shouldTruncate = messageLength > 100;

  const displayMessage = shouldTruncate && !isExpanded 

    ? message.substring(0, 100) + '...' 

    : message;



  return (

    <AnimatePresence>

      {shouldShow && (

        <motion.div

          initial={{ opacity: 0, y: -50, scale: 0.8 }}

          animate={{ opacity: 1, y: 0, scale: 1 }}

          exit={{ opacity: 0, y: -50, scale: 0.8 }}

          transition={{ 

            type: "spring", 

            stiffness: 500, 

            damping: 30,

            mass: 0.8

          }}

          className={`fixed top-4 right-4 z-50 flex ${isExpanded ? 'items-start' : 'items-center'} min-w-[320px] max-w-[400px]`}

        >

          <div className={`relative rounded-lg shadow-2xl border-2 backdrop-blur-md ${colors[type]} overflow-hidden`}>

            {/* Progress Bar for Loading Toasts */}

            {type === 'loading' && progress !== undefined && (

              <motion.div

                className="absolute bottom-0 left-0 right-0 h-1 bg-white/20"

                initial={{ scaleX: 0 }}

                animate={{ scaleX: progress / 100 }}

                transition={{ duration: 0.3 }}

              />

            )}



            {/* Header */}

            <div className="flex items-center justify-between p-4 border-b border-black/10">

              <div className="flex items-center gap-3">

                <div className="flex-shrink-0">

                  <motion.div

                    animate={{ rotate: type === 'loading' ? 360 : 0 }}

                    transition={{ 

                      duration: 2, 

                      repeat: type === 'loading' ? Infinity : 0, 

                      ease: "linear" 

                    }}

                  >

                    {icons[type]}

                  </motion.div>

                </div>

                

                {title && (

                  <div>

                    <h3 className="text-sm font-bold uppercase tracking-wider">

                      {title}

                    </h3>

                  </div>

                )}

              </div>



              <div className="flex items-center gap-2">

                {!persistent && (

                  <motion.button

                    onClick={() => {

                      setShouldShow(false);

                      setTimeout(() => onClose(id), 300);

                    }}

                    className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors"

                    whileHover={{ scale: 1.1 }}

                    whileTap={{ scale: 0.9 }}

                    aria-label="Dismiss notification"

                  >

                    <X size={16} />

                  </motion.button>

                )}

              </div>

            </div>



            {/* Body */}

            <div className={`p-4 ${!title ? 'pt-4' : ''}`}>

              <p className="text-sm leading-relaxed">

                {displayMessage}

              </p>

              

              {/* Expand/Collapse Button */}

              {shouldTruncate && (

                <button

                  onClick={() => setIsExpanded(!isExpanded)}

                  className="mt-2 text-xs text-black/50 hover:text-black/70 transition-colors flex items-center gap-1"

                >

                  {isExpanded ? 'Show less' : 'Show more'}

                </button>

              )}

            </div>



            {/* Action Button */}

            {action && (

              <div className="px-4 pb-4 border-t border-black/10">

                <motion.button

                  onClick={handleActionClick}

                  className="w-full py-2 text-sm font-medium bg-black/10 hover:bg-black/20 rounded transition-colors flex items-center justify-center gap-2"

                  whileHover={{ scale: 1.02 }}

                  whileTap={{ scale: 0.98 }}

                >

                  {action.href && <ExternalLink size={14} />}

                  {action.label}

                </motion.button>

              </div>

            )}



            {/* Progress Indicator for Loading */}

            {type === 'loading' && (

              <div className="absolute bottom-0 left-0 right-0 h-1">

                <motion.div

                  className={`h-full ${progressColors[type]}`}

                  initial={{ scaleX: 0 }}

                  animate={{ scaleX: 1 }}

                  transition={{ 

                    duration: duration || 5000, 

                    ease: "linear",

                    repeat: Infinity,

                    repeatType: "reverse"

                  }}

                />

              </div>

            )}

          </div>

        </motion.div>

      )}

    </AnimatePresence>

  );

};



export default Toast;

