import { useEffect } from 'react';

import { IoMdClose } from "react-icons/io";
import { IoWarningOutline } from "react-icons/io5";

interface ErrorPopupProps {
    message: string;
    onClose: () => void;
    isVisible: boolean;
}

const ErrorPopup = ({ message, onClose, isVisible }: ErrorPopupProps) => {
    useEffect(() => {
        
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000); 

            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
            <div className="bg-white border-l-4 border-red-500 
                rounded-lg shadow-lg p-4 flex items-start max-w-md">
                <div className="flex-shrink-0 text-red-500 mr-3">
                    <IoWarningOutline className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <p className="text-gray-800 font-medium">{message}</p>
                </div>
                <button 
                    onClick={onClose}
                    className="ml-4 text-gray-400 
                        hover:text-gray-600 transition-colors">
                    <IoMdClose className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default ErrorPopup;