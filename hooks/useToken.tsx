"use client";
import { token } from "@/atom/token";
import { useAtom } from "jotai";
import useLocalStorage from "./useLocalStorage";
import { useEffect } from "react";

export const useToken = () => {
  const [_token, setToken] = useAtom(token);
  const [locale, setLocale] = useLocalStorage("token", {
    refreshToken: "",
    token: "",
  });
  useEffect(() => {
    if (_token.token == "") return;
    setLocale(_token);
  }, [_token]);
  useEffect(() => {
    setToken(locale);
  }, []);
  return { _token, setToken };
};
