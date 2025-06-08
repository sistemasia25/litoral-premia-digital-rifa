
import { Card } from "@/components/ui/card";
import { Trophy, Gift, MapPin } from "lucide-react";

const RecentWinners = () => {
  const winners = [
    { 
      id: 1,
      name: "Carlos S.", 
      city: "São Paulo/SP",
      prize: "R$ 100",
      number: "987416",
      date: "05/06/2024",
      avatar: "/default-avatar.png"
    },
    { 
      id: 2,
      name: "Ana P.", 
      city: "Rio de Janeiro/RJ",
      prize: "R$ 50",
      number: "123456",
      date: "03/06/2024",
      avatar: "/default-avatar.png"
    },
    { 
      id: 3,
      name: "Roberto M.", 
      city: "Belo Horizonte/MG",
      prize: "R$ 100",
      number: "789012",
      date: "01/06/2024",
      avatar: "/default-avatar.png"
    },
    { 
      id: 4,
      name: "Juliana F.", 
      city: "Curitiba/PR",
      prize: "R$ 50",
      number: "345678",
      date: "28/05/2024",
      avatar: "/default-avatar.png"
    }
  ];

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-center text-yellow-400 mb-6 flex items-center justify-center">
        🏆 Nossos Últimos Ganhadores 🏆
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {winners.map((winner) => (
          <Card key={winner.id} className="bg-card/90 border-orange-primary/20 hover:border-orange-primary/40 transition-colors">
            <div className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gray-700 mb-3 overflow-hidden">
                  <img 
                    src={winner.avatar} 
                    alt={winner.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/default-avatar.png';
                    }}
                  />
                </div>
                
                <h4 className="font-bold text-white text-lg">{winner.name}</h4>
                
                <div className="flex items-center text-gray-300 text-sm mt-1">
                  <MapPin className="w-4 h-4 mr-1 text-orange-primary" />
                  {winner.city}
                </div>
                
                <div className="mt-3 bg-gray-800/50 rounded-lg p-2 w-full">
                  <p className="text-yellow-400 font-bold flex items-center justify-center gap-1">
                    <Gift className="w-4 h-4" />
                    Ganhou {winner.prize}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Nº {winner.number} • {winner.date}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-6">
        <button className="text-orange-primary hover:text-orange-300 text-sm font-medium">
          Ver todos os ganhadores →
        </button>
      </div>
    </div>
  );
};

export default RecentWinners;
