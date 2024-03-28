import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import React, {useEffect } from "react";
import P5Sketch from "./sketch/sketch";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {


  return (
    <>
      <Head>
        <title>artificial life</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <P5Sketch/>
    </>
  );
}
