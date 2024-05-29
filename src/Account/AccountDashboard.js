
import React, { useState, useEffect } from 'react';

const AccountDashboard = () => {
    const [accounts, setAccounts] = useState([]);
    const [accountName, setAccountName] = useState('');
    const [balance, setBalance] = useState('');

    const handleCreateAccount = (e) => {
        e.preventDefault();

        const newAccount = {
            accountName: accountName,
            balance: parseFloat(balance),
        };

        fetch('http://localhost:8080/api/accounts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newAccount),
        })
            .then(response => response.json())
            .then(data => {
                setAccounts([...accounts, data]);
                setAccountName('');
                setBalance('');
            })
            .catch(error => console.error('Error creating account:', error));
    };

    useEffect(() => {
        fetch('http://localhost:8080/api/accounts')
            .then(response => response.json())
            .then(data => setAccounts(data))
            .catch(error => console.error('Error fetching accounts:', error));
    }, []);

    return (

        <div>
            <form onSubmit={handleCreateAccount} style={{ marginBottom: '20px' }}>
                <div>
                    <label>
                        Account Name:
                        <input
                            type="text"
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            required
                            style={{ marginLeft: '10px', marginRight: '20px' }}
                        />
                    </label>
                    <label>
                        Balance:
                        <input
                            type="number"
                            step="0.01"
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                            required
                            style={{ marginLeft: '10px' }}
                        />
                    </label>
                </div>
                <button type="submit" style={{ marginTop: '10px' }}>Create Account</button>
            </form>


            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Account Name</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map((account) => (
                        <tr key={account.id}>
                            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>{account.accountName}</td>
                            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>{account.balance}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AccountDashboard;
