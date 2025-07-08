const MORALIS_API_KEY = "N3oqw"; // Ganti dengan API key kamu yang valid

// Fungsi untuk ambil saldo wallet, token, dan transaksi
async function fetchWalletInfo() {
  const address = document.getElementById("addressInput").value.trim();
  const chain = document.getElementById("chainSelect").value;

  if (!address) {
    alert("Masukkan alamat wallet terlebih dahulu.");
    return;
  }

  // 1. Fetch Native Balance
  const balanceRes = await fetch(`https://deep-index.moralis.io/api/v2.2/${address}/balance?chain=${chain}`, {
    headers: {
      accept: "application/json",
      "X-API-Key": MORALIS_API_KEY
    }
  });

  const balanceData = await balanceRes.json();
  const native = parseFloat(balanceData.balance) / 1e18;
  document.getElementById("balance").innerText = `${native.toFixed(6)} ${getSymbol(chain)}`;

  // 2. Fetch ERC20 Tokens
  const tokenRes = await fetch(`https://deep-index.moralis.io/api/v2.2/${address}/erc20?chain=${chain}`, {
    headers: {
      accept: "application/json",
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

  // 3. Fetch Last 5 Transactions
  const txRes = await fetch(`https://deep-index.moralis.io/api/v2.2/${address}?chain=${chain}`, {
    headers: {
      accept: "application/json",
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

// Mendapatkan simbol token berdasarkan jaringan
function getSymbol(chain) {
  switch (chain) {
    case "eth": return "ETH";
    case "bsc": return "BNB";
    case "polygon": return "MATIC";
    case "avalanche": return "AVAX";
    default: return "NATIVE";
  }
}

// Fungsi untuk cek NFT berdasarkan contract + token ID
async function fetchNFT(contract, tokenId) {
  const url = `https://deep-index.moralis.io/api/v2.2/nft/${contract}/${tokenId}?chain=eth`;

  try {
    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        "X-API-Key": MORALIS_API_KEY
      }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const img = data.metadata?.image?.replace("ipfs://", "https://ipfs.io/ipfs/") || "";
    const name = data.name || `NFT #${tokenId}`;

    document.getElementById("nftOutput").innerHTML = `
      <h3>${name}</h3>
      ${img ? `<img src="${img}" width="200" />` : ""}
      <p><strong>Owner:</strong> ${data.owner_of || "Unknown"}</p>
      <p><strong>Token ID:</strong> ${data.token_id}</p>
    `;
  } catch (err) {
    document.getElementById("nftOutput").innerHTML = `<p class="error">Error: ${err.message}</p>`;
  }
}

// Fungsi khusus untuk menampilkan NFT statis #7603
function fetchNFT7603() {
  const contract = '0x524cab2ec69124574082676e6f654a18df49a048';
  const tokenId = '7603';
  fetchNFT(contract, tokenId);
}


async function fetchBalance(address) {
  try {
    const res = await fetch(`http://localhost:3000/balance/${address}`);
    const data = await res.json();
    console.log("DEBUG data balance:", data); // ← Tambahkan log ini
    document.getElementById("balance").innerText = `Balance: ${data.balance} ZTC`;
  } catch (e) {
    document.getElementById("balance").innerText = "Balance: Error";
    console.error(e);
  }
}
