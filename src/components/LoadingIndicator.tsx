
const LoadingIndicator = () => {
  return (
    <div className="flex justify-start animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm mr-12">
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
