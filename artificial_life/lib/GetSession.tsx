import supabase from "./supabaseclient"

const  getSession =async () => {
    const {data, error } = await supabase.auth.getSession()
    return {data, error}
}
export default getSession
  