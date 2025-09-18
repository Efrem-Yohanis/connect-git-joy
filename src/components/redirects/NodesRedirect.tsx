import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function NodesRedirect() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Navigate to devtool with nodes tab active
    navigate('/devtool', { replace: true });
    // We can trigger the tab switch using URL hash or state
    setTimeout(() => {
      const tabTrigger = document.querySelector('[value="nodes"]') as HTMLElement;
      if (tabTrigger) tabTrigger.click();
    }, 100);
  }, [navigate]);
  
  return null;
}