import { Image, Send, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { chatStore } from "../store/chatStore";
import toast from "react-hot-toast";

export default function MessageInput() {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>();
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sendMessage } = chatStore();

  // handle Image
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target?.files;
    if (!files) return;
    if (files && files?.length <= 0) return;
    const url = URL.createObjectURL(files[0]);
    setImagePreview(url);
    setImage(files[0]);
  };
  const removeImage = () => {
    setImagePreview("");
    if (!fileInputRef.current) return;
    fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    const formData = new FormData();
    formData.append("text", text);
    image && formData.append("image", image);
    try {
      sendMessage(formData);
      setText("");
      setImagePreview("");
      setImage(null);
    } catch (error) {
      console.log(error);
      toast.error("Failed to send the message, please try again!");
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
          flex items-center justify-center"
              type="button">
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex items-center 
      gap-2">
        <div className="flex-1 flex flex-gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setText(e.currentTarget.value)
            }
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
          />{" "}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => {
              fileInputRef.current?.click();
            }}>
            {" "}
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn p-1 btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}>
          <Send size={27} />
        </button>
      </form>
    </div>
  );
}
