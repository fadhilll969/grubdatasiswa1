import { useState } from "react"

function Dasbor() {
   


    return (

        <div className="w-65  min-h-screen p-2">
            <div className="fixed top-1 h-full w-60 bg-sky-600 bg-indigo-600 text-white">
                <div className="text-4xl font-bold mb-8 text-center">MENU</div>
                <nav className="mt-15">
                    <div className="text-2xl text-center">
                        <a href="/h" className="block py-2 px-3  rounded hover:bg-blue-600  ">Tabel</a>
                        <a href="/f" className="mt-100 block py-2 px-3 rounded hover:bg-blue-600  ">logout</a>
                    </div>
                </nav>
            </div>
        </div>

    )
}


export default Dasbor;