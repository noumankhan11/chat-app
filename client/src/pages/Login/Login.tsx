import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "../../schemas/zodSchemas";
import * as z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { BiLock, BiMessageSquare, BiUser } from "react-icons/bi";
import { FiEyeOff } from "react-icons/fi";
import { BsEye } from "react-icons/bs";
import { cn } from "../../utils/clsx";
import toast from "react-hot-toast";
import useStore from "../../store/store";

type FormInputs = z.infer<typeof loginSchema>;
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { checkAuth } = useStore();
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
        toast.error(jsonData.errors[0]);
        return;
      }

      toast.success("Successfully Loged in");

      setTimeout(() => {
        checkAuth();
        navigate("/");
      });
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Something went wrong");
      setError("root", {
        type: "manual",
        message: error.message,
      });
    }
  };

  return (
    <div className="">
      {/* Left Side - Form */}
      <div className="h-screen w-screen flex justify-center items-center ">
        <div className="max-w-lg w-full space-y-8 bgwhite ">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors">
                <BiMessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">
                Welcome Back
              </h1>
              <p className="text-base-content/60">
                Sign in to your account
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Username
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BiUser className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={cn(
                    "input input-bordered w-full pl-10 ",
                    errors.username?.message &&
                      "border-red-400 focus:border-red-400"
                  )}
                  placeholder="jhon-doe"
                  {...register("username")}
                />
              </div>
              <p className="text-red-400 pl-1">
                {errors.username?.message}
              </p>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Password
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BiLock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  className={cn(
                    "input input-bordered w-full pl-10 ",
                    errors.password?.message &&
                      "border-red-400 focus:border-red-400"
                  )}
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <BsEye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
              <p className="text-red-400 pl-1">
                {errors.password?.message}
              </p>
            </div>

            <button
              className="btn btn-primary w-full"
              disabled={isSubmitting}>
              {!isSubmitting ? "Login" : "Submitting..."}{" "}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      {/* <div className="bg-white"></div> */}
      {/* <AuthImagePattern
        title={"Welcome back!"}
        subtitle={"Sign in to continue your conversations and catch up with your messages."}
      /> */}
    </div>
  );
  // <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
  //   <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
  //     <h1 className="text-3xl font-semibold text-center text-gray-300">
  //       Login
  //       <span className="text-blue-500"> ChatApp</span>
  //     </h1>

  //     <form onSubmit={handleSubmit(onSubmit)}>
  //       <div>
  //         <label className="label p-2">
  //           <span className="text-base label-text">Username</span>
  //         </label>
  //         <input
  //           {...register("username")}
  //           type="text"
  //           placeholder="Enter username"
  //           className="w-full input input-bordered h-10"
  //         />
  //         <p className="error text-sm text-red-500 ">
  //           {errors.username?.message}{" "}
  //         </p>
  //       </div>

  //       <div>
  //         <label className="label">
  //           <span className="text-base label-text">Password</span>
  //         </label>
  //         <input
  //           {...register("password")}
  //           type="password"
  //           placeholder="Enter Password"
  //           className="w-full input input-bordered h-10"
  //         />
  //         <p className="error text-sm text-red-500 ">
  //           {errors.password?.message}{" "}
  //         </p>
  //       </div>
  //       <Link
  //         to={"/signup"}
  //         className="text-sm  hover:underline hover:text-blue-600 mt-2 inline-block">
  //         {"Don't"} have an account?
  //       </Link>

  //       <div>
  //         <button className="btn btn-block btn-sm mt-2">
  //           {!isSubmitting ? "Login" : "Submitting..."}
  //         </button>
  //       </div>
  //     </form>
  //   </div>
  // </div>
}
