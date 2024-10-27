import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { arbitrumSepolia, polygonAmoy, sepolia, unichainSepolia } from '@reown/appkit/networks'
import './App.css'
import MultisigDeployment from './Home'
import FetchContractsPage from './Pages/FetchContracts'
import Multisig from './Pages/multisig'
import About from './Pages/About'
import HowToUse from './Pages/HowTo'
import { Routes, Route } from "react-router-dom";

function App() {

// 1. Get projectId
const projectId = 'acf19e04601cd0177cf201aa3bd10ec9';

// 2. Set the networks
const networks = [arbitrumSepolia, sepolia, unichainSepolia, polygonAmoy];

// 3. Create a metadata object - optional
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com', // origin must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/']
}

// 4. Create a AppKit instance
createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})

  return (
    <>
      <Routes>
        <Route path="/" element={<MultisigDeployment />} />
        <Route path="/fetch" element={<FetchContractsPage />} />
        <Route path='/multisig' element={<Multisig/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/howto' element={<HowToUse/>} />
      </Routes>
      
    </>
  )
}

export default App
