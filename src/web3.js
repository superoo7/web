import Web3 from 'web3';

export default function initializeWeb3() {
  let web3;
  if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
    // Web3 browser user detected. You can now use the provider.
    web3 = new Web3(window['ethereum'] || window.web3.currentProvider);
  } else {
    web3 = null; //or provide steemhunt's own web3 obj.
    console.error('web3 was undefined');
  }
  return web3;
}

