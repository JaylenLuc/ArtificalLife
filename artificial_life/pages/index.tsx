import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import React, {useEffect } from "react";
import P5Sketch from "./smoothlife/smoothLife";
import Link from "next/link";
import MainImage from '@/home/imageAnimation'
const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  return (
    <div className={styles.main}>
      <Head>
        <title>artificial life</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className = {styles.bigwords}>I am the matter of my own work and everyone that I hold to high regard.</h1>
      <Link href="/smoothlife/smoothLife"><span className={styles.linkers}>GO TO SMOOTHLIFE- THIS IS TEMP</span></Link>
      <br></br>
      <Link href="/julia/julia"><span className={styles.linkers}>GO TO julia- THIS IS TEMP</span></Link>
      <MainImage />
    </div>
  );
}
