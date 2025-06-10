import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, validateCPF } from "@/lib/utils";

interface CustomerFormData {
  name: string;
  cpf: string;
  whatsapp: string;
}

type CustomerFormProps = {
  formData: CustomerFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCpfChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onWhatsAppChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function CustomerForm({ formData, onInputChange, onCpfChange, onWhatsAppChange }: CustomerFormProps) {
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
        <Label htmlFor="cpf" className="text-gray-300">CPF *</Label>
        <div className="relative">
          <Input
            id="cpf"
            name="cpf"
            value={formData.cpf}
            onChange={onCpfChange}
            placeholder="000.000.000-00"
            className={cn(
              "pr-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400",
              formData.cpf && !validateCPF(formData.cpf) && "border-red-500"
            )}
            required
          />
          {formData.cpf && !validateCPF(formData.cpf) && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
              ✕
            </span>
          )}
          {formData.cpf && validateCPF(formData.cpf) && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
              ✓
            </span>
          )}
        </div>
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
    </div>
  );
}
