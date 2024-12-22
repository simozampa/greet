"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { businessTypes, countries } from "@/app/_utils/constants";
import { cn } from "@/app/_utils/helpers";
import InputLabel from "@/app/_components/InputLabel";
import InputText from "@/app/_components/InputText";
import InputError from "@/app/_components/InputError";
import InputSelect from "@/app/_components/InputSelect";
import PrimaryButton from "@/app/_components/PrimaryButton";
import SecondaryButton from "@/app/_components/SecondaryButton";
import InputTextArea from "@/app/_components/InputTextArea";
import useForm from "@/app/_utils/useForm";
import {
  validateBusinessRegistrationSection1,
  validateBusinessRegistrationSection2,
  validateBusinessRegistrationSection3,
} from "@/app/actions";
import {
  Section1RegisterBusinessFormSchemaType,
  Section2RegisterBusinessFormSchemaType,
  Section3RegisterBusinessFormSchemaType,
} from "@/app/(landing)/register/businesses/page";
import PhotoInput from "@/app/_components/PhotoInput";

export default function Page() {
  const form = useForm<
    Section1RegisterBusinessFormSchemaType &
      Section2RegisterBusinessFormSchemaType &
      Section3RegisterBusinessFormSchemaType & { businessLogo?: string }
  >({
    firstName: "Greet",
    lastName: "Club",
    phoneNumber: "4245379215",
    email: "@greet.club",
    password: "GreetClubMeeple10!",
    confirmPassword: "GreetClubMeeple10!",

    businessLogo: "",
    businessName: "",
    businessDescription: "",
    businessCuisineType: "",
    businessType: "in-store",

    locationName: "",
    locationPhoneNumber: "",
    locationStreet: "",
    locationCity: "",
    locationCountry: "united-states",
    locationRegion: "",
    locationPostalCode: "",

    businessEmail: "@greet.club",
    businessPhoneNumber: "",
    businessWebsite: "",
    businessInstagram: "",
    businessTiktok: "",
  });

  const router = useRouter();

  const [submitError, setSubmitError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const validateBusinessUser = async (): Promise<boolean> => {
    const { isValid, errors } = await validateBusinessRegistrationSection1({
      firstName: form.data.firstName,
      lastName: form.data.lastName,
      phoneNumber: form.data.phoneNumber,
      email: form.data.email,
      password: form.data.password,
      confirmPassword: form.data.confirmPassword,
    });

    if (!isValid) {
      form.setError(errors as any);
      return false;
    }

    return true;
  };

  const submitForm = async () => {
    setLoading(true);
    form.clearErrors();

    // Validate only the business user to make sure is valid!
    // especially the email (no duplicates!!!)
    const res = await validateBusinessUser();
    if (!res) {
      setLoading(false);
      return;
    }

    try {
      if (await createInDb()) {
        router.push("/dashboard/businesses");
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error(error);
      setSubmitError("Error. Please try again later.");
    }

    setSubmitError("Error. Please try again later.");
    setLoading(false);
  };

  const createInDb = async (): Promise<boolean> => {
    // First we create the business + location
    const businessResponse = await fetch("/api/businesses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.data.businessName,
        description: form.data.businessDescription,
        cuisineType: form.data.businessCuisineType,
        type: form.data.businessType,

        locationName: form.data.locationName,
        locationPhoneNumber: form.data.locationPhoneNumber,
        locationStreet: form.data.locationStreet,
        locationCity: form.data.locationCity,
        locationCountry: form.data.locationCountry,
        locationRegion: form.data.locationRegion,
        locationPostalCode: form.data.locationPostalCode,

        email: form.data.businessEmail,
        phoneNumber: form.data.businessPhoneNumber,
        website: form.data.businessWebsite,
        instagram: form.data.businessInstagram,
        tiktok: form.data.businessTiktok,

        logo: form.data.businessLogo,
      }),
    });

    if (!businessResponse.ok) {
      const res = await businessResponse.json();
      // console.error()
      form.setError(res.errors);
      return false;
    }

    // Then we create the business owner (user, and associate it to the business we just created)
    // Extract the business ID
    const businessData = await businessResponse.json();

    const businessOwnerResponse = await fetch("/api/users/business-owners", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber: form.data.phoneNumber,
        email: form.data.email,
        password: form.data.password,
        confirmPassword: form.data.confirmPassword,
        firstName: form.data.firstName,
        lastName: form.data.lastName,
        businessId: businessData.business.id,
      }),
    });

    if (!businessOwnerResponse.ok) {
      console.error(await businessOwnerResponse.json());
      return false;
    }

    return true;
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Register a new business
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            These are usually businesses that are completely managed by Greet.
          </p>
        </div>

        <form className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
          {/* First Name */}
          <div className="col-span-full sm:col-span-3">
            <InputLabel htmlFor="firstName" name="First name" required={true} />
            <div className="mt-1">
              <InputText
                name="firstName"
                value={form.data.firstName}
                onChange={(e) => form.setData("firstName", e.target.value)}
                autoComplete="given-name"
              />
            </div>
            <InputError errorMessage={form.errors?.firstName} />
          </div>

          {/* Last Name */}
          <div className="col-span-full sm:col-span-3">
            <InputLabel htmlFor="lastName" name="Last name" required={true} />
            <div className="mt-1">
              <InputText
                name="lastName"
                value={form.data.lastName}
                onChange={(e) => form.setData("lastName", e.target.value)}
                autoComplete="family-name"
              />
            </div>
            <InputError errorMessage={form.errors?.lastName} />
          </div>

          {/* Phone Number */}
          <div className="col-span-full">
            <InputLabel
              htmlFor="phoneNumber"
              name="Phone Number"
              required={true}
            />
            <div className="mt-1">
              <InputText
                name="phoneNumber"
                value={form.data.phoneNumber}
                onChange={(e) => form.setData("phoneNumber", e.target.value)}
                autoComplete="tel"
              />
            </div>
            <InputError errorMessage={form.errors?.phoneNumber} />
          </div>

          {/* Email */}
          <div className="col-span-full">
            <InputLabel htmlFor="email" name="Email" required={true} />
            <div className="mt-1">
              <InputText
                name="email"
                value={form.data.email}
                onChange={(e) => form.setData("email", e.target.value)}
                autoComplete="email"
              />
            </div>
            <InputError errorMessage={form.errors?.email} />
            <div className="mt-1 text-xs text-gray-500">
              Just write a fake email with the @greet.club domain. Because this
              business will be managed by us, all communication will go directly
              to info@greet.club
            </div>
          </div>

          {/* Password */}
          <div className="col-span-full">
            <InputLabel htmlFor="password" name="Password" required={true} />
            <div className="mt-1">
              <InputText
                type="password"
                name="password"
                value={form.data.password}
                onChange={(e) => form.setData("password", e.target.value)}
              />
            </div>
            <InputError errorMessage={form.errors?.password} />
            <div className="mt-1 text-xs text-gray-500">
              Leave this untouched if you would like to use the default Greet
              password.
            </div>
          </div>

          {/* Confirm Password */}
          <div className="col-span-full">
            <InputLabel
              htmlFor="confirmPassword"
              name="Confirm Password"
              required={true}
            />
            <div className="mt-1">
              <InputText
                type="password"
                name="confirmPassword"
                value={form.data.confirmPassword}
                onChange={(e) =>
                  form.setData("confirmPassword", e.target.value)
                }
              />
            </div>
            <InputError errorMessage={form.errors?.confirmPassword} />
          </div>

          <hr className="my-8 col-span-full" />

          {/* Logo */}
          <div className="col-span-full">
            <InputLabel htmlFor="logo" name="Logo" required={true} />
            <div className="mt-1">
              <PhotoInput
                defaultValue={form?.data.businessLogo || ""}
                onChange={(logo: string) => form.setData("businessLogo", logo)}
              />
            </div>
            <InputError errorMessage={form.errors?.businessLogo} />
          </div>

          {/* Business Name */}
          <div className="col-span-full">
            <InputLabel
              htmlFor="businessName"
              name="Business Name"
              required={true}
            />
            <div className="mt-1">
              <InputText
                name="businessName"
                value={form.data.businessName}
                onChange={(e) => form.setData("businessName", e.target.value)}
                placeholder="Example: Joe's Pizza"
              />
            </div>
            <InputError errorMessage={form.errors?.businessName} />
          </div>

          <div className="col-span-full">
            <InputLabel
              htmlFor="businessDescription"
              name="Business Description"
              required={true}
            />
            <div className="mt-1">
              <InputTextArea
                name="businessDescription"
                value={form.data.businessDescription}
                onChange={(e) =>
                  form.setData("businessDescription", e.target.value)
                }
                placeholder="Tell us what makes your business unique!"
              />
            </div>
            <InputError errorMessage={form.errors?.businessDescription} />
          </div>

          <div className="col-span-full sm:col-span-3">
            <InputLabel
              htmlFor="businessCuisineType"
              name="Cuisine Type"
              required={true}
            />
            <div className="mt-1">
              <InputText
                name="businessCuisineType"
                value={form.data.businessCuisineType}
                onChange={(e) =>
                  form.setData("businessCuisineType", e.target.value)
                }
              />
            </div>
            <InputError errorMessage={form.errors?.businessCuisineType} />
          </div>

          <div className="col-span-full sm:col-span-3">
            <InputLabel
              htmlFor="businessType"
              name="Business Type"
              required={true}
            />
            <div className="mt-1">
              <InputSelect
                name="businessType"
                value={form.data.businessType}
                onChange={(e) => form.setData("businessType", e.target.value)}
                options={businessTypes}
              />
            </div>
            <InputError errorMessage={form.errors?.businessType} />
          </div>

          <div className="col-span-full">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Location
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Start by adding your main location. You will be able to add other
              locations once approved.
            </p>
          </div>

          <div className="col-span-full">
            <InputLabel htmlFor="locationName" name="Location Name" />
            <div className="mt-1">
              <InputText
                name="locationName"
                value={form.data.locationName}
                onChange={(e) => form.setData("locationName", e.target.value)}
                placeholder="Example: Sam's Pizza - 123 Main street"
              />
            </div>
            <span className="text-gray-500 mt-1 text-xs">
              Leave this empty if same as Business Name.
            </span>
            <InputError errorMessage={form.errors?.locationName} />
          </div>

          <div className="col-span-full">
            <InputLabel
              htmlFor="locationPhoneNumber"
              name="Phone Number"
              required={true}
            />
            <div className="mt-1">
              <InputText
                name="locationPhoneNumber"
                value={form.data.locationPhoneNumber}
                onChange={(e) =>
                  form.setData("locationPhoneNumber", e.target.value)
                }
              />
            </div>
            <InputError errorMessage={form.errors?.locationPhoneNumber} />
          </div>

          {/* Street */}
          <div className="col-span-full">
            <InputLabel
              htmlFor="locationStreet"
              name="Street"
              required={true}
            />
            <div className="mt-1">
              <InputText
                name="locationStreet"
                value={form.data.locationStreet}
                onChange={(e) => form.setData("locationStreet", e.target.value)}
                autoComplete="street-address"
              />
            </div>
            <InputError errorMessage={form.errors?.locationStreet} />
          </div>

          <div className="col-span-full sm:col-span-3">
            <InputLabel htmlFor="locationCity" name="City" required={true} />
            <div className="mt-1">
              <InputText
                name="locationCity"
                value={form.data.locationCity}
                onChange={(e) => form.setData("locationCity", e.target.value)}
                autoComplete="address-level2"
              />
            </div>
            <InputError errorMessage={form.errors?.locationCity} />
          </div>

          <div className="col-span-full sm:col-span-3">
            <InputLabel
              htmlFor="locationCountry"
              name="Country"
              required={true}
            />
            <div className="mt-1">
              <InputSelect
                name="locationCountry"
                value={form.data.locationCountry}
                onChange={(e) =>
                  form.setData("locationCountry", e.target.value)
                }
                options={countries}
                autoComplete="country-name"
              />
            </div>
            <InputError errorMessage={form.errors?.locationCountry} />
          </div>

          <div className="col-span-full sm:col-span-3">
            <InputLabel
              htmlFor="locationRegion"
              name="State / Province"
              required={true}
            />
            <div className="mt-1">
              <InputText
                name="locationRegion"
                value={form.data.locationRegion}
                onChange={(e) => form.setData("locationRegion", e.target.value)}
                autoComplete="address-level1"
              />
            </div>
            <InputError errorMessage={form.errors?.locationRegion} />
          </div>

          <div className="col-span-full sm:col-span-3">
            <InputLabel
              htmlFor="locationPostalCode"
              name="Postal Code"
              required={true}
            />
            <div className="mt-1">
              <InputText
                name="locationPostalCode"
                value={form.data.locationPostalCode}
                onChange={(e) =>
                  form.setData("locationPostalCode", e.target.value)
                }
                autoComplete="postal-code"
              />
            </div>
            <InputError errorMessage={form.errors?.locationPostalCode} />
          </div>

          <hr className="my-8 col-span-full" />

          <div className="col-span-full">
            <InputLabel
              htmlFor="businessEmail"
              name="Business Email"
              required={true}
            />
            <div className="mt-1">
              <InputText
                name="businessEmail"
                value={form.data.businessEmail}
                onChange={(e) => form.setData("businessEmail", e.target.value)}
                autoComplete="email"
              />
            </div>
            <InputError errorMessage={form.errors?.businessEmail} />
          </div>

          <div className="col-span-full">
            <InputLabel htmlFor="businessPhoneNumber" name="Business Phone" />
            <div className="mt-1">
              <InputText
                name="businessPhoneNumber"
                value={form.data.businessPhoneNumber}
                onChange={(e) =>
                  form.setData("businessPhoneNumber", e.target.value)
                }
                autoComplete="tel"
              />
            </div>
            <InputError errorMessage={form.errors?.businessPhoneNumber} />
          </div>

          <div className="col-span-full">
            <InputLabel htmlFor="businessWebsite" name="Business Website" />
            <div className="mt-1">
              <InputText
                name="businessWebsite"
                value={form.data.businessWebsite}
                onChange={(e) =>
                  form.setData("businessWebsite", e.target.value)
                }
              />
            </div>
            <InputError errorMessage={form.errors?.businessWebsite} />
          </div>

          <div className="col-span-full">
            <InputLabel
              htmlFor="businessInstagram"
              name="Instagram Handle"
              required={true}
            />
            <div className="mt-1">
              <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-900">
                <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                  instagram.com/
                </span>
                <InputText
                  name="businessInstagram"
                  value={form.data.businessInstagram}
                  onChange={(e) =>
                    form.setData("businessInstagram", e.target.value)
                  }
                  placeholder="amazingbusiness"
                  className="border-none bg-transparent pl-1 shadow-none ring-0 ring-transparent focus:ring-0 focus:ring-transparent"
                />
              </div>
            </div>
            <InputError errorMessage={form.errors?.businessInstagram} />
          </div>

          {/* Footer */}
          <div className="mt-8 col-span-full">
            <InputError errorMessage={submitError} className="mt-0" />

            <div className={cn("flex justify-end", submitError ? "mt-2" : "")}>
              <PrimaryButton
                onClick={submitForm}
                disabled={form.processing || loading}
              >
                {(form.processing || loading) && (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                Submit
              </PrimaryButton>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
