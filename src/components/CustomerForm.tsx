import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, validateCPF } from "@/lib/utils";

interface CustomerFormData {
  name: string;
  whatsapp: string;
  city: string;
}

type CustomerFormProps = {
  formData: CustomerFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onWhatsAppChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function CustomerForm({ formData, onInputChange, onWhatsAppChange, onCityChange }: CustomerFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-gray-300">Nome Completo *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          placeholder="Seu nome completo"
          className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
          required
        />
      </div>



      <div className="space-y-2">
        <Label htmlFor="whatsapp" className="text-gray-300">WhatsApp *</Label>
        <Input
          id="whatsapp"
          name="whatsapp"
          value={formData.whatsapp}
          onChange={onWhatsAppChange}
          placeholder="(11) 99999-9999"
          className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="city" className="text-gray-300">Cidade *</Label>
        <Input
          id="city"
          name="city"
          value={formData.city}
          onChange={onCityChange}
          placeholder="Sua cidade"
          className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
          required
        />
      </div>
    </div>
  );
}
