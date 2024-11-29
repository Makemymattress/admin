"use client";
import { toast } from "react-toastify";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import CustomFileInput from "@/components/CustomFileInput";
import Link from "next/link";
import axios from "axios";
import { PROXY } from "@/config";

const Blogs = ({ id, setState, setId, state }: any) => {
  const [selectedFile, setSelectedFile] = useState<any>();
  const search = id;
  const [form, setForm] = useState<any>({
    name: "",
    price: "",
  });

  useEffect(() => {
    if (state === "edit") {
      const d = id.data[id.key];
      setForm(d);
    }
  }, [id]);

  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    if (document) {
      setIsReady(true);
    }
  }, []);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let data;
    if (state === "add") {
      const n = {
        name: form.name,
        price: parseInt(form.price),
      };
      data = id[0]?._id?.data ? id[0]?._id?.data : [];
      data.push(n);
    } else if (state === "edit") {
      const n = {
        name: form.name,
        price: parseInt(form.price),
      };
      data = id.data;
      data.splice(id.key, 1, n);
    }
    try {
      const d = await axios.patch(
        `${PROXY}/utils`,
        {
          name: "raw-material",
          data: {
            "raw-material": data,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${
              typeof window !== "undefined"
                ? JSON.parse(localStorage.getItem("Indiduser")!)?.token
                : ""
            }`,
          },
        }
      );
      setState(false);
    } catch (error) {}
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
            {state === "add" ? "Add" : "Edit"} Raw Material
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
                  Raw Material /
                </Link>
              </li>
              <li className="font-medium text-primary">
                {search ? "Edit" : "Add"} Raw Material
              </li>
            </ol>
          </nav>
        </div>
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <form action="#">
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Name <span className="text-meta-1">*</span>
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      type="text"
                      placeholder="Enter Name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

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
                      placeholder="Enter Price per Cubic Inch"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
                >
                  Save Raw Material
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
