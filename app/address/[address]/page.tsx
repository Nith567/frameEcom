'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home({ params }: { params: { address: string } }) {
    const id = params.address
    const [shippingAddresses, setShippingAddresses] = useState([]);


    useEffect(() => {
        const fetchShippingAddresses = async () => {
          try {
            const response = await axios.get(`http://localhost:4000/api/orders/${id}`);
            setShippingAddresses(response.data);
          } catch (error) {
            console.error(error);
          }
        };
    
        fetchShippingAddresses();
      }, [id]);
    

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
    <h1 className="text-xl font-semibold mb-4">All your purchased Shipping Customers Addresses</h1>
    <ul>
      {shippingAddresses.map((address, index) => (
        <li key={index} className="text-gray-800 mb-2">
          {address}
        </li>
      ))}
    </ul>
  </div>
  
  );
}

