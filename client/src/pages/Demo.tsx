import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Globe2, Users } from "lucide-react";

export default function Demo() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Column: Context */}
          <div className="lg:w-5/12 pt-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-enterprise-bg/10 text-enterprise-bg text-sm font-bold mb-6">
              GROWMAX ENTERPRISE
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-growmax-black mb-6 leading-tight">
              See the Revenue Platform in Action
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              Discover how leading manufacturers are digitizing their dealer networks and partner commerce.
            </p>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center shrink-0 text-blue-600">
                  <Globe2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Customized Walkthrough</h3>
                  <p className="text-gray-600 mt-1">We'll tailor the demo to your specific manufacturing or distribution workflow.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center shrink-0 text-purple-600">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">ERP Integration Discussion</h3>
                  <p className="text-gray-600 mt-1">Learn exactly how we connect to SAP, Dynamics, or your custom backend.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center shrink-0 text-orange-600">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">ROI Assessment</h3>
                  <p className="text-gray-600 mt-1">See how companies like OBO Bettermann achieved 50% faster cycles.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column: Form */}
          <div className="lg:w-7/12">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Request a Demo</h2>
              
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" placeholder="John" required className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" placeholder="Doe" required className="h-12" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Work Email *</Label>
                  <Input id="email" type="email" placeholder="john@company.com" required className="h-12" />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name *</Label>
                    <Input id="company" placeholder="Company Inc." required className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size">Company Size *</Label>
                    <Select>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-50">1-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">201-500 employees</SelectItem>
                        <SelectItem value="501+">500+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4 pt-4">
                  <Label className="text-base font-semibold">What are you looking for? (Select all that apply)</Label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="dealer" />
                      <label htmlFor="dealer" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Dealer Portal</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="partner" />
                      <label htmlFor="partner" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Partner Commerce</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="spares" />
                      <label htmlFor="spares" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Spares Portal</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="sales" />
                      <label htmlFor="sales" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Sales Rep Tools</label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 pt-2">
                  <Label htmlFor="message">Anything else we should know? (Optional)</Label>
                  <Textarea id="message" placeholder="Current ERP, pain points, etc." className="min-h-[100px]" />
                </div>
                
                <Button type="submit" className="w-full bg-growmax-red hover:bg-growmax-red-dark text-white h-14 text-lg mt-4">
                  Request Demo
                </Button>
                <p className="text-xs text-center text-gray-500">
                  By submitting this form, you agree to our Privacy Policy and Terms of Service.
                </p>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}