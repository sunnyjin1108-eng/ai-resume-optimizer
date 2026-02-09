import { NextRequest } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  const { resume, companyName, companyInfo } = await request.json();

  if (!resume || !companyName) {
    return new Response(
      JSON.stringify({ error: '请提供简历内容和公司名称' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 提取请求头
  const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);

  // 初始化 LLM 客户端
  const config = new Config();
  const llmClient = new LLMClient(config);

  // 构建系统提示词
  const systemPrompt = `你是一位专业的简历优化专家。你的任务是帮助用户优化简历，使其更符合目标公司的要求。

优化原则：
1. 保持简历的真实性，不编造经历
2. 使用更专业、更有力的词汇和表达
3. 突出与目标公司岗位相关的技能和经验
4. 优化简历结构和格式，使其更清晰易读
5. 使用行为动词和量化数据增强说服力
6. 优化后的简历应该更加精炼，去除冗余信息

目标公司：${companyName}
${companyInfo?.description ? `公司简介：${companyInfo.description}` : ''}

请直接输出优化后的简历内容，不要包含其他说明或解释。`;

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    { role: 'user' as const, content: resume },
  ];

  // 创建流式响应
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const llmStream = llmClient.stream(messages, {
          model: 'doubao-seed-1-8-251228',
          temperature: 0.7,
        });

        for await (const chunk of llmStream) {
          if (chunk.content) {
            const content = chunk.content.toString();
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
            );
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (error) {
        console.error('简历优化错误:', error);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: '简历优化失败，请重试' })}\n\n`
          )
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
