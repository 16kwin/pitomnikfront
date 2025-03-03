// src/components/User.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/User.css'; // Import CSS file
import AnimalModal from './AnimalModal'; // Import the AnimalModal component

const User = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('dogs');
    const navigate = useNavigate();
    const [animalNames, setAnimalNames] = useState([]);
    const [selectedAnimal, setSelectedAnimal] = useState(null); // State for selected animal
    const [isModalOpen, setIsModalOpen] = useState(false);   // State to control modal visibility

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('jwtToken');

            if (!token) {
                setError('No token found. Please login.');
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8080/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUserData(response.data);
                setError('');
            } catch (error) {
                console.error('Error fetching user data:', error);
                localStorage.removeItem('jwtToken');
                navigate('/login');

                if (error.response && error.response.status === 403) {
                    setError('Unauthorized. You do not have permission to view this resource.');
                } else if (error.response && error.response.status === 401) {
                    setError('Unauthorized. Please login.');
                } else {
                    setError('Failed to fetch user data. Please try again.');
                }
                setUserData(null);
            }
        };

        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        const fetchAnimalNames = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/animals/names', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                    },
                });
                setAnimalNames(response.data);
            } catch (error) {
                console.error('Error fetching animal names:', error);
                setError('Failed to fetch animal names.'); // Set an error message
            }
        };

        fetchAnimalNames();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        navigate('/login');
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleAnimalButtonClick = async (animalId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/animals/${animalId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                },
            });
            setSelectedAnimal(response.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching animal details:', error);
            setError('Failed to fetch animal details.');
        }
    };


    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAnimal(null);
    };

    return (
        <div className="user-container">
            {/* Шапка */}
            <header className="user-header">
                <div className="user-info">
                    {userData && `${userData.firstname} ${userData.lastname}`}
                </div>
                <button onClick={handleLogout}>Logout</button>
            </header>

            {/* Основная часть */}
            <div className="user-main-content">
                {/* Меню слева */}
                <aside className="user-menu">
                    <ul>
                        <li onClick={() => handleTabClick('cats')}>Cats</li>
                        <li onClick={() => handleTabClick('dogs')}>Dogs</li>
                        <li onClick={() => handleTabClick('documents')}>Documents</li>
                        <li onClick={() => handleTabClick('info')}>Info</li>
                    </ul>
                </aside>

                {/* Контент справа */}
                <main className="user-content">
                    {error && <p className="error">{error}</p>}
                    {activeTab === 'cats' && <div>Content for Cats</div>}
                    {activeTab === 'dogs' && (
                        <div>
                           {animalNames.map((animal, index) => (
                                <button className="animal-button" key={index} onClick={() => handleAnimalButtonClick(animal.id)}>
                                    {animal.name}
                                </button>
                            ))}
                        </div>
                    )}
                    {activeTab === 'documents' && <div>Content for Documents</div>}
                    {activeTab === 'info' && <div>content for info</div>}
                </main>
            </div>
             {isModalOpen && (
                <AnimalModal animal={selectedAnimal} onClose={closeModal} />
            )}
        </div>
    );
};

export default User;