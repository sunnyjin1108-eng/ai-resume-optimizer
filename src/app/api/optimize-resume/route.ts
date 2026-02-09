import { NextRequest } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  const { resume, companyName, jobPosition, companyInfo } = await request.json();

  if (!resume || !companyName || !jobPosition) {
    return new Response(
      JSON.stringify({ error: '请提供简历内容、公司名称和职位名称' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 提取请求头
  const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);

  // 初始化 LLM 客户端
  const config = new Config();
  const llmClient = new LLMClient(config);

  // 第一步：生成推荐原因
  const recommendPrompt = `你是一位专业的HR专家。请分析以下简历与目标职位的匹配度，提炼出3-5条推荐理由。

目标公司：${companyName}
应聘职位：${jobPosition}
${companyInfo?.description ? `公司简介：${companyInfo.description}` : ''}

简历内容：
${resume}

请按照以下格式输出推荐理由（每条50字以内，简洁有力）：
1. [推荐理由1]
2. [推荐理由2]
3. [推荐理由3]
...

请直接输出推荐理由，不要包含其他说明。`;

  const recommendMessages = [
    { role: 'system' as const, content: '你是专业的HR专家，善于分析简历与职位的匹配度。' },
    { role: 'user' as const, content: recommendPrompt },
  ];

  // 第二步：优化简历
  const optimizePrompt = `你是一位专业的简历优化专家。你的任务是帮助用户优化简历，使其更符合目标公司和职位的要求。

优化原则：
1. 保持简历的真实性，不编造经历
2. 使用更专业、更有力的词汇和表达
3. 突出与目标职位相关的技能和经验
4. 优化简历结构和格式，使其更清晰易读
5. 使用行为动词和量化数据增强说服力
6. 优化后的简历应该更加精炼，去除冗余信息

目标公司：${companyName}
应聘职位：${jobPosition}
${companyInfo?.description ? `公司简介：${companyInfo.description}` : ''}

请严格按照以下标准简历结构输出优化后的简历内容，**每个项目经验都必须包含完整的项目描述、主要贡献和项目成果**：

## 一、个人信息
姓名：
性别：
年龄：
电话：
地点：
目前薪酬：
期望薪酬：

## 二、教育背景
[时间段] [学校] [学历] [专业]

## 三、工作经历
**[公司名称]** | **[职位]** | **[时间段]**
- [工作职责1]
- [工作职责2]
- [工作业绩1]（使用量化数据）
- [工作业绩2]（使用量化数据）

## 四、项目经验
**[项目名称]** | **[时间段]**

项目描述：[项目背景和目标，50-100字]

主要贡献：[个人职责和贡献，3-5条要点，使用行为动词和量化数据]

项目成果：[项目成果和影响，使用数据和具体指标说明]

**[项目名称]** | **[时间段]**

项目描述：[项目背景和目标，50-100字]

主要贡献：[个人职责和贡献，3-5条要点，使用行为动词和量化数据]

项目成果：[项目成果和影响，使用数据和具体指标说明]

## 五、专业技能
**[技能类别1]**：[具体技能]
**[技能类别2]**：[具体技能]
**[技能类别3]**：[具体技能]

## 六、自我评价
[3-5条简洁的自我评价，突出个人优势和特点]

重要提示：
1. 每个项目经验必须包含完整的三部分：项目描述、主要贡献、项目成果
2. 主要贡献使用列表格式（- 开头），包含3-5个要点
3. 项目成果必须包含具体的量化数据和成果指标
4. 使用行为动词开头，如"负责"、"设计"、"开发"、"优化"等
5. 请直接输出优化后的简历内容，严格按照以上结构，不要包含其他说明或解释`;

  const optimizeMessages = [
    { role: 'system' as const, content: optimizePrompt },
    { role: 'user' as const, content: resume },
  ];

  // 创建流式响应
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // 先发送推荐原因
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'stage', content: 'recommend' })}\n\n`)
        );

        const recommendStream = llmClient.stream(recommendMessages, {
          model: 'doubao-seed-1-8-251228',
          temperature: 0.7,
        });

        for await (const chunk of recommendStream) {
          if (chunk.content) {
            const content = chunk.content.toString();
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'recommend', content })}\n\n`)
            );
          }
        }

        // 然后发送优化后的简历
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'stage', content: 'resume' })}\n\n`)
        );

        const optimizeStream = llmClient.stream(optimizeMessages, {
          model: 'doubao-seed-1-8-251228',
          temperature: 0.7,
        });

        for await (const chunk of optimizeStream) {
          if (chunk.content) {
            const content = chunk.content.toString();
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'resume', content })}\n\n`)
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
