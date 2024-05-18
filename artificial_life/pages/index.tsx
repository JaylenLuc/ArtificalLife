
import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import React, {useEffect, useState } from "react";
import P5Sketch from "./smoothlife/smoothLife";
import Link from "next/link";
import MainImage from '@/home/imageAnimation'
import { authOptions } from "@/lib/authProvider";
import { getServerSession } from "next-auth";
import { use } from "react";
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import supabase from "@/lib/supabaseclient";
import getSession from "@/lib/GetSession";
const inter = Inter({ subsets: ["latin"] });
 
// type Session = {
  
//   data: Session | null
//   status: "authenticated" | "loading" | "unauthenticated"
//   update: UpdateSession;
//   data: Session;
//   status: "authenticated";
// }


function  Home()  {
  const signingout = async () => {
    const { error } = await supabase.auth.signOut()
    console.log(error)
    if (error == null){
      setUser("You are signed out")
    }
  }
  // const { data: session } = useSession()
  const sessionRes = getSession()
  const [loggedinUser, setUser] = useState("")
  sessionRes.then(res => {
    if (res.error == null){
      console.log(typeof res.data.session?.user.email)
      if (res.data.session?.user.email){
        setUser("You are Logged in with " + res.data.session?.user.email as string)
      }
      console.log(loggedinUser)
    }else{
      console.log(res.error)
    }
  })

  return (
   
      <div className={styles.main}>
        <Head>
          <title>artificial life</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <h1 className = {styles.bigwords}>I am the matter of my own work and everyone that I hold to high regard.</h1>
        <br></br>
        {loggedinUser? <span className={styles.linkers}>{loggedinUser}</span> : null}
        <br></br>
        <br></br>
        <Link href="/smoothlife/smoothLife"><span className={styles.linkers}>GO TO SMOOTHLIFE- THIS IS TEMP</span></Link>
        <br></br>
        <Link href="/julia/julia"><span className={styles.linkers}>GO TO julia- THIS IS TEMP</span></Link>
        <br></br>
        <Link href="/userauth/signup"><span className={styles.linkers}>SIGN UP</span></Link>
        <br></br>
        <Link href="/userauth/signin"><span className={styles.linkers}>SIGN IN</span></Link>
        <br></br>
        <button onClick={signingout}>SIGN OUT</button>
        <MainImage />
      </div>

  );
}

export default Home;
