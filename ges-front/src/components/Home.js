import React, { useState } from 'react'
import axios from "axios";
import { useEffect } from 'react';

function Home() {

    const [listOfAdm ,setListOfAd] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3001/Administrateur").then((response) => {
          setListOfAd(response.data);
        });
      
      }, [])

  return (
    <div>
        {listOfAdm.map((value,key) => {
            return (
                <div className='Administrateur'>

                    <div className='username'>{value.id}</div>
                    <div className='password'>{value.motDePasse}</div>
                    <div className='email'>{value.email}</div><br/>
                </div>
            );
        })}
    </div>
  )
}

export default Home