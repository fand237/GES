import React, { useEffect } from 'react';
import { Route, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element, ...rest }) => {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('accessToken');

    useEffect(() => {
        if (!isAuthenticated) {
            setTimeout(() => {
                navigate('/EnseignantConnect');
            });
        }
    }, [isAuthenticated, navigate]);

    return isAuthenticated ? (
        <Route {...rest} element={<Element />} />
    ) : null;
};

export default ProtectedRoute;
