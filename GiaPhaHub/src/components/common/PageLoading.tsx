const PageLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-amber-200" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-500 animate-spin" />
        </div>
        <p className="text-sm text-gray-400 animate-pulse">Đang tải...</p>
      </div>
    </div>
  );
};

export default PageLoading;
