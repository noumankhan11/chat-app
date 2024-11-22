import { Link } from "react-router-dom";
import GenderCheckbox from "../../components/GenderCheckbox";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  fullname: string;
  username: string;
  gender: string;
  password: string;
  confirmPassword: string;
};

export default function Signup() {
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);
  console.log(watch("username"));
  const handleGenderChange = (gender: string) => {
    // Programmatically set the gender value
    setValue("gender", gender);
  };

  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <h1 className="text-3xl font-semibold text-center text-gray-300">
          Sign Up <span className="text-blue-500"> ChatApp</span>
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Full Name</span>
            </label>
            <input
              {...register("fullname")}
              type="text"
              placeholder="John Doe"
              className="w-full input input-bordered  h-10"
            />
          </div>

          <div>
            <label className="label p-2 ">
              <span className="text-base label-text">Username</span>
            </label>
            <input
              {...register("username")}
              type="text"
              placeholder="johndoe"
              className="w-full input input-bordered h-10"
            />
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
          </div>

          <div>
            <label className="label">
              <span className="text-base label-text">
                Confirm Password
              </span>
            </label>
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm Password"
              className="w-full input input-bordered h-10"
            />
          </div>
          {/* gender checkbox */}
          <div className="flex ">
            <div className="form-control">
              <label
                htmlFor=""
                className={`label gap-2 cursor-pointer`}>
                <span className="label-text ">Male</span>
                <input
                  {...register("gender")}
                  value={"male"}
                  type="checkbox"
                  {...register("gender")}
                  onChange={() => handleGenderChange("male")}
                  className="checkbox  checkbox-info border-slate-900 "
                />
              </label>
            </div>
            <div className="form-control">
              <label
                htmlFor=""
                className={`label gap-2 cursor-pointer`}>
                <span className="label-text ">Female</span>
                <input
                  {...register("gender")}
                  type="checkbox"
                  value={"female"}
                  onChange={() => handleGenderChange("female")}
                  className="checkbox checkbox-info border-slate-900 "
                />
              </label>
            </div>
          </div>

          <Link
            to={"/login"}
            className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block">
            Already have an account?
          </Link>

          <div>
            <button className="btn btn-block btn-sm mt-2 border border-slate-700">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
