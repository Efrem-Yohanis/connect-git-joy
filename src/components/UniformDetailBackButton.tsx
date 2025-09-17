import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface UniformDetailBackButtonProps {
  backRoute: string;
  backTab?: 'flows' | 'nodes' | 'subnodes' | 'parameters';
}

export function UniformDetailBackButton({ backRoute, backTab }: UniformDetailBackButtonProps) {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (backTab) {
      navigate(`${backRoute}?tab=${backTab}`);
    } else {
      navigate(backRoute);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleBack}
      className="w-32"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back
    </Button>
  );
}