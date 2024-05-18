'use client';
 
import * as z from 'zod';
import { FieldErrors, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './styles.module.css'
import { useState } from 'react';
import { NextApiRequest, NextApiResponse } from 'next';
import supabase from '@/lib/supabaseclient';
//{ message: "Firstname is required" }
const FormSchema = z
  .object({
    username:z.string().min(1, {message:'Username is required'}).max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have more than 8 characters'),
    confirmPassword: z.string().min(1, "Password confirmation is required")
  })
  .refine ((data) => data.password === data.confirmPassword, {
    path : ['confirmPassword'],
    message: 'Password does not match'
  })

const SignUpForm = () => {
  const [val_msg , _set_val_msg] = useState("");

  const set_val_msg = (err : FieldErrors<{
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}> | string) => {
          
          let new_msg = "";
          if (typeof err === 'string'){
            new_msg = err;
          }else{
            Object.entries(err).map(entry => {
              //console.log(entry)
              new_msg += entry[1]['message'] + '\n'
            })
          }
          //let new_msg 
          _set_val_msg(new_msg)

  }
  const router = useRouter()
  
  const {register, handleSubmit, trigger, formState: { errors }} = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
    });
    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
      console.log(errors)
      console.log(values.username)
      console.log(values.email)
      console.log(values.password)

      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      })
      if (error != null ){
        //set_val_msg(json['message'])
        console.log("resp: ",error)
      }else{
        router.push('/userauth/signin')
          
      }
        




      // const resp = await fetch('/api/signup',{
      //   method: 'POST',
      //   headers: {
      //     'Content-Type' : 'application/json',

      //   },
      //   body:  JSON.stringify({
      //     username : values.username,
      //     email: values.email,
      //     password: values.password
      //   })
      // })
      // if (resp.ok ){
      //   console.log("resp: ",resp)
      //   router.push('/userauth/signin')
      // }else{
      //   let response = resp.json().then(json => {
      //     set_val_msg(json['message'])
      //   })
        
      // }
    };
  
    return (
      <div>
        <h1 className={styles.title}>SIGN UP</h1>
        <div className= {styles.form}>

          <form onSubmit={handleSubmit(onSubmit)}>
            <label>
              User Name:
              <input className= {styles.inputstyle} type="text" placeholder={"Create User Name"} {...register("username")}/>
            </label>
            {/* <input type="submit" value="Submit" /> */}
            <label>
              E-Mail:
              <input className= {styles.inputstyle} type="email"  placeholder={"Create Valid E Mail"}  {...register("email")} />
            </label>
            {/* <input type="password" value="Submit" /> */}
            <label>
              Password:
              <input className= {styles.inputstyle} type="password" placeholder={"Create Password"}  {...register("password")} />
            </label>
            <label>
              Re Enter Password:
              <input className= {styles.inputstyle} type="password" placeholder={"Re enter Password"} {...register("confirmPassword")}/>
            </label>
            {/* <input type="submit" value="Submit" /> */}
            {/* <button className={styles.subbutton} type="submit">Create Account</button> */}
            <button className={styles.subbutton} type="submit" onClick = {() =>{ 
              const output = trigger();
              set_val_msg(errors)
            }
              }>Create Account</button>
            
          </form>
        </div>
        {
          val_msg ? <div className={styles.validation_comp}>{val_msg}</div> : null
        }
      </div>
    );

  };
  
  export default SignUpForm;