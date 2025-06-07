
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Users } from "lucide-react";

const VipGroup = () => {
  return (
    <Card className="bg-gradient-to-r from-orange-600 to-red-600 border-orange-primary p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Crown className="w-8 h-8 text-yellow-300" />
          <div>
            <h3 className="text-lg font-bold text-white">Grupo VIP Litoral Premia!</h3>
            <p className="text-orange-100 text-sm">Ganhe e receba as últimas exclusivas.</p>
          </div>
        </div>
        <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold">
          <Users className="w-4 h-4 mr-2" />
          Participar do Grupo VIP →
        </Button>
      </div>
    </Card>
  );
};

export default VipGroup;
