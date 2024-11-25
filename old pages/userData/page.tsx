"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import HospitalTable from "@/components/table/HospitalTable";
import { PROXY } from "@/config";
import axios from "axios";

const UserData = () => {
  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState<any>();
  const [UsertableData, setUsertableData] = useState([]);
  const [QuerytableData, setQuerytableData] = useState([]);
  const [search, setSearch] = useState("");
  const [updateApi, setUpdateApi] = useState(false);
  const [page, setPage] = useState(1);
  const [totalpage, setTotalPage] = useState();
  const [search1, setSearch1] = useState("");
  const [updateApi1, setUpdateApi1] = useState(false);
  const [page1, setPage1] = useState(1);
  const [totalpage1, setTotalPage1] = useState();
  const getData = async () => {
    const res = await axios.get(`${PROXY}/user?page=${page}&search=${search}`, {
      headers: {
        Authorization: `Bearer ${
          typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("Indiduser")!)?.token
            : ""
        }`,
      },
    });
    setTotalPage(res.data.totalPage);
    setUsertableData(
      res.data.data.map((val: any) => {
        return {
          _id: val._id,
          name: val.name,
          email: val.email,
          mobile: val.mobile,
        };
      })
    );
    const res1 = await axios.get(
      `${PROXY}/inquiry?page=${page1}&search=${search1}`,
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
    setTotalPage1(res.data.totalPage);
    setQuerytableData(
      res1.data.data.map((val: any) => {
        return {
          _id: val._id,
          pName: val.pName,
          email: val.email,
          mNo: val.mNo,
          loc: `${val.city}, ${val.country}`,
        };
      })
    );
  };
  useEffect(() => {
    getData();
  }, [updateApi, updateApi1]);
  const Userheaders = [
    { label: "Name", name: "name" },
    { label: "Email", name: "email" },
    { label: "Mobile No", name: "mobile" },
  ];
  const Queryheaders = [
    { label: "Name", name: "pName" },
    { label: "Email", name: "email" },
    { label: "Location", name: "loc" },
    { label: "Mobile No", name: "mNo" },
  ];
  const eyeClick = async (id: any) => {
    setModal(true);
    const res = await axios.get(`${PROXY}/inquiry?id=${id}`, {
      headers: {
        Authorization: `Bearer ${
          typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("Indiduser")!)?.token
            : ""
        }`,
      },
    });
    setModalData(res.data.data);
  };
  return (
    <>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <HospitalTable
          setUpdateApi={setUpdateApi}
          setSearch={setSearch}
          totalpage={totalpage}
          setPage={setPage}
          headers={Userheaders}
          tableData={UsertableData}
          name="Users"
          notactions={true}
        />
        <HospitalTable
          setUpdateApi={setUpdateApi1}
          setSearch={setSearch1}
          totalpage={totalpage1}
          setPage={setPage1}
          headers={Queryheaders}
          tableData={QuerytableData}
          name="Queries"
          notactions={true}
          onEyeClick={eyeClick}
        />
        {modal ? (
          <div className="modalBack">
            <div className="bg-white dark:bg-boxdark border border-black dark:border-white w-50 h-100 modal">
              <p onClick={() => setModal(false)}>X</p>
              <article>
                <hgroup>Name :</hgroup> <span>{modalData?.pName}</span>
              </article>
              <article>
                <hgroup>Age :</hgroup> <span>{modalData?.age}</span>
              </article>
              <article>
                <hgroup>Query :</hgroup>
                <span>{modalData?.description}</span>
              </article>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default UserData;
