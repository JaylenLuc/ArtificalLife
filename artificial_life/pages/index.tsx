
import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import React, {useEffect } from "react";
import P5Sketch from "./smoothlife/smoothLife";
import Link from "next/link";
import MainImage from '@/home/imageAnimation'
import { authOptions } from "@/lib/authProvider";
import { getServerSession } from "next-auth";
import { use } from "react";
import { GetSessionParams, SessionProvider, getSession, useSession } from "next-auth/react";
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
const inter = Inter({ subsets: ["latin"] });
 
// type Session = {
  
//   data: Session | null
//   status: "authenticated" | "loading" | "unauthenticated"
//   update: UpdateSession;
//   data: Session;
//   status: "authenticated";
// }

 

function Home()  {
  const { data: session } = useSession()

 

  console.log(session)

  return (
   
      <div className={styles.main}>
        <Head>
          <title>artificial life</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <h1 className = {styles.bigwords}>I am the matter of my own work and everyone that I hold to high regard.</h1>
        {session?.user + ""}
        <Link href="/smoothlife/smoothLife"><span className={styles.linkers}>GO TO SMOOTHLIFE- THIS IS TEMP</span></Link>
        <br></br>
        <Link href="/julia/julia"><span className={styles.linkers}>GO TO julia- THIS IS TEMP</span></Link>
        <br></br>
        <Link href="/userauth/signup"><span className={styles.linkers}>SIGN UP</span></Link>
        <br></br>
        <Link href="/userauth/signin"><span className={styles.linkers}>SIGN IN</span></Link>
        <MainImage />
      </div>

  );
}

export default Home;
