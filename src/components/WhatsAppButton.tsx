'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface WhatsAppButtonProps {
  label?: string;
  phone?: string;
  message?: string;
  variant?: 'primary' | 'outline' | 'icon' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const WhatsAppButton = memo(function WhatsAppButton({
  label,
  phone,
  message,
  variant = 'icon',
  size = 'md',
  className = '',
}: WhatsAppButtonProps) {
  const { t, language } = useLanguage();

  const phoneNumber = phone || process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '+351912345678';

  const defaultMessage =
    language === 'pt'
      ? 'Olá! Vim pelo seu portfólio e gostaria de saber mais sobre os seus serviços.'
      : 'Hello! I came across your portfolio and would like to know more about your services.';

  const finalMessage = message || defaultMessage;
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\s/g, '')}?text=${encodeURIComponent(finalMessage)}`;

  // Classes base
  const baseClasses =
    'inline-flex items-center justify-center gap-2 font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl';

  // Variantes
  const variantClasses = {
    primary:
      'bg-green-500 text-white hover:bg-green-600 border-0',
    outline:
      'bg-transparent text-green-600 border-2 border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20',
    icon:
      'bg-green-500 text-white hover:bg-green-600 border-0 w-12 h-12 p-0', // Sem padding, tamanho fixo
    gradient:
      'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 border-0',
  };

  // Tamanhos (apenas para variantes com texto)
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  // Para a variante 'icon', ignoramos os sizeClasses e usamos w-12 h-12
  const isIcon = variant === 'icon';
  const combinedClassName = `${baseClasses} ${variantClasses[variant]} ${isIcon ? '' : sizeClasses[size]} ${className}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={combinedClassName}
      whileHover={{ scale: isIcon ? 1.1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      aria-label="WhatsApp"
    >
      <MessageCircle className={isIcon ? 'w-6 h-6' : 'w-5 h-5'} />
      {!isIcon && (label || t.common.whatsapp)}
    </motion.a>
  );
});