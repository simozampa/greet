"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { countries, creatorRegistrationSteps } from "@/app/_utils/constants";
import InputLabel from "@/app/_components/InputLabel";
import InputError from "@/app/_components/InputError";
import InputText from "@/app/_components/InputText";
import PrimaryButton from "@/app/_components/PrimaryButton";
import InputSelect from "@/app/_components/InputSelect";
import SecondaryButton from "@/app/_components/SecondaryButton";
import { cn, loginRedirect } from "@/app/_utils/helpers";
import useForm from "@/app/_utils/useForm";
import {
  validateCreatorRegistrationSection1,
  validateCreatorRegistrationSection2,
  validateCreatorRegistrationSection3,
} from "@/app/actions";
import InputCheckbox from "@/app/_components/InputCheckbox";
import { User } from "@prisma/client";

export type Section1RegisterCreatorFormSchemaType = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type Section2RegisterCreatorFormSchemaType = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  city: string;
  country: string;
  region: string;
  postalCode: string;
};

export type Section3RegisterCreatorFormSchemaType = {
  instagramHandle: string;
  tiktokHandle: string;
};

export default function Page() {
  const section1Form = useForm<Section1RegisterCreatorFormSchemaType>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const section2Form = useForm<Section2RegisterCreatorFormSchemaType>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    city: "",
    country: "united-states",
    region: "",
    postalCode: "",
  });

  const section3Form = useForm<Section3RegisterCreatorFormSchemaType>({
    instagramHandle: "",
    tiktokHandle: "",
  });

  const router = useRouter();
  const { data: session } = useSession();

  const [submitError, setSubmitError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const validateSection1 = async (): Promise<boolean> => {
    section1Form.setProcessing(true);
    section1Form.clearErrors();

    const { isValid, errors } = await validateCreatorRegistrationSection1(
      section1Form.data
    );
    if (!isValid) {
      section1Form.setError(
        errors as Record<keyof Section1RegisterCreatorFormSchemaType, string>
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

    const { isValid, errors } = await validateCreatorRegistrationSection2(
      section2Form.data
    );
    if (!isValid) {
      section2Form.setError(
        errors as Record<keyof Section2RegisterCreatorFormSchemaType, string>
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

    const { isValid, errors } = await validateCreatorRegistrationSection3(
      section3Form.data
    );
    if (!isValid) {
      section3Form.setError(
        errors as Record<keyof Section3RegisterCreatorFormSchemaType, string>
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
    if (currentStep + 1 === creatorRegistrationSteps.length) {
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
      const { isValid, redirectUrl } = await createInDb();
      if (isValid) {
        router.push(redirectUrl);
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

  const createInDb = async (): Promise<{
    isValid: boolean;
    redirectUrl: string;
  }> => {
    const response = await fetch("/api/users/creators", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: section1Form.data.email,
        password: section1Form.data.password,
        confirmPassword: section1Form.data.confirmPassword,
        firstName: section2Form.data.firstName,
        lastName: section2Form.data.lastName,
        phoneNumber: section2Form.data.phoneNumber,
        city: section2Form.data.city,
        country: section2Form.data.country,
        region: section2Form.data.region,
        postalCode: section2Form.data.postalCode,
        instagramHandle: section3Form.data.instagramHandle.trim().toLowerCase(),
        tiktokHandle: section3Form.data.tiktokHandle,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      console.error(data);
      return {
        isValid: false,
        redirectUrl: "",
      };
    }

    // Parse the response data
    const data = await response.json();
    const user: User = data.user;
    const verificationUrl: string | null = data.verificationUrl;

    // If we have verificationUrl (ie: it's not null)
    // it means that we already automatically approved the user
    // So we use that to redirect the user to the verification page
    return {
      isValid: true,
      redirectUrl: verificationUrl ? verificationUrl : "/thank-you",
    };
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
              Sign Up As A Creator
            </h2>
          </div>

          {/* Steps menu */}
          <nav className="py-8" aria-label="Progress">
            <ol
              role="list"
              className="space-y-4 md:flex md:space-x-8 md:space-y-0"
            >
              {creatorRegistrationSteps.map((step) => (
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
                <div className="grid grid-cols-1 gap-y-4">
                  {/* Email */}
                  <div className="col-span-full">
                    <InputLabel htmlFor="email" name="Email" required={true} />
                    <div className="mt-1">
                      <InputText
                        name="firstName"
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
                  <div>
                    <InputLabel
                      htmlFor="firstName"
                      name="First name"
                      required={true}
                    />
                    <div className="mt-1">
                      <InputText
                        name="firstName"
                        value={section2Form.data.firstName}
                        onChange={(e) =>
                          section2Form.setData("firstName", e.target.value)
                        }
                        autoComplete="given-name"
                      />
                    </div>
                    <InputError errorMessage={section2Form.errors?.firstName} />
                  </div>

                  <div>
                    <InputLabel
                      htmlFor="lastName"
                      name="Last name"
                      required={true}
                    />
                    <div className="mt-1">
                      <InputText
                        name="lastName"
                        value={section2Form.data.lastName}
                        onChange={(e) =>
                          section2Form.setData("lastName", e.target.value)
                        }
                        autoComplete="family-name"
                      />
                    </div>
                    <InputError errorMessage={section2Form.errors?.lastName} />
                  </div>

                  <div className="sm:col-span-2">
                    <InputLabel
                      htmlFor="phoneNumber"
                      name="Phone"
                      required={true}
                    />
                    <div className="mt-1">
                      <InputText
                        name="phoneNumber"
                        value={section2Form.data.phoneNumber}
                        onChange={(e) =>
                          section2Form.setData("phoneNumber", e.target.value)
                        }
                        autoComplete="tel"
                      />
                    </div>
                    <InputError
                      errorMessage={section2Form.errors?.phoneNumber}
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

                  <div>
                    <InputLabel htmlFor="city" name="City" required={true} />
                    <div className="mt-1">
                      <InputText
                        name="city"
                        value={section2Form.data.city}
                        onChange={(e) =>
                          section2Form.setData("city", e.target.value)
                        }
                        autoComplete="address-level2"
                      />
                    </div>
                    <InputError errorMessage={section2Form.errors?.city} />
                  </div>

                  <div>
                    <InputLabel
                      htmlFor="country"
                      name="Country"
                      required={true}
                    />
                    <div className="mt-1">
                      <InputSelect
                        name="country"
                        value={section2Form.data.country}
                        onChange={(e) =>
                          section2Form.setData("country", e.target.value)
                        }
                        options={countries}
                        autoComplete="country-name"
                      />
                    </div>
                    <InputError errorMessage={section2Form.errors?.country} />
                  </div>

                  <div>
                    <InputLabel
                      htmlFor="region"
                      name="State / Province"
                      required={true}
                    />
                    <div className="mt-1">
                      <InputText
                        name="region"
                        value={section2Form.data.region}
                        onChange={(e) =>
                          section2Form.setData("region", e.target.value)
                        }
                        autoComplete="address-level1"
                      />
                    </div>
                    <InputError errorMessage={section2Form.errors?.region} />
                  </div>

                  <div>
                    <InputLabel
                      htmlFor="postalCode"
                      name="Postal Code"
                      required={true}
                    />
                    <div className="mt-1">
                      <InputText
                        name="postalCode"
                        value={section2Form.data.postalCode}
                        onChange={(e) =>
                          section2Form.setData("postalCode", e.target.value)
                        }
                        autoComplete="postal-code"
                      />
                    </div>
                    <InputError
                      errorMessage={section2Form.errors?.postalCode}
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
                <div className="grid grid-cols-1 gap-y-4">
                  <div className="col-span-full">
                    <InputLabel
                      htmlFor="instagramHandle"
                      name="Instagram Handle"
                      required={true}
                    />
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Please provide your Instagram handle (eg: your username).
                      <br />
                      We will use this information to verify your profile. We
                      may ask you for further verification after your
                      registration.
                      <span className="font-bold">
                        {" "}
                        Please double-check your handle before submitting.
                      </span>
                    </p>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-900">
                        <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                          instagram.com/
                        </span>
                        <InputText
                          name="instagramHandle"
                          value={section3Form.data.instagramHandle}
                          onChange={(e) =>
                            section3Form.setData(
                              "instagramHandle",
                              e.target.value
                            )
                          }
                          placeholder="foodie2020"
                          className="border-none bg-transparent pl-1 shadow-none ring-0 ring-transparent focus:ring-0 focus:ring-transparent"
                        />
                      </div>
                    </div>
                    <InputError
                      errorMessage={section3Form.errors?.instagramHandle}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8">
                  <InputError errorMessage={submitError} className="mt-0" />
                  {(section3Form.processing || loading) && (
                    <p className="text-yellow-800 text-xs mb-2 -mt-2">
                      Analyzing your application, please wait. <br/>
                      This might take a few seconds. Do not close or refresh the page.
                    </p>
                  )}

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
                      Send my Request
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
