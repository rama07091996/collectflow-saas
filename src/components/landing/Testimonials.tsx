import React from 'react';
import { Card } from '@/components/ui/Card';
import { Star, CheckCircle } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Julian Hayes',
    role: 'Founder & CEO, Catalyst Digital (42 Person Agency)',
    text: 'We had $110k in unpaid 45+ day invoices floating around. CollectFlow recovered 85% of it within 3 weeks without a single client feeling offended. It paid for itself in day one.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    recovery: '$94,000 Recovered',
  },
  {
    name: 'Melissa Thorne',
    role: 'Head of Operations, Apex Design Studio',
    text: 'The 1-click payment link inside the automated cadence emails completely eliminated the "can you resend the W9 and payment link" back-and-forth.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    recovery: 'DSO Reduced by 16 Days',
  },
  {
    name: 'David Chen',
    role: 'Managing Partner, Stratos Consulting',
    text: 'The Stripe + QuickBooks real-time sync is flawless. The moment a client pays via wire or card, the cadence halts instantly. Zero accidental reminder emails.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    recovery: '12 hrs/mo Saved',
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight">
            Trusted by 400+ Fast-Growing US Agencies
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            See how founders and finance teams accelerate receivables with CollectFlow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((r, idx) => (
            <Card key={idx} className="p-6 bg-slate-50 border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed mb-6">"{r.text}"</p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{r.name}</div>
                    <div className="text-[10px] text-slate-500">{r.role}</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {r.recovery}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
