"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './styles.module.css'
import C_inout from '@/JuliaComponents/C_inout';
import NfoldChooser from '@/JuliaComponents/Nfoldchooser';
import ColorMode from '@/JuliaComponents/ColorMode';
import { add, complex, multiply } from 'mathjs';
import { color } from 'framer-motion';
import getSession from '@/lib/GetSession';
import supabase from '@/lib/supabaseclient';
import Link from 'next/link';
import { RgbaColorPicker } from "react-colorful";
import { TablesInsert } from '@/database.types';
import Savepreset from '@/SmoothLifeComponents/SavePreset';


export default function JuliaMain () {
    const DEFAULT_COLOR = { r: 0, g: 255, b: 255, a: 0.5 }
    const [mode1color, setMode1Color] = useState({ r: 0, g: 255, b: 255, a: 0.5 });
    const renderRef = useRef(null);
    const WIDTH_HEIGHT = 760
    var MAX_ITER =200;
    const c_DEFUALT = [-.8, -.156] // must be bounded by |c| <= R
    const c2_DEFUALT = [-.06, -.40526]
    const R = 2
    const [c, _setC] = useState(c_DEFUALT) // - (.008 * Math.)
    const [c_alias, _setC_alias] = useState(c_DEFUALT) // - (.008 * Math.)
    const I_CONSTANT: number = Math.sqrt(-1);
    const FOLD_DEFUALT = 1
    const [nFold, setFold] = useState(FOLD_DEFUALT)
    const COLOR_DEFAULT = 1
    const [colorMode, setMode] = useState(COLOR_DEFAULT)
    var k = 0;
    const normalize_to_scale = (a : number, b : number, value : number, min_value : number, max_value : number) => {
        let res =  (b - a) * ((value - min_value)/(max_value - min_value)) + a
        //console.log(res)
        return res
    }

    const julia_function = (a : number , bi: number) => {
        let real =  a*a  - ((bi*bi))
        let im = ((bi >= 0 ? 1 : -1) * (2*a*(Math.abs(bi))))
        return (
           [real + c[0], im + c[1]]
        )
    }


    const push_cellsAray = (p: any, row : number, col : number, val : number[] )  => {
        let pixel = (WIDTH_HEIGHT * row + col) * 4
        p.pixels[pixel] = val[0];  
        p.pixels[pixel + 1] = val[1];  
        p.pixels[pixel + 2] = val[2];  
        p.pixels[pixel + 3] = val[3];  
        
    }

    const oneFoldSymmetry = (a :number , b: number) => {
        //here you want to calculate z^2 -> a^2 - b^2 + 2abi
        let newa = (a * a - b * b) + c[0] //real number
        let newb = (2 * a * b) + c[1] //imaginary number 
        return [newa,newb]

    }

    const twoFoldSymmetry = (a :number , b: number) => {
        
    //\(a^3-( 3a * b^2)  - (3a^2 * bi)-( b^3 * -IMG_CONSTANT))
    //
    let newa = (a*a*a -( 3 *a * b*b))+ c[0] //real number
    let newb =  - (3*a*a * b) + ( b*b*b)+ c[1]//imaginary number 
    return [newa,newb]

    
    }

    // Source: https://stackoverflow.com/a/54024653/229247
// Author: Kamil Kiełczewski
// CC-BY-SA 4.0 
    function hsv2rgb(h : number, s : number, v : number) {                              
        function f(n : number) {
            const k = (n + h / 60) % 6;
            return v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);     
        }
        return [f(5),f(3),f(1)];  
    }
    function magn(a : number, b : number) {
        return a * a + b * b;
      }
    //MODE 3 would be a LERP between 

    const generate_julia = (p : any, slider : any ) => {
        if (colorMode == 2) MAX_ITER = 75
        else MAX_ITER = 175
        for  (let row = 0 ; row < WIDTH_HEIGHT; row ++){
            for (let col = 0 ; col < WIDTH_HEIGHT; col ++){
                let b = normalize_to_scale(-R, R, row, 0, WIDTH_HEIGHT)
                let a = normalize_to_scale(-R, R, col, 0, WIDTH_HEIGHT)
                // let ca = a
                // let cb = b
                let iterations = 0 
                let maxIteration = colorMode == 2? slider.value() : 0 ;
                // Math.abs(a + b) < R &&
                while (magn(a,b) <= R && iterations < MAX_ITER){
                    let newvals = [a,b]
                    //if (magn(a,b) <= 4){
                        switch (nFold){
                            case 1 : 
                                newvals = oneFoldSymmetry(a,b)
                                break;
                            case 2 : 
                                newvals = twoFoldSymmetry(a,b) 
                                break
                            default :
                                newvals = oneFoldSymmetry(a,b)
                        }
                    //}
                    
                    a = newvals[0]
                    b = newvals[1]
                    iterations ++

                }
                let color = 0;
                let [red,green,blue] = [0,0,0]  
                
                if (iterations == MAX_ITER){ //bounded
                    
                    blue = 255
                    green = 255
                    red = 255
                    if (colorMode == 2) color = 0
                    else if (colorMode == 1) color = 255
                   
                }else{
                    //log2(log2|z|) 
                    //√(a^2 + b^2)
                    let complex_abs = Math.sqrt(a*a + b*b)
                    iterations = (iterations) - Math.log2(Math.log2(complex_abs))
                    
                    if (colorMode == 2){
                        [red, green, blue] = hsv2rgb(
                            Math.pow(iterations / maxIteration * 360, 1.2) % 360,
                            .9,
                            (iterations / maxIteration) * 0.8 + 0.5
                        );
                        red = red * 255
                        green = green * 255
                        blue = blue * 255
                        
                    }
                    //console.log(red," ",green, " ",blue)

                    //color = normalize_to_scale(0, 1, iterations, 0, MAX_ITER) 
                    //color = (255 * iterations / MAX_ITER)
                    color = normalize_to_scale(0, 255, Math.sqrt(normalize_to_scale(0, 1, iterations, 0, MAX_ITER-1)), 0, 1)
                    //LERP between white and some color, in this case that some color is cyan 
            
                    if (colorMode == 1){
                        //console.log(color);
                        blue = normalize_to_scale(0, mode1color.b, Math.sqrt(normalize_to_scale(0, 1, iterations, 0, MAX_ITER-1)), 0, 1) 
                        green = normalize_to_scale(0, mode1color.g, Math.sqrt(normalize_to_scale(0, 1, iterations, 0, MAX_ITER-1)), 0, 1)
                        red = normalize_to_scale(0, mode1color.r, Math.sqrt(normalize_to_scale(0, 1, iterations, 0, MAX_ITER-1)), 0, 1) 
                        color = (color *( mode1color.a)) + ((mode1color.a*3) *150)
                    }
                    
                    //push_cellsAray(p, row, col, [red ,green ,blue, color ])
                }
                push_cellsAray(p, row, col, [red ,green ,blue, color])
                //console.log("out : ",red," ",green, " ",blue)
               
            }

        }

    }

    const set_color = () => {
        //setMode1Color({ r: r, g: g, b: b, a: a })
        if (loggedinUser && UID != ""){
            const newSetting: TablesInsert<'julia_prev'> ={ 
                r: mode1color.r,
                g: mode1color.g,
                b: mode1color.b,
                a: mode1color.a,
                userID: UID

            }
            supabase.from("julia_prev")
            .upsert([newSetting]).select('*').then(res => {
                console.log("pushed res : ",res)
            })
        }
        //set current color !

        
        

    }
    const del_color = () => {
        //console.log("curr: ", UID)
        if (loggedinUser && UID != ""){
            supabase
            .from('julia_prev')
            .delete()
            .eq('userID', UID).then(res => {console.log(res)})
        }

    }
    //delete the current saved color

    //upon load there must be a fetch for the setting and if it exists then set the color



    useEffect(() => {
        const p5 = require("p5");
        var myShader: any;
        var slider: { input: (arg0: () => void) => void; };
        p5.disableFriendlyErrors = true;
        const p5instance = new p5((p : any) => {
            //  p.preload = () => {
            //     // load each shader file (don't worry, we will come back to these!)
            //     myShader = p.createShader(vertex, fragment);
            //   }
            p.setup = () => {
                //getContext('2d', { willReadFrequently: true });
                p.createCanvas( WIDTH_HEIGHT, WIDTH_HEIGHT).parent(renderRef.current);
                p.pixelDensity(1)
                //p.colorMode(p.HSB, 1);
                if (colorMode == 2){
                    slider = p.createSlider(10, 1000, 80, 1).position(10,10)
                    slider.input(() => {
                        p.redraw();
                    });
                    
                }
                  
                

                
                

            }

            p.draw = () => {
                if (p.mouseIsPressed && p.mouseX > 0 && p.mouseX <= 750 && p.mouseY > 0 && p.mouseY <= 750){
                    //console.log(p.mouseX, p.mouseY)
                    //a : number, b : number, value : number, min_value : number, max_value : number

                    let newC = [normalize_to_scale(-1,1, p.mouseX, 0, WIDTH_HEIGHT),
                    normalize_to_scale(-1,1, p.mouseY, 0, WIDTH_HEIGHT)]
                    c[0] = newC[0]
                    c[1] = newC[1]
                    _setC_alias(newC)
                    //console.log(c)
                    

                }
                p.loadPixels()
                generate_julia(p, slider)
                p.updatePixels();

                //p.background(0,0,0);
                //if (free) generateJuliaSet(p);
                // console.log(p.frameRate());
            }
        })
        return () => {
            //console.log("cleaning up...");
            
            // comment this out to get 2 canvases and 2 draw() loops
            p5instance.remove();
          };
        


    }, [nFold, c, colorMode, mode1color])

    
    const [loggedinUser, setUser] = useState("")
    const [UID, setUID] = useState("")
    // const [hasPrev, setHasPrev] = useState(false)
    if (loggedinUser == ""){
        const sessionRes = getSession()
        sessionRes.then(res => {
            if (res.error == null){
              console.log(typeof res.data.session?.user.email)
              if (res.data.session?.user.email){
                setUser("You are Logged in with " + res.data.session?.user.email as string)
                let uID = res.data.session?.user.id as string
                setUID(uID)
                supabase
                .from("julia_prev")
                .select()
                .eq("userID", uID).then (res => {
                    console.log("res:: ",res.data)
                    if (res.data){
                        setMode1Color({r: res.data[0].r!, g: res.data[0].g!, b: res.data[0].b!, a: res.data[0].a!})
                    }
                })
              }
              
              console.log(loggedinUser)
            }else{
              console.log(res.error)
            }
          })
    }

    
