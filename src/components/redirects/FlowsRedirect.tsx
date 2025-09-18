import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function FlowsRedirect() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/devtool', { replace: true });
  }, [navigate]);
  
  return null;
}