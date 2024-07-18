// uniswapConfig.js

// Uniswap V2 Router address on Ethereum mainnet
export const uniswapRouterAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

// Uniswap V2 Router ABI
export const uniswapRouterABI = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "amountOutMin",
        "type": "uint256"
      },
      {
        "name": "path",
        "type": "address[]"
      },
      {
        "name": "to",
        "type": "address"
      },
      {
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "swapExactETHForTokens",
    "outputs": [
      {
        "name": "amounts",
        "type": "uint256[]"
      }
    ],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  }
];
