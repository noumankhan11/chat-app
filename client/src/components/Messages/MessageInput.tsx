import { useState } from "react";
import { BsSend } from "react-icons/bs";

const MessageInput = () => {
  const [text, setText] = useState("");

  const handleInput = (e: any) => {
    const textarea = e.target;
    textarea.style.height = "auto"; // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set to scroll height
    setText(textarea.value);
  };
  return (
    <form className="px-4 my-3 pr-12 relative py-1 bg-gray-700">
      <div className="w-full">
        <textarea
          className="custom-scrollbar border max-h-20 overflow-auto text-sm rounded-lg custom block w-full p-2.5  bg-gray-800 border-gray-600 text-white resize-none focus:outline-none focus:border-0"
          rows={1}
          placeholder="Type here..."
          value={text}
          onInput={handleInput}></textarea>
        <button
          type="submit"
          className="absolute pl-1 bottom-[14px] end-0 text-xl right-2 flex items-center bg-gray-700 pe-3 text-gray-50">
          <BsSend />
        </button>
      </div>
    </form>
  );
};
export default MessageInput;
