import MessageContainer from "../../components/Messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import toast from "react-hot-toast";

const notify = () => toast("Here is your toast.");
const Home = () => {
  return (
    <div className="flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
      <button className="btn btn-accent" onClick={notify}>
        notify
      </button>

      <Sidebar />
      <MessageContainer />
    </div>
  );
};
export default Home;
