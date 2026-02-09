'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText, Image as ImageIcon, Loader2, Sparkles, Save } from 'lucide-react';


interface CompanyInfo {
  name: string;
  logoUrl: string;
}

export default function ResumeOptimizer() {
  const [resume, setResume] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [optimizedResume, setOptimizedResume] = useState('');
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isLoadingCompany, setIsLoadingCompany] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const templates = [
    { id: 'modern', name: '现代简约', description: '简洁大方，适合科技公司' },
    { id: 'classic', name: '经典商务', description: '正式严谨，适合传统行业' },
    { id: 'creative', name: '创意设计', description: '独特个性，适合创意岗位' },
  ];

  const handleOptimize = async () => {
    if (!resume.trim() || !companyName.trim()) {
      alert('请输入简历内容和目标公司名称');
      return;
    }

    setIsOptimizing(true);

    try {
      // 先获取公司信息
      setIsLoadingCompany(true);
      const companyRes = await fetch('/api/company-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName }),
      });
      const companyData = await companyRes.json();
      setCompanyInfo(companyData);
      setIsLoadingCompany(false);

      // 然后优化简历
      const resumeRes = await fetch('/api/optimize-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume,
          companyName,
          companyInfo: companyData,
        }),
      });

      const reader = resumeRes.body?.getReader();
      const decoder = new TextDecoder();
      let optimizedText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                optimizedText += data.content;
                setOptimizedResume(optimizedText);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('优化失败:', error);
      alert('简历优化失败，请重试');
    } finally {
      setIsOptimizing(false);
      setIsLoadingCompany(false);
    }
  };

  const exportToImage = async () => {
    const element = document.getElementById('resume-preview');
    if (!element) return;

    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(element, { scale: 2 });
    const link = document.createElement('a');
    link.download = `resume_${companyName}_优化版.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const exportToPDF = async () => {
    const element = document.getElementById('resume-preview');
    if (!element) return;

    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).jsPDF;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`resume_${companyName}_优化版.pdf`);
  };

  const exportToWord = async () => {
    const element = document.getElementById('resume-preview');
    if (!element) return;

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
      <head><meta charset='utf-8'><title>简历</title></head>
      <body>
        ${element.innerHTML}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `resume_${companyName}_优化版.doc`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const saveResume = async () => {
    if (!optimizedResume || !companyName) {
      alert('请先优化简历');
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch('/api/save-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume: optimizedResume,
          companyName,
          selectedTemplate,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('简历保存成功！\n\n下载链接：' + data.downloadUrl);
      } else {
        alert('保存失败：' + data.error);
      }
    } catch (error) {
      console.error('保存失败:', error);
      alert('简历保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
            AI 简历优化助手
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            智能优化您的简历，匹配目标公司要求
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* 左侧：输入区域 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                输入信息
              </CardTitle>
              <CardDescription>
                请输入您的原始简历和目标公司信息
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">目标公司名称</Label>
                <Input
                  id="company-name"
                  placeholder="例如：字节跳动、腾讯、阿里巴巴..."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume">简历内容</Label>
                <Textarea
                  id="resume"
                  placeholder="请粘贴您的简历内容..."
                  className="min-h-[400px] resize-none"
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                />
              </div>

              <Button
                onClick={handleOptimize}
                disabled={isOptimizing}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    优化中...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    开始优化简历
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* 右侧：预览区域 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                优化预览
              </CardTitle>
              <CardDescription>
                查看优化后的简历，选择模板并导出
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {optimizedResume ? (
                <>
                  {/* 模板选择 */}
                  <div className="space-y-2">
                    <Label>选择模板</Label>
                    <Tabs value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <TabsList className="grid w-full grid-cols-3">
                        {templates.map((template) => (
                          <TabsTrigger key={template.id} value={template.id}>
                            {template.name}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      <TabsContent value="modern" className="mt-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          简洁大方，适合科技公司
                        </p>
                      </TabsContent>
                      <TabsContent value="classic" className="mt-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          正式严谨，适合传统行业
                        </p>
                      </TabsContent>
                      <TabsContent value="creative" className="mt-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          独特个性，适合创意岗位
                        </p>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* 简历预览 */}
                  <div className="overflow-y-auto rounded-lg border bg-white p-6 dark:bg-gray-800">
                    <div
                      id="resume-preview"
                      className={`prose max-w-none dark:prose-invert ${
                        selectedTemplate === 'modern' ? 'modern-template' : ''
                      } ${selectedTemplate === 'classic' ? 'classic-template' : ''} ${
                        selectedTemplate === 'creative' ? 'creative-template' : ''
                      }`}
                    >
                      {companyInfo && (
                        <div className="mb-6 flex items-center justify-end gap-2 border-b pb-4">
                          <div className="text-right">
                            <div className="text-xl font-bold text-gray-900 dark:text-white">
                              {companyInfo.name}
                            </div>
                          </div>
                          {companyInfo.logoUrl && (
                            <img
                              src={companyInfo.logoUrl}
                              alt={companyInfo.name}
                              className="h-10 w-10 object-contain"
                            />
                          )}
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{optimizedResume}</div>
                    </div>
                  </div>

                  {/* 导出按钮 */}
                  <div className="flex gap-2">
                    <Button
                      onClick={exportToImage}
                      variant="outline"
                      className="flex-1"
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      导出图片
                    </Button>
                    <Button
                      onClick={exportToPDF}
                      variant="outline"
                      className="flex-1"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      导出 PDF
                    </Button>
                    <Button
                      onClick={exportToWord}
                      variant="outline"
                      className="flex-1"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      导出 Word
                    </Button>
                  </div>

                  {/* 保存按钮 */}
                  <Button
                    onClick={saveResume}
                    disabled={isSaving}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        保存中...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        保存简历到云端
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="flex min-h-[400px] items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <FileText className="mx-auto mb-4 h-16 w-16 opacity-50" />
                    <p>输入简历并点击优化后，此处将显示结果</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 功能特点 */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Card className="border-2 border-blue-100 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="text-lg">智能优化</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI 分析简历内容，针对目标公司自动优化关键词和表达方式
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100 bg-green-50/50 dark:border-green-900/50 dark:bg-green-950/20">
            <CardHeader>
              <CardTitle className="text-lg">公司匹配</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                自动获取公司名称和 Logo，让简历更加专业和个性化
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100 bg-purple-50/50 dark:border-purple-900/50 dark:bg-purple-950/20">
            <CardHeader>
              <CardTitle className="text-lg">多格式导出</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                支持 PDF、Word、图片多种格式导出，方便分享和投递
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx global>{`
        .modern-template {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .modern-template h1,
        .modern-template h2 {
          color: #2563eb;
        }
        .classic-template {
          font-family: 'Georgia', 'Times New Roman', serif;
        }
        .classic-template h1,
        .classic-template h2 {
          color: #1f2937;
          border-bottom: 2px solid #374151;
          padding-bottom: 8px;
        }
        .creative-template {
          font-family: 'Courier New', Courier, monospace;
        }
        .creative-template h1,
        .creative-template h2 {
          color: #7c3aed;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
}
