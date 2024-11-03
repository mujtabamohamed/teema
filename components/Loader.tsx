const LoadingSpinner = () => {
    
    return (
        <div className="flex items-center justify-center h-full w-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#405fff]"></div>
        </div>
    );
};

export default LoadingSpinner;