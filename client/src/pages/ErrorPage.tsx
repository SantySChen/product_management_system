import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationCircle } from 'react-icons/fa';

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100 text-center"
      style={{ backgroundColor: '#f8f9fa' }}
    >
      <FaExclamationCircle size={80} className="text-danger mb-4" />
      <h2 className="mb-3">Oops, something went wrong!</h2>
      <button className="btn btn-primary" onClick={() => navigate('/')}>
        Go Home
      </button>
    </div>
  );
};

export default ErrorPage;
