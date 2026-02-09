import { NextRequest, NextResponse } from 'next/server';
import { SearchClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { companyName } = await request.json();

    if (!companyName || typeof companyName !== 'string') {
      return NextResponse.json(
        { error: '请提供有效的公司名称' },
        { status: 400 }
      );
    }

    // 提取请求头
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);

    // 初始化搜索客户端
    const config = new Config();
    const searchClient = new SearchClient(config, customHeaders);

    // 搜索公司信息
    const searchQuery = `${companyName} 公司 官网 简介 Logo`;
    const searchResponse = await searchClient.webSearch(searchQuery, 5, true);

    if (!searchResponse.web_items || searchResponse.web_items.length === 0) {
      return NextResponse.json(
        {
          name: companyName,
          logoUrl: null,
          description: '未找到该公司详细信息',
        },
        { status: 200 }
      );
    }

    // 提取公司信息
    const firstResult = searchResponse.web_items[0];
    const logoUrl = firstResult.logo_url || null;

    // 使用 AI 总结提取公司简介
    let companyDescription = '';
    if (searchResponse.summary) {
      companyDescription = searchResponse.summary;
    } else if (firstResult.snippet) {
      companyDescription = firstResult.snippet;
    }

    return NextResponse.json({
      name: companyName,
      logoUrl,
      description: companyDescription,
      website: firstResult.url,
    });
  } catch (error) {
    console.error('获取公司信息失败:', error);
    return NextResponse.json(
      { error: '获取公司信息失败，请重试' },
      { status: 500 }
    );
  }
}
