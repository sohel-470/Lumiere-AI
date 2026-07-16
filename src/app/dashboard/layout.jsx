import React from 'react'
import Header from './_components/Header'
import Sidenav from './_components/Sidenav'

const Dashboardlayout = ({ children }) => {
    return (
        <div>
            <div className='hidden md:block h-screen bg-white fixed mt-20 w-64'>
                <Sidenav />
            </div>
            <div>
                <Header />
                <div className='md:ml-64'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Dashboardlayout
