'use client';

import { useState } from 'react';
import { toast } from 'sonner';
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
  const [jobRequirements, setJobRequirements] = useState('');
  const [hrCommunicationNotes, setHrCommunicationNotes] = useState('');
  const [optimizedResume, setOptimizedResume] = useState('');
  const [recommendReason, setRecommendReason] = useState('');
  const [riskTips, setRiskTips] = useState('');
  const [interviewQuestions, setInterviewQuestions] = useState('');
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isLoadingCompany, setIsLoadingCompany] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedResume, setEditedResume] = useState('');

  // 解析简历内容为HTML
  const parseResumeToHTML = (resume: string) => {
    let html = resume;

    // 转换一级标题 (## 一、xxx)
    html = html.replace(/^##\s+(.+)$/gm, '<h3 class="text-xl font-bold mt-6 mb-4 text-gray-900 dark:text-white border-b-2 border-gray-300 pb-2">$1</h3>');

    // 转换二级标题 (### xxx)
    html = html.replace(/^###\s+(.+)$/gm, '<h4 class="text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-white">$1</h4>');

    // 特殊处理教育背景格式：[时间段] [学校] [学历] [专业]
    // 格式：2015.03-2018.03	中央财经大学   西方经济学  硕士
    html = html.replace(/^(\d{4}\.\d{2}-\d{4}\.\d{2})\s+(.+?)\s+(.+?)\s+(.+?)$/gm,
      '<div class="flex items-baseline justify-between mb-3 py-2 bg-gray-50 dark:bg-gray-900/50 px-4 rounded-lg">' +
        '<span class="text-gray-600 dark:text-gray-400 font-mono">$1</span>' +
        '<span class="flex-1 mx-4 text-center font-semibold text-gray-900 dark:text-white">$2</span>' +
        '<span class="text-gray-700 dark:text-gray-300">$3</span>' +
        '<span class="ml-4 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm rounded-full">$4</span>' +
      '</div>');

    // 特殊处理项目经验头部：**[项目名称]** | **[时间段]**
    html = html.replace(/^\*\*([^\*|]+)\*\*\s*\|\s*\*\*([^\*]+)\*\*$/gm,
      '<div class="flex items-center justify-between mb-4 pb-3 border-b-2 border-gray-200 dark:border-gray-700">' +
        '<span class="text-lg font-bold text-gray-900 dark:text-white">$1</span>' +
        '<span class="text-sm font-semibold text-gray-600 dark:text-gray-400 font-mono">$2</span>' +
      '</div>');

    // 特殊处理项目经验标注（项目描述、主要贡献、项目成果）
    // 使用更健壮的正则表达式，匹配到下一个标注或章节标题
    html = html.replace(/^(项目描述|主要贡献|项目成果)：([^\n]*(?:\n(?!项目描述|主要贡献|项目成果|\n##|-\s|\*\*|[^\n]+：)[^\n]*)*)/gm,
      (match, label, content) => {
        const trimmedContent = content.trim();
        return '<div class="flex items-start mb-3">' +
          '<span class="w-24 flex-shrink-0 font-semibold text-gray-700 dark:text-gray-300">' + label + '：</span>' +
          '<div class="flex-1 text-gray-900 dark:text-white leading-relaxed">' + trimmedContent + '</div>' +
        '</div>';
      });

    // 转换粗体 (**xxx**) - 在处理完特殊格式后再处理
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-white">$1</strong>');

    // 特殊处理专业技能：**技能类别**：具体技能
    html = html.replace(/^\*\*([^\*:]+)\*\*：(.+)$/gm,
      '<div class="flex items-start mb-2 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">' +
        '<span class="font-bold text-purple-700 dark:text-purple-300 min-w-[120px]">$1</span>' +
        '<span class="flex-1 text-gray-700 dark:text-gray-300 ml-2">$2</span>' +
      '</div>');

    // 转换列表项 (- xxx)
    html = html.replace(/^-\s+(.+)$/gm, '<li class="ml-6 text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">$1</li>');

    // 转换多行列表项为列表
    html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul class="list-disc mb-4 space-y-2">$&</ul>');

    // 转换冒号分隔的个人信息行（姓名：xxx）- 排除项目经验标注和已处理的格式
    html = html.replace(/^((?!项目描述|主要贡献|项目成果|\d{4}\.\d{2}-\d{4}\.\d{2}|-\s|\*\*|\s{2,})[^\n]+)：(.+)$/gm,
      '<div class="flex items-center mb-2">' +
        '<span class="w-24 font-semibold text-gray-900 dark:text-white">$1：</span>' +
        '<span class="flex-1 text-gray-700 dark:text-gray-300">$2</span>' +
      '</div>');

    // 转换换行为段落（处理剩余文本）
    html = html.replace(/\n\n+/g, '</p><p class="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">');

    // 包裹整个内容
    if (!html.startsWith('<')) {
      html = '<p class="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">' + html;
    }
    if (!html.endsWith('</p>') && !html.endsWith('</div>') && !html.endsWith('</h3>') && !html.endsWith('</h4>') && !html.endsWith('</ul>')) {
      html += '</p>';
    }

    return html;
  };

  // 从简历中提取关键信息用于导出命名
  const extractResumeInfo = (resume: string) => {
    const info = {
      name: '',
      recentCompany: '',
      recentPosition: '',
      highestEducation: '',
      gender: '',
      age: '',
    };

    // 提取姓名
    const nameMatch = resume.match(/(?:姓名[:：]\s*)([^\n]+)/);
    if (nameMatch) {
      info.name = nameMatch[1].trim();
    }

    // 提取性别
    const genderMatch = resume.match(/(?:性别[:：]\s*)([^\n]+)/);
    if (genderMatch) {
      info.gender = genderMatch[1].trim();
    }

    // 提取年龄
    const ageMatch = resume.match(/(?:年龄[:：]\s*)([^\n]+)/);
    if (ageMatch) {
      info.age = ageMatch[1].trim();
    }

    // 提取最高学历
    const educationMatch = resume.match(/(?:学历[:：]\s*)([^\n]+)/);
    if (educationMatch) {
      info.highestEducation = educationMatch[1].trim();
    }

    // 提取最近的公司和职位（查找工作经历中的第一个）
    const workSectionMatch = resume.match(/(?:##\s*三、工作经历|###\s*工作经历)([\s\S]*?)(?:##\s*|$)/);
    if (workSectionMatch) {
      const workSection = workSectionMatch[1];
      // 提取第一个工作经历
      const firstWorkMatch = workSection.match(/\*\*([^*]+)\*\*\s*\|\s*\*\*([^*]+)\*\*/);
      if (firstWorkMatch) {
        info.recentCompany = firstWorkMatch[1].trim();
        info.recentPosition = firstWorkMatch[2].trim();
      }
    }

    return info;
  };

  const handleOptimize = async () => {
    if (!resume.trim() || !companyName.trim() || !jobPosition.trim()) {
      alert('请输入简历内容、目标公司名称和应聘职位');
      return;
    }

    setIsOptimizing(true);
    setOptimizedResume('');
    setRecommendReason('');
    setRiskTips('');
    setInterviewQuestions('');

    try {
      // 先获取公司信息（失败也不影响流程）
      setIsLoadingCompany(true);
      let companyData = null;
      try {
        const companyRes = await fetch('/api/company-info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ companyName }),
        });
        if (companyRes.ok) {
          companyData = await companyRes.json();
          setCompanyInfo(companyData);
        }
      } catch (error) {
        console.error('获取公司信息失败，将继续优化简历:', error);
        // 即使获取公司信息失败，也继续流程
      } finally {
        setIsLoadingCompany(false);
      }

      // 然后优化简历
      const resumeRes = await fetch('/api/optimize-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume,
          companyName,
          jobPosition,
          jobRequirements,
          hrCommunicationNotes,
          companyInfo: companyData,
        }),
      });

      const reader = resumeRes.body?.getReader();
      const decoder = new TextDecoder();
      let optimizedText = '';
      let reasonText = '';
      let riskText = '';
      let interviewText = '';
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
                  } else if (currentStage === 'risk') {
                    riskText += data.content;
                    setRiskTips(riskText);
                  } else if (currentStage === 'interview') {
                    interviewText += data.content;
                    setInterviewQuestions(interviewText);
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
    try {
      if (!editedResume) {
        toast.error('请先优化简历');
        return;
      }

      const element = document.getElementById('resume-content');
      if (!element) {
        console.error('未找到 resume-content 元素');
        toast.error('未找到简历内容');
        return;
      }

      console.log('开始导出图片，元素内容长度:', element.innerHTML.length);

      const loadingId = toast.loading('正在生成图片，请稍候...');

      const html2canvas = (await import('html2canvas')).default;

      // 滚动到顶部以确保完整截图
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 300)); // 等待滚动完成

      console.log('开始调用 html2canvas');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      console.log('html2canvas 完成，canvas尺寸:', canvas.width, 'x', canvas.height);

      // 提取简历信息用于命名
      const resumeInfo = extractResumeInfo(editedResume);
      const fileName = [
        jobPosition || '应聘职位',
        resumeInfo.name || '姓名',
        resumeInfo.recentCompany || '公司',
        resumeInfo.recentPosition || '职位',
        resumeInfo.highestEducation || '学历',
        resumeInfo.gender || '性别',
        resumeInfo.age || '年龄',
      ].filter(Boolean).join('_');

      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('图片导出成功！', { id: loadingId });
    } catch (error) {
      console.error('图片导出失败:', error);
      toast.error(`图片导出失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  const exportToPDF = async () => {
    try {
      if (!editedResume) {
        toast.error('请先优化简历');
        return;
      }

      const element = document.getElementById('resume-content');
      if (!element) {
        console.error('未找到 resume-content 元素');
        toast.error('未找到简历内容');
        return;
      }

      console.log('开始导出PDF，元素内容长度:', element.innerHTML.length);

      const loadingId = toast.loading('正在生成 PDF，请稍候...');

      const html2canvas = (await import('html2canvas')).default;
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;

      // 滚动到顶部以确保完整截图
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 300)); // 等待滚动完成

      console.log('开始调用 html2canvas');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      console.log('html2canvas 完成，canvas尺寸:', canvas.width, 'x', canvas.height);

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      console.log('PDF尺寸:', pdfWidth, 'x', pdfHeight);

      // 提取简历信息用于命名
      const resumeInfo = extractResumeInfo(editedResume);
      const fileName = [
        jobPosition || '应聘职位',
        resumeInfo.name || '姓名',
        resumeInfo.recentCompany || '公司',
        resumeInfo.recentPosition || '职位',
        resumeInfo.highestEducation || '学历',
        resumeInfo.gender || '性别',
        resumeInfo.age || '年龄',
      ].filter(Boolean).join('_');

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${fileName}.pdf`);

      console.log('PDF保存成功');
      toast.success('PDF 导出成功！', { id: loadingId });
    } catch (error) {
      console.error('PDF 导出失败:', error);
      toast.error(`PDF 导出失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  const exportToWord = async () => {
    try {
      if (!editedResume) {
        toast.error('请先优化简历');
        return;
      }

      const element = document.getElementById('resume-preview');
      if (!element) {
        console.error('未找到 resume-preview 元素');
        toast.error('未找到简历内容');
        return;
      }

      console.log('开始导出Word，元素内容长度:', element.innerHTML.length);

      const loadingId = toast.loading('正在生成 Word 文档，请稍候...');

      // 提取简历信息用于命名
      const resumeInfo = extractResumeInfo(editedResume);
      const fileName = [
        jobPosition || '应聘职位',
        resumeInfo.name || '姓名',
        resumeInfo.recentCompany || '公司',
        resumeInfo.recentPosition || '职位',
        resumeInfo.highestEducation || '学历',
        resumeInfo.gender || '性别',
        resumeInfo.age || '年龄',
      ].filter(Boolean).join('_');

      // 提取内联样式和内容
      const style = document.createElement('style');
      style.textContent = `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Microsoft YaHei', '微软雅黑', 'SimHei', Arial, sans-serif;
          margin: 20px;
          line-height: 1.6;
          color: #111827;
          background-color: #ffffff;
        }
        h3 {
          font-size: 18px;
          font-weight: bold;
          margin-top: 24px;
          margin-bottom: 16px;
          border-bottom: 2px solid #d1d5db;
          padding-bottom: 8px;
          color: #111827;
        }
        h4 {
          font-size: 16px;
          font-weight: 600;
          margin-top: 16px;
          margin-bottom: 8px;
          color: #111827;
        }
        strong { font-weight: bold; color: #111827; }
        div { margin-bottom: 8px; }
        ul { margin-left: 24px; margin-bottom: 16px; }
        li { margin-bottom: 4px; color: #374151; line-height: 1.6; }
        p { margin-bottom: 12px; color: #374151; line-height: 1.6; }
        span { color: #374151; }
        .flex { display: flex; }
        .items-baseline { align-items: baseline; }
        .items-center { align-items: center; }
        .items-start { align-items: flex-start; }
        .justify-between { justify-content: space-between; }
        .flex-1 { flex: 1; }
        .gap-2 { gap: 8px; }
        .w-24 { width: 96px; }
        .min-w-\\[120px\\] { min-width: 120px; }
        .mb-2 { margin-bottom: 8px; }
        .mb-3 { margin-bottom: 12px; }
        .mb-4 { margin-bottom: 16px; }
        .mb-6 { margin-bottom: 24px; }
        .mt-2 { margin-top: 8px; }
        .mt-4 { margin-top: 16px; }
        .mt-6 { margin-top: 24px; }
        .py-2 { padding-top: 8px; padding-bottom: 8px; }
        .py-3 { padding-top: 12px; padding-bottom: 12px; }
        .px-4 { padding-left: 16px; padding-right: 16px; }
        .pb-2 { padding-bottom: 8px; }
        .pb-3 { padding-bottom: 12px; }
        .pb-4 { padding-bottom: 16px; }
        .ml-2 { margin-left: 8px; }
        .ml-4 { margin-left: 16px; }
        .ml-6 { margin-left: 24px; }
        .mr-4 { margin-right: 16px; }
        .mx-4 { margin-left: 16px; margin-right: 16px; }
        .text-xs { font-size: 12px; }
        .text-sm { font-size: 14px; }
        .text-base { font-size: 16px; }
        .text-lg { font-size: 18px; }
        .text-xl { font-size: 20px; }
        .text-2xl { font-size: 24px; }
        .text-3xl { font-size: 30px; }
        .font-mono { font-family: 'Courier New', monospace; }
        .font-semibold { font-weight: 600; }
        .font-bold { font-weight: bold; }
        .text-gray-900 { color: #111827; }
        .text-gray-700 { color: #374151; }
        .text-gray-600 { color: #4b5563; }
        .text-gray-500 { color: #6b7280; }
        .text-gray-400 { color: #9ca3af; }
        .text-gray-300 { color: #d1d5db; }
        .text-gray-200 { color: #e5e7eb; }
        .text-gray-100 { color: #f3f4f6; }
        .text-blue-600 { color: #2563eb; }
        .text-blue-900 { color: #1e3a8a; }
        .text-blue-100 { color: #dbeafe; }
        .text-blue-800 { color: #1e40af; }
        .text-orange-600 { color: #ea580c; }
        .text-orange-900 { color: #7c2d12; }
        .text-green-600 { color: #16a34a; }
        .text-green-900 { color: #14532d; }
        .bg-gray-50 { background-color: #f9fafb; }
        .bg-blue-50 { background-color: #eff6ff; }
        .bg-blue-100 { background-color: #dbeafe; }
        .bg-blue-800 { background-color: #1e40af; color: #ffffff; }
        .bg-orange-50 { background-color: #fff7ed; }
        .bg-green-50 { background-color: #f0fdf4; }
        .bg-blue-950\\/30 { background-color: rgba(30, 58, 138, 0.3); }
        .bg-orange-950\\/30 { background-color: rgba(124, 45, 18, 0.3); }
        .bg-green-950\\/30 { background-color: rgba(20, 83, 45, 0.3); }
        .border-b-2 { border-bottom: 2px solid #d1d5db; }
        .border-b { border-bottom: 1px solid #e5e7eb; }
        .border-t { border-top: 1px solid #e5e7eb; }
        .border-gray-200 { border-color: #e5e7eb; }
        .border-gray-300 { border-color: #d1d5db; }
        .rounded-lg { border-radius: 8px; }
        .rounded-full { border-radius: 9999px; }
        .p-4 { padding: 16px; }
        .leading-relaxed { line-height: 1.625; }
        .whitespace-pre-wrap { white-space: pre-wrap; }
        .flex-shrink-0 { flex-shrink: 0; }
        .space-y-2 > * + * { margin-top: 8px; }
        .max-w-none { max-width: none; }
        .from-purple-50 { background-color: #faf5ff; }
        .to-pink-50 { background-color: #fdf2f8; }
        .bg-gradient-to-r { background: linear-gradient(to right, #faf5ff, #fdf2f8); }
        .list-disc { list-style-type: disc; }
        .h-4 { height: 16px; }
        .w-4 { width: 16px; }
      `;

      const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
        <head>
          <meta charset='utf-8'>
          <title>简历</title>
          ${style.outerHTML}
        </head>
        <body>${element.innerHTML}</body>
        </html>
      `;

      const blob = new Blob(['\ufeff', htmlContent], {
        type: 'application/msword',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${fileName}.doc`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('Word保存成功');
      toast.success('Word 文档导出成功！', { id: loadingId });
    } catch (error) {
      console.error('Word 导出失败:', error);
      toast.error(`Word 导出失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
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
${'='.repeat(50)}

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
                <Label htmlFor="job-requirements">岗位需求/人才画像（选填）</Label>
                <Textarea
                  id="job-requirements"
                  placeholder="请输入岗位需求或理想人才画像，例如：要求3年以上React开发经验，熟悉TypeScript，有大型项目经验，具备良好的沟通能力..."
                  className="min-h-[100px] resize-none"
                  value={jobRequirements}
                  onChange={(e) => setJobRequirements(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hr-communication-notes">HR沟通记录（选填）</Label>
                <Textarea
                  id="hr-communication-notes"
                  placeholder="请输入与候选人沟通的记录，例如：候选人期望薪资20-25k，当前在北京，能接受出差，对技术团队规模有要求..."
                  className="min-h-[100px] resize-none"
                  value={hrCommunicationNotes}
                  onChange={(e) => setHrCommunicationNotes(e.target.value)}
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
                            • 简历包含：个人信息、教育背景、工作经历、项目经验、专业技能、自我评价<br/>
                            • 个人信息使用"字段："格式分行显示<br/>
                            • 教育背景格式：时间段 学校 学历 专业<br/>
                            • 工作经历的公司、职位、时间会自动加粗<br/>
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

                        {/* 推荐原因 */}
                        {recommendReason && (
                          <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
                            <div className="mb-2 flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-blue-600" />
                              <span className="font-semibold text-blue-900 dark:text-blue-100">
                                推荐原因
                              </span>
                            </div>
                            <div className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                              {recommendReason}
                            </div>
                          </div>
                        )}

                        {riskTips && (
                          <div className="mb-6 rounded-lg bg-orange-50 p-4 dark:bg-orange-950/30">
                            <div className="mb-2 flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-orange-600" />
                              <span className="font-semibold text-orange-900 dark:text-orange-100">
                                风险提示
                              </span>
                            </div>
                            <div className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                              {riskTips}
                            </div>
                          </div>
                        )}

                        {interviewQuestions && (
                          <div className="mb-6 rounded-lg bg-green-50 p-4 dark:bg-green-950/30">
                            <div className="mb-2 flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-green-600" />
                              <span className="font-semibold text-green-900 dark:text-green-100">
                                面试提问建议
                              </span>
                            </div>
                            <div className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                              {interviewQuestions}
                            </div>
                          </div>
                        )}

                        {/* 优化后的简历内容 */}
                        <div
                          id="resume-content"
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
