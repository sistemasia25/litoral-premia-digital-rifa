
import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

const RecentWinners = () => {
  const winners = [
    { name: "Maria S.", prize: "PIX de R$ 100", number: "Sortudo 06" },
    { name: "João P.", prize: "PIX de R$ 50", number: "Sortudo 12" }
  ];

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-center text-yellow-400 mb-6 flex items-center justify-center">
        🏆 Nossos Últimos Ganhadores 🏆
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {winners.map((winner, index) => (
          <Card key={index} className="bg-card border-orange-primary/20 p-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-xs">300 × 300</span>
              </div>
              <div>
                <p className="font-bold text-white">{winner.name}</p>
                <p className="text-orange-primary text-sm">{winner.prize}</p>
                <p className="text-gray-400 text-xs">{winner.number}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecentWinners;
