export function LoadingAnimation() {
  return (
    <div className="flex space-x-2 p-1 bg-gray-100 rounded-lg">
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
      <div
        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      ></div>
      <div
        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
        style={{ animationDelay: "0.4s" }}
      ></div>
    </div>
  );
}
