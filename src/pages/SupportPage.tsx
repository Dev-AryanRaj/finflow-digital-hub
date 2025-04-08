
import React, { useState } from 'react';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  FileQuestion, 
  MapPin, 
  Clock, 
  Search,
  ChevronRight,
  Send
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// FAQ data
const faqCategories = [
  { id: 'accounts', name: 'Accounts' },
  { id: 'cards', name: 'Cards & Payments' },
  { id: 'online', name: 'Online Banking' },
  { id: 'security', name: 'Security' },
  { id: 'loans', name: 'Loans & Mortgages' },
];

const faqList = [
  {
    id: 1,
    question: 'How do I reset my online banking password?',
    answer: 'To reset your password, click the "Forgot Password" link on the login page. You will receive an email with instructions to create a new password. For security reasons, passwords must contain at least 8 characters including numbers, uppercase and lowercase letters.',
    category: 'online',
  },
  {
    id: 2,
    question: 'What should I do if I lose my debit card?',
    answer: 'If you lose your debit card, you should immediately report it by calling our 24/7 customer support line. You can also temporarily freeze your card through the online banking platform or mobile app. A replacement card will typically arrive within 5-7 business days.',
    category: 'cards',
  },
  {
    id: 3,
    question: 'How can I set up direct deposit for my paycheck?',
    answer: 'To set up direct deposit, you\'ll need to provide your employer with your account number and the bank\'s routing number. Both can be found in your online banking portal under "Account Details" or on the bottom of your checks.',
    category: 'accounts',
  },
  {
    id: 4,
    question: 'Are my online banking transactions secure?',
    answer: 'Yes, all online banking transactions are secured with advanced encryption technology. We also employ multi-factor authentication and continuous monitoring systems to ensure the security of your accounts and personal information.',
    category: 'security',
  },
  {
    id: 5,
    question: 'What interest rates do you offer for home loans?',
    answer: 'Our current mortgage rates vary based on term length, credit score, and down payment amount. For the most accurate and up-to-date rates, please contact our mortgage department directly or use the mortgage calculator tool in your online banking portal.',
    category: 'loans',
  },
  {
    id: 6,
    question: 'How do I set up automatic bill payments?',
    answer: 'You can set up automatic bill payments through the "Bill Pay" section of your online banking account. Select the payee, enter the payment amount, and choose the frequency (one-time or recurring). You can also set payment limits and notifications.',
    category: 'cards',
  },
  {
    id: 7,
    question: 'What happens if I detect fraudulent activity on my account?',
    answer: 'If you notice any unauthorized transactions, contact our fraud department immediately. Your account will be secured, the fraudulent transactions investigated, and you\'ll be issued new cards if necessary. Our Zero Liability Protection ensures you won\'t be responsible for unauthorized charges.',
    category: 'security',
  },
  {
    id: 8,
    question: 'How do I open a new savings account?',
    answer: 'You can open a new savings account through your online banking portal under "Open New Account", by visiting any branch location, or by calling our customer service. You\'ll need to provide identification and an initial deposit (minimum amounts vary by account type).',
    category: 'accounts',
  },
];

// Support contact methods
const contactMethods = [
  {
    icon: <Phone className="h-5 w-5" />,
    title: 'Phone Support',
    description: 'Speak with a representative',
    details: '1-800-555-BANK (2265)',
    availability: '24/7 Support Available',
  },
  {
    icon: <Mail className="h-5 w-5" />,
    title: 'Email Support',
    description: 'Send us a message',
    details: 'support@finflow.com',
    availability: 'Response within 24 hours',
  },
  {
    icon: <MessageSquare className="h-5 w-5" />,
    title: 'Live Chat',
    description: 'Chat with a representative',
    details: 'Available in online banking',
    availability: 'Monday-Friday: 8am-8pm',
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    title: 'Branch Locations',
    description: 'Visit us in person',
    details: 'Find your nearest branch',
    availability: 'Check local branch hours',
  },
];

const SupportPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: '',
  });
  const { toast } = useToast();

  // Filter FAQs based on search term and category
  const filteredFAQs = faqList.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Handle contact form submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Form submission would happen here
    toast({
      title: "Message Sent",
      description: "We've received your message and will respond shortly.",
    });
    
    // Reset form
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: '',
      category: '',
    });
  };

  // Handle form field changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Customer Support Center</h1>
        <p className="text-muted-foreground">Get the help you need with your banking questions and issues.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>How Can We Help You?</CardTitle>
            <CardDescription>Search our knowledge base or browse by category</CardDescription>
            <div className="mt-3">
              <Input
                className="max-w-lg"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                prefix={<Search className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="faqs">
              <TabsList className="mb-4">
                <TabsTrigger value="faqs" className="gap-2">
                  <FileQuestion className="h-4 w-4" />
                  <span>Frequently Asked Questions</span>
                </TabsTrigger>
                <TabsTrigger value="contact" className="gap-2">
                  <Phone className="h-4 w-4" />
                  <span>Contact Us</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="faqs">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button 
                    variant={activeCategory === 'all' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setActiveCategory('all')}
                  >
                    All Categories
                  </Button>
                  {faqCategories.map(category => (
                    <Button
                      key={category.id}
                      variant={activeCategory === category.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveCategory(category.id)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
                
                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-8">
                    <FileQuestion className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium">No results found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or category filter
                    </p>
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFAQs.map((faq) => (
                      <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </TabsContent>
              
              <TabsContent value="contact">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Send Us a Message</h3>
                    <form onSubmit={handleContactSubmit}>
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            name="name"
                            value={contactForm.name}
                            onChange={handleFormChange}
                            placeholder="Your full name"
                            required
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email" 
                            name="email"
                            type="email"
                            value={contactForm.email}
                            onChange={handleFormChange}
                            placeholder="Your email address"
                            required
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="category">Category</Label>
                          <Select 
                            name="category" 
                            value={contactForm.category}
                            onValueChange={(value) => setContactForm(prev => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger id="category">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {faqCategories.map(category => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Input 
                            id="subject" 
                            name="subject"
                            value={contactForm.subject}
                            onChange={handleFormChange}
                            placeholder="Brief subject of your message"
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea 
                            id="message" 
                            name="message"
                            value={contactForm.message}
                            onChange={handleFormChange}
                            placeholder="How can we help you?"
                            rows={5}
                            required
                          />
                        </div>
                        
                        <Button type="submit" className="w-full">
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                      </div>
                    </form>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Contact Methods</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {contactMethods.map((method, index) => (
                        <Card key={index}>
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                              <div className="p-2 rounded-full bg-bank-primary/10 text-bank-primary">
                                {method.icon}
                              </div>
                              <div>
                                <h4 className="font-medium">{method.title}</h4>
                                <p className="text-sm text-muted-foreground">{method.description}</p>
                                <p className="text-sm font-medium mt-1">{method.details}</p>
                                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>{method.availability}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="mt-6 bg-muted p-4 rounded-lg">
                      <h4 className="font-medium">Need Immediate Assistance?</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        For urgent matters, please call our 24/7 customer support line.
                      </p>
                      <Button variant="link" className="p-0 mt-2 h-auto flex items-center">
                        <span>More emergency options</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportPage;
