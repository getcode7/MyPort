'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { z } from 'zod';

// ============================================
// TIPAGEM
// ============================================

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  projectType: string;
  industry: string;
  description: string;
  existingWebsite: string;
  mainGoal: string;
  targetAudience: string;
  features: string[];
  otherFeatures: string;
  designStyle: string[];
  designReference: string;
  requiredPages: string[];
  performanceNeeds: string[];
  expectedVisitors: string;
  integrations: string;
  budgetRange: string;
  timeline: string;
  availability: string;
  additionalNotes: string;
}

// ============================================
// ESQUEMA DE VALIDAÇÃO (Zod)
// ============================================

const formSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  projectType: z.string().min(1, 'Tipo de projeto obrigatório'),
  industry: z.string().optional(),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  existingWebsite: z.string().url('URL inválida').optional().or(z.literal('')),
  mainGoal: z.string().optional(),
  targetAudience: z.string().optional(),
  features: z.array(z.string()).default([]),
  otherFeatures: z.string().optional(),
  designStyle: z.array(z.string()).default([]),
  designReference: z.string().optional(),
  requiredPages: z.array(z.string()).default([]),
  performanceNeeds: z.array(z.string()).default([]),
  expectedVisitors: z.string().optional(),
  integrations: z.string().optional(),
  budgetRange: z.string().optional(),
  timeline: z.string().optional(),
  availability: z.string().optional(),
  additionalNotes: z.string().optional(),
});

// ============================================
// CONSTANTES (movidas para um ficheiro separado)
// ============================================

