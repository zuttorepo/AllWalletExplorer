const MORALIS_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImEzMDFiNmE2LTZhMjktNDBmOC04Y2I0LTExODVjYmY2YzcyYSIsIm9yZ0lkIjoiNDU4MDEzIiwidXNlcklkIjoiNDcxMjE5IiwidHlwZUlkIjoiNjUxMTIzZmMtMzRhZS00NTFmLTllNjMtMDRmM2IyNDM0NWY2IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NTE4OTAwNTIsImV4cCI6NDkwNzY1MDA1Mn0.KPkvPtq-DdqEDjJ7OaqkYl11218nL5fodGVxVXN3oqw"; // pakai punyamu


async function fetchWalletInfo() {
  const address = document.getElementById("addressInput").value.trim();
  const chain = document.getElementById("chainSelect").value;

  if (!address) {
    alert("Masukkan alamat wallet terlebih dahulu.");
    return;
  }

  // Fetch native balance
  const balanceRes = await fetch(`https://deep-index.moralis.io/api/v2.2/${address}/balance?chain=${chain}`, {
    headers: {
      "accept": "application/json",
      "X-API-Key": MORALIS_API_KEY
    }
  });

  const balanceData = await balanceRes.json();
  const native = parseFloat(balanceData.balance) / 1e18;
  document.getElementById("balance").innerText = `${native.toFixed(6)} ${getSymbol(chain)}`;

  // Fetch token balances
  const tokenRes = await fetch(`https://deep-index.moralis.io/api/v2.2/${address}/erc20?chain=${chain}`, {
    headers: {
      "accept": "application/json",
      "X-API-Key": MORALIS_API_KEY
    }
  });

  const tokens = await tokenRes.json();
  const tokenList = document.getElementById("tokens");
  tokenList.innerHTML = "";
  tokens.forEach(token => {
    const li = document.createElement("li");
    const amount = parseFloat(token.balance) / Math.pow(10, token.decimals);
    li.textContent = `${token.name} (${token.symbol}): ${amount.toFixed(4)}`;
    tokenList.appendChild(li);
  });

  // Fetch transaction history (last 5)
  const txRes = await fetch(`https://deep-index.moralis.io/api/v2.2/${address}?chain=${chain}`, {
    headers: {
      "accept": "application/json",
      "X-API-Key": MORALIS_API_KEY
    }
  });

  const txData = await txRes.json();
  const txList = document.getElementById("transactions");
  txList.innerHTML = "";
  txData.result.slice(0, 5).forEach(tx => {
    const li = document.createElement("li");
    li.textContent = `From ${tx.from_address.slice(0, 6)}... To ${tx.to_address.slice(0, 6)}... | ${parseFloat(tx.value) / 1e18} ${getSymbol(chain)}`;
    txList.appendChild(li);
  });
}

function getSymbol(chain) {
  switch (chain) {
    case "eth": return "ETH";
    case "bsc": return "BNB";
    case "polygon": return "MATIC";
    case "avalanche": return "AVAX";
    default: return "NATIVE";
  }
}