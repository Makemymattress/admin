"use client";
import { toast } from "react-toastify";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import CustomFileInput from "@/components/CustomFileInput";
import Link from "next/link";
import axios from "axios";
import { PROXY } from "@/config";

const Blogs = ({ id, setState, setId }: any) => {
  const [selectedFile, setSelectedFile] = useState<any>();
  const search = id;
  const [form, setForm] = useState<any>({
    title: "",
    url: "",
    category: "",
    subCategory: "",
    keywords: [],
    description: "",
  });
  const [value, setValue] = useState("");
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
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
  useEffect(() => {
    const getOne = async () => {
      if (search) {
        const findata: any = await axios.get(`${PROXY}/blog/getBlog/${search}`);
        setForm(findata.data?.data);
        setValue(findata.data?.data.description);
      }
    };
    getOne();
  }, []);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // setForm({ ...form, about: descriptions });
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("category", form.category);
    formData.append("subCategory", form.subCategory);
    formData.append("description", form.description);
    formData.append("url", form.url);
    formData.append("keywords", JSON.stringify(form.keywords));
    selectedFile && formData.append("file", selectedFile);
    let res;
    if (search) {
      formData.append("id", search);
      res = await axios.patch(`${PROXY}/blog/update`, formData, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ?
            JSON.parse(localStorage.getItem("Indiduser")!)?.token : ""
          }`,
        },
      });
      toast.success("Blog Update Successfully");
      setState(false);
    } else {
      res = await axios.post(`${PROXY}/blog/create`, formData, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ?
            JSON.parse(localStorage.getItem("Indiduser")!)?.token : ""
          }`,
        },
      });
      toast.success("Blog Created Successfully");
      setState(false);
    }
  };
  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };
  if (isReady) {
    return (
      <>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            {search ? "Edit" : "Add"} Blogs
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
                  onClick={() => setState(false)}>
                  Blogs /
                </Link>
              </li>
              <li className="font-medium text-primary">
                {search ? "Edit" : "Add"} Blogs
              </li>
            </ol>
          </nav>
        </div>
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <form action="#">
              <CustomFileInput
                filePreviewed={form.mainImage}
                setSelectedFileFromParent={setSelectedFile}></CustomFileInput>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Title <span className="text-meta-1">*</span>
                    </label>
                    <input
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      type="text"
                      placeholder="Enter Title"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      URL
                    </label>
                    <input
                      value={form.url}
                      onChange={(e) =>
                        setForm({ ...form, url: e.target.value })
                      }
                      type="text"
                      placeholder="Enter URL"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Category
                    </label>
                    <input
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                      type="text"
                      placeholder="Enter Category"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Sub Category
                    </label>
                    <input
                      value={form.subCategory}
                      onChange={(e) =>
                        setForm({ ...form, subCategory: e.target.value })
                      }
                      type="text"
                      placeholder="Enter Sub Category"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    SEO Keyword <span className="text-meta-1">*</span>
                  </label>
                  <input
                    value={form.keywords.join(",")}
                    onChange={(e) =>
                      setForm({ ...form, keywords: e.target.value.split(",") })
                    }
                    type="text"
                    placeholder="Enter SEO Keyword"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5" style={{ height: "500px" }}>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Description <span className="text-meta-1">*</span>
                  </label>
                  {/* <EditorToolbar /> */}
                  <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={editorChage}
                    placeholder={"Write Your Blog Description...."}
                    modules={modules}
                    style={{ height: "75%" }}

                    // formats={formats}
                  ></ReactQuill>
                </div>
                <button
                  onClick={handleSubmit}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
                  Save Blog
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }
};

export default Blogs;
