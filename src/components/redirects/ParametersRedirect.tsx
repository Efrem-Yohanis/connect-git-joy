import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function ParametersRedirect() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/devtool', { replace: true });
    setTimeout(() => {
      const tabTrigger = document.querySelector('[value="parameters"]') as HTMLElement;
      if (tabTrigger) tabTrigger.click();
    }, 100);
  }, [navigate]);
  
  return null;
}