import React, { useState } from 'react';
import { Container, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

type AuthMode = 'signin' | 'signup' | 'update';

interface AuthFormProps {
  mode: AuthMode;
  onSubmit: (data: { email: string; password: string }) => void;
  checkEmail?: (email: string) => Promise<boolean>
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onSubmit, checkEmail }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailNotFound, setEmailNotFound] = useState(false)

  const navigate = useNavigate();

  const handleValidation = () => {
    setEmailError('');
    setPasswordError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    if (!emailRegex.test(email)) {
      setEmailError('Invalid Email input!');
      isValid = false;
    }

    if (mode !== 'update') {
      if (password.length < 6) {
        setPasswordError('Invalid password input!');
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailNotFound(false)
    if (!handleValidation()) return;
    if (mode === 'update') {
      if (checkEmail) {
        const exists = await checkEmail(email)
        if(!exists) {
          setEmailNotFound(true)
          return;
        }
      }
      onSubmit({ email, password: '' });
 
    } else {
      onSubmit({ email, password });
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'signin': return 'Sign in to your account';
      case 'signup': return 'Sign up an account';
      case 'update': return 'Update your password';
    }
  };

  const getButtonLabel = () => {
    switch (mode) {
      case 'signin': return 'Sign In';
      case 'signup': return 'Create account';
      case 'update': return 'Update password';
    }
  };

  const getSubtitle = () => {
    if (mode === 'update') {
      return 'Enter your email link, we will send you the recovery link';
    }
    return null;
  };

  return (
    <Container fluid className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <Card className="p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="d-flex justify-content-end">
          <button 
            type="button" 
            className="btn-close" 
            aria-label="Close"
            onClick={() => navigate('/')}></button>
        </div>
        <h3 className="text-center mb-2">{getTitle()}</h3>
        {getSubtitle() && <p className="text-center text-muted small mb-3">{getSubtitle()}</p>}
        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3 text-start" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!emailError}
              required
            />
            <div className="invalid-feedback text-end">
              {emailError}
            </div>
            {emailNotFound && (
              <div className='text-danger text-end small mt-1'>
                No resigtered email found.
              </div>
            )}
          </Form.Group>

          {mode !== 'update' && (
            <>
              <Form.Group className="mb-3 text-start" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isInvalid={!!passwordError}
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </Button>
                  <div className="invalid-feedback text-end">
                    {passwordError}
                  </div>
                </InputGroup>
              </Form.Group>
            </>
          )}

          <div className="d-grid">
            <Button type="submit" variant="primary">
              {getButtonLabel()}
            </Button>
          </div>

          {mode === 'signin' && (
            <>
              <div className="d-flex justify-content-between align-items-center small">
                <div>
                  Don’t have an account?{" "}
                  <Link to='/signup' className="text-decoration-none">Sign up</Link>
                </div>
                <Link to='/update' className="text-decoration-none">Forgot password?</Link>
              </div>
            </>
          )}

          {mode === 'signup' && (
            <>
              <div className="d-flex justify-content-between align-items-center small">
                <div>
                  Already have an account{" "}
                  <a 
                  href="#" 
                  className="text-decoration-none"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/signin')
                  }}
                  >Sign in</a>
                </div>
              </div>
            </>
          )}
        </Form>
      </Card>
    </Container>
  );
};

export default AuthForm;
