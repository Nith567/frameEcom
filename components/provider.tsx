'use client';

import {PrivyProvider} from '@privy-io/react-auth';
import {defineChain} from 'viem';
import {arbitrumSepolia } from 'viem/chains';

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider
      appId='clu43ma1g02yz1y4ob9gk96cg' // Replace with your Privy App ID
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#676FFF',
          logo: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.Sg034aXqfDmRi4ufNLF5NQAAAA%26pid%3DApi&f=1&ipt=4dc4aa0cd5fa3db36fb56383bdb89ea997e337b354a2f521289b3dc052291735&ipo=images',
        },
        defaultChain:arbitrumSepolia,
        supportedChains:[arbitrumSepolia],
        embeddedWallets: {
          createOnLogin: 'all-users',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}