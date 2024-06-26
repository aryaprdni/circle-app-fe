/* eslint-disable react-hooks/exhaustive-deps */
import { API, setAuthToken } from "../../../libs/axios";
import { useDispatch, useSelector } from "react-redux";
import { GET_THREADS, POST_THREAD } from "../../../store/RootReducer";
import { RootState } from "../../../store/types/RootState";
import { useEffect } from "react";
import React from "react";
import { IPostThread } from "../../../interface/IThread";

export function useThreads() {
  const dispatch = useDispatch();
  const threads = useSelector((state: RootState) => state.thread);

  if (localStorage.token) {
    setAuthToken(localStorage.token);
  } else {
    console.warn("Token not found in localStorage");
  }

  const [data, setData] = React.useState<IPostThread>({
    content: "",
    image: null,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;
    if (files && files.length > 0) {
      setData({
        ...data,
        [name]: files[0],
      });
    } else {
      setData({
        ...data,
        [name]: value,
      });
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handlePost = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("content", data.content);
      formData.append("image", data.image as File);
      console.log(data.image);
      const response = await API.post("/threads", formData);
      console.log("test", response.data);
      dispatch(POST_THREAD(response.data));
      await getThreads();

      setData({
        content: "",
        image: null,
      });
    } catch (error) {
      console.error("Error posting thread:", error);
    }
  };

  async function getThreads() {
    try {
      const response = await API.get("/threads");
      console.log(response.data);
      dispatch(GET_THREADS(response.data));
    } catch (error) {
      console.error("Error getting threads:", error);
      throw error;
    }
  }

  useEffect(() => {
    getThreads();
  }, [dispatch]);

  return {
    data,
    threads,
    handlePost,
    fileInputRef,
    handleChange,
    // handleLike,
  };
}
