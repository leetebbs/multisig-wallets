import React from 'react';
import { Shield, Users, Settings, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutSection = () => {
  const features = [
    {
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      title: "Multi-signature Security",
      description: "Enhance the security of your funds by requiring multiple confirmations for transactions."
    },
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      title: "Collaborative Management",
      description: "Easily add multiple owners to your wallet, allowing for shared control and decision-making."
    },
    {
      icon: <Settings className="w-6 h-6 text-blue-600" />,
      title: "Customizable Thresholds",
      description: "Set flexible confirmation requirements based on your group's needs."
    },
    {
      icon: <Layout className="w-6 h-6 text-blue-600" />,
      title: "User-Friendly Interface",
      description: "Our intuitive design makes it easy for anyone to create and manage a multisig wallet, regardless of their technical expertise."
    }
  ];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">About</h2>
          <p className="text-lg text-gray-600 mb-8">
            <span className="font-bold">MultiVault</span> is a secure and user-friendly platform designed for creating and managing multisignature wallets on the EVM blockchains. Our goal is to provide a collaborative and secure way for multiple parties to manage funds and execute transactions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-4">
                {feature.icon}
                <h3 className="text-xl font-semibold ml-3 text-gray-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Why Use Section */}
        <div className="bg-blue-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Use MultiVault?</h3>
          <p className="text-gray-600 mb-6">
            In today&apos;s digital landscape, security is paramount. MultiVault empowers users to take control of their assets with a robust multisignature solution, reducing the risk of unauthorized access and ensuring that all parties are involved in critical financial decisions. Whether you&apos;re managing funds for a project, a community, or personal use, MultiVault provides the tools you need to operate securely and efficiently.
          </p>
          <div className='flex justify-between'>
          <p className="text-lg font-semibold text-blue-600">
            Join us in revolutionizing the way we manage digital assets!
          </p>
          <Link to="/">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Home
          </button>
        </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutSection;