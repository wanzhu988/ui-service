import React, { useState } from 'react';
import { Table, Button, Spin, Alert, Modal } from 'antd';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Container from '../container'; 
/**
 * SearchResult component that displays search results and allows users to add stocks to their watchlist.
 */
const SearchResult = () => {
    const location = useLocation();
    const [stocks, setStocks] = useState(location.state?.stocks || []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);

    /**
     * Handles displaying detailed price information for a specific stock.
     * @param {string} symbol - The stock symbol.
     */
    const handleShowDetails = async (symbol) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:10789/api/stocks/${symbol}`);
            const updatedStocks = stocks.map(stock => stock.symbol === symbol ? { ...stock, currentPrice: response.data.currentPrice } : stock);
            setStocks(updatedStocks);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch stock details');
            setLoading(false);
        }
    };

    /**
     * Shows a modal dialog to confirm adding a stock to the watchlist.
     * @param {Object} stock - The stock to be added.
     */
    const showModal = (stock) => {
        setSelectedStock(stock);
        setIsModalOpen(true); 
    };

    /**
     * Handles adding a stock to the user's watchlist after confirmation.
     */
    const handleAddToWatchlist = async () => {
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
                await axios.post(`http://localhost:10789/api/user/add-to-watchlist/${userId}`, {
                    symbol: selectedStock.symbol
                });
                Modal.success({
                    content: `${selectedStock.symbol} added to your watchlist!`,
                });
                user.stockWatchlist.push(selectedStock.symbol);
                localStorage.setItem('user', JSON.stringify(user));
            } catch (error) {
                Modal.error({
                    title: 'Failed to add the stock',
                    content: error.message,
                });
            }
        }
        setIsModalOpen(false);
    };

    // Configuration for the table columns
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
            render: (text, record) => (
                text ? text : <Button onClick={() => handleShowDetails(record.symbol)}>Show</Button>
            )
        }
    ];

    return (
        <Container>
            <div>
                <h1>Search Results</h1>
                <Table dataSource={stocks} columns={columns} rowKey="symbol" />
                <Modal
                    title="Add to Watchlist"
                    open={isModalOpen} 
                    onOk={handleAddToWatchlist}
                    onCancel={() => setIsModalOpen(false)}
                >
                    <p>Do you want to add {selectedStock?.symbol} to your watchlist?</p>
                </Modal>
            </div>
        </Container>
    );
};

export default SearchResult;
