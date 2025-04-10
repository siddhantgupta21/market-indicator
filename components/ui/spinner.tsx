// components/ui/spinner.tsx
export const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-full mt-10">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );
};
