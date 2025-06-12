
// Client-side input validation utilities
// These complement the database-level validations

export const validateWhatsApp = (phone: string): { isValid: boolean; error?: string } => {
  if (!phone) {
    return { isValid: false, error: 'WhatsApp é obrigatório' };
  }
  
  // Brazilian phone number pattern
  const pattern = /^(\+55\s?)?(\([1-9]{2}\)\s?|[1-9]{2}\s?)[6-9][0-9]{7,8}$/;
  
  if (!pattern.test(phone)) {
    return { 
      isValid: false, 
      error: 'Formato de WhatsApp inválido. Use o formato: (11) 99999-9999' 
    };
  }
  
  return { isValid: true };
};

export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: 'Email é obrigatório' };
  }
  
  const pattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  
  if (!pattern.test(email)) {
    return { isValid: false, error: 'Formato de email inválido' };
  }
  
  return { isValid: true };
};

export const validatePixKey = (pixKey: string): { isValid: boolean; error?: string } => {
  if (!pixKey) {
    return { isValid: false, error: 'Chave PIX é obrigatória' };
  }
  
  // CPF: 11 digits
  if (/^\d{11}$/.test(pixKey)) {
    return { isValid: true };
  }
  
  // CNPJ: 14 digits
  if (/^\d{14}$/.test(pixKey)) {
    return { isValid: true };
  }
  
  // Email format
  if (validateEmail(pixKey).isValid) {
    return { isValid: true };
  }
  
  // Phone format
  if (validateWhatsApp(pixKey).isValid) {
    return { isValid: true };
  }
  
  // Random key: 32 alphanumeric characters
  if (/^[A-Za-z0-9]{32}$/.test(pixKey)) {
    return { isValid: true };
  }
  
  return { 
    isValid: false, 
    error: 'Chave PIX inválida. Use CPF, CNPJ, email, telefone ou chave aleatória' 
  };
};

export const validateCPF = (cpf: string): { isValid: boolean; error?: string } => {
  if (!cpf) {
    return { isValid: false, error: 'CPF é obrigatório' };
  }
  
  // Remove non-numeric characters
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  
  if (cleanCPF.length !== 11) {
    return { isValid: false, error: 'CPF deve ter 11 dígitos' };
  }
  
  // Check for known invalid CPFs (all same digit)
  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return { isValid: false, error: 'CPF inválido' };
  }
  
  // Validate CPF check digits
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) {
    return { isValid: false, error: 'CPF inválido' };
  }
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) {
    return { isValid: false, error: 'CPF inválido' };
  }
  
  return { isValid: true };
};

export const validateAmount = (amount: number | string): { isValid: boolean; error?: string } => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount) || numAmount <= 0) {
    return { isValid: false, error: 'Valor deve ser maior que zero' };
  }
  
  if (numAmount > 999999.99) {
    return { isValid: false, error: 'Valor muito alto' };
  }
  
  return { isValid: true };
};

export const validateQuantity = (quantity: number | string): { isValid: boolean; error?: string } => {
  const numQuantity = typeof quantity === 'string' ? parseInt(quantity) : quantity;
  
  if (isNaN(numQuantity) || numQuantity <= 0) {
    return { isValid: false, error: 'Quantidade deve ser maior que zero' };
  }
  
  if (numQuantity > 10000) {
    return { isValid: false, error: 'Quantidade muito alta' };
  }
  
  return { isValid: true };
};

// Sanitize and validate form data
export const sanitizeAndValidate = {
  salesForm: (data: {
    customer_name: string;
    customer_email?: string;
    customer_whatsapp: string;
    customer_city: string;
    quantity: number;
    notes?: string;
  }) => {
    const errors: Record<string, string> = {};
    const sanitized = { ...data };
    
    // Sanitize inputs
    sanitized.customer_name = data.customer_name.trim();
    sanitized.customer_email = data.customer_email?.trim().toLowerCase();
    sanitized.customer_whatsapp = data.customer_whatsapp.replace(/[^\d+()-\s]/g, '');
    sanitized.customer_city = data.customer_city.trim();
    sanitized.notes = data.notes?.trim();
    
    // Validate required fields
    if (!sanitized.customer_name || sanitized.customer_name.length < 2) {
      errors.customer_name = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    if (!sanitized.customer_city || sanitized.customer_city.length < 2) {
      errors.customer_city = 'Cidade deve ter pelo menos 2 caracteres';
    }
    
    // Validate WhatsApp
    const whatsappValidation = validateWhatsApp(sanitized.customer_whatsapp);
    if (!whatsappValidation.isValid) {
      errors.customer_whatsapp = whatsappValidation.error!;
    }
    
    // Validate email if provided
    if (sanitized.customer_email) {
      const emailValidation = validateEmail(sanitized.customer_email);
      if (!emailValidation.isValid) {
        errors.customer_email = emailValidation.error!;
      }
    }
    
    // Validate quantity
    const quantityValidation = validateQuantity(sanitized.quantity);
    if (!quantityValidation.isValid) {
      errors.quantity = quantityValidation.error!;
    }
    
    return {
      sanitized,
      errors,
      isValid: Object.keys(errors).length === 0
    };
  }
};