return (

    <div className = {styles.foreground}>
        <meta name="viewport" content="width=device-width; width=device-width;"></meta>
                {/* TEMP */}

        <div className={styles.wavy}> 
            <span className="--i:1">J</span> 
            <span className="--i:2">u</span> 
            <span className="--i:3">l</span> 
            <span className="--i:4">i</span> 
            <span className="--i:5">a</span> 
            <span className="--i:6"> </span> 
            <span className="--i:7">S</span> 
            <span className="--i:8">e</span> 
            <span className="--i:9">t</span> 
            <span className="--i:9">s</span> 
        </div> 
        {/* END TEMP */}
        <button><Link href="/">GO BACK</Link></button>
        <br></br>
        {loggedinUser? <span className={styles.linkers}>{loggedinUser}</span> : null}
        <br></br>
        {colorMode == 1 && loggedinUser?  <button className={styles.savebutton} onClick={set_color}>Save Color Preset</button>: null}
        {colorMode == 1 && loggedinUser?  <button className={styles.savebutton} onClick={del_color}>Delete Color Preset</button>: null}
        <br></br>
        {colorMode == 1?  <RgbaColorPicker color={mode1color} onChange={setMode1Color} />: null}
        
        <div className={styles.julia_box} ref={renderRef}></div>
        <C_inout c= {c_alias} setC = {_setC_alias}/> 
        <NfoldChooser fold = {nFold} setFold={setFold} setC = {_setC_alias} def={c_DEFUALT} c = {c} def2 = {c2_DEFUALT}/>
        <ColorMode mode = {colorMode} setColor = {setMode}/>
        
    </div>

    )
}

//export default memo(P5Sketch)