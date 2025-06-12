
-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view raffle prizes" ON public.raffle_prizes;
DROP POLICY IF EXISTS "Anyone can view winning numbers" ON public.winning_numbers;

-- Phase 1: Create security definer functions for role checking
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin' AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_partner()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'partner' AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_customer()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'customer' AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.owns_sale(sale_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.sales 
    WHERE id = sale_id AND (
      customer_profile_id = auth.uid() OR 
      partner_id = auth.uid()
    )
  );
$$;

-- Phase 1: Implement comprehensive RLS policies

-- RAFFLES table policies
DROP POLICY IF EXISTS "Anyone can view active raffles" ON public.raffles;
CREATE POLICY "Anyone can view active raffles" ON public.raffles
  FOR SELECT USING (status = 'active');

CREATE POLICY "Only admins can create raffles" ON public.raffles
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update raffles" ON public.raffles
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can delete raffles" ON public.raffles
  FOR DELETE USING (public.is_admin());

-- SALES table policies
DROP POLICY IF EXISTS "Users can view their own sales" ON public.sales;
CREATE POLICY "Users can view their own sales" ON public.sales
  FOR SELECT USING (
    customer_profile_id = auth.uid() OR 
    partner_id = auth.uid() OR 
    public.is_admin()
  );

DROP POLICY IF EXISTS "Partners can create sales" ON public.sales;
DROP POLICY IF EXISTS "Partners and admins can create sales" ON public.sales;
CREATE POLICY "Partners and admins can create sales" ON public.sales
  FOR INSERT WITH CHECK (
    public.is_partner() OR public.is_admin()
  );

CREATE POLICY "Only admins can update sales" ON public.sales
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can delete sales" ON public.sales
  FOR DELETE USING (public.is_admin());

-- PURCHASED_NUMBERS table policies
DROP POLICY IF EXISTS "Users can view their purchased numbers" ON public.purchased_numbers;
CREATE POLICY "Users can view their purchased numbers" ON public.purchased_numbers
  FOR SELECT USING (
    public.owns_sale(sale_id) OR public.is_admin()
  );

CREATE POLICY "Only through valid sales can numbers be purchased" ON public.purchased_numbers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sales 
      WHERE id = sale_id AND (
        partner_id = auth.uid() OR 
        public.is_admin()
      )
    )
  );

CREATE POLICY "Only admins can update purchased numbers" ON public.purchased_numbers
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can delete purchased numbers" ON public.purchased_numbers
  FOR DELETE USING (public.is_admin());

-- PARTNER_CLICKS table policies
DROP POLICY IF EXISTS "Partners can view their own clicks" ON public.partner_clicks;
CREATE POLICY "Partners can view their own clicks" ON public.partner_clicks
  FOR SELECT USING (
    partner_id = auth.uid() OR public.is_admin()
  );

DROP POLICY IF EXISTS "Anyone can create clicks" ON public.partner_clicks;
CREATE POLICY "Valid partner clicks only" ON public.partner_clicks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = partner_id AND role = 'partner' AND is_active = true
    )
  );

CREATE POLICY "Only admins can update clicks" ON public.partner_clicks
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can delete clicks" ON public.partner_clicks
  FOR DELETE USING (public.is_admin());

-- WITHDRAWALS table policies
DROP POLICY IF EXISTS "Partners can view their own withdrawals" ON public.withdrawals;
CREATE POLICY "Partners can view their own withdrawals" ON public.withdrawals
  FOR SELECT USING (
    partner_id = auth.uid() OR public.is_admin()
  );

DROP POLICY IF EXISTS "Partners can create withdrawal requests" ON public.withdrawals;
CREATE POLICY "Only active partners can create withdrawals" ON public.withdrawals
  FOR INSERT WITH CHECK (
    partner_id = auth.uid() AND public.is_partner()
  );

CREATE POLICY "Only admins can update withdrawals" ON public.withdrawals
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can delete withdrawals" ON public.withdrawals
  FOR DELETE USING (public.is_admin());

-- RAFFLE_PRIZES table policies
CREATE POLICY "Anyone can view raffle prizes" ON public.raffle_prizes
  FOR SELECT USING (true);

CREATE POLICY "Only admins can create prizes" ON public.raffle_prizes
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update prizes" ON public.raffle_prizes
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can delete prizes" ON public.raffle_prizes
  FOR DELETE USING (public.is_admin());

-- WINNING_NUMBERS table policies
CREATE POLICY "Anyone can view winning numbers" ON public.winning_numbers
  FOR SELECT USING (true);

