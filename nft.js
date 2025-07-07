async function fetchNFT() {
  const apiKey = 'ISI_API_KEY_KAMU_DI_SINI'; // Ganti dengan API Key Moralis kamu
  const contract = '0x524cab2ec69124574082676e6f654a18df49a048';
  const tokenId = '7603';

  const url = `https://deep-index.moralis.io/api/v2.2/nft/${contract}/${tokenId}?chain=eth`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'X-API-Key': apiKey
      }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const image = fixIPFS(data.metadata?.image);
    const name = data.name || `NFT #${tokenId}`;
    const owner = data.owner_of || "Unknown";

    document.getElementById("nftOutput").innerHTML = `
      <div style="background:#1a1a1a; padding:20px; border-radius:10px; color:#ffd700;">
        <h2 style="margin-bottom:10px;">${name}</h2>
        ${image ? `<img src="${image}" alt="${name}" style="width:200px; border-radius:10px;">` : ''}
        <p><strong>Owner:</strong> <span style="color:white">${owner}</span></p>
        <p><strong>Token ID:</strong> ${data.token_id}</p>
      </div>
    `;
  } catch (err) {
    document.getElementById("nftOutput").innerHTML = `<p style="color:red;">Gagal memuat data NFT: ${err.message}</p>`;
  }
}

// Fungsi bantu untuk konversi IPFS ke URL HTTP
function fixIPFS(url) {
  if (!url) return "";
  return url.startsWith("ipfs://")
    ? url.replace("ipfs://", "https://ipfs.io/ipfs/")
    : url;
}
