'use client';
 
import * as z from 'zod';
import { FieldErrors, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {useRouter} from 'next/navigation'
import Link from 'next/link';
import GoogleSignInButton from './GoogleSignInButton';
import styles from './styles.module.css'
import { useState } from 'react';
import {signIn} from 'next-auth/react'
//{ message: "Firstname is required" }
const FormSchema = z
  .object({
    username:z.string().min(1, {message:'Username is required'}).max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have more than 8 characters'),
  })

const SignInForm = () => {
const router = useRouter()
  const [val_msg , _set_val_msg] = useState("");
  const set_val_msg = (err : FieldErrors<{
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}>) => {
  let new_msg = "";
  Object.entries(err).map(entry => {
    //console.log(entry)
    new_msg += entry[1]['message'] + '\n'
  })
  //let new_msg 
  _set_val_msg(new_msg)

  }
  
  const {register, handleSubmit, trigger, formState: { errors }} = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        username: '',
        email: '',
        password: '',
      },
    });
    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
      console.log(errors)
      console.log(values.username)
      console.log(values.email)
      console.log(values.password)

      const signinData =  await signIn('Credentials', {
        email: values.email,
        password: values.password,
        username: values.username,
        redirect: false,
      }).then((res) => {
        if (res?.error) {
            _set_val_msg("sign in credentials are incorrect")
           } else {
            console.log(res)
            router.push('/');
           }
      });
    };


  
    return (
      <div>
        <h1 className={styles.title}>SIGN IN</h1>
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
            {/* <input type="submit" value="Submit" /> */}
            {/* <button className={styles.subbutton} type="submit">Create Account</button> */}
            <button className={styles.subbutton} type="submit" onClick = {() =>{ 
              const output = trigger();
              set_val_msg(errors)
            }
              }>Sign In</button>
            
          </form>
        </div>
        {
          val_msg ? <div className={styles.validation_comp}>{val_msg}</div> : null
        }
      </div>
    );

  };
  
  export default SignInForm;