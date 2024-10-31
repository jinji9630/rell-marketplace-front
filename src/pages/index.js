import React, { useState, useEffect, createContext, useContext } from 'react';
import { createClient } from "postchain-client";

//2F53A8D219FCDC359446F23BCF77C70DB2FAC549FFF9ABFCB5851A7AC66F7442
// Create context for user state
const NFTContext = createContext();
const NFTContextProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [balance, setBalance] = useState(0);
  const [username, setUsername] = useState('');
  const [client, setClient]= useState(null);

  useEffect(()=>{
    const loadClient = async() =>{
      const client = await createClient({
        nodeUrlPool: "http://localhost:7740",
        blockchainRid: "5DBF34DAE13460D581771389CD1080B513A9674FDDB4D2CA8451E512871CAA1B",
      });
      setClient(client)
    }
    loadClient();


  },[])

  return (
    <NFTContext.Provider value={{ loggedIn, setLoggedIn, balance, setBalance, username, setUsername, client }}>
      {children}
    </NFTContext.Provider>
  );
};



// Styles object
const styles = {
  body: {
    fontFamily: "'Courier New', Courier, monospace",
    backgroundColor: 'orange',
    color: '#333',
    margin: 0,
    padding: 0,
  },
  header: {
    background: '#ff6f61',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
  },
  headerTitle: {
    fontSize: '2rem',
    letterSpacing: '2px',
    textShadow: '2px 2px #ffcc00',
  },
  nav: {
    fontSize: '1.2rem',
  },
  nftMarketplace: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
    padding: '20px',
  },
  nftCard: {
    background: 'black', // Retro gradient background
    border: '2px solid #ff6f61',
    borderRadius: '10px',
    padding: '15px',
    textAlign: 'center',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    position: 'relative',
    color:'white'
  },
  nftImage: {
    maxWidth: '80%',
    borderRadius: '5px',
  },
  price: {
    fontSize: '1.5rem',
    color: 'green',
    margin: '10px 0',
    fontWeight:'bold'
  },
  stat: {
    fontSize: '1rem',
    color: '#333',
    margin: '5px 0',
  },
  button: {
    backgroundColor: '#ff6f61',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.3s, transform 0.3s',
  },
  form: {
    background: '#fff3e0',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
    maxWidth: '400px',
    margin: 'auto',
  },
  formInput: {
    width: 'calc(100% - 20px)',
    padding: '10px',
    marginBottom: '10px',
    border: '2px solid #ff6f61',
    borderRadius: '5px',
  },
  textarea: {
    width: '100%',
    height: '80px',
    padding: '10px',
    border: '2px solid #ff6f61',
    borderRadius: '5px',
    marginTop: '10px',
  },
};

const Header = () => {
  const { loggedIn, balance, username } = useContext(NFTContext);

  return (
    <header style={styles.header}>
      <h1 style={styles.headerTitle}>NFT Marketplace</h1>
      <nav style={styles.nav}>
        {loggedIn ? (
          <span>
            {username}'s Balance: {balance} ETH
          </span>
        ) : (
          <span>Please log in</span>
        )}
      </nav>
    </header>
  );
};

const NFTMarketplace = () => {
  const [nfts, setNfts] = useState([]);
  const { balance, setBalance,client } = useContext(NFTContext);

  const loadNFTs = () => {
    const images = Array.from({ length: 10 }, (_, i) => `${i + 1}.png`);
    const prices = Array.from({ length: 10 }, (_, i) => (Math.random() * 10).toFixed(2));
    const strengths = Array.from({ length: 10 }, (_, i) => Math.floor(Math.random() * 100) + 1);
    const healths = Array.from({ length: 10 }, (_, i) => Math.floor(Math.random() * 100) + 1);
    const owners = Array.from({ length: 10 }, () => `User${Math.floor(Math.random() * 1000)}`);

    const nftData = images.map((img, index) => ({
      id: index + 1,
      image: img,
      price: prices[index],
      strength: strengths[index],
      health: healths[index],
      owner: owners[index],
    }));
    setNfts(nftData);
  };

  const buyNFT = async (price) => {
    const newBalance = (parseFloat(balance) - parseFloat(price)).toFixed(2);
    setBalance(newBalance);
    alert(`You bought an NFT for ${price} ETH!`);
  };

  useEffect(() => {
    loadNFTs();
  }, []);

  return (
    <div style={styles.nftMarketplace}>
      {nfts.map(nft => (
        <NFTCard key={nft.id} nft={nft} onBuy={buyNFT} />
      ))}
    </div>
  );
};

const NFTCard = ({ nft, onBuy }) => {
  const handleBuy = () => {
    onBuy(nft.price);
  };

  return (
    <div style={styles.nftCard}>
      <img src={`/images/${nft.image}`} alt={`NFT ${nft.id}`} style={styles.nftImage} />
      <h3>NFT {nft.id}</h3>
      <p>Owner: {nft.owner}</p>
      <p style={styles.price}>Price: {nft.price} ETH</p>
      <p style={styles.stat}>Strength: {nft.strength}</p>
      <p style={styles.stat}>Health: {nft.health}</p>
      <button 
        style={styles.button}
        onClick={handleBuy}
      >
        Buy
      </button>
    </div>
  );
};

const Login = () => {
  const { setLoggedIn, setBalance, setUsername } = useContext(NFTContext);
  const [privateKey, setPrivateKey] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const randomUsername = `User${Math.floor(Math.random() * 1000)}`;
    setUsername(randomUsername);
    setLoggedIn(true);
    setBalance('10.00'); // Starting balance
  };

  const handlePrivateKeyLogin = () => {
    const randomUsername = `User${Math.floor(Math.random() * 1000)}`;
    setUsername(randomUsername);
    setLoggedIn(true);
    setBalance('10.00'); // Starting balance
    alert(`Logged in with private key: ${privateKey}`);
  };

  return (
    <form style={styles.form} onSubmit={handleLogin}>
      <h2>Login</h2>
      <input type="text" placeholder="Username" required style={styles.formInput} />
      <input type="password" placeholder="Password" required style={styles.formInput} />
      <button type="submit" style={styles.button}>Login</button>
      
      <div style={{ marginTop: '20px' }}>
        <button 
          style={{ ...styles.button, backgroundColor: 'orange', color: 'white' }}
          onClick={() => {/* MetaMask login logic */}}
        >
          Login with MetaMask
        </button>
        <textarea 
          placeholder="Enter your private key" 
          style={{...styles.textarea, borderColor:'blue'}} 
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
        />
        <button 
          type="button" 
          style={{ ...styles.button, backgroundColor: 'blue', marginTop: '10px' }}
          onClick={handlePrivateKeyLogin}
        >
          Login with Private Key
        </button>
      </div>
    </form>
  );
};

const App = () => {
  return (
    <>
      <NFTContextProvider>
        <Header />
        <div className="content">
          <Login />
          <NFTMarketplace />
        </div>
      </NFTContextProvider>
    </>
  );
};

export default App;
