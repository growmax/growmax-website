import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cpu, Fingerprint, Box, ArrowRight } from "lucide-react";

export default function Demo() {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24 selection:bg-growmax-red selection:text-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Context (Brutalist style) */}
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
          
          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-gray-200 p-8 md:p-12 shadow-sm relative">
              <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-gray-400">SECURE_FORM_V2</div>
              <h2 className="text-2xl font-bold text-growmax-black mb-8 font-mono uppercase tracking-tight">Initiate Sequence</h2>
              
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="font-mono text-xs uppercase text-gray-500">First Name *</Label>
                    <Input id="firstName" required className="h-12 rounded-none border-gray-300 focus:border-growmax-red focus:ring-growmax-red/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="font-mono text-xs uppercase text-gray-500">Last Name *</Label>
                    <Input id="lastName" required className="h-12 rounded-none border-gray-300 focus:border-growmax-red focus:ring-growmax-red/20" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-mono text-xs uppercase text-gray-500">Work Email *</Label>
                  <Input id="email" type="email" required className="h-12 rounded-none border-gray-300 focus:border-growmax-red focus:ring-growmax-red/20" />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company" className="font-mono text-xs uppercase text-gray-500">Company Name *</Label>
                    <Input id="company" required className="h-12 rounded-none border-gray-300 focus:border-growmax-red focus:ring-growmax-red/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size" className="font-mono text-xs uppercase text-gray-500">Company Size *</Label>
                    <Select>
                      <SelectTrigger className="h-12 rounded-none border-gray-300">
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
                    <div className="flex items-center space-x-3 bg-gray-50 p-3 border border-gray-200 hover:border-growmax-red transition-colors">
                      <Checkbox id="dealer" className="rounded-none data-[state=checked]:bg-growmax-red data-[state=checked]:text-white" />
                      <label htmlFor="dealer" className="text-sm font-medium leading-none cursor-pointer">Dealer/Partner Portal</label>
                    </div>
                    <div className="flex items-center space-x-3 bg-gray-50 p-3 border border-gray-200 hover:border-growmax-red transition-colors">
                      <Checkbox id="quote" className="rounded-none data-[state=checked]:bg-growmax-red data-[state=checked]:text-white" />
                      <label htmlFor="quote" className="text-sm font-medium leading-none cursor-pointer">Quote-to-Cash Automation</label>
                    </div>
                    <div className="flex items-center space-x-3 bg-gray-50 p-3 border border-gray-200 hover:border-growmax-red transition-colors">
                      <Checkbox id="spares" className="rounded-none data-[state=checked]:bg-growmax-red data-[state=checked]:text-white" />
                      <label htmlFor="spares" className="text-sm font-medium leading-none cursor-pointer">Spares/Parts Portal</label>
                    </div>
                    <div className="flex items-center space-x-3 bg-gray-50 p-3 border border-gray-200 hover:border-growmax-red transition-colors">
                      <Checkbox id="sap" className="rounded-none data-[state=checked]:bg-growmax-red data-[state=checked]:text-white" />
                      <label htmlFor="sap" className="text-sm font-medium leading-none cursor-pointer">SAP ECC Integration</label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 pt-4">
                  <Label htmlFor="message" className="font-mono text-xs uppercase text-gray-500">System Context (Optional)</Label>
                  <Textarea id="message" placeholder="Current ERP setup, pain points, etc." className="min-h-[100px] rounded-none border-gray-300 focus:border-growmax-red" />
                </div>
                
                <Button type="submit" className="w-full bg-growmax-red hover:bg-growmax-black text-white h-16 text-lg mt-6 rounded-none font-bold tracking-tight transition-colors duration-300">
                  Request Technical Consultation <ArrowRight className="ml-2 w-5 h-5" />
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