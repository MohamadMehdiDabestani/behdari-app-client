"use client";
import axios from "axios";
import { loading, snack } from "@/atom";
import { useAtom } from "jotai";
import useLocalStorage from "./useLocalStorage";
import { useToken } from "./useToken";
const useApi = () => {
  const [_, setError] = useAtom(snack);
  const [__, setLoading] = useAtom(loading);
  const [_token, setLocale] = useLocalStorage("token", {
    refreshToken: "",
    token: "",
  });
  const instance = axios.create({
    baseURL: "https://behdari.liara.run/api/v1",
    headers : {
      "Authorization" : `Bearer ${_token.token}`
    }
  });
  const showError = (text: string) => {
    setError({
      show: true,
      text,
      type: "error",
    });
  };
  instance.interceptors.request.use(
    function (config) {
      setLoading(true)
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
  instance.interceptors.response.use(
    function (response) {
      setLoading(false)
      if (!response.data.isSuccess) {
        showError(response.data.message);
        return Promise.reject(response);
      }
      return response;
    },
    function (error) {
      setLoading(false)
      if (!error.response.data.isSuccess) {
        showError(error.response.data.message);
      }
      return Promise.reject(error);
    }
  );
  return instance;
};
export default useApi;
