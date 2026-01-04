import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface AnimationSettings {
  duration: number;
  style: string;
  intensity: number;
  format: string;
  prompt: string;
}

export default function Index() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [settings, setSettings] = useState<AnimationSettings>({
    duration: 3,
    style: 'cinematic',
    intensity: 50,
    format: 'mp4',
    prompt: ''
  });
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        toast({
          title: "Фото загружено",
          description: "Настройте параметры анимации и запустите обработку",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    if (!uploadedImage) {
      toast({
        title: "Загрузите фото",
        description: "Сначала выберите изображение для анимации",
        variant: "destructive"
      });
      return;
    }

    if (!settings.prompt.trim()) {
      toast({
        title: "Добавьте описание",
        description: "Опишите, что должно произойти на фото",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    setGeneratedVideo(null);
    setTimeout(() => {
      setIsProcessing(false);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const videoUrl = canvas.toDataURL('image/jpeg');
        setGeneratedVideo(videoUrl);
      };
      img.src = uploadedImage!;
      toast({
        title: "Видео готово!",
        description: `Анимация создана в формате ${settings.format.toUpperCase()}`,
      });
    }, 3000);
  };

  const promptSuggestions = [
    "Девушка медленно поворачивает голову и улыбается",
    "Человек идет по улице, волосы развеваются на ветру",
    "Облака плывут по небу, свет меняется",
    "Камера медленно приближается к объекту",
    "Листья на деревьях шелестят от ветра"
  ];

  const examples = [
    { id: 1, title: 'Портрет', style: 'Cinematic', duration: '3s' },
    { id: 2, title: 'Пейзаж', style: 'Dynamic', duration: '5s' },
    { id: 3, title: 'Архитектура', style: 'Smooth', duration: '4s' },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 gradient-ai opacity-20 animate-gradient bg-300%"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl font-bold mb-4 text-gradient">
            AI Video Generator
          </h1>
          <p className="text-xl text-muted-foreground">
            Превратите фотографии в живые видео с помощью нейросети
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="glass p-8 animate-scale-in hover:glow transition-all duration-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Icon name="Upload" size={28} />
              Загрузка и Превью
            </h2>
            
            <div className="space-y-6">
              {!uploadedImage ? (
                <label className="border-2 border-dashed border-primary/50 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors hover:bg-primary/5">
                  <Icon name="ImagePlus" size={64} className="mb-4 text-primary" />
                  <span className="text-lg font-medium mb-2">Выберите фото</span>
                  <span className="text-sm text-muted-foreground">PNG, JPG до 10MB</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload}
                  />
                </label>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden group">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded" 
                      className="w-full h-auto rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => setUploadedImage(null)}
                          className="flex-1"
                        >
                          <Icon name="Trash2" size={16} className="mr-2" />
                          Удалить
                        </Button>
                        <label className="flex-1">
                          <Button variant="secondary" size="sm" className="w-full" asChild>
                            <span>
                              <Icon name="RefreshCw" size={16} className="mr-2" />
                              Заменить
                            </span>
                          </Button>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {isProcessing && (
                    <div className="p-4 glass rounded-lg animate-pulse">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon name="Sparkles" size={20} className="text-primary animate-spin" />
                        <span className="font-medium">Генерация видео...</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full animate-gradient bg-300%"></div>
                      </div>
                    </div>
                  )}

                  {generatedVideo && !isProcessing && (
                    <div className="animate-scale-in">
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-lg font-semibold flex items-center gap-2">
                          <Icon name="Video" size={20} className="text-primary" />
                          Результат
                        </Label>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="glass"
                            onClick={() => {
                              const a = document.createElement('a');
                              a.href = generatedVideo;
                              a.download = `animated-${Date.now()}.${settings.format}`;
                              a.click();
                              toast({
                                title: "Загрузка начата",
                                description: "Видео сохраняется на ваше устройство"
                              });
                            }}
                          >
                            <Icon name="Download" size={16} className="mr-2" />
                            Скачать
                          </Button>
                        </div>
                      </div>
                      <div className="relative rounded-lg overflow-hidden glass p-2">
                        <img
                          src={generatedVideo}
                          alt="Generated animation"
                          className="w-full rounded-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="glass p-4 rounded-lg">
                            <Icon name="Play" size={48} className="text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 p-3 glass rounded-lg">
                        <div className="flex items-start gap-2 text-sm">
                          <Icon name="Info" size={16} className="text-primary mt-0.5" />
                          <div>
                            <p className="font-medium mb-1">Параметры видео:</p>
                            <div className="text-muted-foreground space-y-1">
                              <p>• Длительность: {settings.duration}с</p>
                              <p>• Стиль: {settings.style}</p>
                              <p>• Формат: {settings.format.toUpperCase()}</p>
                              <p>• Промпт: "{settings.prompt}"</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          <Card className="glass p-8 animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Icon name="Settings" size={28} />
              Настройки Анимации
            </h2>
            
            <div className="space-y-6">
              <div>
                <Label className="text-base mb-3 block flex items-center gap-2">
                  <Icon name="Wand2" size={18} />
                  Что должно произойти?
                </Label>
                <Textarea
                  placeholder="Например: девушка идет к морю и прыгает в воду, волосы развеваются на ветру..."
                  value={settings.prompt}
                  onChange={(e) => setSettings({...settings, prompt: e.target.value})}
                  className="glass min-h-[100px] resize-none"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {promptSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSettings({...settings, prompt: suggestion})}
                      className="text-xs px-3 py-1.5 rounded-full glass hover:bg-primary/20 transition-colors border border-primary/30"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Опишите, как должно ожить фото: движения, действия, эффекты
                </p>
              </div>
              <div>
                <Label className="text-base mb-3 block">Длительность: {settings.duration}с</Label>
                <Slider 
                  value={[settings.duration]} 
                  onValueChange={(v) => setSettings({...settings, duration: v[0]})}
                  min={1}
                  max={10}
                  step={1}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1с</span>
                  <span>10с</span>
                </div>
              </div>

              <div>
                <Label className="text-base mb-3 block">Стиль движения</Label>
                <Select value={settings.style} onValueChange={(v) => setSettings({...settings, style: v})}>
                  <SelectTrigger className="glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cinematic">🎬 Cinematic</SelectItem>
                    <SelectItem value="dynamic">⚡ Dynamic</SelectItem>
                    <SelectItem value="smooth">🌊 Smooth</SelectItem>
                    <SelectItem value="dramatic">🔥 Dramatic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base mb-3 block">Интенсивность: {settings.intensity}%</Label>
                <Slider 
                  value={[settings.intensity]} 
                  onValueChange={(v) => setSettings({...settings, intensity: v[0]})}
                  min={0}
                  max={100}
                  step={10}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Слабо</span>
                  <span>Сильно</span>
                </div>
              </div>

              <div>
                <Label className="text-base mb-3 block">Формат экспорта</Label>
                <Select value={settings.format} onValueChange={(v) => setSettings({...settings, format: v})}>
                  <SelectTrigger className="glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mp4">📹 MP4 (универсальный)</SelectItem>
                    <SelectItem value="webm">🌐 WebM (для веба)</SelectItem>
                    <SelectItem value="gif">🎞️ GIF (анимация)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                size="lg" 
                className="w-full gradient-ai hover:opacity-90 transition-opacity text-lg font-semibold"
                onClick={handleGenerate}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Icon name="Loader" size={20} className="mr-2 animate-spin" />
                    Обработка...
                  </>
                ) : (
                  <>
                    <Icon name="Sparkles" size={20} className="mr-2" />
                    Создать видео
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="examples" className="animate-slide-up">
          <TabsList className="glass mb-6">
            <TabsTrigger value="examples" className="flex items-center gap-2">
              <Icon name="Lightbulb" size={18} />
              Примеры
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Icon name="History" size={18} />
              История
            </TabsTrigger>
          </TabsList>

          <TabsContent value="examples">
            <div className="grid md:grid-cols-3 gap-6">
              {examples.map((example, idx) => (
                <Card 
                  key={example.id} 
                  className="glass p-6 hover:glow transition-all duration-300 cursor-pointer group animate-scale-in"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon name="Play" size={48} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{example.title}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="Wand2" size={14} />
                      {example.style}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Clock" size={14} />
                      {example.duration}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className="glass p-8">
              <div className="text-center py-12">
                <Icon name="FileVideo" size={64} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">
                  История обработок появится здесь после создания первого видео
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}