
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DoorToDoorSaleForm } from './DoorToDoorSaleForm';

interface DoorToDoorFormCardProps {
  isRegisteringSale: boolean;
  onStartRegistering: () => void;
  onSuccess: () => void;
  onCancel: () => void;
}

export function DoorToDoorFormCard({ 
  isRegisteringSale, 
  onStartRegistering, 
  onSuccess, 
  onCancel 
}: DoorToDoorFormCardProps) {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">
          {isRegisteringSale ? 'Registrar Nova Venda' : 'Venda Rápida'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isRegisteringSale ? (
          <div className="space-y-4">
            <DoorToDoorSaleForm 
              onSuccess={onSuccess}
              onCancel={onCancel}
            />
          </div>
        ) : (
          <div className="text-center p-6">
            <p className="text-slate-400 mb-6">
              Registre uma nova venda porta a porta para começar
            </p>
            <Button 
              onClick={onStartRegistering}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Venda
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
