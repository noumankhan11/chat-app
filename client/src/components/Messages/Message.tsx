export default function Message() {
  return (
    <div className="chat chat-end">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            src="https://avatar.iran.liara.run/username?username=jhon+doe"
            alt="Profile"
          />
        </div>
      </div>
      <div className={`chat-bubble text-white bg-[#009deb]`}>
        <p className="text-sm">Hello, how are you?</p>
      </div>
      <div className="chat-footer opacity-50 text-xl flex gap-1 items-center">
        <p className="text-sm"> 12:42</p>
      </div>
    </div>
  );
}
