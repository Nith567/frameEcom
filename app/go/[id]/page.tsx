'use client'
import { FaCopy } from 'react-icons/fa';

export default function Home({ params }: { params: { id: string } }) {

    const id = params.id
    const copyToClipboard = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/ecom/${id}`;
            await navigator.clipboard.writeText(url);
        alert('copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy: ', error);
        alert('Failed to copy content to clipboard');
      }
    }
    return (
      <main className="flex flex-col text-center p-8 lg:p-16 mb-20">
        <div className="flex flex-col">
          <p className="font-black text-green-400">Your frame</p>
          <p className="mt-12 max-w-lg mx-auto">Link to your frame:</p>
          <div className="px-4 py-2 mt-4 w-full lg:w-max mx-auto bg-gray-900 rounded-lg">
            <p className="font-mono text-green-500 break-all flex whitespace-pre-wrap">
              {process.env.NEXT_PUBLIC_SITE_URL}/api/ecom/{id}
              <button onClick={copyToClipboard}>
               <FaCopy />
             </button>
            </p>
         
          </div>
          <p className="mt-4 max-w-lg mx-auto">
            Share this link on Farcaster and only payed users will be 
            able to access your livestream video.
          </p>
        </div>
      </main>
    )
  }
