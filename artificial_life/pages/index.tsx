import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import React, {useEffect } from "react";
import P5Sketch from "./smoothlife/smoothLife";
import Link from "next/link";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {


  return (
    <>
      <Head>
        <title>artificial life</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <P5Sketch/> */}
      <Link href="/smoothlife/smoothLife"><span >GO TO SMOOTHLIFE- THIS IS TEMP</span></Link>
      <Link href="/julia/julia"><span >GO TO julia- THIS IS TEMP</span></Link>
    </>
  );
}
