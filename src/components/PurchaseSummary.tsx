type PurchaseSummaryProps = {
  quantity: number;
  total: string;
  indicatedBy?: string;
};

export function PurchaseSummary({ quantity, total, indicatedBy }: PurchaseSummaryProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-orange-500/20">
      <h3 className="font-medium mb-3 text-white">Resumo da Compra</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-300">Quantidade:</span>
          <span className="text-white">{quantity} número(s)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Total:</span>
          <span className="font-bold text-orange-500">R$ {total}</span>
        </div>
        {indicatedBy && (
          <div className="flex justify-between">
            <span className="text-gray-300">Indicado por:</span>
            <span className="text-green-400 font-medium">{indicatedBy}</span>
          </div>
        )}
      </div>
    </div>
  );
}
