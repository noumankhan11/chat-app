import { Link, Navigate, useNavigate } from "react-router-dom";
import { loginSchema } from "../../schemas/zodSchemas";
import * as z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bounce, toast } from "react-toastify";
import { UseAuthContext } from "../../context/AuthContext";

type FormInputs = z.infer<typeof loginSchema>;
export default function Login() {
  const { authUser, setAuthUser } = UseAuthContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const uri = "http://localhost:3000/api/auth/login";
      const response = await fetch(uri, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const jsonData = await response.json();

      if (!jsonData.success) {
        toast.error(jsonData.errors[0], {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        return;
      }

      localStorage.setItem("userInfo", JSON.stringify(jsonData.data));
      setAuthUser(jsonData.data);
      toast.success("Successfully Login", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      navigate("/");
    } catch (error: any) {
      toast.error("Something went wrong", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.error("Error:", error);
      setError("root", {
        type: "manual",
        message: error.message,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <h1 className="text-3xl font-semibold text-center text-gray-300">
          Login
          <span className="text-blue-500"> ChatApp</span>
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Username</span>
            </label>
            <input
              {...register("username")}
              type="text"
              placeholder="Enter username"
              className="w-full input input-bordered h-10"
            />
            <p className="error text-sm text-red-500 ">
              {errors.username?.message}{" "}
            </p>
          </div>

          <div>
            <label className="label">
              <span className="text-base label-text">Password</span>
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="Enter Password"
              className="w-full input input-bordered h-10"
            />
            <p className="error text-sm text-red-500 ">
              {errors.password?.message}{" "}
            </p>
          </div>
          <Link
            to={"/signup"}
            className="text-sm  hover:underline hover:text-blue-600 mt-2 inline-block">
            {"Don't"} have an account?
          </Link>

          <div>
            <button className="btn btn-block btn-sm mt-2">
              {!isSubmitting ? "Login" : "Submitting..."}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
