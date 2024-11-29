"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import HospitalTable from "@/components/table/HospitalTable";
import { toast } from "react-toastify";
import { PROXY } from "@/config";
import axios from "axios";
import { useEffect, useState } from "react";

const Component2 = ({ setId, setState, state }: any) => {
  const [HospitaltableData, setHospitaltableData] = useState([]);
  const [updateApi, setUpdateApi] = useState(false);
  const getData = async () => {
    const res = await axios.get(`${PROXY}/utils/raw-material`, {
      headers: {
        Authorization: `Bearer ${
          typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("Indiduser")!)?.token
            : ""
        }`,
      },
    });
    console.log(
      "🚀 ~ file: Component2.tsx:24 ~ res.data.data.map ~ map:",
      res.data.data.data["raw-material"]
    );
    setHospitaltableData(
      res.data.data.data["raw-material"].map((val: any, key: number) => {
        return {
          _id: {
            data: res.data.data.data["raw-material"],
            key,
          },
          name: val.name,
          price: val.price,
        };
      })
    );
  };
  useEffect(() => {
    getData();
  }, [updateApi, state]);
  const Hospitalheaders = [
    { label: "Name", name: "name" },
    { label: "Price", name: "price" },
  ];

  return (
    <>
      <Breadcrumb pageName="Raw Material" />
      <div className="flex flex-col gap-10">
        <HospitalTable
          isPage={false}
          isSearch={false}
          setUpdateApi={setUpdateApi}
          onAddClick={(id: any) => {
            setId(id), setState("add");
          }}
          headers={Hospitalheaders}
          tableData={HospitaltableData}
          name="Raw Material"
          onEyeClick={(id: any) => {
            setId(id);
            setState("edit");
          }}
          onDelClick={async (id: any) => {
            const arr = id.data;
            arr.splice(id.key, 1);
            console.log(
              "🚀 ~ file: Component2.tsx:66 ~ onDelClick={ ~ id:",
              arr
            );

            const res = await axios.patch(
              `${PROXY}/utils`,
              {
                name: "raw-material",
                data: {
                  "raw-material": arr,
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
            toast.success("Blog Deleted Successfully");
            setUpdateApi(!updateApi);
          }}
        />
      </div>
    </>
  );
};

export default Component2;
