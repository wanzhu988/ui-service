import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spin, Alert, Input, Button, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';  
import Container from '../container'; 
/**
 * Home component that displays the user's stock watchlist, allows for stock search, and deletion of stocks from the watchlist.
 */
const Home = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);
    const navigate = useNavigate();  

    /**
     * Shows a modal dialog for confirming deletion of a stock.
     * @param {Object} stock - The stock to potentially delete.
     */
    const showModal = (stock) => {
        setSelectedStock(stock);
        setIsModalOpen(true); 
    };

    /**
     * Handles the deletion of a stock from the user's watchlist.
     */
    const handleDeletFromWatchlist = async () => {
        if (selectedStock) {
            const user = JSON.parse(localStorage.getItem('user')); 
            console.log(localStorage.getItem('user'));
            if (!user) {
                Modal.error({
                    title: 'Not Logged In',
                    content: 'You must be logged in to add stocks to your watchlist.',
                });
                return;
            }
    
            const userId = user.id; 
            try {
                await axios.post(`http://localhost:10789/api/user/delete-from-watchlist/${userId}`, {
                    symbol: selectedStock.symbol
                });
                Modal.success({
                    content: `${selectedStock.symbol} deleted from your watchlist!`,
                });
                const updatedWatchlist = user.stockWatchlist.filter(item => item !== selectedStock.symbol);

                // Update the user's watchlist
                user.stockWatchlist = updatedWatchlist; 
                localStorage.setItem('user', JSON.stringify(user));
        
                // Update the stocks displayed
                const updatedStocks = stocks.filter(stock => stock.symbol !== selectedStock.symbol);
                setStocks(updatedStocks);

            } catch (error) {
                Modal.error({
                    title: 'Failed to delete the stock',
                    content: error.message,
                });
            }
        }
        setIsModalOpen(false);
    };

    /**
     * Handles the logout of user.
     */
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login')
    }

    /**
     * Fetches stock details.
     */
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        // console.log(user);
        if (user && user.stockWatchlist && user.stockWatchlist.length > 0) {
            axios.post('http://localhost:10789/api/stocks/details', user.stockWatchlist)
                .then(response => {
                    setStocks(response.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error loading stocks:', err);
                    setError('Failed to fetch stock details');
                    setLoading(false);
                });
        } else {
            setLoading(false);
            setStocks([]); 
        }
    }, []);
    
    /**
     * Initiates a search page for stocks based on the user's input.
     */
    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:10789/api/stocks/search/${searchText}`);
            setLoading(false);
            navigate('/search-results', { state: { stocks: response.data } });  
        } catch (err) {
            console.error('Error searching stocks:', err);
            setError('Failed to fetch search results');
            setLoading(false);
        }
    };

    // Table columns configuration
    const columns = [
        {
            title: 'Symbol',
            dataIndex: 'symbol',
            key: 'symbol',
            onCell: (record) => ({
                onClick: () => showModal(record),
            }),
        },
        {
            title: 'Company Name',
            dataIndex: 'companyName',
            key: 'companyName',
        },
        {
            title: 'Current Price',
            dataIndex: 'currentPrice',
            key: 'currentPrice',
        }
    ];

    return (
        <Container>
            {loading && <Spin tip="Loading..." />}
            {!loading && (
                <>
                    {error && <Alert message={error} type="error" />}
                    <div>
                        <h1>My Stock Watchlist</h1>
                        <Input
                            placeholder="Search by symbol or company name"
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            style={{ marginBottom: 20, width: 300 }}
                        />
                        <Button onClick={handleSearch} type="primary" disabled={!searchText.trim()}>Search</Button>
                        <Table dataSource={stocks} columns={columns} rowKey="symbol" />
                        <Button onClick={handleLogout} type="default" style={{ margin: '10px 0' }}>Logout</Button>
                        <Modal
                            title="Delete from Watchlist"
                            open={isModalOpen}
                            onOk={handleDeletFromWatchlist}
                            onCancel={() => setIsModalOpen(false)}
                        >
                            <p>Do you want to delete {selectedStock?.symbol} from your watchlist?</p>
                        </Modal>
                    </div>
                </>
            )}
        </Container>
    );
};

export default Home;
