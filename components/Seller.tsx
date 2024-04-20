'use client'
import {usePrivy} from '@privy-io/react-auth';
import {useWallets} from '@privy-io/react-auth';
import { Database } from "@tableland/sdk";
import { useState } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation'
import { FaCopy } from 'react-icons/fa';
import * as LR from '@uploadcare/blocks';
import uploadFile from '@/utils/s3';
import axios from 'axios';
export default function Seller() {

  
  const {ready, authenticated, login,user,logout} = usePrivy();
  const disableLogin = !ready || (ready && authenticated);
  const disablelogout = ready
  const {wallets} = useWallets();
  const [broadcast, setBroadcast] = useState('');
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [table, setTableName] = useState('');
  const [streamId, setStreamId] = useState('');
  const [metadata, setMetadata] = useState('');
  const [price, setPrice] = useState('');
  const [url, seturl] = useState("")
  const [base64, setbase64] = useState('');
  const router = useRouter()


const handleFileChange = async (e: any) => {
  try {
    const file = e.target.files[0];
    const reader = new FileReader();
    const imageUrlPromise = new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
          const imageUrl = reader.result as string;
          if (!imageUrl) {
              reject('Failed to read file.');
          } else {
              resolve(imageUrl);
          }
      };

      reader.onerror = () => {
          reject('Error reading file.');
      };

      reader.readAsDataURL(file);
  });
  let randomNumber = Math.floor(Math.random() * 1000000) + 1;
  let ran="img"+randomNumber
      const imageUrl = await imageUrlPromise;
      const imageData = imageUrl.split(";base64,");

      if (!imageData || imageData.length < 2) {
          console.log('Invalid image data.');
          return;
      }
      console.log('Image data: ', imageData[1]);
      const imageBuffer: any = Buffer.from(imageData[1], "base64");
      console.log('Image buffer: ', imageBuffer);
      // Assuming uploadFile is an asynchronous function
      const uploadedUrl = await uploadFile(imageBuffer, ran,'image/png');
      seturl(`https://image78bucket.s3.amazonaws.com/${ran}`);
      console.log(uploadedUrl);
  } catch (error) {
      console.error(error);
  }
};

const orders=()=>{
  router.push(`/address/${user?.id.split(":").at(2)}`)
}
  const handleSubmit = async (event:any) => {
    event.preventDefault();
    const wallet = wallets[0];
    const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
    if (!embeddedWallet) {
      console.error('Embedded wallet not found');
      return;
    }
    try {
      await axios.post('http://localhost:4000/api/register', {
        address: user?.id.split(":")[2]
   })
   
      const providers = await embeddedWallet.getEthersProvider();
      const signer = providers.getSigner();
     
        const prefix = "EcomFrame";
        const db = new Database({ signer});
      const { meta: create } = await db
        .prepare(`CREATE TABLE ${prefix} (id integer primary key,creator text,address text,title text, image text,metadata text,price integer);`)
        .run();
        await create.txn?.wait();
        let tableName = create.txn?.names[0]
        console.log(tableName);
      const { meta: insert } = await db
        .prepare(`INSERT INTO ${tableName} (creator,address,title, image, metadata, price) VALUES (?, ?, ?, ?, ?, ?)`)
        .bind(`${user?.id.split(":").at(2)}`,address,title ,url, metadata, price)
        .run();
      await insert.txn?.wait();
      console.log(insert.txn?.names)
      console.log('Data inserted successfully');

   console.log(
    'done bro'
   );
      let p=user?.id.split(":").at(2)
    router.push(`/go/${tableName}-${user?.id.split(":").at(2)}`)
    } 
    catch (error) {
      console.error('singl error  ', error);
    }
  };

  return (
    <div>
    {ready && !authenticated && (
      <button className='m-2 p-3 bg-blue-500 inline-block  hover:bg-violet-800 text-white font-bold py-2 px-4 rounded-lg shadow-md'disabled={disableLogin} onClick={login}>
      Log in
    </button>

    )}



    {ready && authenticated && (
        <div>
   {user?.wallet?.address}
      <li>Google: {user?.google ? user?.google.email : 'None'}</li>
      <button onClick={orders} className='m-2 p-3 bg-orange-500 inline-block  hover:bg-red-800 text-white font-bold py-2 px-4 rounded-lg shadow-md'>
    YourOrders
  </button>
      {/* <button onClick={upload} className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700">Upload</button> */}
        <div>
      <input type="file" onChange={handleFileChange} />
      </div>
      <div className="max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block font-medium text-gray-700">Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 p-2 w-full border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label htmlFor="metadata" className="block font-medium text-gray-700">Metadata</label>
          <input type="text" id="metadata" value={metadata} onChange={(e) => setMetadata(e.target.value)} className="mt-1 p-2 w-full border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label htmlFor="address" className="block font-medium text-gray-700">Target Address</label>
          <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 p-2 w-full border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label htmlFor="price" className="block font-medium text-gray-700">Price</label>
          <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 p-2 w-full border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700">Submit</button>
      </form>
    </div>
   </div>
    )}
  </div>
  );
}