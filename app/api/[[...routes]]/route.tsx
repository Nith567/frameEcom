/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput, parseEther } from 'frog'
import { handle } from 'frog/vercel'
import { neynar } from 'frog/hubs'
import { erc20Abi, parseUnits } from 'viem';
import { ethers } from 'ethers';
import axios from 'axios';
import { checkApi } from '@/utils/check';



const app = new Frog({
  basePath: '/api',
  hub: neynar({ apiKey: process.env.NEYNAR_API_KEY as string}),
  verify:'silent'
})

const usdcContractAddress = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'; 

app.frame('/ecom/:ids', async (c) => {
  const id = c.req.param('ids');
  const ids = id.split('-');
  const tableName = ids[0];
  const creatorAddress = ids[1];
  const filteredData = await checkApi(tableName, creatorAddress);
  let owner = filteredData[0].address;
  return c.res({
    action: `/ecom2/${id}`,
    // image: `${filteredData[0].image}`,
     image: 'https://image78bucket.s3.amazonaws.com/class',

    imageAspectRatio:"1.91:1",
    headers:{
      'Content-Type': 'image/png'
    },
    intents: [
      <Button key='pay' value='P'>Pay</Button>,
      <Button key='details' value="D">Details</Button>
    ]
  });
})
app.frame('/ecom2/:id', async (c) => {
  const { buttonValue} = c
  const id = c.req.param('id');
  const ids = id.split('-');
  const tableName = ids[0];
  const creatorAddress = ids[1];
  const filteredData = await checkApi(tableName, creatorAddress);
  let owner = filteredData[0].address;
  if (buttonValue === "D"){
  return c.res({
    action: `/ecom/${id}`,
    image: (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundImage: 'linear-gradient(to bottom, #dbf4ff, #fff1f1)',
          fontSize: 80,
          fontWeight: 700,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 223, 216))',
            backgroundClip: 'text',
            color: 'transparent',
            fontSize: 80,
            fontWeight: 700,
            margin: 0,
          }}
        >
          {filteredData[0].title}{' '}
          {' '}
          {filteredData[0].metadata}
        </p>
        {filteredData && (
          <p
            style={{
              backgroundImage:
                'linear-gradient(90deg, rgb(121, 40, 202), rgb(255, 0, 128))',
              backgroundClip: 'text',
              color: 'transparent',
              fontSize: 80,
              fontWeight: 700,
              margin: 0,
              marginTop: 20,
            }}
          >
            ${filteredData[0].price}
          </p>
        )}
      </div>
    ),
    intents: [
      <Button key='details' value="Details">⏎ Back</Button>
    ]
  })}
  return c.res({
    action: `/goto/${creatorAddress}`,
    image: (
      <div 
        style={{
          color: 'white',
          display: 'flex',
          justifyItems: 'center',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
          height: '100%',
          fontSize: 90,
        }}
      >
      Pay Now!
      </div>
      ),
    intents: [
      <Button.Transaction key="transaction" target={`/send-etherss/${owner}/${filteredData[0].price}`}>Send ${filteredData[0].price}</Button.Transaction>
    ],
  })
})
app.transaction('/send-etherss/:owner/:price', async(c) => {
const owner  = c.req.param('owner');
const price  = c.req.param('price');
console.log('owners , ' , owner,price);
  return c.contract({
    // @ts-ignore
    abi:erc20Abi,
    chainId: 'eip155:8453',
    //@ts-ignore
    functionName: 'transfer',
    args: [
      //@ts-ignore
      owner,
      parseUnits(price, 6)
    ],
    to: usdcContractAddress,
  })
})

app.frame('/goto/:creatorAddress', (c) => {
  const owner  = c.req.param('creatorAddress');
  console.log('lol' ,owner)
  const { transactionId} = c
  return c.res({
    image: (
      <div
        style={{
          color: 'white',
          display: 'flex',  
          flexDirection: 'column', 
          justifyItems: 'center',
          alignItems: 'center',
          fontSize: 60,
        }}
      >
        {transactionId
            ? `tnx : ${transactionId.slice(0, 6)}...${transactionId.slice(-6)}`
            : 'Transaction ...'}
      </div>
    ),
    action:`/final/${owner}`,
    intents: transactionId
    ? [
      <TextInput placeholder="(1/3-203 USA" />,
        <Button key='video' value="transactionId">Shipping Address</Button>
      ]
    : [
      ],
  })
})

app.frame('/final/:owner',async (c)=>{
  const owner=c.req.param("owner")
  const { inputText = '' } = c
const shippingAddress=inputText;
console.log(shippingAddress);
console.log('suiiii,',inputText);
console.log('suii ',owner);

try {
  await axios.post('http://localhost:4000/api/ship', {
    owner,
    shippingAddress
  })
console.log('done baby ');
} catch (e) {
  console.log(e);
}

  return c.res({
    image: (
      <div 
        style={{
          color: 'white',
          display: 'flex',
          justifyItems: 'center',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
          height: '100%',
          fontSize: 90,
        }}
      >
      Thank You for your Purchase !!!
      </div>
      )
  })
}

)
export const GET = handle(app)
export const POST = handle(app)
