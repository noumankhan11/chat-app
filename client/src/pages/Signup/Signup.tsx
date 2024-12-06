import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { signupSchema } from "../../schemas/zodSchemas";
import { BiLock, BiMessageSquare, BiUser } from "react-icons/bi";
import { cn } from "../../utils/clsx";
import { FiEyeOff } from "react-icons/fi";
import { BsEye } from "react-icons/bs";
import { useState } from "react";
import toast from "react-hot-toast";

type FormInputs = z.infer<typeof signupSchema>;

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullname: "",
      username: "",
      gender: undefined,
      password: "",
      confirmPassword: "",
      profilePic: undefined,
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      //
      const formData = new FormData();
      formData.append("fullname", data.fullname);
      formData.append("username", data.username);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);
      formData.append("gender", data.gender || "");
      formData.append("profilePic", data.profilePic || "");

      // api handling
      const uri = "http://localhost:3000/api/auth/register";
      const response = await fetch(uri, {
        method: "POST",
        body: formData,
      });
      const jsonData = await response.json();

      if (!jsonData.success) {
        toast.error(jsonData.errors[0]);
        return;
      }
      toast.success(
        "User registerd successfully, Please login to your account"
      );
      navigate("/login");
    } catch (error: any) {
      toast.error("Something went wrong! Please try again.");
      console.error("Error:", error);
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
              <h1 className="text-2xl font-semibold mt-2">
                Welcome To{" "}
                <span className="font-bolder font-thin text-3xl">
                  Me-Chat
                </span>
              </h1>
              <p className="text-base-content/60">
                Create a new account
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-2">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  User Name
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
            <div className="form-control mt-0">
              <label className="label">
                <span className="label-text font-medium">
                  Full Name
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
                    errors.fullname?.message &&
                      "border-red-400 focus:border-red-400"
                  )}
                  placeholder="Jhon Doe"
                  {...register("fullname")}
                />
              </div>
              <p className="text-red-400 pl-1">
                {errors.fullname?.message}
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
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Confirm Password
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BiLock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  {...register("confirmPassword")}
                  className={cn(
                    "input input-bordered w-full pl-10 ",
                    errors.confirmPassword?.message &&
                      "border-red-400 focus:border-red-400"
                  )}
                  placeholder="••••••••"
                />
              </div>
              <p className="text-red-400 pl-1">
                {errors.confirmPassword?.message}
              </p>
              <p>{errors.root?.message}</p>
            </div>

            <button
              className="btn btn-primary w-full"
              disabled={isSubmitting}>
              {!isSubmitting ? "Sign Up" : "Submitting..."}{" "}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link to="/login" className="link link-primary">
                login to your account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
