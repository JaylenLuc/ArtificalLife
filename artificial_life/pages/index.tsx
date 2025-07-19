'use client'
import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import React, {useEffect, useState } from "react";
import P5Sketch from "./smoothlife/smoothLife";
import Link from "next/link";
import MainImage from '@/home/imageAnimation'
import { getServerSession } from "next-auth";
import { use } from "react";
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import supabase from "@/lib/supabaseclient";
import getSession from "@/lib/GetSession";
import MovingFrame from "@/home/MovingFrame";
import ButtonOne from "@/home/buttonAnimation";
import ClickAway from "@/home/clickAway";
import JuliaButton from "@/home/juliaButton";
import LifeButton from "@/home/lifeButton";
import FlowButton from "@/home/flowButton";
const inter = Inter({ subsets: ["latin"] });
 
//git reset --hard HEAD{3046c18a6cdf9dcbb02a1a64ab73fa82bc2fff65} *LAST VERSION WITHOUT AUTH*


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
  console.log(sessionRes)
  const [loggedinUser, setUser] = useState("")
  sessionRes.then(res => {
    if (res.error == null){
      console.log( res.data.session == null)
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
          <link rel="icon" href="/favicon.ico" />
          <title>苦/दुःख/སྡུག་བསྔལ།</title>
        </Head>
        <MovingFrame/>
        <br></br>
        <meta name="viewport" content="height=device-height; width=device-width; "></meta>
        <div className={styles.col}>
           {loggedinUser? <span className={styles.linkers}>{loggedinUser}</span> : null}
          <br></br>
          <br></br>
          <ClickAway/>
          <br></br>
          <Link href="/smoothlife/smoothLife"><span className={styles.linkers}> <ButtonOne/></span></Link>
          <br></br>
          <Link href="/julia/julia"><span className={styles.linkers}><JuliaButton/></span></Link>
          <br></br>
          <Link href="https://jaylenluc.github.io/TheMortalCoil/"><span className={styles.linkers}><LifeButton/></span></Link>
          <br></br>
          <Link href="/flowfield/flowField"><span className={styles.linkers}><FlowButton/></span></Link>
          <br></br>
          <Link href="https://the-biomes-atlas.vercel.app/"><span className={styles.linkers}>WORLD BIOMES MAP</span></Link>
          <br></br>
          <Link href="/alex/alexRoom"><span className={styles.linkers}>Alex Room</span></Link>
          <br></br>
          <Link href="/genetic/genetic"><span className={styles.linkers}>Evolving Art</span></Link>
          <br></br>
          <Link href="/art/art"><span className={styles.linkers}>World as Images</span></Link>
          <br></br>
          <Link href="/userauth/signin"><span className={styles.linkers}>SIGN IN</span></Link>
          <br></br>
          <Link href="https://sickness-unto-death.vercel.app"><span className={styles.linkers}>THE INFINITE THE FINITE MUST CONTEND</span></Link>
          {/* <Link href= "https://the-biomes-atlas.vercel.app/"> </Link> THIS SECTION IS ABOUT MAPS AND ARCGIS AND ML*/}
          <br></br>
          <button onClick={signingout}>SIGN OUT</button>
        </div>
        <div className={styles.col}>
          <MainImage />
        </div>
      </div>

  );
}

export default Home;
