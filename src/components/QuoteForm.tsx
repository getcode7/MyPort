'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ============================================
// CONSTANTES (mantidas exatamente iguais)
// ============================================
const projectTypes = [
  'Landing Page',
  'Site Institucional (5-10 páginas)',
  'E-commerce completo',
  'Marketplace / Plataforma multi-vendedor',
  'Aplicação Web (SaaS / Dashboard)',
  'Mobile App (iOS/Android)',
  'API / Backend service',
  'Ferramenta interna / ERP',
  'Redesign de site existente',
  'Outro'
];

const industries = [
  'Tecnologia / Software',
  'Saúde / Clínica',
  'Educação / Ensino',
  'E-commerce / Retalho',
  'Finanças / Seguros',
  'Imobiliário',
  'Turismo / Hotelaria',
  'Logística / Transportes',
  'Artes / Entretenimento',
  'Outro'
];

const featuresList = [
  'Autenticação de utilizadores (login/registo)',
  'Painel administrativo completo',
  'Gestão de conteúdos (CMS)',
  'Sistema de pagamentos (Stripe/PayPal/MB Way)',
  'Notificações por email (transacionais)',
  'Notificações push (mobile/web)',
  'Integração com redes sociais (login social)',
  'Chat / Suporte em tempo real',
  'Dashboard com gráficos e analytics',
  'Exportação de relatórios (PDF/Excel)',
  'Integração com API externa (descrever)',
  'SEO avançado (meta tags, sitemap, schema)',
  'Multilinguagem (i18n)',
  'Modo escuro',
  'Sistema de reservas / agendamentos',
  'Blog / artigos',
  'Pesquisa avançada com filtros',
  'Outros (descrever abaixo)'
];

const designPreferences = [
  'Moderno / Minimalista',
  'Colorido / Vibrante',
  'Sóbrio / Corporativo',
  'Escuro (dark mode)',
  'Com animações / micro-interações',
  'Acessível (WCAG)',
  'Mobile-first',
  'Baseado num design existente (forneço referências)'
];

const performanceRequirements = [
  'Tempo de carregamento inferior a 2 segundos',
  'Otimização para SEO (Core Web Vitals)',
  'Suporte a alto tráfego (milhares de utilizadores)',
  'Necessidade de CDN',
  'Caching avançado'
];

const budgetRanges = [
  '< 2.000€',
  '2.000€ - 5.000€',
  '5.000€ - 10.000€',
  '10.000€ - 20.000€',
  '> 20.000€',
  'A definir / Preciso de orientação'
];

const timelineOptions = [
  'Extremamente urgente (< 2 semanas)',
  'Curto prazo (2-4 semanas)',
  'Normal (1-2 meses)',
  'Confortável (2-3 meses)',
  'Longo prazo (3-6 meses)',
  'Sem pressa (6+ meses)'
];

const availabilityOptions = [
  'Disponível para reunião imediata',
  'Disponível para reunião esta semana',
  'Disponível apenas por email (próximos dias)',
  'Só contactar após análise da proposta'
];

interface QuoteFormProps {
  onSuccess?: () => void;
}