CREATE POLICY "Only admins can create winning numbers" ON public.winning_numbers
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update winning numbers" ON public.winning_numbers
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can delete winning numbers" ON public.winning_numbers
  FOR DELETE USING (public.is_admin());

-- Phase 2: Add input validation functions
CREATE OR REPLACE FUNCTION public.validate_whatsapp(phone_number TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
IMMUTABLE
AS $$
  SELECT phone_number ~ '^(\+55\s?)?(\([1-9]{2}\)\s?|[1-9]{2}\s?)[6-9][0-9]{7,8}$';
$$;

CREATE OR REPLACE FUNCTION public.validate_email(email_address TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
IMMUTABLE
AS $$
  SELECT email_address ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
$$;

CREATE OR REPLACE FUNCTION public.validate_pix_key(pix_key TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
IMMUTABLE
AS $$
  SELECT 
    -- CPF: 11 digits
    pix_key ~ '^\d{11}$' OR
    -- CNPJ: 14 digits
    pix_key ~ '^\d{14}$' OR
    -- Email format
    public.validate_email(pix_key) OR
    -- Phone format
    public.validate_whatsapp(pix_key) OR
    -- Random key: 32 alphanumeric characters
    pix_key ~ '^[A-Za-z0-9]{32}$';
$$;

-- Phase 3: Add database constraints and triggers (skip constraints if they already exist)
DO $$ 
BEGIN
  BEGIN
    ALTER TABLE public.profiles
    ADD CONSTRAINT valid_email CHECK (public.validate_email(email));
  EXCEPTION 
    WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE public.profiles
    ADD CONSTRAINT valid_whatsapp CHECK (whatsapp IS NULL OR public.validate_whatsapp(whatsapp));
  EXCEPTION 
    WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE public.profiles
    ADD CONSTRAINT valid_pix_key CHECK (pix_key IS NULL OR public.validate_pix_key(pix_key));
  EXCEPTION 
    WHEN duplicate_object THEN NULL;
  END;
END $$;

DO $$ 
BEGIN
  BEGIN
    ALTER TABLE public.sales
    ADD CONSTRAINT valid_customer_email CHECK (customer_email IS NULL OR public.validate_email(customer_email));
  EXCEPTION 
    WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE public.sales
    ADD CONSTRAINT valid_customer_whatsapp CHECK (public.validate_whatsapp(customer_whatsapp));
  EXCEPTION 
    WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE public.sales
    ADD CONSTRAINT positive_quantity CHECK (quantity > 0);
  EXCEPTION 
    WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE public.sales
    ADD CONSTRAINT positive_amounts CHECK (unit_price > 0 AND total_amount > 0);
  EXCEPTION 
    WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE public.sales
    ADD CONSTRAINT valid_commission CHECK (commission_amount >= 0);
  EXCEPTION 
    WHEN duplicate_object THEN NULL;
  END;
END $$;

-- Phase 4: Create audit trigger for profile role changes
CREATE OR REPLACE FUNCTION public.audit_role_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Prevent non-admin users from changing roles
  IF OLD.role != NEW.role AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only administrators can change user roles';
  END IF;
  
  -- Log role changes if audit_log table exists
  IF OLD.role != NEW.role THEN
    BEGIN
      INSERT INTO public.audit_log (
        table_name, 
        record_id, 
        action, 
        old_values, 
        new_values, 
        user_id
      ) VALUES (
        'profiles',
        NEW.id,
        'role_change',
        jsonb_build_object('role', OLD.role),
        jsonb_build_object('role', NEW.role),
        auth.uid()
      );
    EXCEPTION
      WHEN undefined_table THEN NULL; -- Ignore if audit_log doesn't exist yet
    END;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create audit log table
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Drop and recreate audit log policy
DROP POLICY IF EXISTS "Only admins can view audit log" ON public.audit_log;
CREATE POLICY "Only admins can view audit log" ON public.audit_log
  FOR ALL USING (public.is_admin());

-- Add the audit trigger
DROP TRIGGER IF EXISTS audit_profile_role_changes ON public.profiles;
CREATE TRIGGER audit_profile_role_changes
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_role_changes();

-- Phase 5: Add unique constraints to prevent duplicate partner slugs
DO $$ 
BEGIN
  BEGIN
    ALTER TABLE public.profiles
    ADD CONSTRAINT unique_partner_slug UNIQUE (slug);
  EXCEPTION 
    WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE public.profiles
    ADD CONSTRAINT partner_must_have_slug CHECK (
      (role != 'partner') OR (role = 'partner' AND slug IS NOT NULL)
    );
  EXCEPTION 
    WHEN duplicate_object THEN NULL;
  END;
END $$;
