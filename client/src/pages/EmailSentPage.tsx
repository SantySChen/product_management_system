import { Card, Container } from 'react-bootstrap';
import envelope from '../assets/envelope.svg';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/titleHooks';

export default function EmailSentPage() {
    useDocumentTitle('Email sent')
    const navigate = useNavigate()

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
                <div>
                    <img src={envelope} alt='Mail Envelope Icon' className='size-6' />
                </div>
                <div className='justify-content'>
                    We have sent the updated password link to your email, please check that !
                </div>
            </Card>
        </Container>
    )
}
