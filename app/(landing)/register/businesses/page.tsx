"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  businessRegistrationSteps,
  businessTypes,
  countries,
} from "@/app/_utils/constants";
import { cn, loginRedirect } from "@/app/_utils/helpers";
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
import InputCheckbox from "@/app/_components/InputCheckbox";

export type Section1RegisterBusinessFormSchemaType = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type Section2RegisterBusinessFormSchemaType = {
  businessName?: string;
  businessDescription: string;
  businessCuisineType: string;
  businessType: string;

  locationName?: string;
  locationPhoneNumber: string;
  locationStreet: string;
  locationCity: string;
  locationCountry: string;
  locationRegion: string;
  locationPostalCode: string;
};

export type Section3RegisterBusinessFormSchemaType = {
  businessEmail: string;
  businessPhoneNumber?: string;
  businessWebsite?: string;
  businessInstagram?: string;
  businessTiktok: string;
};

export default function Page() {
  const section1Form = useForm<Section1RegisterBusinessFormSchemaType>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const section2Form = useForm<Section2RegisterBusinessFormSchemaType>({
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
  });

  const section3Form = useForm<Section3RegisterBusinessFormSchemaType>({
    businessEmail: "",
    businessPhoneNumber: "",
    businessWebsite: "",
    businessInstagram: "",
    businessTiktok: "",
  });

  const router = useRouter();
  const { data: session } = useSession();

  const [submitError, setSubmitError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const validateSection1 = async (): Promise<boolean> => {
    section1Form.setProcessing(true);
    section1Form.clearErrors();

    const { isValid, errors } = await validateBusinessRegistrationSection1(
      section1Form.data
    );
    if (!isValid) {
      section1Form.setError(
        errors as Record<keyof Section1RegisterBusinessFormSchemaType, string>
      );
      section1Form.setProcessing(false);
      return false;
    }

    section1Form.setProcessing(false);
    return true;
  };

  const validateSection2 = async (): Promise<boolean> => {
    section2Form.setProcessing(true);
    section2Form.clearErrors();

    const { isValid, errors } = await validateBusinessRegistrationSection2(
      section2Form.data
    );
    if (!isValid) {
      section2Form.setError(
        errors as Record<keyof Section2RegisterBusinessFormSchemaType, string>
      );
      section2Form.setProcessing(false);
      return false;
    }

    section2Form.setProcessing(false);
    return true;
  };

  const validateSection3 = async (): Promise<boolean> => {
    section3Form.setProcessing(true);
    section3Form.clearErrors();

    const { isValid, errors } = await validateBusinessRegistrationSection3(
      section3Form.data
    );
    if (!isValid) {
      section3Form.setError(
        errors as Record<keyof Section3RegisterBusinessFormSchemaType, string>
      );
      section3Form.setProcessing(false);
      return false;
    }

    section3Form.setProcessing(false);
    return true;
  };

  const handleNext = async () => {
    setSubmitError("");

    switch (currentStep) {
      case 0: {
        if (!(await validateSection1())) {
          return;
        }
        break;
      }
      case 1: {
        if (!(await validateSection2())) {
          return;
        }
        break;
      }
      case 2: {
        if (!(await validateSection3())) {
          return;
        }
        break;
      }
      default:
        return;
    }

    // If we got to the last step in the form
    if (currentStep + 1 === businessRegistrationSteps.length) {
      submitForm();
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const submitForm = async () => {
    setLoading(true);

    try {
      if (await createInDb()) {
        router.push("/thank-you");
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
        name: section2Form.data.businessName,
        description: section2Form.data.businessDescription,
        cuisineType: section2Form.data.businessCuisineType,
        type: section2Form.data.businessType,

        locationName: section2Form.data.locationName,
        locationPhoneNumber: section2Form.data.locationPhoneNumber,
        locationStreet: section2Form.data.locationStreet,
        locationCity: section2Form.data.locationCity,
        locationCountry: section2Form.data.locationCountry,
        locationRegion: section2Form.data.locationRegion,
        locationPostalCode: section2Form.data.locationPostalCode,

        email: section3Form.data.businessEmail,
        phoneNumber: section3Form.data.businessPhoneNumber,
        website: section3Form.data.businessWebsite,
        instagram: section3Form.data.businessInstagram,
        tiktok: section3Form.data.businessTiktok,
      }),
    });

    if (!businessResponse.ok) {
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
        phoneNumber: section1Form.data.phoneNumber,
        email: section1Form.data.email,
        password: section1Form.data.password,
        confirmPassword: section1Form.data.confirmPassword,
        firstName: section1Form.data.firstName,
        lastName: section1Form.data.lastName,
        businessId: businessData.business.id,
      }),
    });

    if (!businessOwnerResponse.ok) {
      console.error(await businessOwnerResponse.json());
      return false;
    }

    return true;
  };

  useEffect(() => {
    loginRedirect(session);
  }, [session]);

  return (
    <>
      <div className="w-full py-8 lg:py-16">
        <div className="mx-auto max-w-2xl p-4 lg:p-8 bg-white md:shadow-sm md:ring-1 md:ring-gray-900/5 rounded-xl md:col-span-2">
          {/* Section Header */}
          <div className="pt-4">
            <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900 text-center">
              Sign Up As A Business
            </h2>
          </div>

          {/* Steps menu */}
          <nav className="py-8" aria-label="Progress">
            <ol
              role="list"
              className="space-y-4 md:flex md:space-x-8 md:space-y-0"
            >
              {businessRegistrationSteps.map((step) => (
                <li key={step.name} className="md:flex-1">
                  {step.index < currentStep ? (
                    <div className="flex flex-col border-l-4 border-gray-900 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                      <span className="text-sm font-medium text-gray-900">
                        {step.id}
                      </span>
                      <span className="text-sm font-medium">{step.name}</span>
                    </div>
                  ) : step.index === currentStep ? (
                    <div
                      className="flex flex-col border-l-4 border-gray-900 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                      aria-current="step"
                    >
                      <span className="text-sm font-medium text-gray-600">
                        {step.id}
                      </span>
                      <span className="text-sm font-medium">{step.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col border-l-4 border-gray-200 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                      <span className="text-sm font-medium text-gray-600">
                        {step.id}
                      </span>
                      <span className="text-sm font-medium">{step.name}</span>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* Multistep Form */}
          <form>
            {currentStep === 0 ? (
              <div key="0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-x-4">
                  {/* First Name */}
                  <div className="">
                    <InputLabel
                      htmlFor="firstName"
                      name="First name"
                      required={true}
                    />
                    <div className="mt-1">
                      <InputText
                        name="firstName"
                        value={section1Form.data.firstName}
                        onChange={(e) =>
                          section1Form.setData("firstName", e.target.value)
                        }
                        autoComplete="given-name"
                      />
                    </div>
                    <InputError errorMessage={section1Form.errors?.firstName} />
                  </div>

                  {/* Last Name */}
                  <div className="">
                    <InputLabel
                      htmlFor="lastName"
                      name="Last name"
                      required={true}
                    />
                    <div className="mt-1">
                      <InputText
                        name="lastName"
                        value={section1Form.data.lastName}
                        onChange={(e) =>
                          section1Form.setData("lastName", e.target.value)
                        }
                        autoComplete="family-name"
                      />
                    </div>
                    <InputError errorMessage={section1Form.errors?.lastName} />
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
                        value={section1Form.data.phoneNumber}
                        onChange={(e) =>
                          section1Form.setData("phoneNumber", e.target.value)
                        }
                        autoComplete="tel"
                      />
                    </div>
                    <InputError
                      errorMessage={section1Form.errors?.phoneNumber}
                    />
                    <div className="mt-3 flex space-x-2">
                      <div className="flex h-5 items-center">
                        <InputCheckbox />
                      </div>
                      <label htmlFor="terms" className="text-xs text-gray-500">
                        By opting in, I agree to receive text messages in
                        relation to my account. I understand that standard text
                        and data rates may apply.
                      </label>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-span-full">
                    <InputLabel htmlFor="email" name="Email" required={true} />
                    <div className="mt-1">
                      <InputText
                        name="email"
                        value={section1Form.data.email}
                        onChange={(e) =>
                          section1Form.setData("email", e.target.value)
                        }
                        autoComplete="email"
                      />
                    </div>
                    <InputError errorMessage={section1Form.errors?.email} />
                  </div>

                  {/* Password */}
                  <div className="col-span-full">
                    <InputLabel
                      htmlFor="password"
                      name="Password"
                      required={true}
                    />
                    <div className="mt-1">
                      <InputText
                        type="password"
                        name="password"
                        value={section1Form.data.password}
                        onChange={(e) =>
                          section1Form.setData("password", e.target.value)
                        }
                      />
                    </div>
                    <InputError errorMessage={section1Form.errors?.password} />
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
                        value={section1Form.data.confirmPassword}
                        onChange={(e) =>
                          section1Form.setData(
                            "confirmPassword",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <InputError
                      errorMessage={section1Form.errors?.confirmPassword}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 flex justify-end">
                  <PrimaryButton
                    disabled={section1Form.processing}
                    onClick={handleNext}
                  >
                    {section1Form.processing && (
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
                    Next
                  </PrimaryButton>
                </div>
              </div>
            ) : currentStep === 1 ? (
              <div key="1">
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  {/* Business Name */}
                  <div className="sm:col-span-2">
                    <InputLabel
                      htmlFor="businessName"
                      name="Business Name"
                      required={true}
                    />
                    <div className="mt-1">
                      <InputText
                        name="businessName"
                        value={section2Form.data.businessName}
                        onChange={(e) =>
                          section2Form.setData("businessName", e.target.value)
                        }
                        placeholder="Example: Joe's Pizza"
                      />
                    </div>
                    <InputError
                      errorMessage={section2Form.errors?.businessName}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <InputLabel
                      htmlFor="businessDescription"
                      name="Business Description"
                      required={true}
                    />
                    <div className="mt-1">
                      <InputTextArea
                        name="businessDescription"
                        value={section2Form.data.businessDescription}
                        onChange={(e) =>
                          section2Form.setData(
                            "businessDescription",
                            e.target.value
                          )
                        }
                        placeholder="Tell us what makes your business unique!"
                      />
                    </div>
                    <InputError
                      errorMessage={section2Form.errors?.businessDescription}
                    />
                  </div>

                  <div>
                    <InputLabel
                      htmlFor="businessCuisineType"
                      name="Cuisine Type"
                      required={true}
                    />
                    <div className="mt-1">
                      <InputText
                        name="businessCuisineType"
                        value={section2Form.data.businessCuisineType}
                        onChange={(e) =>
                          section2Form.setData(
                            "businessCuisineType",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <InputError
                      errorMessage={section2Form.errors?.businessCuisineType}
                    />
                  </div>

                  <div>
                    <InputLabel
                      htmlFor="businessType"
                      name="Business Type"
                      required={true}
                    />
                    <div className="mt-1">
                      <InputSelect
                        name="businessType"
                        value={section2Form.data.businessType}
                        onChange={(e) =>
                          section2Form.setData("businessType", e.target.value)
                        }
                        options={businessTypes}
                      />
                    </div>
                    <InputError
                      errorMessage={section2Form.errors?.businessType}
                    />
                  </div>

                  <div className="col-span-full">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                      Location
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Start by adding your main location. You will be able to
                      add other locations once approved.
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <InputLabel htmlFor="locationName" name="Location Name" />
                    <div className="mt-1">
                      <InputText
                        name="locationName"
                        value={section2Form.data.locationName}
                        onChange={(e) =>
                          section2Form.setData("locationName", e.target.value)
                        }
                        placeholder="Example: Sam's Pizza - 123 Main street"
                      />
                    </div>
                    <span className="text-gray-500 mt-1 text-xs">
                      Leave this empty if same as Business Name.
                    </span>
                    <InputError
                      errorMessage={section2Form.errors?.locationName}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <InputLabel
                      htmlFor="locationPhoneNumber"
                      name="Phone Number"
                      required={true}
                    />
                    <div className="mt-1">
                      <InputText
                        name="locationPhoneNumber"
                        value={section2Form.data.locationPhoneNumber}
                        onChange={(e) =>
                          section2Form.setData(
                            "locationPhoneNumber",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <InputError
                      errorMessage={section2Form.errors?.locationPhoneNumber}
                    />
                  </div>

                  {/* Street */}
                  <div className="sm:col-span-2">
                    <InputLabel
                      htmlFor="locationStreet"
                      name="Street"
                      required={true}
                    />
                    <div className="mt-1">
                      <InputText
                        name="locationStreet"
                        value={section2Form.data.locationStreet}
                        onChange={(e) =>
                          section2Form.setData("locationStreet", e.target.value)
                        }
                        autoComplete="street-address"
                      />
                    </div>
                    <InputError
                      errorMessage={section2Form.errors?.locationStreet}
                    />
                  </div>

                  <div>
                    <InputLabel
                      htmlFor="locationCity"
                      name="City"
                      required={true}
                    />
                    <div className="mt-1">
                      <InputText
                        name="locationCity"
                        value={section2Form.data.locationCity}
                        onChange={(e) =>
                          section2Form.setData("locationCity", e.target.value)
                        }
                        autoComplete="address-level2"
                      />
                    </div>
                    <InputError
                      errorMessage={section2Form.errors?.locationCity}
                    />
                  </div>

                  <div>
                    <InputLabel
                      htmlFor="locationCountry"
                      name="Country"
                      required={true}
                    />
                    <div className="mt-1">
                      <InputSelect
                        name="locationCountry"
                        value={section2Form.data.locationCountry}
                        onChange={(e) =>
                          section2Form.setData(
                            "locationCountry",
                            e.target.value
                          )
                        }
                        options={countries}
                        autoComplete="country-name"
                      />
                    </div>
                    <InputError
                      errorMessage={section2Form.errors?.locationCountry}
                    />
                  </div>

                  <div>
                    <InputLabel
                      htmlFor="locationRegion"
                      name="State / Province"
                      required={true}
                    />
                    <div className="mt-1">
                      <InputText
                        name="locationRegion"
                        value={section2Form.data.locationRegion}
                        onChange={(e) =>
                          section2Form.setData("locationRegion", e.target.value)
                        }
                        autoComplete="address-level1"
                      />
                    </div>
                    <InputError
                      errorMessage={section2Form.errors?.locationRegion}
                    />
                  </div>

                  <div>
                    <InputLabel
                      htmlFor="locationPostalCode"
                      name="Postal Code"
                      required={true}
                    />
                    <div className="mt-1">
                      <InputText
                        name="locationPostalCode"
                        value={section2Form.data.locationPostalCode}
                        onChange={(e) =>
                          section2Form.setData(
                            "locationPostalCode",
                            e.target.value
                          )
                        }
                        autoComplete="postal-code"
                      />
                    </div>
                    <InputError
                      errorMessage={section2Form.errors?.locationPostalCode}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 flex justify-between">
                  <SecondaryButton onClick={() => handleBack()}>
                    Back
                  </SecondaryButton>

                  <PrimaryButton
                    disabled={section2Form.processing}
                    onClick={handleNext}
                  >
                    {section2Form.processing && (
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
                    Next
                  </PrimaryButton>
                </div>
              </div>
            ) : currentStep === 2 ? (
              <div key="2">
                {/* Fields */}
                <div className="grid grid-cols-1 gap-y-4">
                  <div className="col-span-full">
                    <InputLabel
                      htmlFor="businessEmail"
                      name="Business Email"
                      required={true}
                    />
                    <div className="mt-1">
                      <InputText
                        name="businessEmail"
                        value={section3Form.data.businessEmail}
                        onChange={(e) =>
                          section3Form.setData("businessEmail", e.target.value)
                        }
                        autoComplete="email"
                      />
                    </div>
                    <InputError
                      errorMessage={section3Form.errors?.businessEmail}
                    />
                  </div>

                  <div className="col-span-full">
                    <InputLabel
                      htmlFor="businessPhoneNumber"
                      name="Business Phone"
                    />
                    <div className="mt-1">
                      <InputText
                        name="businessPhoneNumber"
                        value={section3Form.data.businessPhoneNumber}
                        onChange={(e) =>
                          section3Form.setData(
                            "businessPhoneNumber",
                            e.target.value
                          )
                        }
                        autoComplete="tel"
                      />
                    </div>
                    <InputError
                      errorMessage={section3Form.errors?.businessPhoneNumber}
                    />
                  </div>

                  <div className="col-span-full">
                    <InputLabel
                      htmlFor="businessWebsite"
                      name="Business Website"
                    />
                    <div className="mt-1">
                      <InputText
                        name="businessWebsite"
                        value={section3Form.data.businessWebsite}
                        onChange={(e) =>
                          section3Form.setData(
                            "businessWebsite",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <InputError
                      errorMessage={section3Form.errors?.businessWebsite}
                    />
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
                          value={section3Form.data.businessInstagram}
                          onChange={(e) =>
                            section3Form.setData(
                              "businessInstagram",
                              e.target.value
                            )
                          }
                          placeholder="amazingbusiness"
                          className="border-none bg-transparent pl-1 shadow-none ring-0 ring-transparent focus:ring-0 focus:ring-transparent"
                        />
                      </div>
                    </div>
                    <InputError
                      errorMessage={section3Form.errors?.businessInstagram}
                    />
                  </div>

                  {/* <div className="col-span-full">
                                        <InputLabel htmlFor="tiktok" name="TikTok Account (optional)" />
                                        <div className="mt-1">
                                            <a
                                                href="#"
                                                className="flex w-full items-center justify-center gap-2 rounded-md px-3 py-1.5 text-gray-900 border border-gray-900 hover:bg-gray-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0Z" />
                                                </svg>
                                                <span className="text-sm font-semibold leading-6">Connect with TikTok</span>
                                            </a>
                                        </div>
                                    </div> */}
                </div>

                {/* Footer */}
                <div className="mt-8">
                  <InputError errorMessage={submitError} className="mt-0" />

                  <div
                    className={cn(
                      "flex justify-between",
                      submitError ? "mt-2" : ""
                    )}
                  >
                    <SecondaryButton onClick={() => handleBack()}>
                      Back
                    </SecondaryButton>

                    <PrimaryButton
                      disabled={section3Form.processing || loading}
                      onClick={handleNext}
                    >
                      {(section3Form.processing || loading) && (
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
              </div>
            ) : (
              <></>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
