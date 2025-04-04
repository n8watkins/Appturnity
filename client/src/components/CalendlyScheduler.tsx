import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CalendarDays, Clock, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendlyInlineEmbed, CalendlyPopupButton } from '@/components/ui/calendly-embed';

export default function CalendlyScheduler() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const availableDates = [
    "Monday, April 6, 2025",
    "Tuesday, April 7, 2025",
    "Wednesday, April 8, 2025",
    "Thursday, April 9, 2025",
    "Friday, April 10, 2025"
  ];

  const availableTimes = [
    "9:00 AM - 9:30 AM",
    "10:00 AM - 10:30 AM", 
    "11:00 AM - 11:30 AM",
    "1:00 PM - 1:30 PM",
    "2:00 PM - 2:30 PM",
    "3:00 PM - 3:30 PM"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="schedule" className="py-20 bg-slate-50 scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
            Schedule a Consultation
          </h2>
          <p className="text-lg text-slate-600">
            Book a free 30-minute call to discuss your project needs and how we can help
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="shadow-lg border border-slate-200 overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle className="flex items-center text-2xl">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                {!submitted ? "Choose a Time" : "Consultation Scheduled"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Tabs defaultValue="calendly" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="calendly">Calendly</TabsTrigger>
                  <TabsTrigger value="custom">Custom Scheduler</TabsTrigger>
                </TabsList>
                
                <TabsContent value="calendly" className="pt-2">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-medium text-slate-900">Schedule directly through Calendly</h3>
                    <p className="text-sm text-slate-600 mb-4">Choose a time that works for your schedule</p>
                  </div>
                  
                  <CalendlyInlineEmbed 
                    url="https://calendly.com/stupid-simple-apps/30min"
                    styles={{ height: '600px', width: '100%' }}
                    prefill={{
                      name: name,
                      email: email
                    }}
                    utm={{
                      utmSource: "website",
                      utmMedium: "scheduling_page"
                    }}
                  />
                </TabsContent>
                
                <TabsContent value="custom">
                  {!submitted ? (
                    <div>
                      {/* Progress steps */}
                      <div className="flex justify-between mb-8">
                        {[1, 2].map((i) => (
                          <div 
                            key={i} 
                            className={`flex items-center ${i === 1 ? 'flex-1' : ''}`}
                          >
                            <div 
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                i <= step ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'
                              }`}
                            >
                              {i}
                            </div>
                            {i === 1 && (
                              <div className="flex-1 h-1 mx-2 bg-slate-200">
                                <div 
                                  className="h-full bg-primary transition-all" 
                                  style={{ width: step > 1 ? '100%' : '0%' }}
                                ></div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {step === 1 && (
                        <div className="space-y-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-slate-700 mb-2">
                              <CalendarDays className="h-5 w-5 text-primary" />
                              <span className="font-medium">Select a Date</span>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                              {availableDates.map((dateOption, i) => (
                                <Button
                                  key={i}
                                  type="button"
                                  variant={dateOption === selectedDate ? "default" : "outline"}
                                  className="justify-start h-auto py-3 px-4"
                                  onClick={() => setSelectedDate(dateOption)}
                                >
                                  {dateOption}
                                </Button>
                              ))}
                            </div>
                          </div>
                          
                          <Button 
                            type="button" 
                            className="w-full mt-6"
                            disabled={!selectedDate}
                            onClick={() => setStep(2)}
                          >
                            Continue
                          </Button>
                        </div>
                      )}

                      {step === 2 && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-slate-700 mb-2">
                              <Clock className="h-5 w-5 text-primary" />
                              <span className="font-medium">Select a Time</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              {availableTimes.map((time, i) => (
                                <Button
                                  key={i}
                                  type="button"
                                  variant={time === selectedTime ? "default" : "outline"}
                                  className="justify-center"
                                  onClick={() => setSelectedTime(time)}
                                >
                                  {time}
                                </Button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center gap-2 text-slate-700 mb-2">
                              <Users className="h-5 w-5 text-primary" />
                              <span className="font-medium">Your Information</span>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <Label htmlFor="name">Full Name</Label>
                                <Input 
                                  id="name" 
                                  value={name} 
                                  onChange={(e) => setName(e.target.value)} 
                                  placeholder="Enter your name"
                                  required
                                />
                              </div>

                              <div className="space-y-1">
                                <Label htmlFor="email">Email Address</Label>
                                <Input 
                                  id="email" 
                                  type="email" 
                                  value={email} 
                                  onChange={(e) => setEmail(e.target.value)} 
                                  placeholder="Enter your email"
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => setStep(1)}
                              className="flex-1"
                            >
                              Back
                            </Button>
                            <Button 
                              type="submit" 
                              disabled={!selectedTime || !name || !email}
                              className="flex-1"
                            >
                              Schedule Meeting
                            </Button>
                          </div>
                        </form>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                        <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Your meeting is scheduled!</h3>
                      <p className="text-slate-600 mb-6">
                        We've sent a calendar invitation to <span className="font-medium">{email}</span>
                      </p>
                      <div className="bg-slate-50 p-4 rounded-lg inline-block mx-auto text-left border border-slate-200">
                        <div className="flex items-start gap-3 mb-3">
                          <CalendarDays className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <div className="font-medium text-slate-900">Date</div>
                            <div className="text-slate-600">{selectedDate}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <div className="font-medium text-slate-900">Time</div>
                            <div className="text-slate-600">{selectedTime}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}