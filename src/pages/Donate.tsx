import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  CreditCard,
  ShieldCheck,
  Globe,
  Smartphone,
  Users,
  CheckCircle2,
  ArrowRight,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";

const DONATION_AMOUNTS = [1000, 5000, 10000, 50000];

const BANK_DETAILS = {
  accountName: "Adam",
  accountNumber: "9026645775",
  bankName: "PalmPay",
};

export function DonatePage() {
  const [frequency, setFrequency] = useState<"monthly" | "once">("monthly");
  const [selectedAmount, setSelectedAmount] = useState<number>(5000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value === customAmount) return;
    setCustomAmount(value);
    if (value) {
      setSelectedAmount(0);
    }
  };

  const handleDonate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowBankDetails(true);
    }, 1000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const currentAmount = customAmount ? parseInt(customAmount) : selectedAmount;

  return (
    <>
      <SEO
        title='Donate to Minaret'
        description='Support Minaret and earn Sadaqah Jariyah. Your donation helps broadcast Islamic knowledge to the world and maintain this platform for the Ummah.'
        url={window.location.href}
      />

      <div className='min-h-screen bg-background relative overflow-hidden'>
        <div className='absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none' />
        <div className='absolute top-20 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none' />

        <div className='container max-w-6xl mx-auto px-4 py-12 relative z-10'>
          <div className='grid lg:grid-cols-2 gap-12 items-start'>
            {/* Left Column: Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className='space-y-8'>
              <div className='space-y-4'>
                <h1 className='text-4xl md:text-5xl font-bold tracking-tight'>
                  Empower the Ummah with{" "}
                  <span className='text-primary'>Knowledge</span>
                </h1>
                <p className='text-xl text-muted-foreground leading-relaxed'>
                  Your support helps us maintain free access to thousands of
                  hours of Islamic audio content for millions of Muslims
                  worldwide.
                </p>
              </div>

              <div className='grid sm:grid-cols-2 gap-4'>
                <FeatureItem
                  icon={<Smartphone className='w-5 h-5 text-primary' />}
                  title='Technology'
                  description='Server costs, app development, and maintenance.'
                />
                <FeatureItem
                  icon={<Users className='w-5 h-5 text-primary' />}
                  title='Growth'
                  description='Reaching new audiences and translating content.'
                />
                <FeatureItem
                  icon={<Globe className='w-5 h-5 text-primary' />}
                  title='Content'
                  description='Recording, editing, and curating high-quality lectures.'
                />
                <FeatureItem
                  icon={<ShieldCheck className='w-5 h-5 text-primary' />}
                  title='Secure'
                  description='All transactions are encrypted and 100% secure.'
                />
              </div>

              <div className='p-6 bg-card/50 backdrop-blur-sm border rounded-2xl space-y-4'>
                <div className='flex items-start gap-4'>
                  <div className='p-3 bg-primary/10 rounded-full'>
                    <Heart className='w-6 h-6 text-primary filled-icon' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-lg'>Why Monthly?</h3>
                    <p className='text-muted-foreground'>
                      Recurring donations provide us with stability, allowing us
                      to plan long-term projects and ensure consistent service
                      availability.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Donation Widget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}>
              <Card className='p-6 md:p-8 backdrop-blur-md bg-card/80 border-primary/20 shadow-2xl relative overflow-hidden'>
                <div className='absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none' />

                <div className='space-y-8 relative z-10'>
                  <div className='text-center space-y-2'>
                    <h2 className='text-2xl font-bold'>Make a Contribution</h2>
                    <p className='text-sm text-muted-foreground'>
                      Choose your donation frequency
                    </p>
                  </div>

                  {/* Frequency Toggle */}
                  <div className='flex p-1 bg-muted/50 rounded-xl relative'>
                    <div
                      className={cn(
                        "absolute top-1 bottom-1 w-[calc(50%-4px)] bg-background shadow-sm rounded-lg transition-all duration-300 ease-spring",
                        frequency === "once" ? "left-[calc(50%+2px)]" : "left-1"
                      )}
                    />
                    <button
                      onClick={() => setFrequency("monthly")}
                      className={cn(
                        "flex-1 py-3 text-sm font-medium z-10 transition-colors relative flex items-center justify-center gap-2",
                        frequency === "monthly"
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}>
                      <CheckCircle2
                        className={cn(
                          "w-4 h-4",
                          frequency === "monthly" ? "opacity-100" : "opacity-0"
                        )}
                      />
                      Monthly
                    </button>
                    <button
                      onClick={() => setFrequency("once")}
                      className={cn(
                        "flex-1 py-3 text-sm font-medium z-10 transition-colors relative flex items-center justify-center gap-2",
                        frequency === "once"
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}>
                      <CheckCircle2
                        className={cn(
                          "w-4 h-4",
                          frequency === "once" ? "opacity-100" : "opacity-0"
                        )}
                      />
                      One-time
                    </button>
                  </div>

                  {/* Amounts Grid */}
                  <div className='grid grid-cols-2 gap-3'>
                    {DONATION_AMOUNTS.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount("");
                        }}
                        className={cn(
                          "py-2 px-4 rounded-xl border-2 transition-all duration-200 font-semibold text-lg relative overflow-hidden group",
                          selectedAmount === amount && !customAmount
                            ? "border-primary bg-primary/5 text-primary shadow-[0_0_0_2px_rgba(16,185,129,0.2)]"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        )}>
                        ₦{amount.toLocaleString()}
                        {selectedAmount === amount && !customAmount && (
                          <motion.div
                            layoutId='active-check'
                            className='absolute top-2 right-2 text-primary'>
                            <CheckCircle2 className='w-4 h-4' />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <div className='relative group'>
                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                      <span className='text-gray-500 font-semibold'>₦</span>
                    </div>
                    <input
                      type='text'
                      placeholder='Enter custom amount'
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      className={cn(
                        "w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-background focus:outline-none focus:ring-0 transition-all font-semibold",
                        customAmount
                          ? "border-primary shadow-[0_0_0_2px_rgba(16,185,129,0.2)]"
                          : "border-border focus:border-primary/50"
                      )}
                    />
                  </div>

                  {/* Submit Action */}
                  <Button
                    size='sm'
                    className='w-full h-14 text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all'
                    onClick={handleDonate}
                    disabled={isLoading || (!selectedAmount && !customAmount)}>
                    {isLoading ? (
                      <div className='flex items-center gap-2'>
                        <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                        Processing...
                      </div>
                    ) : (
                      <span className='flex items-center gap-2'>
                        Donate ₦{(currentAmount || 0).toLocaleString()} Now
                        <ArrowRight className='w-5 h-5' />
                      </span>
                    )}
                  </Button>

                  <div className='flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2'>
                    <span className='flex items-center gap-1'>
                      <ShieldCheck className='w-3 h-3' /> Secure Payment
                    </span>
                    <span className='flex items-center gap-1'>
                      <CreditCard className='w-3 h-3' /> Cancel Anytime
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Manual Transfer Modal */}
        <Dialog open={showBankDetails} onOpenChange={setShowBankDetails}>
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>Bank Transfer Details</DialogTitle>
              <DialogDescription>
                Please make a transfer of{" "}
                <span className='font-bold text-primary'>
                  ₦{(currentAmount || 0).toLocaleString()}
                </span>{" "}
                to the account below.
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-4 py-4'>
              <div className='p-4 rounded-lg border bg-muted/50 space-y-3'>
                <div className='flex justify-between items-center pb-2 border-b border-border/50'>
                  <span className='text-sm text-muted-foreground'>
                    Bank Name
                  </span>
                  <span className='font-semibold'>{BANK_DETAILS.bankName}</span>
                </div>

                <div className='flex justify-between items-center pb-2 border-b border-border/50'>
                  <span className='text-sm text-muted-foreground'>
                    Account Name
                  </span>
                  <span className='font-semibold text-right'>
                    {BANK_DETAILS.accountName}
                  </span>
                </div>

                <div className='flex flex-col gap-1.5 pt-1'>
                  <span className='text-sm text-muted-foreground text-center'>
                    Account Number
                  </span>
                  <div className='flex items-center gap-2'>
                    <code className='flex-1 bg-background p-3 rounded-md border text-lg font-mono font-bold tracking-wider text-center'>
                      {BANK_DETAILS.accountNumber}
                    </code>
                    <Button
                      size='icon'
                      variant='outline'
                      onClick={() =>
                        copyToClipboard(
                          BANK_DETAILS.accountNumber,
                          "Account number"
                        )
                      }
                      className='h-[50px] w-[50px] shrink-0'>
                      <Copy className='h-5 w-5' />
                    </Button>
                  </div>
                </div>
              </div>

              <div className='text-sm bg-blue-500/10 text-blue-500 p-3 rounded-lg border border-blue-500/20 flex gap-2'>
                <CreditCard className='w-5 h-5 shrink-0' />
                <p>
                  After finding the transfer, please send the receipt to
                  <span className='font-semibold'> 7063255405</span> for
                  confirmation (optional).
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className='flex gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors'>
      <div className='mt-1 bg-background p-2 rounded-lg border shadow-sm h-fit'>
        {icon}
      </div>
      <div>
        <h4 className='font-semibold mb-1'>{title}</h4>
        <p className='text-sm text-muted-foreground leading-relaxed'>
          {description}
        </p>
      </div>
    </div>
  );
}