export function QuoteForm({ onSuccess }: QuoteFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [estimatedBudget, setEstimatedBudget] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
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
    features: [] as string[],
    otherFeatures: '',
    designStyle: [] as string[],
    designReference: '',
    requiredPages: [] as string[],
    performanceNeeds: [] as string[],
    expectedVisitors: '',
    integrations: '',
    budgetRange: '',
    timeline: '',
    availability: '',
    additionalNotes: ''
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field: keyof typeof formData, value: string) => {
    const current = formData[field] as string[];
    if (current.includes(value)) {
      updateField(field, current.filter(v => v !== value));
    } else {
      updateField(field, [...current, value]);
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // 🔥 Bloqueio global da tecla Enter fora do passo 5
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
    // 🔥 Garantia máxima: só envia se estiver no passo 5
    if (step !== 5) {
      console.warn(`Tentativa de submissão bloqueada (passo ${step})`);
      return;
    }

    setLoading(true);
    setError('');

    if (!formData.name || !formData.email || !formData.projectType || !formData.description) {
      setError('Por favor, preencha nome, email, tipo de projeto e descrição.');
      setLoading(false);
      return;
    }

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

      let data: any = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      setEstimatedBudget(data?.estimatedBudget || data?.budget || null);
      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Ocorreu um erro ao enviar o pedido.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8 text-center border border-green-200 dark:border-green-800"
      >
        <div className="text-6xl mb-4">📬</div>
        <h3 className="text-2xl font-black text-green-700 dark:text-green-300">Pedido enviado com sucesso!</h3>
        <p className="text-gray-700 dark:text-gray-300 mt-3">Obrigado por partilhar os detalhes do seu projecto.</p>
        {estimatedBudget && (
          <p className="mt-3 text-lg">
            Estimativa preliminar: <strong className="text-blue-600 dark:text-blue-400">{estimatedBudget}</strong>
          </p>
        )}
        <p className="text-sm text-gray-500 mt-4">Entrarei em contacto nas próximas 24h para agendarmos uma reunião de apresentação.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-bold hover:scale-105 transition"
        >
          Solicitar novo orçamento
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 p-8 rounded-2xl max-h-[80vh] overflow-y-auto">
      {/* Indicador de progresso */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
              {s}
            </div>
            <span className="text-xs mt-1 text-gray-500 hidden sm:block">
              {s === 1 && 'Dados'}
              {s === 2 && 'Projecto'}
              {s === 3 && 'Funcionalidades'}
              {s === 4 && 'Técnico'}
              {s === 5 && 'Orçamento'}
            </span>
          </div>
        ))}
      </div>

      {/* STEP 1 – Dados */}
      {step === 1 && (
        <div className="space-y-5">
          <h3 className="text-2xl font-black">👤 Dados de contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className="block font-bold mb-1">Nome completo *</label><input type="text" value={formData.name} onChange={(e) => updateField('name', e.target.value)} className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm" required /></div>
            <div><label className="block font-bold mb-1">Email *</label><input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm" required /></div>
            <div><label className="block font-bold mb-1">Telefone</label><input type="tel" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm" /></div>
            <div><label className="block font-bold mb-1">Empresa</label><input type="text" value={formData.company} onChange={(e) => updateField('company', e.target.value)} className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm" /></div>
            <div><label className="block font-bold mb-1">Cargo</label><input type="text" value={formData.position} onChange={(e) => updateField('position', e.target.value)} className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm" /></div>
          </div>
        </div>
      )}

      {/* STEP 2 – Projeto */}
      {step === 2 && (
        <div className="space-y-5">
          <h3 className="text-2xl font-black">💡 Sobre o projecto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-bold mb-1">Tipo de projeto *</label>
              <select value={formData.projectType} onChange={(e) => updateField('projectType', e.target.value)} className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm [&>option]:bg-white/80 dark:[&>option]:bg-gray-800/80" required>
                <option value="">Seleccione...</option>
                {projectTypes.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">Sector</label>
              <select value={formData.industry} onChange={(e) => updateField('industry', e.target.value)} className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm [&>option]:bg-white/80 dark:[&>option]:bg-gray-800/80">
                <option value="">Seleccione...</option>
                {industries.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
          </div>
          <div><label className="block font-bold mb-1">Descrição *</label><textarea rows={5} value={formData.description} onChange={(e) => updateField('description', e.target.value)} className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm" placeholder="Descreva o objectivo..." required /></div>
          <div><label className="block font-bold mb-1">Website existente</label><input type="url" value={formData.existingWebsite} onChange={(e) => updateField('existingWebsite', e.target.value)} className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm" /></div>
          <div><label className="block font-bold mb-1">Objectivo principal</label><textarea rows={3} value={formData.mainGoal} onChange={(e) => updateField('mainGoal', e.target.value)} className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm" /></div>
          <div><label className="block font-bold mb-1">Público-alvo</label><input type="text" value={formData.targetAudience} onChange={(e) => updateField('targetAudience', e.target.value)} className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm" /></div>
        </div>
      )}

      {/* STEP 3 – Funcionalidades e design */}
      {step === 3 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-black">⚙️ Funcionalidades</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2">
            {featuresList.map(feat => (
              <label key={feat} className="flex items-start gap-2 text-sm">
                <input type="checkbox" checked={formData.features.includes(feat)} onChange={() => toggleArrayField('features', feat)} className="mt-1" />
                <span>{feat}</span>
              </label>
            ))}
          </div>
          <div><label className="block font-bold mb-1">Outras funcionalidades</label><textarea rows={3} value={formData.otherFeatures} onChange={(e) => updateField('otherFeatures', e.target.value)} className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm" /></div>
          <h3 className="text-2xl font-black mt-6">🎨 Design</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {designPreferences.map(d => (
              <label key={d} className="flex items-center gap-2"><input type="checkbox" checked={formData.designStyle.includes(d)} onChange={() => toggleArrayField('designStyle', d)} />{d}</label>
            ))}
          </div>
          <div><label className="block font-bold mb-1">Referências</label><input type="text" value={formData.designReference} onChange={(e) => updateField('designReference', e.target.value)} className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm" /></div>
          <div><label className="block font-bold mb-1">Páginas esperadas</label><input type="text" value={formData.requiredPages} onChange={(e) => updateField('requiredPages', e.target.value.split(',').map(s => s.trim()))} className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm" /></div>
        </div>
      )}

      {/* STEP 4 – Performance */}
      {step === 4 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-black">⚡ Performance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {performanceRequirements.map(pr => (
              <label key={pr} className="flex items-center gap-2"><input type="checkbox" checked={formData.performanceNeeds.includes(pr)} onChange={() => toggleArrayField('performanceNeeds', pr)} />{pr}</label>
            ))}
          </div>
          <div>
            <label className="block font-bold mb-1">Tráfego esperado</label>
            <select value={formData.expectedVisitors} onChange={(e) => updateField('expectedVisitors', e.target.value)} className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm [&>option]:bg-white/80 dark:[&>option]:bg-gray-800/80">
              <option value="">Seleccione...</option>
              <option>Menos de 1.000</option><option>1.000 - 10.000</option><option>10.000 - 50.000</option><option>50.000 - 200.000</option><option>+200.000</option>
            </select>
          </div>
          <div><label className="block font-bold mb-1">Integrações</label><textarea rows={3} value={formData.integrations} onChange={(e) => updateField('integrations', e.target.value)} className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm" /></div>
        </div>
      )}

      {/* STEP 5 – Orçamento */}
      {step === 5 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-black">💰 Orçamento e prazo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-bold mb-1">Orçamento previsto</label>
              <select value={formData.budgetRange} onChange={(e) => updateField('budgetRange', e.target.value)} className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm [&>option]:bg-white/80 dark:[&>option]:bg-gray-800/80">
                <option value="">Seleccione...</option>
                {budgetRanges.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">Prazo desejado</label>
              <select value={formData.timeline} onChange={(e) => updateField('timeline', e.target.value)} className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm [&>option]:bg-white/80 dark:[&>option]:bg-gray-800/80">
                <option value="">Seleccione...</option>
                {timelineOptions.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block font-bold mb-1">Disponibilidade</label>
            <select value={formData.availability} onChange={(e) => updateField('availability', e.target.value)} className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm [&>option]:bg-white/80 dark:[&>option]:bg-gray-800/80">
              <option value="">Seleccione...</option>
              {availabilityOptions.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div><label className="block font-bold mb-1">Notas adicionais</label><textarea rows={4} value={formData.additionalNotes} onChange={(e) => updateField('additionalNotes', e.target.value)} className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm" /></div>
        </div>
      )}

      {error && <div className="text-red-500 text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">{error}</div>}

      <div className="flex justify-between pt-4">
        {step > 1 && (
          <button type="button" onClick={prevStep} className="px-6 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 font-bold hover:bg-gray-300 transition">
            Voltar
          </button>
        )}
        {step < 5 ? (
          <button type="button" onClick={nextStep} className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition ml-auto">
            Continuar
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:scale-105 transition disabled:opacity-50 ml-auto"
          >
            {loading ? 'A enviar...' : '📨 Enviar pedido'}
          </button>
        )}
      </div>
    </div>
  );
}