// Nota: Estas constantes foram movidas para src/lib/form-constants.ts
// Para simplificar, mantive-as aqui, mas recomendo movê-las.

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export function QuoteForm({ onSuccess }: { onSuccess?: () => void }) {
  const { t, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [estimatedBudget, setEstimatedBudget] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Estado do formulário
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    projectType: '',
    industry: '',
    description: '',
    existingWebsite: '',
    mainGoal: '',
    targetAudience: '',
    features: [],
    otherFeatures: '',
    designStyle: [],
    designReference: '',
    requiredPages: [],
    performanceNeeds: [],
    expectedVisitors: '',
    integrations: '',
    budgetRange: '',
    timeline: '',
    availability: '',
    additionalNotes: '',
  });

  // ============================================
  // TRADUÇÕES PARA O FORMULÁRIO
  // ============================================

  const texts = {
    pt: {
      title: '📋 Solicitar Orçamento',
      step1: '👤 Dados de contacto',
      step2: '💡 Sobre o projeto',
      step3: '⚙️ Funcionalidades e design',
      step4: '⚡ Performance e integrações',
      step5: '💰 Orçamento e prazo',
      name: 'Nome completo *',
      email: 'Email *',
      phone: 'Telefone',
      company: 'Empresa',
      position: 'Cargo',
      projectType: 'Tipo de projeto *',
      industry: 'Sector',
      description: 'Descrição do projeto *',
      existingWebsite: 'Website existente',
      mainGoal: 'Objetivo principal',
      targetAudience: 'Público-alvo',
      features: 'Funcionalidades pretendidas',
      otherFeatures: 'Outras funcionalidades',
      designStyle: 'Estilo de design',
      designReference: 'Referências de design',
      requiredPages: 'Páginas esperadas (separadas por vírgula)',
      performanceNeeds: 'Requisitos de performance',
      expectedVisitors: 'Tráfego esperado (visitantes/mês)',
      integrations: 'Integrações necessárias',
      budgetRange: 'Orçamento previsto',
      timeline: 'Prazo desejado',
      availability: 'Disponibilidade para reunião',
      additionalNotes: 'Notas adicionais',
      back: 'Voltar',
      next: 'Continuar',
      submit: '📨 Enviar pedido',
      submitting: 'A enviar...',
      successTitle: 'Pedido enviado com sucesso!',
      successMessage: 'Obrigado por partilhar os detalhes do seu projeto.',
      budgetEstimate: 'Estimativa preliminar',
      contactMessage: 'Entrarei em contacto nas próximas 24h para agendarmos uma reunião.',
      newQuote: 'Solicitar novo orçamento',
    },
    en: {
      title: '📋 Request a Quote',
      step1: '👤 Contact details',
      step2: '💡 About the project',
      step3: '⚙️ Features & design',
      step4: '⚡ Performance & integrations',
      step5: '💰 Budget & timeline',
      name: 'Full name *',
      email: 'Email *',
      phone: 'Phone',
      company: 'Company',
      position: 'Position',
      projectType: 'Project type *',
      industry: 'Industry',
      description: 'Project description *',
      existingWebsite: 'Existing website',
      mainGoal: 'Main goal',
      targetAudience: 'Target audience',
      features: 'Desired features',
      otherFeatures: 'Other features',
      designStyle: 'Design style',
      designReference: 'Design references',
      requiredPages: 'Expected pages (comma separated)',
      performanceNeeds: 'Performance requirements',
      expectedVisitors: 'Expected traffic (visitors/month)',
      integrations: 'Required integrations',
      budgetRange: 'Budget range',
      timeline: 'Desired timeline',
      availability: 'Availability for meeting',
      additionalNotes: 'Additional notes',
      back: 'Back',
      next: 'Continue',
      submit: '📨 Submit request',
      submitting: 'Submitting...',
      successTitle: 'Request sent successfully!',
      successMessage: 'Thank you for sharing your project details.',
      budgetEstimate: 'Preliminary estimate',
      contactMessage: 'I will contact you within 24 hours to schedule a meeting.',
      newQuote: 'Request a new quote',
    },
  };

  const currentTexts = texts[language] || texts.pt;

  // ============================================
  // CONSTANTES DO FORMULÁRIO (versão traduzida)
  // ============================================

  const projectTypes = ['Landing Page', 'Site Institucional (5-10 páginas)', 'E-commerce completo', 'Marketplace / Plataforma multi-vendedor', 'Aplicação Web (SaaS / Dashboard)', 'Mobile App (iOS/Android)', 'API / Backend service', 'Ferramenta interna / ERP', 'Redesign de site existente', 'Outro'];

  const industries = ['Tecnologia / Software', 'Saúde / Clínica', 'Educação / Ensino', 'E-commerce / Retalho', 'Finanças / Seguros', 'Imobiliário', 'Turismo / Hotelaria', 'Logística / Transportes', 'Artes / Entretenimento', 'Outro'];

  const featuresList = ['Autenticação de utilizadores (login/registo)', 'Painel administrativo completo', 'Gestão de conteúdos (CMS)', 'Sistema de pagamentos (Stripe/PayPal/MB Way)', 'Notificações por email (transacionais)', 'Notificações push (mobile/web)', 'Integração com redes sociais (login social)', 'Chat / Suporte em tempo real', 'Dashboard com gráficos e analytics', 'Exportação de relatórios (PDF/Excel)', 'Integração com API externa (descrever)', 'SEO avançado (meta tags, sitemap, schema)', 'Multilinguagem (i18n)', 'Modo escuro', 'Sistema de reservas / agendamentos', 'Blog / artigos', 'Pesquisa avançada com filtros', 'Outros (descrever abaixo)'];

  const designPreferences = ['Moderno / Minimalista', 'Colorido / Vibrante', 'Sóbrio / Corporativo', 'Escuro (dark mode)', 'Com animações / micro-interações', 'Acessível (WCAG)', 'Mobile-first', 'Baseado num design existente (forneço referências)'];

  const performanceRequirements = ['Tempo de carregamento inferior a 2 segundos', 'Otimização para SEO (Core Web Vitals)', 'Suporte a alto tráfego (milhares de utilizadores)', 'Necessidade de CDN', 'Caching avançado'];

  const budgetRanges = ['< 2.000€', '2.000€ - 5.000€', '5.000€ - 10.000€', '10.000€ - 20.000€', '> 20.000€', 'A definir / Preciso de orientação'];

  const timelineOptions = ['Extremamente urgente (< 2 semanas)', 'Curto prazo (2-4 semanas)', 'Normal (1-2 meses)', 'Confortável (2-3 meses)', 'Longo prazo (3-6 meses)', 'Sem pressa (6+ meses)'];

  const availabilityOptions = ['Disponível para reunião imediata', 'Disponível para reunião esta semana', 'Disponível apenas por email (próximos dias)', 'Só contactar após análise da proposta'];

  // ============================================
  // FUNÇÕES
  // ============================================

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando for editado
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const toggleArrayField = (field: keyof FormData, value: string) => {
    const current = formData[field] as string[];
    if (current.includes(value)) {
      updateField(field, current.filter((v) => v !== value));
    } else {
      updateField(field, [...current, value]);
    }
  };

  const validateStep = (step: number) => {
    const fields = {
      1: ['name', 'email'],
      2: ['projectType', 'description'],
    };

    const requiredFields = fields[step as keyof typeof fields] || [];
    const newErrors: Record<string, string> = {};

    for (const field of requiredFields) {
      const value = formData[field as keyof FormData];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        newErrors[field] = 'Campo obrigatório';
      }
    }

    // Validar email no passo 1
    if (step === 1 && formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  // Bloqueio da tecla Enter fora do passo 5
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && step !== 5) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step]);

  const handleSubmit = async () => {
    if (step !== 5) {
      console.warn(`Tentativa de submissão bloqueada (passo ${step})`);
      return;
    }

    // Validar passo 5
    if (!validateStep(5)) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const payload = {
        ...formData,
        submittedAt: new Date().toISOString(),
        features: formData.features,
        designStyle: formData.designStyle.join(', '),
        performanceNeeds: formData.performanceNeeds.join(', '),
        requiredPages: formData.requiredPages.join(', '),
      };

      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Erro ${response.status}: Falha ao enviar formulário`);

      const data = await response.json().catch(() => ({}));
      setEstimatedBudget(data?.estimatedBudget || data?.budget || null);
      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrors({ submit: err?.message || 'Ocorreu um erro ao enviar o pedido.' });
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // RENDER
  // ============================================

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8 text-center border border-green-200 dark:border-green-800"
      >
        <div className="text-6xl mb-4">📬</div>
        <h3 className="text-2xl font-black text-green-700 dark:text-green-300">
          {currentTexts.successTitle}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mt-3">{currentTexts.successMessage}</p>
        {estimatedBudget && (
          <p className="mt-3 text-lg">
            {currentTexts.budgetEstimate}: <strong className="text-blue-600 dark:text-blue-400">{estimatedBudget}</strong>
          </p>
        )}
        <p className="text-sm text-gray-500 mt-4">{currentTexts.contactMessage}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-bold hover:scale-105 transition"
        >
          {currentTexts.newQuote}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 p-8 rounded-2xl max-h-[80vh] overflow-y-auto">
      {/* Progresso */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}
            >
              {s}
            </div>
            <span className="text-xs mt-1 text-gray-500 hidden sm:block">
              {s === 1 && currentTexts.step1}
              {s === 2 && currentTexts.step2}
              {s === 3 && currentTexts.step3}
              {s === 4 && currentTexts.step4}
              {s === 5 && currentTexts.step5}
            </span>
          </div>
        ))}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-5">
          <h3 className="text-2xl font-black">{currentTexts.step1}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-bold mb-1" aria-required="true">
                {currentTexts.name}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className={`w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm ${
                  errors.name ? 'border-red-500' : ''
                }`}
                required
                aria-describedby="name-error"
              />
              {errors.name && <p id="name-error" className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block font-bold mb-1" aria-required="true">
                {currentTexts.email}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className={`w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm ${
                  errors.email ? 'border-red-500' : ''
                }`}
                required
                aria-describedby="email-error"
              />
              {errors.email && <p id="email-error" className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block font-bold mb-1">{currentTexts.phone}</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">{currentTexts.company}</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => updateField('company', e.target.value)}
                className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">{currentTexts.position}</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => updateField('position', e.target.value)}
                className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-5">
          <h3 className="text-2xl font-black">{currentTexts.step2}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-bold mb-1" aria-required="true">
                {currentTexts.projectType}
              </label>
              <select
                value={formData.projectType}
                onChange={(e) => updateField('projectType', e.target.value)}
                className={`w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm [&>option]:bg-white/80 dark:[&>option]:bg-gray-800/80 ${
                  errors.projectType ? 'border-red-500' : ''
                }`}
                required
              >
                <option value="">Seleccione...</option>
                {projectTypes.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
              {errors.projectType && <p className="text-red-500 text-sm mt-1">{errors.projectType}</p>}
            </div>
            <div>
              <label className="block font-bold mb-1">{currentTexts.industry}</label>
              <select
                value={formData.industry}
                onChange={(e) => updateField('industry', e.target.value)}
                className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm [&>option]:bg-white/80 dark:[&>option]:bg-gray-800/80"
              >
                <option value="">Seleccione...</option>
                {industries.map((i) => (
                  <option key={i}>{i}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block font-bold mb-1" aria-required="true">
              {currentTexts.description}
            </label>
            <textarea
              rows={5}
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              className={`w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm ${
                errors.description ? 'border-red-500' : ''
              }`}
              placeholder="Descreva o objectivo..."
              required
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          <div>
            <label className="block font-bold mb-1">{currentTexts.existingWebsite}</label>
            <input
              type="url"
              value={formData.existingWebsite}
              onChange={(e) => updateField('existingWebsite', e.target.value)}
              className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm"
            />
          </div>
          <div>
            <label className="block font-bold mb-1">{currentTexts.mainGoal}</label>
            <textarea
              rows={3}
              value={formData.mainGoal}
              onChange={(e) => updateField('mainGoal', e.target.value)}
              className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm"
            />
          </div>
          <div>
            <label className="block font-bold mb-1">{currentTexts.targetAudience}</label>
            <input
              type="text"
              value={formData.targetAudience}
              onChange={(e) => updateField('targetAudience', e.target.value)}
              className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm"
            />
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-black">{currentTexts.step3}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2">
            {featuresList.map((feat) => (
              <label key={feat} className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.features.includes(feat)}
                  onChange={() => toggleArrayField('features', feat)}
                  className="mt-1"
                />
                <span>{feat}</span>
              </label>
            ))}
          </div>
          <div>
            <label className="block font-bold mb-1">{currentTexts.otherFeatures}</label>
            <textarea
              rows={3}
              value={formData.otherFeatures}
              onChange={(e) => updateField('otherFeatures', e.target.value)}
              className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm"
            />
          </div>
          <h3 className="text-2xl font-black mt-6">🎨 Design</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {designPreferences.map((d) => (
              <label key={d} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.designStyle.includes(d)}
                  onChange={() => toggleArrayField('designStyle', d)}
                />
                {d}
              </label>
            ))}
          </div>
          <div>
            <label className="block font-bold mb-1">{currentTexts.designReference}</label>
            <input
              type="text"
              value={formData.designReference}
              onChange={(e) => updateField('designReference', e.target.value)}
              className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm"
            />
          </div>
          <div>
            <label className="block font-bold mb-1">{currentTexts.requiredPages}</label>
            <input
              type="text"
              value={formData.requiredPages.join(', ')}
              onChange={(e) => updateField('requiredPages', e.target.value.split(',').map((s) => s.trim()))}
              className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm"
              placeholder="Página inicial, Sobre, Serviços, Contactos"
            />
          </div>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-black">{currentTexts.step4}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {performanceRequirements.map((pr) => (
              <label key={pr} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.performanceNeeds.includes(pr)}
                  onChange={() => toggleArrayField('performanceNeeds', pr)}
                />
                {pr}
              </label>
            ))}
          </div>
          <div>
            <label className="block font-bold mb-1">{currentTexts.expectedVisitors}</label>
            <select
              value={formData.expectedVisitors}
              onChange={(e) => updateField('expectedVisitors', e.target.value)}
              className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm [&>option]:bg-white/80 dark:[&>option]:bg-gray-800/80"
            >
              <option value="">Seleccione...</option>
              <option>Menos de 1.000</option>
              <option>1.000 - 10.000</option>
              <option>10.000 - 50.000</option>
              <option>50.000 - 200.000</option>
              <option>+200.000</option>
            </select>
          </div>
          <div>
            <label className="block font-bold mb-1">{currentTexts.integrations}</label>
            <textarea
              rows={3}
              value={formData.integrations}
              onChange={(e) => updateField('integrations', e.target.value)}
              className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm"
            />
          </div>
        </div>
      )}

      {/* STEP 5 */}
      {step === 5 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-black">{currentTexts.step5}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-bold mb-1">{currentTexts.budgetRange}</label>
              <select
                value={formData.budgetRange}
                onChange={(e) => updateField('budgetRange', e.target.value)}
                className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm [&>option]:bg-white/80 dark:[&>option]:bg-gray-800/80"
              >
                <option value="">Seleccione...</option>
                {budgetRanges.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">{currentTexts.timeline}</label>
              <select
                value={formData.timeline}
                onChange={(e) => updateField('timeline', e.target.value)}
                className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm [&>option]:bg-white/80 dark:[&>option]:bg-gray-800/80"
              >
                <option value="">Seleccione...</option>
                {timelineOptions.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block font-bold mb-1">{currentTexts.availability}</label>
            <select
              value={formData.availability}
              onChange={(e) => updateField('availability', e.target.value)}
              className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm [&>option]:bg-white/80 dark:[&>option]:bg-gray-800/80"
            >
              <option value="">Seleccione...</option>
              {availabilityOptions.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-bold mb-1">{currentTexts.additionalNotes}</label>
            <textarea
              rows={4}
              value={formData.additionalNotes}
              onChange={(e) => updateField('additionalNotes', e.target.value)}
              className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm"
            />
          </div>
        </div>
      )}

      {/* Erros gerais */}
      {errors.submit && (
        <div className="text-red-500 text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">{errors.submit}</div>
      )}

      {/* Navegação */}
      <div className="flex justify-between pt-4">
        {step > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 font-bold hover:bg-gray-300 transition"
          >
            {currentTexts.back}
          </button>
        )}
        {step < 5 ? (
          <button
            type="button"
            onClick={nextStep}
            className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition ml-auto"
          >
            {currentTexts.next}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:scale-105 transition disabled:opacity-50 ml-auto"
          >
            {loading ? currentTexts.submitting : currentTexts.submit}
          </button>
        )}
      </div>
    </div>
  );
}