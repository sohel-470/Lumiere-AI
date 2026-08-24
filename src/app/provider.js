'use client'
import { useUser } from '@clerk/nextjs'
import React, { useEffect } from 'react'

// 1. Import your Server Action
import { checkAndCreateUser } from '@/app/actions' 

const Provider = ({children}) => {
    const {user} = useUser();
    
    useEffect(() => {
      user && isNewUser()
    }, [user])
         
    const isNewUser = async ()=>{
        // 2. Safely call the backend function
        await checkAndCreateUser(
            user?.primaryEmailAddress?.emailAddress, 
            user.fullName, 
            user?.imageUrl
        );
    }
    
  return (
    <div>
      {children}
    </div>
  )
}
export default Provider