import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cpu, Fingerprint, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import SEOHead from "@/components/SEOHead";
import { contactPageSchema } from "@/lib/structuredData";

export default function Demo() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [modules, setModules] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const toggleModule = (mod: string) => {
    setModules((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    );
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/demo-requests", {
        firstName,
        lastName,
        email,
        company,
        companySize,
        modules,
        message: message || null,
      });
      return res.json();
    },
  });

  if (mutation.isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center selection:bg-growmax-red selection:text-white">
        <div className="text-center max-w-lg px-4">
          <div className="w-20 h-20 bg-growmax-black flex items-center justify-center mx-auto mb-8 shadow-[6px_6px_0px_0px_rgba(204,30,30,1)]">
            <CheckCircle className="w-10 h-10 text-growmax-red" />
          </div>
          <h2 className="text-4xl font-bold tracking-tighter text-growmax-black mb-4 uppercase" data-testid="text-success-heading">
            Sequence Initiated.
          </h2>
          <p className="text-lg text-gray-600 font-light mb-8" data-testid="text-success-message">
            Our architecture team will review your system requirements and respond within 24 business hours. Expect a technical deep-dive, not a sales pitch.
          </p>
          <div className="font-mono text-xs text-gray-400 uppercase tracking-widest border-t border-gray-200 pt-4">
            Ref: DEMO-{Date.now().toString(36).toUpperCase()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24 selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="Request a Demo | Growmax B2B Revenue Platform"
        description="Schedule a technical consultation with the Growmax architecture team. Deploy pilot programs in 8-12 weeks. ERP integration, partner portals, and B2B commerce."
        path="/demo"
        structuredData={contactPageSchema()}
      />
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          <div className="lg:col-span-5">
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3">
              Deployment Request
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-growmax-black mb-8 leading-[1.1] tracking-tighter">
              Fix your disconnected commerce.
            </h1>
            <p className="text-xl text-gray-600 mb-12 font-light leading-relaxed">
              We deploy pilot programs in 8-12 weeks. Stop revenue leaks and connect your Sales, Partners, and ERP.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-6 border-t border-gray-200 pt-6">
                <div className="w-12 h-12 bg-white border border-gray-200 flex items-center justify-center shrink-0">
                  <Fingerprint className="w-6 h-6 text-growmax-black" />
                </div>
                <div>
                  <h3 className="font-bold text-growmax-black text-lg tracking-tight">Technical Review</h3>
                  <p className="text-gray-500 mt-1 font-light text-sm">Deep dive into ERP integrations (SAP JCo, Dynamics), complex pricing matrices, and architecture needs.</p>
                </div>
              </div>
              
              <div className="flex gap-6 border-t border-gray-200 pt-6">
                <div className="w-12 h-12 bg-white border border-gray-200 flex items-center justify-center shrink-0">
                  <Cpu className="w-6 h-6 text-growmax-black" />
                </div>
                <div>
                  <h3 className="font-bold text-growmax-black text-lg tracking-tight">System Mapping</h3>
                  <p className="text-gray-500 mt-1 font-light text-sm">We map your current disjointed processes into a unified quote-to-cash workflow.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-7">
            <div className="bg-white border border-gray-200 p-8 md:p-12 shadow-sm relative">
              <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-gray-400">SECURE_FORM_V2</div>
              <h2 className="text-2xl font-bold text-growmax-black mb-8 font-mono uppercase tracking-tight">Initiate Sequence</h2>
              
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  mutation.mutate();
                }}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="font-mono text-xs uppercase text-gray-500">First Name *</Label>
                    <Input
                      id="firstName"
                      data-testid="input-firstName"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-12 rounded-none border-gray-300 focus:border-growmax-red focus:ring-growmax-red/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="font-mono text-xs uppercase text-gray-500">Last Name *</Label>
                    <Input
                      id="lastName"
                      data-testid="input-lastName"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-12 rounded-none border-gray-300 focus:border-growmax-red focus:ring-growmax-red/20"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-mono text-xs uppercase text-gray-500">Work Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    data-testid="input-email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-none border-gray-300 focus:border-growmax-red focus:ring-growmax-red/20"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company" className="font-mono text-xs uppercase text-gray-500">Company Name *</Label>
                    <Input
                      id="company"
                      data-testid="input-company"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="h-12 rounded-none border-gray-300 focus:border-growmax-red focus:ring-growmax-red/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size" className="font-mono text-xs uppercase text-gray-500">Company Size *</Label>
                    <Select value={companySize} onValueChange={setCompanySize} required>
                      <SelectTrigger data-testid="select-companySize" className="h-12 rounded-none border-gray-300">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent className="rounded-none">
                        <SelectItem value="1-50">1-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">201-500 employees</SelectItem>
                        <SelectItem value="501+">500+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <Label className="font-mono text-xs uppercase text-gray-800">Target Modules (Select applicable)</Label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { id: "dealer", label: "Dealer/Partner Portal" },
                      { id: "quote", label: "Quote-to-Cash Automation" },
                      { id: "spares", label: "Spares/Parts Portal" },
                      { id: "sap", label: "SAP ECC Integration" },
                    ].map((mod) => (
                      <div
                        key={mod.id}
                        className="flex items-center space-x-3 bg-gray-50 p-3 border border-gray-200 hover:border-growmax-red transition-colors"
                      >
                        <Checkbox
                          id={mod.id}
                          data-testid={`checkbox-${mod.id}`}
                          checked={modules.includes(mod.id)}
                          onCheckedChange={() => toggleModule(mod.id)}
                          className="rounded-none data-[state=checked]:bg-growmax-red data-[state=checked]:text-white"
                        />
                        <label htmlFor={mod.id} className="text-sm font-medium leading-none cursor-pointer">
                          {mod.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2 pt-4">
                  <Label htmlFor="message" className="font-mono text-xs uppercase text-gray-500">System Context (Optional)</Label>
                  <Textarea
                    id="message"
                    data-testid="input-message"
                    placeholder="Current ERP setup, pain points, etc."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px] rounded-none border-gray-300 focus:border-growmax-red"
                  />
                </div>

                {mutation.isError && (
                  <div className="bg-red-50 border border-red-200 p-4 font-mono text-sm text-red-700" data-testid="text-error">
                    Submission failed. Please try again.
                  </div>
                )}
                
                <Button
                  type="submit"
                  data-testid="button-submit-demo"
                  disabled={mutation.isPending || !companySize}
                  className="w-full bg-growmax-red hover:bg-growmax-black text-white h-16 text-lg mt-6 rounded-none font-bold tracking-tight transition-colors duration-300 disabled:opacity-50"
                >
                  {mutation.isPending ? (
                    <><Loader2 className="mr-2 w-5 h-5 animate-spin" /> Processing...</>
                  ) : (
                    <>Request Technical Consultation <ArrowRight className="ml-2 w-5 h-5" /></>
                  )}
                </Button>
                <div className="text-center mt-4">
                  <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">
                    Encrypted transmission. Your data is secure.
                  </p>
                </div>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}