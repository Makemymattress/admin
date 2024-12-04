"use client";
import { toast } from "react-toastify";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { PROXY, Variants_const } from "@/config";
import Select, { MultiValue, Options } from "react-select";
import { Modal, Upload } from "antd";
import { uploadButton } from "@/components/common/Loader";
import {
  compressAndAppendFiles,
  setDefaultImages,
  setDefaultImages1,
} from "@/utils";
type SizeOption = { value: string; label: string };
type FormState = {
  variants: string[]; // Selected variants
  single: string[];
  diwan: string[];
  queen: string[];
  king: string[];
};
interface Option {
  name: string;
  price: number;
}
interface ThicknessOption {
  value: string;
  label: string;
}

const Products = ({ id, setState, setId, state }: any) => {
  const [selectedFile, setSelectedFile] = useState<any>();
  const [rawMaterial, setRawMaterial] = useState<any>();
  const [form, setForm] = useState<any>({
    product_name: "",
    description: "",
    price: "",
    discount: "",
    benefit: "",
    firmness_level: "",
    top_layer: "",
    middle_layer: "",
    base_layer: "",
    trial_period: "",
    warranty: "",
    top_fabric: "",
    cover_type: "",
    usability: "",
    material: "",
    feel: "",
    thickness: [],
    shipping_policies: "",
    category: "",
    rank: "",
    popular: false,
    exclusive: false,
    customization: "",
    colors: [],
    variants: [],
    single: [],
    diwan: [],
    queen: [],
    king: [],
  });
  const handleVariantChange = (selectedOptions: MultiValue<SizeOption>) => {
    const selectedVariants = selectedOptions.map((option) => option.value);
    setForm((prevForm: any) => ({
      ...prevForm,
      variants: selectedVariants,
      // Reset size selections for unselected variants
      single: selectedVariants.includes("Single") ? prevForm.single : [],
      diwan: selectedVariants.includes("Diwan") ? prevForm.diwan : [],
      queen: selectedVariants.includes("Queen") ? prevForm.queen : [],
      king: selectedVariants.includes("King") ? prevForm.king : [],
    }));
  };

  const handleSizeChange = (
    key: keyof FormState,
    selectedOptions: MultiValue<SizeOption>
  ) => {
    setForm((prevForm: any) => ({
      ...prevForm,
      [key]: selectedOptions.map((option) => option.value),
    }));
  };

  const variantOptions: Options<SizeOption> = Object.keys(Variants_const).map(
    (key) => ({
      value: key,
      label: key,
    })
  );
  const [value, setValue] = useState("");

  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    if (document) {
      setIsReady(true);
    }
  }, []);
  const editorChage = (Value: any) => {
    setValue(Value);
    setForm({ ...form, description: Value });
  };

  //thickness
  const [selectedThickness, setSelectedThickness] = useState<any>([]);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [thicknessInputs, setThicknessInputs] = useState<any[]>([]);
  const [thinknessVal, setThinknessVal] = useState<any[]>([]);
  const thicknessOptions: ThicknessOption[] = [
    { value: "4", label: "4" },
    { value: "6", label: "6" },
    { value: "8", label: "8" },
    { value: "10", label: "10" },
  ];

  const handleThicknessChange = (selectedOptions: any, selected: any) => {
    setSelectedThickness(selectedOptions.map((val: any) => val.value));
    if (selected.action === "select-option") {
      setThicknessInputs((value) => ({
        ...value,
        [selected.option.value]: [],
      }));
      setThinknessVal((value) => ({
        ...value,
        [selected.option.value]: {},
      }));
    } else if (selected.action === "remove-value") {
      setThicknessInputs((value: any) => {
        delete value[selected?.removedValue?.value];
        return value;
      });
      setThinknessVal((value: any) => {
        delete value[selected?.removedValue?.value];
        return value;
      });
    }
  };
  const [images, setImages] = useState<any>([]);
  const [imageLinks, setImageLinks] = useState([]);

  const [thumbnail, setThumbnail] = useState<any>([]);
  const [thumbnailLink, setThumbnailLink] = useState([]);

  const [videos, setVideos] = useState<any>([]);
  const [videoLinks, setVideoLinks] = useState([]);

  const handleChangeMedia = (
    { fileList: newFileList, file }: any,
    setMedia: any,
    setMediaLink: any
  ) => {
    if (file.status !== "removed") {
      setMedia(newFileList);
    } else {
      const data = newFileList
        .filter((data: any) => data.url)
        .map((data: any) => data.url);
      setMediaLink(data);
      setMedia(newFileList);
    }
  };
  useEffect(() => {
    const getRawData = async () => {
      const res = await axios.get(`${PROXY}/utils/raw-material`, {
        headers: {
          Authorization: `Bearer ${
            typeof window !== "undefined"
              ? JSON.parse(localStorage.getItem("Indiduser")!)?.token
              : ""
          }`,
        },
      });
      setSelectedOptions(
        res.data.data.data["raw-material"].map((val: any) => ({
          value: val.name,
          label: val.name,
        }))
      );
    };
    const getOne = async () => {
      if (id) {
        const findata: any = await axios.get(`${PROXY}/product/getone/${id}`);
        setForm(findata.data?.data);
        // setValue(findata.data?.data.description);
        if (findata.data?.data.images?.length) {
          const data = findata.data?.data.images.map((url: any, uid: any) => {
            return setDefaultImages(url, uid);
          });
          setImages(data);
          setImageLinks(setDefaultImages1(data));
        }
        if (findata.data?.data.thumbnail) {
          const data = [setDefaultImages(findata.data?.data.thumbnail, 20)];
          console.log("🚀 ~ file: Component1.tsx:199 ~ getOne ~ data:", data);

          setThumbnail(data);
          setThumbnailLink(setDefaultImages1(data));
        }
        if (findata.data?.data.videos?.length) {
          const data = findata.data?.data.videos.map((url: any, uid: any) => {
            return setDefaultImages(url, uid);
          });
          setVideos(data);
          setVideoLinks(setDefaultImages1(data));
        }
        setThicknessInputs(findata.data?.data["thickness_options"]);
        setThinknessVal(findata.data?.data["thickness_values"]);
        setSelectedThickness(findata.data?.data.thickness);
      }
    };
    getOne();
    getRawData();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let res;
    // setForm({ ...form, about: descriptions });
    try {
      const formData = new FormData();
      formData.append("product_name", form.product_name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("discount", form.discount);
      formData.append("benefit", form.benefit);
      formData.append("firmness_level", form.firmness_level);
      formData.append("top_layer", form.top_layer);
      formData.append("middle_layer", form.middle_layer);
      formData.append("base_layer", form.base_layer);
      formData.append("trial_period", form.trial_period);
      formData.append("warranty", form.warranty);
      formData.append("top_fabric", form.top_fabric);
      formData.append("cover_type", form.cover_type);
      formData.append("usability", form.usability);
      formData.append("material", form.material);
      formData.append("feel", form.feel);
      formData.append("thickness", JSON.stringify(selectedThickness));
      formData.append("thickness_options", JSON.stringify(thicknessInputs));
      formData.append("thickness_values", JSON.stringify(thinknessVal));
      formData.append("shipping_policies", form.shipping_policies);
      formData.append("category", form.category);
      formData.append("rank", form.rank);
      formData.append("popular", JSON.stringify(form.popular));
      formData.append("exclusive", JSON.stringify(form.exclusive));
      formData.append("customization", form.customization);
      formData.append("colors", JSON.stringify(form.colors));
      formData.append("variants", JSON.stringify(form.variants));
      formData.append("single", JSON.stringify(form.single));
      formData.append("diwan", JSON.stringify(form.diwan));
      formData.append("queen", JSON.stringify(form.queen));
      formData.append("king", JSON.stringify(form.king));
      await compressAndAppendFiles(images, formData, "images");
      await compressAndAppendFiles(thumbnail, formData, "thumbnail");
      videos.forEach(async (file: any) => {
        if (file.originFileObj) {
          formData.append("videos", file.originFileObj);
        }
      });
      if (state === "edit") {
        formData.append("imagesLink", JSON.stringify(imageLinks));
        formData.append("videosLink", JSON.stringify(videoLinks));
        formData.append(
          "thumbnailLink",
          thumbnailLink.length ? thumbnailLink[0] : ""
        );
        formData.append("id", id);
        res = await axios.patch(`${PROXY}/product/update`, formData, {
          headers: {
            Authorization: `Bearer ${
              typeof window !== "undefined"
                ? JSON.parse(localStorage.getItem("Indiduser")!)?.token
                : ""
            }`,
          },
        });
        toast.success("Blog Update Successfully");
        setState(false);
      } else if (state === "add") {
        res = await axios.post(`${PROXY}/product/create`, formData, {
          headers: {
            Authorization: `Bearer ${
              typeof window !== "undefined"
                ? JSON.parse(localStorage.getItem("Indiduser")!)?.token
                : ""
            }`,
          },
        });
        toast.success("Blog Created Successfully");
        setState(false);
      }
    } catch (error) {
    } finally {
      setState(false);
    }
  };

  if (isReady) {
    return (
      <>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            {id ? "Edit" : "Add"} Products
          </h2>

          <nav>
            <ol className="flex items-center gap-2">
              <li>
                <Link className="font-medium" href="/">
                  Dashboard /
                </Link>
              </li>
              <li>
                <Link
                  className="font-medium"
                  href=""
                  onClick={() => setState(false)}
                >
                  Products /
                </Link>
              </li>
              <li className="font-medium text-primary">
                {id ? "Edit" : "Add"} Products
              </li>
            </ol>
          </nav>
        </div>
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <form action="#">
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 ">
                  <label className="mb-1 block text-black dark:text-white">
                    Thumbnail
                  </label>
                  <Upload
                    accept="image/*"
                    multiple
                    listType="picture-card"
                    fileList={thumbnail}
                    onChange={(e: any) => {
                      handleChangeMedia(e, setThumbnail, setThumbnailLink);
                    }}
                  >
                    {thumbnail.length >= 1 ? null : uploadButton}
                  </Upload>
                </div>{" "}
                <div className="mb-4.5 flex flex-col gap-6 ">
                  <label className="mb-1 block text-black dark:text-white">
                    Images
                  </label>
                  <Upload
                    accept="image/*"
                    multiple
                    listType="picture-card"
                    fileList={images}
                    onChange={(e: any) => {
                      handleChangeMedia(e, setImages, setImageLinks);
                    }}
                  >
                    {images.length >= 10 ? null : uploadButton}
                  </Upload>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 ">
                  <label className="mb-1 block text-black dark:text-white">
                    Videos
                  </label>
                  <Upload
                    multiple
                    accept="video/*"
                    listType="picture-card"
                    fileList={videos}
                    onChange={(e: any) => {
                      handleChangeMedia(e, setVideos, setVideoLinks);
                    }}
                  >
                    {videos.length >= 10 ? null : uploadButton}
                  </Upload>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Product Name <span className="text-meta-1">*</span>
                    </label>
                    <input
                      value={form.product_name}
                      onChange={(e) =>
                        setForm({ ...form, product_name: e.target.value })
                      }
                      type="text"
                      placeholder="Enter Product Name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Description
                    </label>
                    <input
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      type="text"
                      placeholder="Enter Description"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
                {/* Row 2 */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Price
                    </label>
                    <input
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      type="number"
                      placeholder="Enter Price"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Discount
                    </label>
                    <input
                      value={form.discount}
                      onChange={(e) =>
                        setForm({ ...form, discount: e.target.value })
                      }
                      type="number"
                      placeholder="Enter Discount"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
                {/* Row 3 */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Benefit
                    </label>
                    <input
                      value={form.benefit}
                      onChange={(e) =>
                        setForm({ ...form, benefit: e.target.value })
                      }
                      type="text"
                      placeholder="Enter Benefit"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Firmness Level
                    </label>
                    <input
                      value={form.firmness_level}
                      onChange={(e) =>
                        setForm({ ...form, firmness_level: e.target.value })
                      }
                      type="text"
                      placeholder="Enter Firmness Level"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
                {/* Category */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Category
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    >
                      <option value="">Select Category</option>
                      <option value="Mattress">Mattress</option>
                      <option value="Pillows">Pillows</option>
                      <option value="Covers">Covers</option>
                    </select>
                  </div>

                  {/* Rank */}
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Rank
                    </label>
                    <select
                      value={form.rank}
                      onChange={(e) =>
                        setForm({ ...form, rank: Number(e.target.value) })
                      }
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    >
                      <option value="">Select Rank</option>
                      {[1, 2, 3, 4, 5].map((rank) => (
                        <option key={rank} value={rank}>
                          {rank}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Popular and Exclusive */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Popular
                    </label>
                    <select
                      value={form.popular}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          popular: e.target.value === "true",
                        })
                      }
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    >
                      <option value="">Select Popular</option>
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Exclusive
                    </label>
                    <select
                      value={form.exclusive}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          exclusive: e.target.value === "true",
                        })
                      }
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    >
                      <option value="">Select Exclusive</option>
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </div>
                </div>
                {/* Customization */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Customization
                    </label>
                    <select
                      value={form.customization}
                      onChange={(e) =>
                        setForm({ ...form, customization: e.target.value })
                      }
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    >
                      <option value="">Select Customization</option>
                      <option value="Available">Available</option>
                      <option value="Not-Available">Not Available</option>
                    </select>
                  </div>
                  <div className="w-full xl:w-1/2">
                    {/* Multi-select for Colors */}
                    <label className="mb-2.5 block text-black dark:text-white">
                      Colors
                    </label>
                    <select
                      multiple
                      value={form.colors}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          colors: Array.from(
                            e.target.selectedOptions,
                            (option) => option.value
                          ),
                        })
                      }
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    >
                      <option value="Red">Red</option>
                      <option value="Blue">Blue</option>
                      <option value="Green">Green</option>
                      <option value="Yellow">Yellow</option>
                      <option value="Black">Black</option>
                      <option value="White">White</option>
                    </select>
                  </div>
                </div>
                {form.category === "Mattress" && (
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/5">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Select Variants
                      </label>
                      <Select
                        closeMenuOnSelect={false}
                        isMulti
                        options={variantOptions}
                        value={variantOptions.filter((option) =>
                          form.variants.includes(option.value)
                        )}
                        onChange={handleVariantChange}
                        placeholder="Select Variants"
                        className="basic-multi-select"
                        classNamePrefix="select"
                      />
                    </div>

                    {form.variants.includes("Single") && (
                      <div className="w-full xl:w-1/5">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Select Sizes for Single
                        </label>
                        <Select
                          closeMenuOnSelect={false}
                          isMulti
                          options={Variants_const.Single.map((size) => ({
                            value: size,
                            label: size,
                          }))}
                          value={form.single.map((size: any) => ({
                            value: size,
                            label: size,
                          }))}
                          onChange={(selectedOptions) =>
                            handleSizeChange("single", selectedOptions)
                          }
                          placeholder="Select Sizes for Single"
                          className="basic-multi-select"
                          classNamePrefix="select"
                        />
                      </div>
                    )}

                    {form.variants.includes("Diwan") && (
                      <div className="w-full xl:w-1/5">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Select Sizes for Diwan
                        </label>
                        <Select
                          closeMenuOnSelect={false}
                          isMulti
                          options={Variants_const.Diwan.map((size) => ({
                            value: size,
                            label: size,
                          }))}
                          value={form.diwan.map((size: any) => ({
                            value: size,
                            label: size,
                          }))}
                          onChange={(selectedOptions) =>
                            handleSizeChange("diwan", selectedOptions)
                          }
                          placeholder="Select Sizes for Diwan"
                          className="basic-multi-select"
                          classNamePrefix="select"
                        />
                      </div>
                    )}

                    {form.variants.includes("Queen") && (
                      <div className="w-full xl:w-1/5">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Select Sizes for Queen
                        </label>
                        <Select
                          closeMenuOnSelect={false}
                          isMulti
                          options={Variants_const.Queen.map((size) => ({
                            value: size,
                            label: size,
                          }))}
                          value={form.queen.map((size: any) => ({
                            value: size,
                            label: size,
                          }))}
                          onChange={(selectedOptions) =>
                            handleSizeChange("queen", selectedOptions)
                          }
                          placeholder="Select Sizes for Queen"
                          className="basic-multi-select"
                          classNamePrefix="select"
                        />
                      </div>
                    )}

                    {form.variants.includes("King") && (
                      <div className="w-full xl:w-1/5">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Select Sizes for King
                        </label>
                        <Select
                          closeMenuOnSelect={false}
                          isMulti
                          options={Variants_const.King.map((size) => ({
                            value: size,
                            label: size,
                          }))}
                          value={form.king.map((size: any) => ({
                            value: size,
                            label: size,
                          }))}
                          onChange={(selectedOptions) =>
                            handleSizeChange("king", selectedOptions)
                          }
                          placeholder="Select Sizes for King"
                          className="basic-multi-select"
                          classNamePrefix="select"
                        />
                      </div>
                    )}
                  </div>
                )}
                <div className="form-container">
                  {/* Category selection */}

                  {/* Show thickness multi-select only if category is "Mattress" */}
                  {form.category === "Mattress" && (
                    <>
                      <div>
                        <label>Thickness</label>
                        <Select
                          isMulti
                          closeMenuOnSelect={false}
                          options={thicknessOptions}
                          onChange={handleThicknessChange}
                          value={thicknessOptions.filter((option, k) =>
                            selectedThickness.includes(option.value)
                          )}
                        />
                      </div>
                      {selectedThickness &&
                        selectedOptions.length > 0 &&
                        selectedThickness.map((val: any) => (
                          <div className="border-2  border-grey-400 p-4 m-4 rounded-xl">
                            <div>
                              <label>Options for {val} inch</label>
                              <Select
                                options={selectedOptions}
                                isMulti
                                onChange={(selectedOptions, selected: any) => {
                                  setThicknessInputs((prevVal: any) => {
                                    return {
                                      ...prevVal,
                                      [val]: selectedOptions.map((val) => val),
                                    };
                                  });
                                  if (selected.action === "select-option") {
                                    setThinknessVal((value) => ({
                                      ...value,
                                      [val]: {
                                        ...thinknessVal[val],
                                        [selected.option.value]: "",
                                      },
                                    }));
                                  } else if (
                                    selected.action === "remove-value"
                                  ) {
                                    setThinknessVal((value: any) => {
                                      delete value[val][
                                        selected?.removedValue?.value
                                      ];
                                      return value;
                                    });
                                  }
                                }}
                                value={thicknessInputs[val]}
                              />
                            </div>
                            {thicknessInputs[val].map((input: any) => (
                              <div key={input.value} className="input-box">
                                <label>{input.value}</label>
                                <input
                                  type="number"
                                  min="1"
                                  max={parseInt(val || "0")}
                                  value={thinknessVal[val][input.value]}
                                  onChange={(e) =>
                                    setThinknessVal((prevVal: any) => ({
                                      ...prevVal,
                                      [val]: {
                                        ...prevVal[val],
                                        [input.value]: e.target.value,
                                      },
                                    }))
                                  }
                                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                              </div>
                            ))}

                            {/* Final validation */}
                            <div className="validation-message">
                              {(() => {
                                const sum: any = Object.values(
                                  thinknessVal[val]
                                ).reduce(
                                  (sum: any, input: any) =>
                                    sum + parseInt(input),
                                  0
                                );
                                const isValid = sum === parseInt(val);

                                return isValid ? (
                                  <p>Total matches selected thickness: {val}</p>
                                ) : (
                                  <p style={{ color: "red" }}>
                                    Sum Total input values ({sum}) must match
                                    selected thickness ({val})
                                  </p>
                                );
                              })()}
                            </div>
                          </div>
                        ))}
                    </>
                  )}

                  {/* Show dynamic multi-select for options when thickness is selected */}

                  {/* Input boxes for each selected option */}
                </div>
                {/* Repeat for all fields */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Top Layer
                    </label>
                    <input
                      value={form.top_layer}
                      onChange={(e) =>
                        setForm({ ...form, top_layer: e.target.value })
                      }
                      type="text"
                      placeholder="Enter Top Layer"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Middle Layer
                    </label>
                    <input
                      value={form.middle_layer}
                      onChange={(e) =>
                        setForm({ ...form, middle_layer: e.target.value })
                      }
                      type="text"
                      placeholder="Enter Middle Layer"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Base Layer
                    </label>
                    <input
                      value={form.base_layer}
                      onChange={(e) =>
                        setForm({ ...form, base_layer: e.target.value })
                      }
                      type="text"
                      placeholder="Enter Base Layer"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Trial Period
                    </label>
                    <input
                      value={form.trial_period}
                      onChange={(e) =>
                        setForm({ ...form, trial_period: e.target.value })
                      }
                      type="text"
                      placeholder="Enter Trial Period"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Warranty
                    </label>
                    <input
                      value={form.warranty}
                      onChange={(e) =>
                        setForm({ ...form, warranty: e.target.value })
                      }
                      type="text"
                      placeholder="Enter Warranty"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Top Fabric
                    </label>
                    <input
                      value={form.top_fabric}
                      onChange={(e) =>
                        setForm({ ...form, top_fabric: e.target.value })
                      }
                      type="text"
                      placeholder="Enter Top Fabric"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Cover Type
                    </label>
                    <input
                      value={form.cover_type}
                      onChange={(e) =>
                        setForm({ ...form, cover_type: e.target.value })
                      }
                      type="text"
                      placeholder="Enter Cover Type"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Usability
                    </label>
                    <input
                      value={form.usability}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          usability: e.target.value,
                        })
                      }
                      type="text"
                      placeholder="Enter Usability"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Material
                    </label>
                    <input
                      value={form.material}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          material: e.target.value,
                        })
                      }
                      type="text"
                      placeholder="Enter Material"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Feel
                    </label>
                    <input
                      value={form.feel}
                      onChange={(e) =>
                        setForm({ ...form, feel: e.target.value })
                      }
                      type="text"
                      placeholder="Enter Feel"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Shipping Policies
                    </label>
                    <input
                      value={form.shipping_policies}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          shipping_policies: e.target.value,
                        })
                      }
                      type="text"
                      placeholder="Enter Shipping Policies"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }
};

export default Products;
