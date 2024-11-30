import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import Toast from "../../components/Toast";
import { signupSchema } from "../../schemas/zodSchemas";

type FormInputs = z.infer<typeof signupSchema>;

export default function Signup() {
  const {
    control,
    setValue,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
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
    console.log("submitting..");
    console.log(data);
    try {
      //
      const formData = new FormData();
      formData.append("fullname", data.fullname);
      formData.append("username", data.username);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);
      formData.append("gender", data.gender);
      formData.append("profilePic", data.profilePic);
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      //
      const uri = "http://localhost:3000/api/auth/register";
      const response = await fetch(uri, {
        method: "POST",

        body: formData,
      });
      console.log(await response.json());
      // console.log(await response.errors[0]);
      toast("Form sumitted");
    } catch (error: any) {
      console.error("Error:", error);
      setError("root", {
        type: "manual",
        message: error.message,
      });
    }
  };

  const handleFileOnchange = (e: any) => {
    const files = e.target.files; // Get the selected files
    if (files && files.length > 0) {
      // Set only the first file if multiple files are selected
      setValue("profilePic", files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <h1 className="text-3xl font-semibold text-center text-gray-300">
          Sign Up <span className="text-blue-500"> ChatApp</span>
        </h1>
        <Toast />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Full Name</span>
            </label>
            <input
              {...register("fullname")}
              type="text"
              placeholder="John Doe"
              className="w-full input input-bordered h-10"
            />
            <p className="error text-sm text-red-500 ">
              {errors.fullname?.message}{" "}
            </p>
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
            <p className="error text-sm text-red-500 ">
              {errors.confirmPassword?.message}{" "}
            </p>
          </div>

          <div>
            <label className="form-control w-full max-w-xs">
              {/* <div className="label">
                <span className="label-text">Profile Image</span>
              </div>
              <Controller
                name="profilePic"
                control={control}
                render={({
                  field: { onChange, onBlur, value, ref },
                }) => (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      // Handle file input change
                      if (
                        event.target.files &&
                        event.target.files[0]
                      ) {
                        onChange(event.target.files[0]); // Pass the first file
                      } else {
                        onChange(null); // Clear the value if no file selected
                      }
                    }}
                    onBlur={onBlur} // Optional: handle blur event
                    ref={ref} // Registering the ref
                  />
                )}
              /> */}
              <div className="label">
                <span className="label-text">Profile Image</span>
              </div>
              <input
                // {...register("profilePic")}
                type="file"
                accept="image/*"
                onChange={handleFileOnchange}
                className="file-input file-input-bordered w-full max-w-xs"
              />
            </label>
            <p className="error text-sm text-red-500 ">
              {errors.profilePic?.message}{" "}
            </p>
          </div>
          {/* gender checkbox */}
          <div className="">
            <div className="flex">
              <div className="form-control pb-0">
                <label className="label gap-2 cursor-pointer pb-0">
                  <span className="label-text">Male</span>
                  <input
                    {...register("gender")}
                    type="radio"
                    value="male"
                    className="radio radio-info border-slate-900"
                  />
                </label>
              </div>
              <div className="form-control pb-0">
                <label className="label gap-2 cursor-pointer pb-0">
                  <span className="label-text">Female</span>
                  <input
                    {...register("gender")}
                    type="radio"
                    value="female"
                    className="radio radio-info border-slate-900"
                  />
                </label>
              </div>
            </div>
            {errors.gender && (
              <p className="error text-sm mt text-red-500">
                Please select your gender
              </p>
            )}
          </div>
          <Link
            to={"/login"}
            className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block">
            Already have an account?
          </Link>
          <div>
            <button
              disabled={isSubmitting}
              className="btn btn-block btn-sm mt-2 border border-slate-700">
              {!isSubmitting ? "Sign Up" : "Submitting..."}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
