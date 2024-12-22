"use client";

import InputLabel from "@/app/_components/InputLabel";
import InputError from "@/app/_components/InputError";
import InputText from "@/app/_components/InputText";
import PrimaryButton from "@/app/_components/PrimaryButton";
import { useEffect, useState } from "react";
import { businessTypes } from "@/app/_utils/constants";
import InputSelect from "@/app/_components/InputSelect";
import InputTextArea from "@/app/_components/InputTextArea";
import { Location } from "@prisma/client";
import { BusinessWithRelations } from "@/app/_utils/db";
import UpdateLocationForm from "@/app/_components/UpdateLocationForm";
import InputSuccess from "@/app/_components/InputSuccess";
import PhotoInput from "@/app/_components/PhotoInput";
import { ChevronLeftIcon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import useForm from "@/app/_utils/useForm";
import SecondaryButton from "@/app/_components/SecondaryButton";

export type UpdateBusinessFormSchemaType = {
  logo?: string;
  name: string;
  description: string;
  cuisineType: string;
  type: string;
  email: string;
  phoneNumber: string;
  website?: string;
  instagram: string;
  tiktok?: string;
};

export default function Page({
  params,
}: {
  params: { [key: string]: string | string[] | undefined };
}) {
  const [business, setBusiness] = useState<BusinessWithRelations>();
  const [loadingPage, setLoadingPage] = useState<boolean>(true);

  const form = useForm<UpdateBusinessFormSchemaType>({
    logo: "",
    name: "",
    description: "",
    cuisineType: "",
    type: "",
    email: "",
    phoneNumber: "",
    website: "",
    instagram: "",
    tiktok: "",
  });

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    form.transform((data) => {
      return {
        ...data,
        logo: data.logo != null ? data.logo : "",
      };
    });

    form.put(`/api/businesses/${business?.id}`);
  };

  const getBusiness = async () => {
    const businessResponse = await fetch(
      `/api/businesses/${params.business_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!businessResponse.ok) {
      const data = await businessResponse.json();
      console.error(data);

      return {};
    }

    const data = await businessResponse.json();
    setBusiness(data);

    form.setData({
      logo: data.logo,
      name: data.name,
      description: data.description,
      cuisineType: data.cuisineType,
      type: data.type,
      email: data.email,
      phoneNumber: data.phoneNumber,
      website: data.website,
      instagram: data.instagram,
      tiktok: data.tiktok,
    });

    setLoadingPage(false);
  };

  useEffect(() => {
    getBusiness();
  }, []);

  return (
    <div>
      {loadingPage ? (
        <div className="w-full py-8 flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-8 w-8 text-gray-900"
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
        </div>
      ) : (
        <>
          <Link href={`/dashboard/businesses/profile/${business?.id}`}>
            <SecondaryButton className="px-3 py-2 text-sm">
              <ChevronLeftIcon className="w-4 h-4 mr-1" />
              Back
            </SecondaryButton>
          </Link>
          <div className="mt-4 space-y-12">
            {/* Edit Business */}
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Business Profile
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Edit the general information of your business.
                </p>
              </div>

              <form
                onSubmit={submit}
                className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2"
              >
                {/* Logo */}
                <div className="sm:col-span-4">
                  <InputLabel htmlFor="logo" name="Logo" required={true} />
                  <div className="mt-1">
                    <PhotoInput
                      defaultValue={business?.logo || ""}
                      onChange={(logo: string) => form.setData("logo", logo)}
                    />
                  </div>
                  <InputError errorMessage={form.errors?.logo} />
                </div>

                <div className="sm:col-span-4">
                  <InputLabel htmlFor="name" name="Name" required={true} />
                  <div className="mt-1">
                    <InputText
                      name="name"
                      value={form.data.name}
                      onChange={(e) => form.setData("name", e.target.value)}
                    />
                  </div>
                  <InputError errorMessage={form.errors?.name} />
                </div>

                <div className="col-span-full">
                  <InputLabel
                    htmlFor="description"
                    name="Description"
                    required={true}
                  />
                  <div className="mt-1">
                    <InputTextArea
                      name="description"
                      value={form.data.description}
                      onChange={(e) =>
                        form.setData("description", e.target.value)
                      }
                    />
                  </div>
                  <InputError errorMessage={form.errors?.description} />
                </div>

                <div className="sm:col-span-3">
                  <InputLabel
                    htmlFor="cuisineType"
                    name="Cuisine Type"
                    required={true}
                  />
                  <div className="mt-1">
                    <InputText
                      name="cuisineType"
                      value={form.data.cuisineType}
                      onChange={(e) =>
                        form.setData("cuisineType", e.target.value)
                      }
                    />
                  </div>
                  <InputError errorMessage={form.errors?.cuisineType} />
                </div>

                <div className="sm:col-span-3">
                  <InputLabel
                    htmlFor="type"
                    name="Business Type"
                    required={true}
                  />
                  <div className="mt-1">
                    <InputSelect
                      name="type"
                      value={form.data.type}
                      onChange={(e) => form.setData("type", e.target.value)}
                      options={businessTypes}
                    />
                  </div>
                  <InputError errorMessage={form.errors?.type} />
                </div>

                <div className="sm:col-span-3">
                  <InputLabel
                    htmlFor="email"
                    name="Business Email"
                    required={true}
                  />
                  <div className="mt-1">
                    <InputText
                      name="email"
                      value={form.data.email}
                      onChange={(e) => form.setData("email", e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                  <InputError errorMessage={form.errors?.email} />
                </div>

                <div className="sm:col-span-3">
                  <InputLabel htmlFor="phoneNumber" name="Business Phone" />
                  <div className="mt-1">
                    <InputText
                      name="phoneNumber"
                      value={form.data.phoneNumber}
                      onChange={(e) =>
                        form.setData("phoneNumber", e.target.value)
                      }
                      autoComplete="tel"
                    />
                  </div>
                  <InputError errorMessage={form.errors?.phoneNumber} />
                </div>

                <div className="col-span-full">
                  <InputLabel htmlFor="website" name="Business Website" />
                  <div className="mt-1">
                    <InputText
                      name="website"
                      value={form.data.website}
                      onChange={(e) => form.setData("website", e.target.value)}
                    />
                  </div>
                  <InputError errorMessage={form.errors?.website} />
                </div>

                <div className="col-span-full">
                  <InputLabel htmlFor="instagram" name="Instagram Handle" />
                  <div className="mt-1">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-900">
                      <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                        instagram.com/
                      </span>
                      <InputText
                        name="instagram"
                        value={form.data.instagram}
                        onChange={(e) =>
                          form.setData("instagram", e.target.value)
                        }
                        placeholder="amazingbusiness"
                        className="border-none bg-transparent pl-1 shadow-none ring-0 ring-transparent focus:ring-0 focus:ring-transparent"
                      />
                    </div>
                  </div>
                  <InputError errorMessage={form.errors?.instagram} />
                </div>

                <div className="col-span-full py-6 flex items-center justify-end gap-x-6 border-b border-gray-900/10">
                  {form.hasErrors && (
                    <InputError errorMessage="Erorr while updating the business." />
                  )}
                  {form.recentlySuccessful && (
                    <InputSuccess successMessage="Business updated!" />
                  )}

                  <PrimaryButton disabled={form.processing} type="submit">
                    {form.processing && (
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
                    Save
                  </PrimaryButton>
                </div>
              </form>
            </div>

            {/* Edit Locations */}
            {business?.locations ? (
              business.locations.map((location: Location) => (
                <div
                  key={location.id}
                  className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3"
                >
                  <div>
                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                      {location.name
                        ? location.name
                        : `${business.name} - Location`}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Edit the information for this location.
                    </p>
                  </div>
                  <UpdateLocationForm location={location} />
                </div>
              ))
            ) : (
              <></>
            )}

            {/* <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Add more Locations
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Use this section to add more Locations to your business.
                </p>
              </div>

              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                <div className="col-span-full py-6 flex items-center justify-end gap-x-6 border-b border-gray-900/10">
                  <Link href="/contact-us">
                    <PrimaryButton>
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Location
                    </PrimaryButton>
                  </Link>
                </div>
              </div>
            </div> */}
          </div>
        </>
      )}
    </div>
  );
}
