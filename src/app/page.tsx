'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Image as ImageIcon, Loader2, Sparkles, Save, Edit2, Eye } from 'lucide-react';


interface CompanyInfo {
  name: string;
  logoUrl: string;
  description?: string;
  website?: string;
}

export default function ResumeOptimizer() {
  const [resume, setResume] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobPosition, setJobPosition] = useState('');
  const [optimizedResume, setOptimizedResume] = useState('');
  const [recommendReason, setRecommendReason] = useState('');
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isLoadingCompany, setIsLoadingCompany] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedResume, setEditedResume] = useState('');

  // 解析简历内容为HTML
  const parseResumeToHTML = (resume: string) => {
    return resume
      // 转换一级标题 (## 一、xxx)
      .replace(/^##\s+(.+)$/gm, '<h3 class="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-white border-b border-gray-300 pb-2">$1</h3>')
      // 转换二级标题 (### xxx)
      .replace(/^###\s+(.+)$/gm, '<h4 class="text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-white">$1</h4>')
      // 转换列表项 (- xxx)
      .replace(/^-\s+(.+)$/gm, '<li class="ml-6 text-gray-700 dark:text-gray-300 mb-1">$1</li>')
      // 转换多行列表项为列表
      .replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul class="list-disc mb-4">$&</ul>')
      // 转换粗体 (**xxx**)
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      // 转换换行为段落
      .replace(/\n\n+/g, '</p><p class="mb-3 text-gray-700 dark:text-gray-300">')
      // 包裹整个内容
      .replace(/^(?!<)/, '<p class="mb-3 text-gray-700 dark:text-gray-300">')
      .replace(/(?<!>)$/, '</p>');
  };

  const handleOptimize = async () => {
    if (!resume.trim() || !companyName.trim() || !jobPosition.trim()) {
      alert('请输入简历内容、目标公司名称和应聘职位');
      return;
    }

    setIsOptimizing(true);
    setOptimizedResume('');
    setRecommendReason('');

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
          jobPosition,
          companyInfo: companyData,
        }),
      });

      const reader = resumeRes.body?.getReader();
      const decoder = new TextDecoder();
      let optimizedText = '';
      let reasonText = '';
      let currentStage = 'recommend';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const content = line.slice(6).trim();

              // 跳过[DONE]标记
              if (content === '[DONE]') {
                continue;
              }

              // 跳过空行
              if (!content) {
                continue;
              }

              try {
                const data = JSON.parse(content);
                if (data.type === 'stage') {
                  currentStage = data.content;
                } else if (data.content) {
                  if (currentStage === 'recommend') {
                    reasonText += data.content;
                    setRecommendReason(reasonText);
                  } else if (currentStage === 'resume') {
                    optimizedText += data.content;
                    setOptimizedResume(optimizedText);
                  }
                }
              } catch (parseError) {
                console.error('JSON parse error:', parseError, 'Content:', content);
              }
            }
          }
        }
      }

      // 优化完成后，初始化编辑内容
      if (optimizedText) {
        setEditedResume(optimizedText);
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
    if (!editedResume || !companyName) {
      alert('请先优化简历');
      return;
    }

    setIsSaving(true);

    try {
      // 构建完整简历内容
      const fullResume = `
${companyInfo ? `目标公司：${companyInfo.name}\n` : ''}应聘职位：${jobPosition}

${recommendReason ? `\n=== AI 推荐理由 ===\n${recommendReason}\n` : ''}
${'=' * 50}

=== 优化后的简历 ===
${editedResume}
      `.trim();

      const response = await fetch('/api/save-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume: fullResume,
          companyName,
          jobPosition,
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
                <Label htmlFor="job-position">应聘职位</Label>
                <Input
                  id="job-position"
                  placeholder="例如：前端工程师、产品经理、数据分析师..."
                  value={jobPosition}
                  onChange={(e) => setJobPosition(e.target.value)}
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
                查看优化后的简历
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {optimizedResume ? (
                <>
                  {/* 编辑/预览模式切换 */}
                  <div className="flex items-center justify-between border-b pb-3">
                    <Label className="text-base font-semibold">简历内容</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={!isEditMode ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setIsEditMode(false)}
                        className={!isEditMode ? 'bg-blue-600 hover:bg-blue-700' : ''}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        预览模式
                      </Button>
                      <Button
                        variant={isEditMode ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setIsEditMode(true)}
                        className={isEditMode ? 'bg-blue-600 hover:bg-blue-700' : ''}
                      >
                        <Edit2 className="mr-2 h-4 w-4" />
                        编辑模式
                      </Button>
                    </div>
                  </div>

                  {/* 简历预览 */}
                  <div className="overflow-y-auto rounded-lg border bg-white p-6 dark:bg-gray-800">
                    {isEditMode ? (
                      /* 编辑模式 */
                      <div className="space-y-4">
                        <div className="rounded-lg border bg-gray-50 p-4 dark:bg-gray-900">
                          <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            💡 提示：您可以直接编辑简历内容，修改后点击导出即可使用
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            • 简历包含：个人信息、求职意向、教育背景、工作经历、项目经验、专业技能、自我评价<br/>
                            • 保持原有结构格式，使用 ## 标题区分不同模块<br/>
                            • 可自由修改和补充内容
                          </p>
                        </div>
                        <Textarea
                          value={editedResume}
                          onChange={(e) => setEditedResume(e.target.value)}
                          placeholder="在此编辑简历内容..."
                          className="min-h-[500px] resize-none font-mono text-sm"
                        />
                      </div>
                    ) : (
                      /* 预览模式 */
                      <div
                        id="resume-preview"
                        className="prose max-w-none dark:prose-invert"
                      >
                        {/* 顶部信息区：公司名称和应聘职位 */}
                        <div className="mb-6 border-b-2 border-gray-300 pb-4">
                          <div className="flex items-start justify-between">
                            {/* 左侧：应聘职位 */}
                            {jobPosition && (
                              <div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                  应聘职位：{jobPosition}
                                </div>
                                {companyInfo && (
                                  <div className="mt-2 text-lg text-gray-700 dark:text-gray-300">
                                    {companyInfo.name}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* 右侧：公司名称 */}
                            {companyInfo && (
                              <div className="text-xl font-bold text-gray-900 dark:text-white">
                                {companyInfo.name}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* AI推荐理由 */}
                        {recommendReason && (
                          <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
                            <div className="mb-2 flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-blue-600" />
                              <span className="font-semibold text-blue-900 dark:text-blue-100">
                                AI 推荐理由
                              </span>
                            </div>
                            <div className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                              {recommendReason}
                            </div>
                          </div>
                        )}

                        {/* 优化后的简历内容 */}
                        <div 
                          className="prose max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{ __html: parseResumeToHTML(editedResume) }}
                        />
                      </div>
                    )}
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
