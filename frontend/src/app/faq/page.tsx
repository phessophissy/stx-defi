'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { ChevronDown, HelpCircle } from 'lucide-react';
import clsx from 'clsx';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What is STX DeFi Protocol?',
    answer:
      'STX DeFi Protocol is a decentralized lending and yield generation platform built on the Stacks blockchain. It allows users to deposit STX as collateral to borrow against, or deposit into a yield vault to earn passive income.',
  },
  {
    question: 'How does the lending pool work?',
    answer:
      'The Core Pool allows you to deposit STX as collateral. You can then borrow up to 66% of your collateral value (150% collateralization ratio). Borrowers pay 5% APY interest on their loans, which is distributed to depositors.',
  },
  {
    question: 'What is the collateralization ratio?',
    answer:
      'The protocol requires a 150% collateralization ratio. This means for every 1 STX you want to borrow, you need to deposit at least 1.5 STX as collateral. This protects lenders from default risk.',
  },
  {
    question: 'What happens if my position gets liquidated?',
    answer:
      'If your health factor drops below 1.2 (120% collateralization), your position becomes liquidatable. Liquidators can repay your debt and receive your collateral plus a 0.5% bonus. To avoid liquidation, maintain a healthy collateralization ratio by repaying debt or adding more collateral.',
  },
  {
    question: 'How does the Yield Vault work?',
    answer:
      'The Yield Vault is a simple way to earn 8% APY on your STX. When you deposit, you receive vault shares proportional to your deposit. As yield accrues, the share price increases, meaning your shares are worth more STX when you withdraw.',
  },
  {
    question: 'What is the difference between the Lending Pool and Yield Vault?',
    answer:
      'The Lending Pool lets you deposit collateral and borrow against it, earning 5% APY on deposits. The Yield Vault is purely for earning yield at 8% APY without any borrowing functionality. Choose based on whether you need liquidity or just want to earn.',
  },
  {
    question: 'How do I connect my wallet?',
    answer:
      'Click the "Connect Wallet" button in the header. The protocol supports Hiro Wallet (formerly Stacks Wallet). If you don\'t have a wallet, you can download one from the Hiro website.',
  },
  {
    question: 'Are there any fees?',
    answer:
      'The protocol charges a 5% annual interest rate on borrows. There are no deposit or withdrawal fees for the lending pool or yield vault, though standard Stacks network transaction fees apply.',
  },
  {
    question: 'Is the protocol audited?',
    answer:
      'The smart contracts are open source and available for review. We recommend users do their own research and only deposit what they can afford to lose. DeFi protocols carry inherent risks.',
  },
  {
    question: 'What is a health factor?',
    answer:
      'Health factor represents the safety of your position. It\'s calculated as (collateral value × liquidation threshold) / borrowed amount. A health factor above 1.5 is considered safe. Below 1.2 means your position can be liquidated.',
  },
];

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[var(--border)] last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left hover:text-[var(--primary)] transition-colors"
      >
        <span className="font-medium pr-4">{item.question}</span>
        <ChevronDown
          className={clsx(
            'w-5 h-5 flex-shrink-0 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        className={clsx(
          'overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-96 pb-4' : 'max-h-0'
        )}
      >
        <p className="text-[var(--muted-foreground)]">{item.answer}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-3 mb-4">
          <HelpCircle className="w-8 h-8 text-[var(--primary)]" />
          Frequently Asked Questions
        </h1>
        <p className="text-[var(--muted-foreground)]">
          Find answers to common questions about STX DeFi Protocol
        </p>
      </div>

      {/* FAQ List */}
      <Card>
        <CardContent className="pt-6">
          {faqs.map((faq, index) => (
            <FAQAccordion
              key={index}
              item={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </CardContent>
      </Card>

      {/* Contact Section */}
      <Card className="mt-8">
        <CardContent className="pt-6 text-center">
          <h3 className="font-semibold mb-2">Still have questions?</h3>
          <p className="text-[var(--muted-foreground)] mb-4">
            Join our community for support and updates.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://discord.gg/stacks"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[var(--secondary)] rounded-lg hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-colors"
            >
              Discord
            </a>
            <a
              href="https://twitter.com/stikisDeFi"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[var(--secondary)] rounded-lg hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-colors"
            >
              Twitter
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
